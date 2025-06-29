class WhisperVoiceApp {
    constructor() {
        this.apiHandler = new APIHandler();
        this.initializeElements();
        this.loadStoredApiKeys();
        this.attachEventListeners();
    }

    initializeElements() {
        // API Configuration
        this.geminiApiKeyInput = document.getElementById('geminiApiKey');
        this.murfApiKeyInput = document.getElementById('murfApiKey');
        this.saveApiKeysBtn = document.getElementById('saveApiKeys');

        // Message Input
        this.secretMessageInput = document.getElementById('secretMessage');
        this.keywordInput = document.getElementById('keyword');

        // Theme Selection
        this.themeSelect = document.getElementById('themeSelect');
        this.customThemeGroup = document.getElementById('customThemeGroup');
        this.customThemeInput = document.getElementById('customTheme');

        // Voice Selection
        this.voiceSelect = document.getElementById('voiceSelect');

        // Action Button
        this.generateBtn = document.getElementById('generateBtn');

        // Results
        this.resultsSection = document.getElementById('resultsSection');
        this.encryptedTextDiv = document.getElementById('encryptedText');
        this.coverSentenceDiv = document.getElementById('coverSentence');
        this.generatedAudio = document.getElementById('generatedAudio');
        this.downloadBtn = document.getElementById('downloadBtn');

        // Loading and Status
        this.loadingSection = document.getElementById('loadingSection');
        this.statusMessage = document.getElementById('statusMessage');
    }

    async loadStoredApiKeys() {
        try {
            const result = await chrome.storage.local.get(['geminiApiKey', 'murfApiKey']);
            if (result.geminiApiKey) {
                this.geminiApiKeyInput.value = result.geminiApiKey;
            }
            if (result.murfApiKey) {
                this.murfApiKeyInput.value = result.murfApiKey;
            }
            
            // Set API keys if they exist
            if (result.geminiApiKey && result.murfApiKey) {
                this.apiHandler.setApiKeys(result.geminiApiKey, result.murfApiKey);
            }
        } catch (error) {
            console.error('Error loading stored API keys:', error);
        }
    }

    attachEventListeners() {
        // API Key Management
        this.saveApiKeysBtn.addEventListener('click', () => this.saveApiKeys());

        // Theme Selection
        this.themeSelect.addEventListener('change', () => this.handleThemeChange());

        // Generate Button
        this.generateBtn.addEventListener('click', () => this.generateCovertMessage());

        // Download Button
        this.downloadBtn.addEventListener('click', () => this.downloadAudio());

        // Auto-save inputs and update button state
        this.secretMessageInput.addEventListener('input', () => this.updateGenerateButton());
        this.keywordInput.addEventListener('input', () => this.updateGenerateButton());
        this.geminiApiKeyInput.addEventListener('input', () => this.updateGenerateButton());
        this.murfApiKeyInput.addEventListener('input', () => this.updateGenerateButton());
    }

    async saveApiKeys() {
        const geminiKey = this.geminiApiKeyInput.value.trim();
        const murfKey = this.murfApiKeyInput.value.trim();

        if (!geminiKey || !murfKey) {
            this.showStatus('Please enter both API keys', 'error');
            return;
        }

        try {
            await chrome.storage.local.set({
                geminiApiKey: geminiKey,
                murfApiKey: murfKey
            });

            this.apiHandler.setApiKeys(geminiKey, murfKey);
            this.showStatus('API keys saved successfully!', 'success');
            this.updateGenerateButton(); // Update button state after saving keys
        } catch (error) {
            console.error('Error saving API keys:', error);
            this.showStatus('Failed to save API keys', 'error');
        }
    }

    handleThemeChange() {
        const isCustom = this.themeSelect.value === 'custom';
        this.customThemeGroup.style.display = isCustom ? 'block' : 'none';
    }

    updateGenerateButton() {
        const hasMessage = this.secretMessageInput.value.trim().length > 0;
        const hasKeyword = this.keywordInput.value.trim().length > 0;
        const hasApiKeys = this.geminiApiKeyInput.value.trim().length > 0 && 
                          this.murfApiKeyInput.value.trim().length > 0;

        this.generateBtn.disabled = !(hasMessage && hasKeyword && hasApiKeys);
    }

    async generateCovertMessage() {
        const secretMessage = this.secretMessageInput.value.trim();
        const keyword = this.keywordInput.value.trim();
        const theme = this.themeSelect.value === 'custom' ? 
                     this.customThemeInput.value.trim() : 
                     this.themeSelect.value;
        const voiceId = this.voiceSelect.value;

        // Validation
        if (!secretMessage || !keyword) {
            this.showStatus('Please fill in all required fields', 'error');
            return;
        }

        if (!this.apiHandler.geminiApiKey || !this.apiHandler.murfApiKey) {
            this.showStatus('Please configure API keys first', 'error');
            return;
        }

        if (keyword.length < 3) {
            this.showStatus('Security key must be at least 3 characters long', 'error');
            return;
        }

        try {
            this.showLoading(true);
            this.showStatus('Starting encryption process...', 'info');

            // Step 1: Encrypt the message using Playfair cipher
            console.log('Original message:', secretMessage);
            console.log('Keyword:', keyword);
            
            const playfairCipher = new PlayfairCipher(keyword);
            const encryptedText = playfairCipher.encrypt(secretMessage);
            
            console.log('Encrypted text:', encryptedText);
            
            if (!encryptedText || encryptedText.length === 0) {
                throw new Error('Encryption failed - no ciphertext generated');
            }
            
            this.encryptedTextDiv.textContent = encryptedText;
            this.showStatus('Message encrypted successfully. Generating cover sentence...', 'info');

            // Step 2: Generate cover sentence using Gemini
            const coverSentence = await this.apiHandler.generateCoverSentence(encryptedText, theme);
            
            if (!coverSentence || coverSentence.trim().length === 0) {
                throw new Error('Failed to generate cover sentence');
            }
            
            console.log('Cover sentence:', coverSentence);
            this.coverSentenceDiv.textContent = coverSentence;
            this.showStatus('Cover sentence generated. Converting to speech...', 'info');

            // Step 3: Convert to speech using Murf.ai
            const audioUrl = await this.apiHandler.generateSpeech(coverSentence, voiceId);
            
            if (!audioUrl) {
                throw new Error('Failed to generate speech audio');
            }
            
            console.log('Audio URL:', audioUrl);

            // Step 4: Display results
            this.generatedAudio.src = audioUrl;
            this.generatedAudio.style.display = 'block';
            this.downloadBtn.style.display = 'block';
            this.downloadBtn.setAttribute('data-audio-url', audioUrl);
            
            this.resultsSection.style.display = 'block';
            this.showStatus('Covert voice message generated successfully!', 'success');

            // Test decryption to verify everything works
            console.log('Testing decryption...');
            const decryptedTest = playfairCipher.decrypt(encryptedText);
            console.log('Decrypted test:', decryptedTest);

        } catch (error) {
            console.error('Error generating covert message:', error);
            this.showStatus(`Error: ${error.message}`, 'error');
        } finally {
            this.showLoading(false);
        }
    }

    async downloadAudio() {
        const audioUrl = this.downloadBtn.getAttribute('data-audio-url');
        if (!audioUrl) {
            this.showStatus('No audio available for download', 'error');
            return;
        }

        try {
            const audioBlob = await this.apiHandler.downloadAudio(audioUrl);
            const url = URL.createObjectURL(audioBlob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `whispervoice_${Date.now()}.mp3`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            URL.revokeObjectURL(url);
            this.showStatus('Audio downloaded successfully!', 'success');
        } catch (error) {
            console.error('Error downloading audio:', error);
            this.showStatus('Failed to download audio', 'error');
        }
    }

    showLoading(show) {
        this.loadingSection.style.display = show ? 'block' : 'none';
        this.generateBtn.disabled = show;
    }

    showStatus(message, type) {
        this.statusMessage.textContent = message;
        this.statusMessage.className = `status-message ${type}`;
        
        // Auto-hide success messages after 3 seconds
        if (type === 'success') {
            setTimeout(() => {
                this.statusMessage.textContent = '';
                this.statusMessage.className = 'status-message';
            }, 3000);
        }
    }
}

// Initialize the app when the popup loads
document.addEventListener('DOMContentLoaded', () => {
    new WhisperVoiceApp();
});