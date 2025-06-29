// Background script for WhisperVoice extension
class WhisperVoiceBackground {
  constructor() {
    this.init();
  }

  init() {
    // Handle extension installation
    chrome.runtime.onInstalled.addListener((details) => {
      if (details.reason === 'install') {
        this.onInstall();
      }
    });

    // Handle messages from content script
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      this.handleMessage(request, sender, sendResponse);
      return true; // Keep the message channel open for async responses
    });

    // Handle storage changes
    chrome.storage.onChanged.addListener((changes, namespace) => {
      this.handleStorageChange(changes, namespace);
    });
  }

  onInstall() {
    // Initialize default settings
    chrome.storage.sync.set({
      messagesDecrypted: 0,
      voiceNotesProcessed: 0,
      isEnabled: true
    });

    // Show welcome notification
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: 'WhisperVoice Installed',
      message: 'Configure your API keys to start decrypting hidden messages!'
    });
  }

  async handleMessage(request, sender, sendResponse) {
    try {
      switch (request.action) {
        case 'processAudio':
          const result = await this.processAudioMessage(request.data);
          sendResponse({ success: true, data: result });
          break;

        case 'updateStats':
          await this.updateStatistics(request.data);
          sendResponse({ success: true });
          break;

        case 'getSettings':
          const settings = await this.getSettings();
          sendResponse({ success: true, data: settings });
          break;

        case 'testApiKeys':
          const apiTest = await this.testApiKeys(request.data);
          sendResponse({ success: true, data: apiTest });
          break;

        default:
          sendResponse({ success: false, error: 'Unknown action' });
      }
    } catch (error) {
      console.error('Background script error:', error);
      sendResponse({ success: false, error: error.message });
    }
  }

  async processAudioMessage(data) {
    const { audioUrl, passcode, settings } = data;
    
    // Validate settings
    if (!settings.assemblyaiKey || !settings.murfKey || !settings.playfairKeyword) {
      throw new Error('Missing required API keys or Playfair keyword');
    }

    // Process the audio through the pipeline
    const result = {
      transcription: '',
      ciphertext: '',
      decryptedMessage: '',
      audioUrl: ''
    };

    try {
      // Step 1: Speech to Text
      result.transcription = await this.speechToText(audioUrl, settings.assemblyaiKey);
      
      // Step 2: Extract first letters
      result.ciphertext = this.extractFirstLetters(result.transcription);
      
      // Step 3: Decrypt with Playfair
      result.decryptedMessage = this.decryptPlayfair(result.ciphertext, settings.playfairKeyword);
      
      // Step 4: Text to Speech
      result.audioUrl = await this.textToSpeech(result.decryptedMessage, settings.murfKey);
      
      return result;
    } catch (error) {
      throw new Error(`Processing failed: ${error.message}`);
    }
  }

  async speechToText(audioUrl, apiKey) {
    // Submit transcription job
    const submitResponse = await fetch('https://api.assemblyai.com/v2/transcript', {
      method: 'POST',
      headers: {
        'Authorization': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        audio_url: audioUrl,
        language_code: 'en'
      })
    });

    if (!submitResponse.ok) {
      throw new Error('Failed to submit audio for transcription');
    }

    const submitResult = await submitResponse.json();
    const transcriptId = submitResult.id;

    // Poll for completion
    let attempts = 0;
    const maxAttempts = 60; // 60 seconds timeout
    
    while (attempts < maxAttempts) {
      const pollResponse = await fetch(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
        headers: {
          'Authorization': apiKey
        }
      });

      const pollResult = await pollResponse.json();

      if (pollResult.status === 'completed') {
        return pollResult.text;
      } else if (pollResult.status === 'error') {
        throw new Error(`Transcription failed: ${pollResult.error}`);
      }

      // Wait 1 second before next poll
      await new Promise(resolve => setTimeout(resolve, 1000));
      attempts++;
    }

    throw new Error('Transcription timeout');
  }

  extractFirstLetters(text) {
    if (!text) return '';
    
    const words = text.split(/\s+/).filter(word => word.length > 0);
    return words.map(word => word.charAt(0).toUpperCase()).join('');
  }

  decryptPlayfair(ciphertext, keyword) {
    const playfair = new PlayfairCipher();
    return playfair.decrypt(ciphertext, keyword);
  }

  async textToSpeech(text, apiKey) {
    const requestData = {
      text: text,
      voiceId: "en-US-natalie"
    };

    const response = await fetch('https://api.murf.ai/v1/speech/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'api-key': apiKey
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `Murf.ai API error (${response.status})`;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    
    // The response structure may vary, check for common audio URL fields
    const audioUrl = result.audioFile || result.audio_url || result.url || result.audioUrl;
    
    if (!audioUrl) {
      throw new Error('No audio URL returned from Murf.ai');
    }

    return audioUrl;
  }

  async updateStatistics(data) {
    const current = await chrome.storage.sync.get(['messagesDecrypted', 'voiceNotesProcessed']);
    
    const updates = {
      messagesDecrypted: (current.messagesDecrypted || 0) + (data.messagesDecrypted || 0),
      voiceNotesProcessed: (current.voiceNotesProcessed || 0) + (data.voiceNotesProcessed || 0)
    };

    await chrome.storage.sync.set(updates);
  }

  async getSettings() {
    return await chrome.storage.sync.get([
      'assemblyaiKey',
      'murfKey',
      'playfairKeyword',
      'isEnabled',
      'messagesDecrypted',
      'voiceNotesProcessed'
    ]);
  }

  async testApiKeys(keys) {
    const results = {
      assemblyai: false,
      murf: false
    };

    // Test AssemblyAI
    try {
      const response = await fetch('https://api.assemblyai.com/v2/transcript', {
        method: 'POST',
        headers: {
          'Authorization': keys.assemblyaiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          audio_url: 'https://example.com/test.mp3'
        })
      });
      
      results.assemblyai = response.status !== 401;
    } catch (error) {
      results.assemblyai = false;
    }

    // Test Murf.ai with the correct header format
    try {
      const response = await fetch('https://api.murf.ai/v1/speech/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'api-key': keys.murfKey
        },
        body: JSON.stringify({
          text: 'test',
          voiceId: 'en-US-natalie'
        })
      });
      
      results.murf = response.status !== 401 && response.status !== 403;
    } catch (error) {
      results.murf = false;
    }

    return results;
  }

  handleStorageChange(changes, namespace) {
    if (namespace === 'sync') {
      // Notify content scripts of settings changes if needed
      console.log('Settings changed:', changes);
    }
  }
}

// Playfair Cipher Implementation (duplicate for background script)
class PlayfairCipher {
  constructor() {
    this.alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  }

  createKeyMatrix(keyword) {
    const key = keyword.toUpperCase().replace(/J/g, 'I');
    const matrix = [];
    const used = new Set();

    for (const char of key) {
      if (this.alphabet.includes(char) && !used.has(char)) {
        matrix.push(char);
        used.add(char);
      }
    }

    for (const char of this.alphabet) {
      if (char !== 'J' && !used.has(char)) {
        matrix.push(char);
        used.add(char);
      }
    }

    const keyMatrix = [];
    for (let i = 0; i < 5; i++) {
      keyMatrix.push(matrix.slice(i * 5, (i + 1) * 5));
    }

    return keyMatrix;
  }

  findPosition(matrix, char) {
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        if (matrix[i][j] === char) {
          return [i, j];
        }
      }
    }
    return null;
  }

  decrypt(ciphertext, keyword) {
    const matrix = this.createKeyMatrix(keyword);
    const cleanText = ciphertext.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');
    
    let plaintext = '';
    
    for (let i = 0; i < cleanText.length; i += 2) {
      const char1 = cleanText[i];
      const char2 = cleanText[i + 1] || 'X';
      
      const pos1 = this.findPosition(matrix, char1);
      const pos2 = this.findPosition(matrix, char2);
      
      if (!pos1 || !pos2) continue;
      
      const [row1, col1] = pos1;
      const [row2, col2] = pos2;
      
      if (row1 === row2) {
        plaintext += matrix[row1][(col1 + 4) % 5];
        plaintext += matrix[row2][(col2 + 4) % 5];
      } else if (col1 === col2) {
        plaintext += matrix[(row1 + 4) % 5][col1];
        plaintext += matrix[(row2 + 4) % 5][col2];
      } else {
        plaintext += matrix[row1][col2];
        plaintext += matrix[row2][col1];
      }
    }
    
    return plaintext.toLowerCase();
  }
}

// Initialize the background service
new WhisperVoiceBackground();