# WhisperVoice Chrome Extension

A sophisticated Chrome extension for secure steganography-based voice messaging using AI technologies.

## Features

- **Playfair Cipher Encryption**: Strong symmetric encryption for your secret messages
- **AI-Powered Steganography**: Uses Gemini AI to create natural cover sentences
- **Voice Synthesis**: Converts cover messages to realistic speech using Murf.ai
- **Theme-Based Messaging**: Generate cover sentences in specific contexts (college, work, family, etc.)
- **Secure Storage**: Encrypted local storage for API keys and settings

## Setup Instructions

### 1. Get API Keys

#### Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key for use in the extension

#### Murf.ai API Key
1. Sign up at [Murf.ai](https://murf.ai/)
2. Subscribe to a plan that includes API access
3. Go to your account settings to find your API key
4. Copy the key for use in the extension

### 2. Install the Extension

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked"
4. Select the folder containing the extension files
5. The WhisperVoice extension should now appear in your browser

### 3. Configure the Extension

1. Click the WhisperVoice icon in your browser toolbar
2. Enter your Gemini API key and Murf.ai API key
3. Click "Save Keys"
4. You're ready to create covert voice messages!

## How to Use

1. **Enter Your Secret Message**: Type the confidential message you want to hide
2. **Set Encryption Parameters**: 
   - Enter a keyword for Playfair encryption
   - Set a passcode for additional security
3. **Choose Cover Theme**: Select how you want your cover sentence to sound (work, college, family, etc.)
4. **Select Voice**: Choose from available voice options
5. **Generate**: Click the generate button to create your covert voice message
6. **Share**: Download the audio file and share it through any messaging platform

## Security Features

- **Multi-layer Protection**: Combines encryption and steganography
- **Natural Cover**: AI-generated sentences sound completely normal
- **Theme Customization**: Context-appropriate cover messages
- **Local Storage**: API keys stored securely in browser storage

## Technical Details

- **Encryption**: Playfair cipher with custom keywords
- **Steganography**: First-letter encoding in AI-generated sentences
- **Voice Synthesis**: High-quality TTS using Murf.ai
- **AI Integration**: Gemini API for intelligent sentence generation

## Privacy & Security

- All processing happens locally in your browser
- API keys are stored securely in Chrome's local storage
- No message content is stored or transmitted except to the required APIs
- Generated audio files can be shared through any platform of your choice

## Support

For issues or questions, please refer to the extension's documentation or contact support.

## License

This project is for educational and personal use. Please ensure compliance with all relevant laws and platform terms of service when using steganography tools.