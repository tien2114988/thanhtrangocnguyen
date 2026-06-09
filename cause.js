 // Reasons database
 const reasons = [
    { 
        text: "Chúc Thảo càng ngày càng xinh đẹp nè ✨", 
        emoji: "💖",
        image: "pt1.jpg"
    },
    { 
        text: "Chúc Thảo thuận lợi trong mọi việc 🚀", 
        emoji: "🍀",
        image: "pt2.jpg"
    },
    { 
        text: "Chúc Thảo thật nhiều sức khoẻ 💪", 
        emoji: "🌸",
        image: "pt3.jpg"
    },
    { 
        text: "Chúc Thảo luôn luôn vui vẻ hạnh phúc 😊", 
        emoji: "🌈",
        image: "pt4.jpg"
    },
    { 
        text: "Chúc Thảo tất cả ❤️", 
        emoji: "🎁",
        image: "pt5.jpg"
    }
];

// State management
let currentReasonIndex = 0;
const reasonsContainer = document.getElementById('reasons-container');
const shuffleButton = document.querySelector('.shuffle-button');
const reasonCounter = document.querySelector('.reason-counter');
let isTransitioning = false;

// Create reason card with personal photo
function createReasonCard(reason) {
    const card = document.createElement('div');
    card.className = 'reason-card';
    
    const imgWrapper = document.createElement('div');
    imgWrapper.className = 'reason-img-wrapper';
    imgWrapper.innerHTML = `<img src="${reason.image}" alt="Phương Thảo" class="reason-img">`;
    
    const text = document.createElement('div');
    text.className = 'reason-text';
    text.innerHTML = `${reason.emoji} ${reason.text}`;
    
    card.appendChild(imgWrapper);
    card.appendChild(text);
    
    gsap.from(card, {
        opacity: 0,
        y: 50,
        scale: 0.9,
        duration: 0.6,
        ease: "back.out(1.7)"
    });

    return card;
}

// Display new reason
function displayNewReason() {
    if (isTransitioning) return;
    isTransitioning = true;

    if (currentReasonIndex < reasons.length) {
        // Clear previous card if it exists
        const oldCard = reasonsContainer.querySelector('.reason-card');
        if (oldCard) {
            gsap.to(oldCard, {
                opacity: 0,
                x: -50,
                scale: 0.8,
                duration: 0.4,
                onComplete: () => {
                    oldCard.remove();
                    showNextCard();
                }
            });
        } else {
            showNextCard();
        }

        function showNextCard() {
            const card = createReasonCard(reasons[currentReasonIndex]);
            reasonsContainer.appendChild(card);
            
            // Update counter
            reasonCounter.textContent = `Lời chúc ${currentReasonIndex + 1} / ${reasons.length}`;
            
            currentReasonIndex++;

            // Check if we should transform the button
            if (currentReasonIndex === reasons.length) {
                gsap.to(shuffleButton, {
                    scale: 1.1,
                    duration: 0.5,
                    ease: "elastic.out",
                    onComplete: () => {
                        shuffleButton.textContent = "Tiếp theo 💫";
                        shuffleButton.classList.add('story-mode');
                    }
                });
            }
            isTransitioning = false;
        }
    } else {
        window.location.href = 'last.html';
    }
}

// Initialize button click
shuffleButton.addEventListener('click', () => {
    if (shuffleButton.classList.contains('story-mode')) {
        gsap.to('body', {
            opacity: 0,
            duration: 1,
            onComplete: () => {
                window.location.href = 'last.html';
            }
        });
        return;
    }

    gsap.to(shuffleButton, {
        scale: 0.9,
        duration: 0.1,
        yoyo: true,
        repeat: 1
    });
    displayNewReason();
});

// Create floating elements
const emojis = ['❤️', '💖', '✨', '🌸', '🎁', '✈️', '🌍', '🗺️'];
function createFloatingElement() {
    const emoji = document.createElement('div');
    emoji.className = 'floating';
    emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    emoji.style.left = Math.random() * 100 + 'vw';
    emoji.style.top = '110vh';
    emoji.style.fontSize = (Math.random() * 20 + 20) + 'px';
    document.body.appendChild(emoji);

    gsap.to(emoji, {
        y: -window.innerHeight - 200,
        x: (Math.random() - 0.5) * 200,
        rotation: Math.random() * 360,
        duration: Math.random() * 3 + 4,
        ease: "none",
        onComplete: () => emoji.remove()
    });
}

// Custom cursor (same as before)
const cursor = document.querySelector('.custom-cursor');
document.addEventListener('mousemove', (e) => {
    gsap.to(cursor, {
        x: e.clientX - 15,
        y: e.clientY - 15,
        duration: 0.2
    });
});

// Create initial floating elements
setInterval(createFloatingElement, 2000);