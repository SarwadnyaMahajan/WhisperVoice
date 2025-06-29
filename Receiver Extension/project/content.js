// WhisperVoice Manual Audio Upload Extension
class WhisperVoiceManual {
  constructor() {
    this.settings = {};
    this.playfairCipher = new PlayfairCipher();
    this.debugMode = true;
    this.init();
  }

  async init() {
    await this.loadSettings();
    this.createFloatingButton();
    console.log('WhisperVoice manual upload initialized');
  }

  async loadSettings() {
    this.settings = await chrome.storage.sync.get([
      'assemblyaiKey',
      'murfKey',
      'playfairKeyword'
    ]);
  }

  createFloatingButton() {
    // Remove existing button if any
    const existingButton = document.querySelector('.whispervoice-float-button');
    if (existingButton) {
      existingButton.remove();
    }

    const floatingButton = document.createElement('div');
    floatingButton.className = 'whispervoice-float-button';
    floatingButton.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
      </svg>
    `;
    floatingButton.title = 'WhisperVoice - Upload Audio to Decrypt';

    floatingButton.addEventListener('click', () => {
      this.showUploadModal();
    });

    document.body.appendChild(floatingButton);
  }

  showUploadModal() {
    if (!this.isConfigured()) {
      this.showConfigurationModal();
      return;
    }

    const modal = this.createUploadModal();
    document.body.appendChild(modal);

    const fileInput = modal.querySelector('#audio-file-input');
    const uploadArea = modal.querySelector('.upload-area');
    const submitButton = modal.querySelector('.btn-decrypt');
    const cancelButton = modal.querySelector('.btn-cancel');
    const passcodeInput = modal.querySelector('#passcode-input');
    const fileInfo = modal.querySelector('.file-info');

    let selectedFile = null;

    // File input change handler
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        this.handleFileSelection(file, fileInfo, submitButton);
        selectedFile = file;
      }
    });

    // Drag and drop handlers
    uploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadArea.classList.add('drag-over');
    });

    uploadArea.addEventListener('dragleave', (e) => {
      e.preventDefault();
      uploadArea.classList.remove('drag-over');
    });

    uploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadArea.classList.remove('drag-over');
      
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        const file = files[0];
        if (this.isValidAudioFile(file)) {
          fileInput.files = files;
          this.handleFileSelection(file, fileInfo, submitButton);
          selectedFile = file;
        } else {
          this.showError('Please select a valid audio file (MP3, WAV, M4A, OGG)');
        }
      }
    });

    // Click to upload
    uploadArea.addEventListener('click', () => {
      fileInput.click();
    });

    // Submit button
    submitButton.addEventListener('click', async () => {
      const passcode = passcodeInput.value.trim();
      if (!selectedFile) {
        this.showError('Please select an audio file first');
        return;
      }
      if (!passcode) {
        this.showError('Please enter a passcode');
        return;
      }

      modal.remove();
      await this.processAudioFile(selectedFile, passcode);
    });

    // Cancel button
    cancelButton.addEventListener('click', () => {
      modal.remove();
    });

    // Enter key support
    passcodeInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && selectedFile && passcodeInput.value.trim()) {
        submitButton.click();
      }
    });
  }

  createUploadModal() {
    const modal = document.createElement('div');
    modal.className = 'whispervoice-modal';
    modal.innerHTML = `
      <div class="whispervoice-modal-content upload-modal">
        <div class="modal-header">
          <h3>WhisperVoice - Decrypt Audio Message</h3>
          <div class="modal-logo">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
        </div>
        
        <div class="upload-section">
          <div class="upload-area">
            <div class="upload-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
                <path d="M12 18v-6"/>
                <path d="M9 15l3-3 3 3"/>
              </svg>
            </div>
            <h4>Upload Audio File</h4>
            <p>Drag and drop your audio file here, or click to browse</p>
            <p class="file-types">Supports: MP3, WAV, M4A, OGG</p>
            <input type="file" id="audio-file-input" accept="audio/*" style="display: none;">
          </div>
          
          <div class="file-info" style="display: none;">
            <div class="file-details">
              <div class="file-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="2"/>
                  <path d="M20 12c-2 0-3-1-3-3s1-3 3-3 3 1 3 3-1 3-3 3"/>
                  <path d="M4 12c2 0 3-1 3-3s-1-3-3-3-3 1-3 3 1 3 3 3"/>
                </svg>
              </div>
              <div class="file-text">
                <div class="file-name"></div>
                <div class="file-size"></div>
              </div>
              <button class="btn-remove" type="button">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <div class="passcode-section">
          <label for="passcode-input">Decryption Passcode</label>
          <input type="password" id="passcode-input" placeholder="Enter your passcode" autocomplete="off">
        </div>
        
        <div class="modal-actions">
          <button class="btn-cancel btn-secondary">Cancel</button>
          <button class="btn-decrypt btn-primary" disabled>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
            Decrypt Message
          </button>
        </div>
      </div>
    `;
    return modal;
  }

  handleFileSelection(file, fileInfo, submitButton) {
    if (!this.isValidAudioFile(file)) {
      this.showError('Please select a valid audio file (MP3, WAV, M4A, OGG)');
      return;
    }

    // Show file info
    const fileName = fileInfo.querySelector('.file-name');
    const fileSize = fileInfo.querySelector('.file-size');
    const removeButton = fileInfo.querySelector('.btn-remove');

    fileName.textContent = file.name;
    fileSize.textContent = this.formatFileSize(file.size);
    fileInfo.style.display = 'block';

    // Enable submit button
    submitButton.disabled = false;

    // Remove button handler
    removeButton.addEventListener('click', () => {
      fileInfo.style.display = 'none';
      submitButton.disabled = true;
      document.querySelector('#audio-file-input').value = '';
    });
  }

  isValidAudioFile(file) {
    const validTypes = [
      'audio/mpeg',
      'audio/mp3',
      'audio/wav',
      'audio/wave',
      'audio/x-wav',
      'audio/m4a',
      'audio/mp4',
      'audio/ogg',
      'audio/webm'
    ];
    return validTypes.includes(file.type) || file.name.match(/\.(mp3|wav|m4a|ogg|webm)$/i);
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  async processAudioFile(file, passcode) {
    const loadingModal = this.createLoadingModal();
    document.body.appendChild(loadingModal);

    try {
      // Step 1: Upload file and get URL
      this.updateLoadingStatus(loadingModal, 'Preparing audio file...');
      const audioUrl = await this.uploadAudioFile(file);

      // Step 2: Convert to text
      this.updateLoadingStatus(loadingModal, 'Converting speech to text...');
      const transcribedText = await this.speechToText(audioUrl);
      console.log('Transcribed text:', transcribedText);

      if (!transcribedText || transcribedText.trim().length === 0) {
        throw new Error('No speech detected in the audio. Please ensure the audio contains clear speech.');
      }

      // Step 3: Extract ciphertext
      this.updateLoadingStatus(loadingModal, 'Extracting hidden message...');
      const ciphertext = this.extractFirstLetters(transcribedText);
      console.log('Extracted ciphertext:', ciphertext);

      if (!ciphertext || ciphertext.length === 0) {
        throw new Error('Could not extract ciphertext from transcription. The message may not contain a hidden message.');
      }

      // Step 4: Decrypt
      this.updateLoadingStatus(loadingModal, 'Decrypting message...');
      const decryptedMessage = this.playfairCipher.decrypt(ciphertext, this.settings.playfairKeyword);
      console.log('Decrypted message:', decryptedMessage);

      if (!decryptedMessage || decryptedMessage.trim().length === 0) {
        throw new Error('Decryption failed. Please check your Playfair keyword or verify the message contains a hidden message.');
      }

      // Step 5: Convert to speech and download
      this.updateLoadingStatus(loadingModal, 'Converting to speech...');
      const speechAudioData = await this.textToSpeechWithDownload(decryptedMessage);

      loadingModal.remove();

      // Show result with downloadable audio
      this.showDecryptedMessage(decryptedMessage, speechAudioData, transcribedText, ciphertext);

      // Update stats
      await this.updateStats();

    } catch (error) {
      loadingModal.remove();
      console.error('Error processing audio file:', error);
      this.showErrorModal(error.message);
    }
  }

  async uploadAudioFile(file) {
    // Create a blob URL for the file
    const blobUrl = URL.createObjectURL(file);
    
    // For AssemblyAI, we need to upload the file to a temporary URL
    // We'll use a simple approach with FormData
    const formData = new FormData();
    formData.append('audio', file);

    try {
      // Upload to AssemblyAI's upload endpoint
      const uploadResponse = await fetch('https://api.assemblyai.com/v2/upload', {
        method: 'POST',
        headers: {
          'Authorization': this.settings.assemblyaiKey
        },
        body: formData
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload audio file');
      }

      const uploadResult = await uploadResponse.json();
      return uploadResult.upload_url;
    } catch (error) {
      console.error('Upload error:', error);
      // Fallback to blob URL (may not work with AssemblyAI)
      return blobUrl;
    }
  }

  async speechToText(audioUrl) {
    if (!this.settings.assemblyaiKey) {
      throw new Error('AssemblyAI API key not configured');
    }

    const baseUrl = "https://api.assemblyai.com";
    const headers = {
      'Authorization': this.settings.assemblyaiKey,
      'Content-Type': 'application/json'
    };

    try {
      console.log('Submitting audio for transcription...');
      
      const data = {
        audio_url: audioUrl,
        speech_model: "universal",
        language_code: 'en',
        punctuate: true,
        format_text: true
      };

      const submitResponse = await fetch(`${baseUrl}/v2/transcript`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data)
      });

      if (!submitResponse.ok) {
        const errorData = await submitResponse.json().catch(() => ({}));
        throw new Error(`AssemblyAI submission failed: ${errorData.error || submitResponse.statusText}`);
      }

      const submitResult = await submitResponse.json();
      const transcriptId = submitResult.id;
      
      console.log('Transcription job submitted with ID:', transcriptId);

      // Poll for completion
      const pollingEndpoint = `${baseUrl}/v2/transcript/${transcriptId}`;
      let attempts = 0;
      const maxAttempts = 60;

      while (attempts < maxAttempts) {
        console.log(`Polling attempt ${attempts + 1}/${maxAttempts}...`);
        
        await new Promise((resolve) => setTimeout(resolve, 3000));
        
        const pollingResponse = await fetch(pollingEndpoint, {
          headers: {
            'Authorization': this.settings.assemblyaiKey
          }
        });

        if (!pollingResponse.ok) {
          throw new Error(`Polling failed: ${pollingResponse.statusText}`);
        }

        const transcriptionResult = await pollingResponse.json();
        console.log('Transcription status:', transcriptionResult.status);

        if (transcriptionResult.status === "completed") {
          if (!transcriptionResult.text || transcriptionResult.text.trim().length === 0) {
            throw new Error('No speech detected in audio. The audio may be too quiet or contain no speech.');
          }
          console.log('Transcription completed successfully');
          return transcriptionResult.text;
        } else if (transcriptionResult.status === "error") {
          throw new Error(`Transcription failed: ${transcriptionResult.error}`);
        }

        attempts++;
      }

      throw new Error('Transcription timeout - please try again');

    } catch (error) {
      console.error('Speech-to-text error:', error);
      throw error;
    }
  }

  extractFirstLetters(text) {
    if (!text) return '';
    
    const words = text.replace(/[^\w\s]/g, '').split(/\s+/).filter(word => word.length > 0);
    const firstLetters = words.map(word => word.charAt(0).toUpperCase()).join('');
    
    console.log('Words:', words);
    console.log('First letters:', firstLetters);
    
    return firstLetters;
  }

  async textToSpeechWithDownload(text) {
    if (!this.settings.murfKey) {
      throw new Error('Murf.ai API key not configured');
    }

    try {
      console.log('Generating speech with Murf.ai...');
      
      const requestData = {
        text: text,
        voiceId: "en-US-natalie"
      };

      const response = await fetch('https://api.murf.ai/v1/speech/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'api-key': this.settings.murfKey
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Murf.ai API error response:', errorText);
        
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
      console.log('Murf.ai response:', result);

      // The response structure may vary, check for common audio URL fields
      const audioUrl = result.audioFile || result.audio_url || result.url || result.audioUrl;
      
      if (!audioUrl) {
        console.error('No audio URL found in Murf.ai response:', result);
        throw new Error('No audio URL returned from Murf.ai. Please check your API key and try again.');
      }

      // Download the audio file and convert to blob URL to bypass CSP
      console.log('Downloading audio file to bypass CSP...');
      const audioResponse = await fetch(audioUrl);
      
      if (!audioResponse.ok) {
        throw new Error('Failed to download generated audio');
      }

      const audioBlob = await audioResponse.blob();
      const blobUrl = URL.createObjectURL(audioBlob);
      
      return {
        blobUrl: blobUrl,
        originalUrl: audioUrl,
        blob: audioBlob,
        filename: `whispervoice-decrypted-${Date.now()}.wav`
      };

    } catch (error) {
      console.error('Text-to-speech error:', error);
      throw new Error(`Text-to-speech failed: ${error.message}`);
    }
  }

  createLoadingModal() {
    const modal = document.createElement('div');
    modal.className = 'whispervoice-modal';
    modal.innerHTML = `
      <div class="whispervoice-modal-content">
        <div class="modal-header">
          <h3>Processing Audio</h3>
          <div class="loading-spinner"></div>
        </div>
        <p id="loading-status">Initializing...</p>
        <div class="progress-bar">
          <div class="progress-fill"></div>
        </div>
      </div>
    `;
    return modal;
  }

  updateLoadingStatus(modal, status) {
    const statusElement = modal.querySelector('#loading-status');
    if (statusElement) {
      statusElement.textContent = status;
    }
    console.log('Status:', status);
  }

  showDecryptedMessage(message, audioData, originalText, ciphertext) {
    const modal = document.createElement('div');
    modal.className = 'whispervoice-modal';
    modal.innerHTML = `
      <div class="whispervoice-modal-content">
        <div class="modal-header">
          <h3>Message Decrypted Successfully</h3>
          <div class="success-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 12l2 2 4-4"/>
              <circle cx="12" cy="12" r="9"/>
            </svg>
          </div>
        </div>
        
        <div class="decrypted-message">
          <h4>Hidden Message:</h4>
          <p><strong>${message}</strong></p>
        </div>
        
        <div class="process-details">
          <details>
            <summary>View Decryption Process</summary>
            <div class="process-step">
              <strong>1. Original Audio Transcription:</strong>
              <p>"${originalText}"</p>
            </div>
            <div class="process-step">
              <strong>2. Extracted Ciphertext (First Letters):</strong>
              <p>${ciphertext}</p>
            </div>
            <div class="process-step">
              <strong>3. Playfair Decryption Result:</strong>
              <p>${message}</p>
            </div>
          </details>
        </div>
        
        <div class="audio-controls">
          <button id="play-decrypted" class="btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="5,3 19,12 5,21"/>
            </svg>
            Play Decrypted Message
          </button>
          <button id="download-audio" class="btn-secondary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7,10 12,15 17,10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Download Audio
          </button>
        </div>
        
        <div class="modal-actions">
          <button id="close-decrypted" class="btn-secondary">Close</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const playButton = modal.querySelector('#play-decrypted');
    const downloadButton = modal.querySelector('#download-audio');
    const closeButton = modal.querySelector('#close-decrypted');

    // Play button - uses blob URL which bypasses CSP
    playButton.addEventListener('click', () => {
      try {
        const audio = new Audio(audioData.blobUrl);
        audio.play().catch(error => {
          console.error('Error playing audio:', error);
          // Fallback: try to open in new tab
          window.open(audioData.blobUrl, '_blank');
        });
      } catch (error) {
        console.error('Error creating audio element:', error);
        this.showError('Could not play audio. Try downloading instead.');
      }
    });

    // Download button
    downloadButton.addEventListener('click', () => {
      try {
        const link = document.createElement('a');
        link.href = audioData.blobUrl;
        link.download = audioData.filename;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Error downloading audio:', error);
        this.showError('Could not download audio file.');
      }
    });

    closeButton.addEventListener('click', () => {
      // Clean up blob URL to prevent memory leaks
      if (audioData.blobUrl) {
        URL.revokeObjectURL(audioData.blobUrl);
      }
      modal.remove();
    });
  }

  showErrorModal(message) {
    const modal = document.createElement('div');
    modal.className = 'whispervoice-modal';
    modal.innerHTML = `
      <div class="whispervoice-modal-content">
        <div class="modal-header">
          <h3>Error Processing Audio</h3>
          <div class="error-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="9"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
          </div>
        </div>
        <p>${message}</p>
        <div class="troubleshooting">
          <details>
            <summary>Troubleshooting Tips</summary>
            <ul>
              <li>Ensure the audio file contains clear, audible speech</li>
              <li>Check that your internet connection is stable</li>
              <li>Verify your API keys are correctly configured in settings</li>
              <li>Make sure the audio actually contains a hidden message</li>
              <li>Check that your Playfair keyword matches the sender's keyword</li>
              <li>Try with a different audio file format (MP3, WAV, M4A)</li>
              <li>For Murf.ai errors, verify your API key has sufficient credits</li>
              <li>If audio playback fails, try downloading the file instead</li>
            </ul>
          </details>
        </div>
        <div class="modal-actions">
          <button id="close-error" class="btn-primary">Close</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('#close-error').addEventListener('click', () => {
      modal.remove();
    });
  }

  showConfigurationModal() {
    const modal = document.createElement('div');
    modal.className = 'whispervoice-modal';
    modal.innerHTML = `
      <div class="whispervoice-modal-content">
        <div class="modal-header">
          <h3>Configuration Required</h3>
          <div class="warning-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
        </div>
        <p>Please configure your API keys and Playfair keyword in the extension settings before using WhisperVoice.</p>
        <div class="modal-actions">
          <button id="open-settings" class="btn-primary">Open Settings</button>
          <button id="close-config" class="btn-secondary">Close</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('#open-settings').addEventListener('click', () => {
      chrome.runtime.openOptionsPage();
      modal.remove();
    });

    modal.querySelector('#close-config').addEventListener('click', () => {
      modal.remove();
    });
  }

  showError(message) {
    // Simple error notification
    const notification = document.createElement('div');
    notification.className = 'whispervoice-notification error';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  isConfigured() {
    return this.settings.assemblyaiKey && 
           this.settings.murfKey && 
           this.settings.playfairKeyword;
  }

  async updateStats() {
    const stats = await chrome.storage.sync.get(['messagesDecrypted', 'voiceNotesProcessed']);
    
    await chrome.storage.sync.set({
      messagesDecrypted: (stats.messagesDecrypted || 0) + 1,
      voiceNotesProcessed: (stats.voiceNotesProcessed || 0) + 1
    });
  }
}

// Playfair Cipher Implementation
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

// Initialize the manual upload extension
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new WhisperVoiceManual();
  });
} else {
  new WhisperVoiceManual();
}