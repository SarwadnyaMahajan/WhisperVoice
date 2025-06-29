class APIHandler {
    constructor() {
        this.geminiApiKey = '';
        this.murfApiKey = '';
    }

    setApiKeys(geminiKey, murfKey) {
        this.geminiApiKey = geminiKey;
        this.murfApiKey = murfKey;
    }

    async generateCoverSentence(ciphertext, theme) {
        if (!ciphertext || ciphertext.length === 0) {
            throw new Error('Ciphertext cannot be empty');
        }

        const letters = ciphertext.split('').join('-');
        
        let themePrompt = '';
        switch (theme) {
            case 'college':
                themePrompt = 'Create a sentence about college life, university experiences, studies, or campus activities where ';
                break;
            case 'work':
                themePrompt = 'Create a sentence about work, business, office life, or professional activities where ';
                break;
            case 'family':
                themePrompt = 'Create a sentence about family, relatives, home life, or family activities where ';
                break;
            case 'sports':
                themePrompt = 'Create a sentence about sports, games, athletics, or physical activities where ';
                break;
            case 'travel':
                themePrompt = 'Create a sentence about travel, vacation, places, or tourism where ';
                break;
            case 'food':
                themePrompt = 'Create a sentence about food, cooking, dining, or restaurants where ';
                break;
            case 'technology':
                themePrompt = 'Create a sentence about technology, computers, gadgets, or innovation where ';
                break;
            default:
                themePrompt = 'Create a natural, coherent English sentence where ';
        }

        const prompt = `${themePrompt}the first letter of each word spells out exactly: ${letters}. 
        
        Requirements:
        - The sentence must be grammatically correct and sound natural
        - Each word must start with the exact letter in the sequence: ${letters}
        - The sentence should make logical sense in the context of ${theme}
        - Use exactly ${ciphertext.length} words, no more, no less
        - Do not add any extra words or explanations
        - Return only the sentence itself
        
        Example: If the letters are H-E-L-L-O, create a sentence like "Happy elephants love large oranges."`;

        try {
            const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=' + this.geminiApiKey, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }]
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Gemini API error: ${response.status} ${response.statusText} - ${errorText}`);
            }

            const data = await response.json();
            
            if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
                const generatedText = data.candidates[0].content.parts[0].text.trim();
                
                // Clean up the response - remove quotes and extra formatting
                const cleanedText = generatedText.replace(/^["']|["']$/g, '').trim();
                
                console.log('Generated cover sentence:', cleanedText);
                return cleanedText;
            } else {
                console.error('Invalid Gemini API response:', data);
                throw new Error('Invalid response format from Gemini API');
            }
        } catch (error) {
            console.error('Error calling Gemini API:', error);
            throw new Error(`Failed to generate cover sentence: ${error.message}`);
        }
    }

    async generateSpeech(text, voiceId) {
        if (!text || text.trim().length === 0) {
            throw new Error('Text cannot be empty');
        }

        const requestData = {
            text: text.trim(),
            voiceId: voiceId
        };

        try {
            const response = await fetch('https://api.murf.ai/v1/speech/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'api-key': this.murfApiKey
                },
                body: JSON.stringify(requestData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Murf API error: ${response.status} ${response.statusText} - ${errorText}`);
            }

            const data = await response.json();
            console.log('Murf API response:', data);
            
            // The Murf API typically returns a URL to the generated audio
            if (data.audioUrl || data.audio_url || data.url) {
                return data.audioUrl || data.audio_url || data.url;
            } else if (data.audioFile || data.audio_file) {
                return data.audioFile || data.audio_file;
            } else if (data.data && data.data.audioUrl) {
                return data.data.audioUrl;
            } else {
                console.error('Unexpected Murf API response format:', data);
                throw new Error('No audio URL found in Murf API response');
            }
        } catch (error) {
            console.error('Error calling Murf API:', error);
            throw new Error(`Failed to generate speech: ${error.message}`);
        }
    }

    async downloadAudio(audioUrl) {
        try {
            const response = await fetch(audioUrl);
            if (!response.ok) {
                throw new Error(`Failed to download audio: ${response.status} ${response.statusText}`);
            }
            return await response.blob();
        } catch (error) {
            console.error('Error downloading audio:', error);
            throw new Error(`Failed to download audio: ${error.message}`);
        }
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = APIHandler;
}