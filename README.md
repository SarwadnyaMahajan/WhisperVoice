# WhisperVoice
WhisperVoice: Covert voice notes. Encrypts text and hides it via LLM-generated acrostic sentences. Murf.ai creates natural audio. Browser extension decrypts with passcode, revealing hidden message or playing decoy for unauthorized listeners. Uses LLM, Murf.ai, STT APIs
# WhisperVoice: Covert Communication via AI Voice Notes

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

