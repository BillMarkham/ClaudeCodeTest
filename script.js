// Configuration - Uses Vercel serverless function to proxy to n8n
const N8N_WEBHOOK_URL = '/api/webhook';

// DOM Elements
const messagesContainer = document.getElementById('messages');
const userInput = document.getElementById('user-input');
const bootSequence = document.getElementById('boot-sequence');
const loadingIndicator = document.getElementById('loading');

// Matrix Rain Effect
const canvas = document.getElementById('matrix-bg');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const matrixChars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const fontSize = 14;
const columns = canvas.width / fontSize;
const drops = Array(Math.floor(columns)).fill(1);

function drawMatrix() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#00ff00';
    ctx.font = `${fontSize}px monospace`;

    for (let i = 0; i < drops.length; i++) {
        const text = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

setInterval(drawMatrix, 35);

// Handle window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Hide boot sequence after animation
setTimeout(() => {
    if (bootSequence) {
        bootSequence.style.display = 'none';
    }
}, 5000);

// Helper Functions
function getCurrentTimestamp() {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
}

function addMessage(text, type = 'system') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;

    const timestamp = document.createElement('span');
    timestamp.className = 'timestamp';
    timestamp.textContent = `[${getCurrentTimestamp()}]`;

    const content = document.createElement('span');
    content.textContent = text;

    messageDiv.appendChild(timestamp);
    messageDiv.appendChild(content);
    messagesContainer.appendChild(messageDiv);

    // Smooth scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function showLoading() {
    loadingIndicator.style.display = 'block';
}

function hideLoading() {
    loadingIndicator.style.display = 'none';
}

// Send message to n8n webhook
async function sendMessage(message) {
    try {
        showLoading();

        const response = await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                timestamp: new Date().toISOString(),
                sessionId: getOrCreateSessionId()
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        hideLoading();

        // Handle response - adjust based on your n8n webhook response structure
        if (data.response || data.message || data.output || data.text) {
            const botResponse = data.response || data.message || data.output || data.text;
            addMessage(botResponse, 'bot');
        } else {
            // If the structure is different, try to display the entire response
            addMessage(JSON.stringify(data), 'bot');
        }

    } catch (error) {
        hideLoading();
        console.error('Error sending message:', error);
        addMessage(`ERROR: Failed to communicate with chatbot - ${error.message}`, 'error');
        addMessage('Please check your n8n webhook URL configuration', 'system');
    }
}

// Session Management
function getOrCreateSessionId() {
    let sessionId = sessionStorage.getItem('matrix-session-id');
    if (!sessionId) {
        sessionId = 'session-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        sessionStorage.setItem('matrix-session-id', sessionId);
    }
    return sessionId;
}

// Handle user input
function handleUserInput() {
    const message = userInput.value.trim();

    if (!message) return;

    // Check if webhook URL is configured
    if (N8N_WEBHOOK_URL === 'YOUR_N8N_WEBHOOK_URL_HERE') {
        addMessage('ERROR: n8n webhook URL not configured', 'error');
        addMessage('Please update the N8N_WEBHOOK_URL in script.js', 'system');
        userInput.value = '';
        return;
    }

    // Display user message
    addMessage(`USER: ${message}`, 'user');

    // Clear input
    userInput.value = '';

    // Send to n8n
    sendMessage(message);
}

// Event Listeners
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleUserInput();
    }
});

// Optional: Add click event to send button if you want to add one
// document.getElementById('send-btn').addEventListener('click', handleUserInput);

// Focus input on load
window.addEventListener('load', () => {
    userInput.focus();
});

// Keep input focused when clicking anywhere in terminal
document.querySelector('.terminal-container').addEventListener('click', () => {
    userInput.focus();
});

// Initial greeting
setTimeout(() => {
    addMessage('System initialized. Ready for input.', 'system');
    addMessage('Connection to neural network established...', 'system');
}, 5500);

// Example commands (optional - remove if not needed)
const commands = {
    'help': 'Available commands: help, clear, status',
    'clear': () => {
        messagesContainer.innerHTML = '<div class="system-message"><span class="timestamp">[SYSTEM]</span> Terminal cleared.</div>';
    },
    'status': 'System Status: ONLINE | Connection: ACTIVE | Neural Link: STABLE'
};

// Command processor (optional)
function processCommand(input) {
    const cmd = input.toLowerCase();
    if (commands[cmd]) {
        if (typeof commands[cmd] === 'function') {
            commands[cmd]();
            return true;
        } else {
            addMessage(commands[cmd], 'system');
            return true;
        }
    }
    return false;
}

// Modify handleUserInput to check for commands first (optional)
/*
function handleUserInput() {
    const message = userInput.value.trim();

    if (!message) return;

    // Check for local commands first
    if (processCommand(message)) {
        userInput.value = '';
        return;
    }

    // ... rest of the function
}
*/
