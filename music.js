const audio = new Audio('Until I Found You.mp3');
audio.loop = true;

// Persistence logic
const audioStateKey = 'bgMusicState';

function saveState() {
    localStorage.setItem(audioStateKey, JSON.stringify({
        currentTime: audio.currentTime,
        isPlaying: !audio.paused
    }));
}

function loadState() {
    const savedState = localStorage.getItem(audioStateKey);
    if (savedState) {
        const state = JSON.parse(savedState);
        audio.currentTime = state.currentTime || 0;
        if (state.isPlaying) {
            playAudio();
        }
    }
}

function playAudio() {
    audio.play().catch(error => {
        console.log("Autoplay blocked. Waiting for user interaction.");
        // If blocked, we'll wait for a click anywhere
        document.addEventListener('click', () => {
            audio.play();
        }, { once: true });
    });
}

// Update state frequently
audio.addEventListener('timeupdate', () => {
    // Only save every few seconds or on key events to avoid excessive storage writes
    if (Math.floor(audio.currentTime) % 2 === 0) {
        saveState();
    }
});

audio.addEventListener('play', saveState);
audio.addEventListener('pause', saveState);

// Initialize
window.addEventListener('load', () => {
    loadState();
    
    // Fallback: If it's not playing yet, try to play on the first click
    document.addEventListener('click', () => {
        if (audio.paused) {
            playAudio();
        }
    }, { once: true });
});

// Handle page unload
window.addEventListener('beforeunload', saveState);
