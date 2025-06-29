class PlayfairCipher {
    constructor(keyword) {
        if (!keyword || keyword.trim().length === 0) {
            throw new Error('Keyword cannot be empty');
        }
        
        this.keyword = keyword.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');
        
        if (this.keyword.length === 0) {
            throw new Error('Keyword must contain at least one letter');
        }
        
        this.matrix = this.generateMatrix();
        console.log('Playfair matrix generated for keyword "' + keyword + '":');
        this.printMatrix();
    }

    generateMatrix() {
        const alphabet = 'ABCDEFGHIKLMNOPQRSTUVWXYZ'; // J is omitted, replaced with I
        
        // Get unique characters from keyword first
        const keywordChars = [];
        for (let char of this.keyword) {
            if (!keywordChars.includes(char)) {
                keywordChars.push(char);
            }
        }
        
        // Add remaining alphabet characters
        const remainingChars = [];
        for (let char of alphabet) {
            if (!keywordChars.includes(char)) {
                remainingChars.push(char);
            }
        }
        
        const matrixChars = [...keywordChars, ...remainingChars];
        
        const matrix = [];
        for (let i = 0; i < 5; i++) {
            matrix.push(matrixChars.slice(i * 5, (i + 1) * 5));
        }
        return matrix;
    }

    printMatrix() {
        console.log('Matrix:');
        for (let i = 0; i < 5; i++) {
            console.log(this.matrix[i].join(' '));
        }
    }

    findPosition(char) {
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
                if (this.matrix[row][col] === char) {
                    return { row, col };
                }
            }
        }
        return null;
    }

    preprocessText(text) {
        if (!text || text.trim().length === 0) {
            throw new Error('Text cannot be empty');
        }
        
        // Convert to uppercase and replace J with I
        text = text.toUpperCase().replace(/J/g, 'I');
        
        // Remove non-alphabetic characters
        text = text.replace(/[^A-Z]/g, '');
        
        if (text.length === 0) {
            throw new Error('Text must contain at least one letter');
        }
        
        // Handle repeated characters and ensure even length
        let processed = '';
        for (let i = 0; i < text.length; i++) {
            processed += text[i];
            // Insert X between repeated characters
            if (i < text.length - 1 && text[i] === text[i + 1]) {
                processed += 'X';
            }
        }
        
        // Add 'X' if odd length
        if (processed.length % 2 !== 0) {
            processed += 'X';
        }
        
        console.log('Original text:', text);
        console.log('Preprocessed text:', processed);
        return processed;
    }

    encryptPair(char1, char2) {
        const pos1 = this.findPosition(char1);
        const pos2 = this.findPosition(char2);
        
        if (!pos1 || !pos2) {
            throw new Error(`Invalid characters: ${char1}, ${char2}`);
        }
        
        console.log(`Encrypting pair: ${char1}(${pos1.row},${pos1.col}) ${char2}(${pos2.row},${pos2.col})`);
        
        let result = '';
        
        if (pos1.row === pos2.row) {
            // Same row - move right (wrap around)
            const newCol1 = (pos1.col + 1) % 5;
            const newCol2 = (pos2.col + 1) % 5;
            result = this.matrix[pos1.row][newCol1] + this.matrix[pos2.row][newCol2];
            console.log(`Same row: moving right -> ${result}`);
        } else if (pos1.col === pos2.col) {
            // Same column - move down (wrap around)
            const newRow1 = (pos1.row + 1) % 5;
            const newRow2 = (pos2.row + 1) % 5;
            result = this.matrix[newRow1][pos1.col] + this.matrix[newRow2][pos2.col];
            console.log(`Same column: moving down -> ${result}`);
        } else {
            // Rectangle - swap columns
            result = this.matrix[pos1.row][pos2.col] + this.matrix[pos2.row][pos1.col];
            console.log(`Rectangle: swapping columns -> ${result}`);
        }
        
        return result;
    }

    encrypt(plaintext) {
        try {
            console.log('Starting encryption process...');
            const processed = this.preprocessText(plaintext);
            let ciphertext = '';
            
            console.log('Processing pairs:');
            for (let i = 0; i < processed.length; i += 2) {
                const char1 = processed[i];
                const char2 = processed[i + 1];
                const pair = this.encryptPair(char1, char2);
                ciphertext += pair;
                console.log(`Pair ${i/2 + 1}: ${char1}${char2} -> ${pair}`);
            }
            
            console.log('Final ciphertext:', ciphertext);
            return ciphertext;
        } catch (error) {
            console.error('Encryption error:', error);
            throw error;
        }
    }

    decryptPair(char1, char2) {
        const pos1 = this.findPosition(char1);
        const pos2 = this.findPosition(char2);
        
        if (!pos1 || !pos2) {
            throw new Error(`Invalid characters: ${char1}, ${char2}`);
        }
        
        let result = '';
        
        if (pos1.row === pos2.row) {
            // Same row - move left (wrap around)
            const newCol1 = (pos1.col + 4) % 5; // +4 is same as -1 with wrap
            const newCol2 = (pos2.col + 4) % 5;
            result = this.matrix[pos1.row][newCol1] + this.matrix[pos2.row][newCol2];
        } else if (pos1.col === pos2.col) {
            // Same column - move up (wrap around)
            const newRow1 = (pos1.row + 4) % 5; // +4 is same as -1 with wrap
            const newRow2 = (pos2.row + 4) % 5;
            result = this.matrix[newRow1][pos1.col] + this.matrix[newRow2][pos2.col];
        } else {
            // Rectangle - swap columns
            result = this.matrix[pos1.row][pos2.col] + this.matrix[pos2.row][pos1.col];
        }
        
        return result;
    }

    decrypt(ciphertext) {
        try {
            if (!ciphertext || ciphertext.length === 0) {
                throw new Error('Ciphertext cannot be empty');
            }
            
            console.log('Starting decryption process...');
            let plaintext = '';
            
            for (let i = 0; i < ciphertext.length; i += 2) {
                if (i + 1 < ciphertext.length) {
                    const decryptedPair = this.decryptPair(ciphertext[i], ciphertext[i + 1]);
                    plaintext += decryptedPair;
                }
            }
            
            // Remove padding X's from the end
            plaintext = plaintext.replace(/X+$/, '');
            
            // Remove X's that were inserted between repeated characters
            let cleaned = '';
            for (let i = 0; i < plaintext.length; i++) {
                if (plaintext[i] === 'X' && i > 0 && i < plaintext.length - 1) {
                    // Check if this X was likely inserted between repeated chars
                    if (plaintext[i-1] === plaintext[i+1]) {
                        continue; // Skip this X
                    }
                }
                cleaned += plaintext[i];
            }
            
            console.log('Decrypted text:', cleaned);
            return cleaned;
        } catch (error) {
            console.error('Decryption error:', error);
            throw error;
        }
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PlayfairCipher;
}