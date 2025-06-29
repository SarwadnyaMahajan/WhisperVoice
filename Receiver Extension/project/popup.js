document.addEventListener('DOMContentLoaded', async () => {
  const assemblyaiKeyInput = document.getElementById('assemblyai-key');
  const murfKeyInput = document.getElementById('murf-key');
  const playfairKeywordInput = document.getElementById('playfair-keyword');
  const saveButton = document.getElementById('save-settings');
  const statusElement = document.getElementById('status');
  const messagesDecryptedElement = document.getElementById('messages-decrypted');
  const voiceNotesProcessedElement = document.getElementById('voice-notes-processed');

  // Load saved settings
  const settings = await chrome.storage.sync.get([
    'assemblyaiKey',
    'murfKey',
    'playfairKeyword',
    'messagesDecrypted',
    'voiceNotesProcessed'
  ]);

  if (settings.assemblyaiKey) {
    assemblyaiKeyInput.value = settings.assemblyaiKey;
  }
  if (settings.murfKey) {
    murfKeyInput.value = settings.murfKey;
  }
  if (settings.playfairKeyword) {
    playfairKeywordInput.value = settings.playfairKeyword;
  }

  // Update stats
  messagesDecryptedElement.textContent = settings.messagesDecrypted || 0;
  voiceNotesProcessedElement.textContent = settings.voiceNotesProcessed || 0;

  // Toggle password visibility
  document.querySelectorAll('.toggle-visibility').forEach(button => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-target');
      const input = document.getElementById(targetId);
      const isPassword = input.type === 'password';
      
      input.type = isPassword ? 'text' : 'password';
      
      // Update icon
      const path = button.querySelector('path');
      if (isPassword) {
        path.setAttribute('d', 'M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24');
        const line1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line1.setAttribute('x1', '1');
        line1.setAttribute('y1', '1');
        line1.setAttribute('x2', '23');
        line1.setAttribute('y2', '23');
        button.querySelector('svg').appendChild(line1);
      } else {
        path.setAttribute('d', 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z');
        const line = button.querySelector('line');
        if (line) line.remove();
        const circle = button.querySelector('circle');
        if (!circle) {
          const newCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          newCircle.setAttribute('cx', '12');
          newCircle.setAttribute('cy', '12');
          newCircle.setAttribute('r', '3');
          button.querySelector('svg').appendChild(newCircle);
        }
      }
    });
  });

  // Save settings
  saveButton.addEventListener('click', async () => {
    const settings = {
      assemblyaiKey: assemblyaiKeyInput.value.trim(),
      murfKey: murfKeyInput.value.trim(),
      playfairKeyword: playfairKeywordInput.value.trim()
    };

    if (!settings.assemblyaiKey || !settings.murfKey || !settings.playfairKeyword) {
      showMessage('Please fill in all required fields', 'error');
      return;
    }

    try {
      await chrome.storage.sync.set(settings);
      showMessage('Settings saved successfully!', 'success');
      updateStatus('Configured');
    } catch (error) {
      showMessage('Failed to save settings', 'error');
    }
  });

  function showMessage(text, type) {
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
      existingMessage.remove();
    }

    const message = document.createElement('div');
    message.className = `message ${type}-message`;
    message.textContent = text;
    saveButton.parentNode.appendChild(message);

    setTimeout(() => {
      message.remove();
    }, 3000);
  }

  function updateStatus(text) {
    statusElement.querySelector('span:last-child').textContent = text;
  }

  // Check if extension is properly configured
  if (settings.assemblyaiKey && settings.murfKey && settings.playfairKeyword) {
    updateStatus('Configured');
  }
});