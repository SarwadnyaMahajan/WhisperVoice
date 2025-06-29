# WhisperVoice
WhisperVoice: Covert voice notes. Encrypts text and hides it via LLM-generated acrostic sentences. Murf.ai creates natural audio. Browser extension decrypts with passcode, revealing hidden message or playing decoy for unauthorized listeners. Uses LLM, Murf.ai, STT APIs
# WhisperVoice: Hide Secret Messages Inside Natural Voice Notes

## Project Overview

**WhisperVoice** is an innovative project demonstrating a multi-layered approach to secure and discreet voice communication. It tackles the challenge of **hiding the very existence of a secret message** within seemingly normal voice notes, making covert communication accessible and intuitive.

## The Solution: Multi-API Synergy

WhisperVoice leverages the power of three distinct APIs to achieve its goal of discreet and secure voice messaging:

* **Playfair Cipher (Robust Encryption):** Employs this classic symmetric encryption algorithm for strong cryptographic security. The hidden message remains unreadable without the correct "keyword."

* **Large Language Model (LLM) (Steganography - Hiding in Plain Sight):** The innovative core of our steganography. An LLM (e.g., ChatGPT) is prompted to generate a natural-sounding sentence where the **first letter of each word spells out the Playfair ciphertext**. This creates an "acrostic" poem, disguised as a normal sentence.

* **Murf.ai (AI Voice Synthesis):** The LLM-generated "decoy message" is converted into remarkably natural-sounding human-like speech using the Murf.ai Text-to-Speech (TTS) API. This audio file, sounding like a regular voice note, is what gets transmitted.

* **Speech-to-Text (STT) API (Extraction):** On the receiving end, an STT API (e.g., Google Cloud Speech-to-Text, AssemblyAI) transcribes the Murf.ai audio back into text for extraction.

## How It Works (End-to-End Flow)

### A. Sender's Side (Encryption, Steganography & Voice Generation)

1.  **Secret Message & Shared Keys:** Sender inputs plaintext, a pre-shared Playfair "Keyword," and a "Passcode" for decryption.

2.  **Playfair Encryption:** Plaintext is encrypted into a "Ciphertext" using the Playfair cipher and the Keyword.

3.  **LLM-Powered Steganography (The "First-Letter Code"):**

    * The Playfair Ciphertext (e.g., `KGYPCY`) is used to prompt an LLM.

    * The LLM generates a grammatically correct "Decoy Message" (e.g., "Kids gathered, yearning playfully, crunching yummies."), where the first letter of each word spells out the ciphertext.

4.  **Murf.ai Voice Synthesis:** This Decoy Message is sent to the Murf.ai API, transforming it into a natural-sounding audio voice note.

5.  **Covert Transmission:** The sender shares this audio file via standard messaging platforms (e.g., WhatsApp).

### B. Receiver's Side (Extraction, Decryption & Message Reveal with Browser Extension)

1.  **Voice Note Interception:** A custom browser extension detects the incoming audio message on platforms like WhatsApp.

2.  **Passcode Prompt:** The extension prompts the user for their shared "Passcode."

3.  **Conditional Playback/Decryption:**

    * **Incorrect Passcode:** The extension simply plays the original "decoy" voice note. The listener hears a normal, but semantically irrelevant, message, unaware of any secret.

    * **Correct Passcode & Extraction:**

        * The audio is sent to a **Speech-to-Text (STT) API** for transcription back into the "Decoy Message Text."

        * The steganography rule is applied: the **first letter of every word** from the transcribed text is extracted (e.g., `KGYPCY`), reconstructing the "Playfair Ciphertext."

4.  **Playfair Decryption:** Using the pre-shared "Keyword," the Playfair Ciphertext is decrypted, revealing the "Original Secret Message."

5.  **Message Reveal (Optional Voice Playback):** The decrypted plaintext is presented (as text in a pop-up, or optionally converted to voice again via Murf.ai and played aloud for an immersive reveal).

## Innovation & Impact

* **Multi-layered Security:** Combines cryptographic encryption with ingenious linguistic steganography for robust stealth.

* **AI for Advanced Discretion:** Leverages LLMs to generate highly convincing, natural-sounding cover messages, turning ordinary voice notes into powerful covert communication channels.

* **Intuitive User Experience:** The browser extension streamlines the complex process, making it user-friendly. The "sounds different" effect adds practical deception.

* **API-Driven Scalability:** Demonstrates robust integration with multiple external APIs (LLM, Murf.ai, STT), highlighting real-world potential.

* **Hackathon Feasibility:** A streamlined approach that balances advanced concepts with practical, demonstrable implementation.

## Potential Use Cases

* **Sensitive Information Exchange:** For individuals or teams requiring deniability and discretion.

* **Journalism & Activism:** Protecting sources and sensitive information in high-stakes environments.

* **Personal Privacy:** A novel and secure way to exchange private messages, adding intrigue to communication.
* # WhisperVoice Chrome Extension

**Covert Voice Message Encryption and Steganography**

---

## 🚀 Installation

To install both the sender and receiver extensions:

1. **Clone this repository** or download the source code as a ZIP file and extract it.

2. Open your Chrome browser and navigate to `chrome://extensions/`.

3. Enable **Developer mode** in the top right corner.

4. Click **Load unpacked**.

5. Select the folder containing the extension files:

*(This should be the folder containing `manifest.json`)*

6. The WhisperVoice extension (sender and receiver) will now appear in your browser.

---

## ⚙️ Configuration

Both sender and receiver require API keys for external services.

### 🎯 Get API Keys

#### LLM API Key (e.g., Gemini)

1. Go to [Google AI Studio](https://makersuite.google.com/) (or your chosen LLM provider).
2. Sign in with your Google account.
3. Create a new API key.
4. Copy the key for use in the extension.

#### Murf.ai API Key

1. Sign up at [Murf.ai](https://murf.ai).
2. Subscribe to a plan that includes API access.
3. Go to your account settings to find your API key.
4. Copy the key for use in the extension.

#### Speech-to-Text API Key (e.g., AssemblyAI)

1. Sign up at [AssemblyAI](https://www.assemblyai.com) (or your chosen STT provider).
2. Get your API key from the dashboard.
3. Copy the key for use in the extension.

---

### 🔧 Configure the Extension

1. Click the WhisperVoice icon in your browser toolbar.
2. In the settings interface:
- Enter your LLM (Gemini/ChatGPT) API key.
- Enter your Murf.ai API key.
- Enter your STT (AssemblyAI) API key.
- Set the **Playfair Keyword** (shared secret) for encryption/decryption.
3. Click **Save Keys/Settings**.

✅ You are now ready to send and receive covert voice messages!

---

## ✉️ How to Use

### A. Sending a Covert Voice Message

1. **Enter Your Secret Message**

Type the confidential message into the sender interface.

2. **Set Encryption Parameters**
- Ensure your Playfair keyword is correctly configured.
- Set a **passcode** (required for the receiver).

3. **Choose Cover Theme (Optional)**
Select a theme (e.g., work, college, family) to guide the LLM in generating a decoy sentence.

4. **Select Voice (Optional)**
Pick from available Murf.ai voice options.

5. **Generate**
- Encrypt your message with the Playfair cipher.
- Generate a decoy sentence where the first letters encode the ciphertext.
- Convert it to audio via Murf.ai.

6. **Share**
Download the audio file (MP3, WAV, etc.) and share via WhatsApp, email, etc.

---

### B. Receiving and Decrypting a Covert Voice Message

**You can start decryption in two ways:**

#### Method 1: Floating Button
- Navigate to any website.
- Look for the blue WhisperVoice button in the bottom-right corner.
- Click to open the upload modal.

#### Method 2: Extension Popup
- Click the WhisperVoice icon in the toolbar.
- Use the popup for quick access.

---

### 🛡️ Decryption Process

1. **Upload Audio**
- Drag & drop or browse to select the audio file.
- Supported formats: MP3, WAV, M4A, OGG, WebM.

2. **Enter Passcode**
- Input the passcode shared by the sender.

3. **Click Decrypt**
- The extension will:
  - Transcribe the audio via the STT API.
  - Extract the hidden ciphertext.
  - Decrypt using the Playfair keyword.
  - (Optional) Convert the decrypted text back to speech.

4. **View Results**
- See the decrypted secret message.
- Optionally play the synthesized audio.

---

## 🧠 Technical Details & How It Works

- **Encryption:** Playfair cipher using a shared keyword.
- **Steganography:** 
- Encoding: LLM generates a sentence where the first letter of each word encodes the ciphertext.
- Decoding: The extension extracts the first letters after transcription.
- **Voice Synthesis:** Murf.ai API.
- **Speech-to-Text:** AssemblyAI (or your chosen STT provider).

---

## 🎵 Supported Audio Formats
- MP3
- WAV
- M4A
- OGG
- WebM

---

## 🔒 Privacy & Security

- **Multi-layer Protection:** Encryption + steganography.
- **Passcode Protection:** Extra layer on the receiver side.
- **Natural Cover:** AI-generated sentences avoid suspicion.
- **Local Processing:** Encryption/decryption happens in-browser.
- **Secure API Key Storage:** Stored in Chrome's local storage.
- **No Permanent Storage:** Audio and transcriptions are discarded after processing.

---

## 💻 User Interface Highlights

- **Floating Button:** Quick access from any page.
- **Upload Modal:** Drag & drop files, enter passcode, see progress.
- **Results Display:** Decrypted message, optional audio playback.

---

## 🛠️ Troubleshooting

**Common Issues:**

- **Upload Fails:** Check file format, size, and connection.
- **API Errors:** Verify keys and API quotas.
- **Decryption Fails:** Ensure matching Playfair keyword and clear audio.
- **No Speech Detected:** Try clearer audio or another file.

**Error Examples:**
- `Configuration Required`: API keys missing.
- `Invalid file format`: Unsupported audio.
- `No speech detected`: STT could not transcribe.
- `Decryption failed`: Wrong passcode or keyword.

---

**Key Components**
- **WhisperVoice Core:** Encryption, steganography, API integration.
- **PlayfairCipher Class:** Cryptographic operations.
- **UI Modules:** Sender interface, upload modal, results display.
- **API Modules:** Gemini/Murf/STT communication.

---

## ⚠️ Disclaimer

This extension is for educational, personal, and legitimate privacy uses only. You are responsible for complying with applicable laws and third-party API terms of service.

---

## 📝 Version History

**v1.0.0 (Initial Release)**
- Playfair cipher encryption/decryption.
- LLM-powered first-letter steganography.
- Murf.ai TTS integration.
- AssemblyAI STT integration.
- Chrome extension sender/receiver UI.
- API key management.
- Basic error handling and troubleshooting.
- Multi-format audio support.

---



