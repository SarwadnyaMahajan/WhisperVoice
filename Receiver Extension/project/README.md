# WhisperVoice - Audio Message Decryptor

A sophisticated browser extension that decrypts hidden messages embedded in audio files using AI-powered steganography and cryptography.

## Features

- **Manual Audio Upload**: Upload any audio file (MP3, WAV, M4A, OGG) for decryption
- **Drag & Drop Interface**: Easy file upload with drag and drop support
- **Passcode Protection**: Secure access to hidden messages
- **Real-time Speech Processing**: Uses AssemblyAI for speech-to-text conversion
- **Playfair Cipher Decryption**: Decrypts hidden messages using classic cryptography
- **AI Voice Synthesis**: Converts decrypted messages back to speech using Murf.ai
- **Steganography Extraction**: Extracts hidden messages from first letters of words
- **Universal Compatibility**: Works on any website

## Installation

1. Clone this repository or download the source code
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension folder
5. The WhisperVoice extension will be installed

## Configuration

1. Click the WhisperVoice extension icon in the toolbar
2. Enter your API keys:
   - **AssemblyAI API Key**: Get from [AssemblyAI](https://www.assemblyai.com/)
   - **Murf.ai API Key**: Get from [Murf.ai](https://murf.ai/)
   - **Playfair Keyword**: Shared secret keyword for decryption
3. Click "Save Settings"

## Usage

### Method 1: Floating Button
1. Navigate to any website
2. Look for the blue floating WhisperVoice button in the bottom-right corner
3. Click the floating button to open the upload modal

### Method 2: Extension Popup
1. Click the WhisperVoice extension icon in the toolbar
2. Use the popup interface for quick access

### Decryption Process
1. **Upload Audio**: Drag and drop or click to browse for your audio file
2. **Enter Passcode**: Input your decryption passcode
3. **Click Decrypt**: The extension will:
   - Upload and process your audio file
   - Convert the audio to text using AssemblyAI
   - Extract the hidden ciphertext from first letters
   - Decrypt the message using Playfair cipher
   - Convert the decrypted message back to speech
4. **View Results**: See the decrypted message and play the audio

## How It Works

### Sender Side (Not included in this extension)
1. Secret message is encrypted using Playfair cipher
2. LLM generates a natural sentence where first letters spell the ciphertext
3. Sentence is converted to voice using Murf.ai
4. Audio file is shared with the recipient

### Receiver Side (This Extension)
1. User uploads the audio file manually
2. User enters passcode to decrypt
3. Audio is converted to text using AssemblyAI
4. First letters of each word are extracted
5. Ciphertext is decrypted using Playfair cipher
6. Decrypted message is converted back to speech

## Supported Audio Formats

- **MP3** - Most common format
- **WAV** - High quality uncompressed
- **M4A** - Apple audio format
- **OGG** - Open source format
- **WebM** - Web-optimized format

## Security Features

- Passcode protection for message access
- Playfair cipher encryption/decryption
- Secure API key storage
- Local processing with external API calls only for transcription/synthesis
- No data stored permanently

## API Requirements

### AssemblyAI
- Sign up at [AssemblyAI](https://www.assemblyai.com/)
- Get your API key from the dashboard
- Used for speech-to-text conversion
- Supports file upload for audio processing

### Murf.ai
- Sign up at [Murf.ai](https://murf.ai/)
- Get your API key from the dashboard
- Used for text-to-speech conversion

## Privacy

- Audio files are temporarily uploaded to AssemblyAI for processing
- API keys are stored securely in Chrome's sync storage
- No permanent data storage
- Messages are processed in real-time
- Audio files are not stored by the extension

## User Interface

### Floating Button
- **Location**: Bottom-right corner of any webpage
- **Design**: Blue gradient circle with WhisperVoice logo
- **Behavior**: Hover effects and smooth animations

### Upload Modal
- **Drag & Drop Area**: Large, intuitive upload zone
- **File Information**: Shows selected file name and size
- **Passcode Input**: Secure password field
- **Progress Tracking**: Real-time status updates

### Results Display
- **Decrypted Message**: Prominently displayed result
- **Process Details**: Expandable view of decryption steps
- **Audio Playback**: Play button for synthesized speech
- **Error Handling**: Clear error messages with troubleshooting tips

## Troubleshooting

### Common Issues

1. **Upload fails**
   - Check file format is supported
   - Ensure file size is reasonable (< 25MB)
   - Verify internet connection

2. **API errors**
   - Check your API keys are correct
   - Ensure you have sufficient API credits
   - Verify API endpoints are accessible

3. **Decryption fails**
   - Verify the Playfair keyword matches the sender's
   - Check that the audio contains clear speech
   - Ensure the audio actually contains a hidden message

4. **No speech detected**
   - Audio may be too quiet or unclear
   - Try with a different audio file
   - Check audio format compatibility

### Error Messages

- "Configuration Required": API keys not set up
- "Invalid file format": Unsupported audio format
- "No speech detected": Audio doesn't contain recognizable speech
- "Decryption failed": Wrong passcode or no hidden message

## Development

### File Structure
```
├── manifest.json          # Extension manifest
├── popup.html             # Settings popup
├── popup.css              # Popup styles
├── popup.js               # Popup logic
├── content.js             # Main extension logic
├── background.js          # Background service worker
├── styles.css             # Injected styles
└── README.md              # This file
```

### Key Components

1. **WhisperVoiceManual Class**: Main extension logic
2. **PlayfairCipher Class**: Cryptographic operations
3. **Upload Interface**: File handling and UI
4. **API Integration**: AssemblyAI and Murf.ai communication

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Disclaimer

This extension is for educational and legitimate privacy purposes only. Users are responsible for complying with all applicable laws and regulations regarding encryption and communication privacy.

## Version History

### v1.0.0
- Initial release with manual audio upload
- Support for multiple audio formats
- Drag & drop interface
- Real-time processing with progress tracking
- Comprehensive error handling and troubleshooting