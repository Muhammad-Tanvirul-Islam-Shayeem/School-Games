// Game state
let isDrawing = false;
let currentWord = '';
let isDrawer = false;
let players = [];

// Canvas setup
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');
const clearBtn = document.getElementById('clearBtn');
const guessBtn = document.getElementById('guessBtn');
const messageBox = document.getElementById('messageBox');
const wordDisplay = document.getElementById('wordDisplay');

// Drawing settings
ctx.lineWidth = 3;
ctx.lineCap = 'round';
ctx.lineJoin = 'round';

// Mock WebSocket connection (since we can't set up a real server in this example)
// In a real implementation, you would connect to a WebSocket server
const mockWebSocket = {
    send: (data) => {
        console.log('Sending:', data);
        // Simulate receiving messages
        setTimeout(() => {
            const message = JSON.parse(data);
            handleMessage(message);
        }, 100);
    }
};

// Drawing functions
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

function startDrawing(e) {
    if (!isDrawer) return;
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
}

function draw(e) {
    if (!isDrawing || !isDrawer) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
}

function stopDrawing() {
    isDrawing = false;
}

// Color picker
colorPicker.addEventListener('change', (e) => {
    ctx.strokeStyle = e.target.value;
});

// Clear canvas
clearBtn.addEventListener('click', () => {
    if (!isDrawer) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Make guess
guessBtn.addEventListener('click', () => {
    if (isDrawer) return;
    const guess = prompt('Enter your guess:');
    if (guess) {
        mockWebSocket.send(JSON.stringify({
            type: 'guess',
            guess: guess.toLowerCase()
        }));
    }
});

// Handle incoming messages
function handleMessage(message) {
    switch (message.type) {
        case 'word':
            currentWord = message.word;
            isDrawer = message.isDrawer;
            wordDisplay.textContent = isDrawer ? `Draw: ${currentWord}` : 'Guess the drawing!';
            if (isDrawer) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
            break;
        case 'guess':
            addMessage(`${message.player}: ${message.guess}`);
            if (message.guess.toLowerCase() === currentWord.toLowerCase()) {
                addMessage(`${message.player} guessed correctly!`);
            }
            break;
        case 'clear':
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            break;
    }
}

function addMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageBox.appendChild(messageElement);
    messageBox.scrollTop = messageBox.scrollHeight;
}

// Start the game with a mock word
setTimeout(() => {
    handleMessage({
        type: 'word',
        word: 'cat',
        isDrawer: true
    });
}, 1000); 