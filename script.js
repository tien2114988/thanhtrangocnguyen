// Cursor following effect
const cursor = document.querySelector('.cursor');
document.addEventListener('mousemove', (e) => {
    gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: "power2.out"
    });
});

// Typing effect for greeting
const greetingText = "Hey You Know What! You're the most adorable human i ever met! 💖";
const greetingElement = document.querySelector('.greeting');
let charIndex = 0;

function typeGreeting() {
    if (charIndex < greetingText.length) {
        greetingElement.textContent += greetingText.charAt(charIndex);
        charIndex++;
        setTimeout(typeGreeting, 100);
    }
}

// Create floating elements
const floatingElements = ['💖', '✨', '🌸', '💫', '💕', '💗', '⭐', '✈️', '🌍', '🗺️', '🌟'];
function createFloating() {
    const element = document.createElement('div');
    element.className = 'floating';
    element.textContent = floatingElements[Math.floor(Math.random() * floatingElements.length)];
    
    const size = Math.random() * 20 + 20;
    element.style.left = Math.random() * 100 + 'vw';
    element.style.top = '110vh';
    element.style.fontSize = size + 'px';
    element.style.filter = `blur(${Math.random() * 2}px)`;
    document.body.appendChild(element);

    gsap.to(element, {
        y: -1200,
        x: (Math.random() - 0.5) * 300,
        rotation: Math.random() * 720,
        duration: Math.random() * 8 + 8,
        opacity: Math.random() * 0.6 + 0.3,
        ease: "power1.out",
        onComplete: () => element.remove()
    });
}

// Initialize animations
window.addEventListener('load', () => {
    // Profile photo animation
    gsap.to('.profile-container', {
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: "back.out(1.7)"
    });

    // Title animation with bounce
    gsap.to('.main-title', {
        opacity: 1,
        duration: 1.5,
        y: 20,
        ease: "back.out(1.7)"
    });

    // Sub-greeting animation
    gsap.to('.sub-greeting', {
        opacity: 1,
        duration: 1.2,
        y: 0,
        delay: 0.5,
        ease: "power2.out"
    });

    // Button animation with bounce
    gsap.to('.cta-button', {
        opacity: 1,
        duration: 1,
        y: -10,
        delay: 1,
        ease: "back.out(2)"
    });

    // Start typing effect
    typeGreeting();

    // Create floating elements periodically
    setInterval(createFloating, 800);
});

// Hover effects
       // Hover effects
       document.querySelectorAll('.cta-button').forEach(button => {
        button.addEventListener('mouseenter', () => {
            gsap.to(button, {
                scale: 1.1,
                duration: 0.3
            });
        });

        button.addEventListener('mouseleave', () => {
            gsap.to(button, {
                scale: 1,
                duration: 0.3
            });
        });

        // Smooth page transition on click
        button.addEventListener('click', () => {
            gsap.to('body', {
                opacity: 0,
                duration: 1,
                onComplete: () => {
                    window.location.href = 'cause.html'; // Replace with the actual URL of the next page
                }
            });
        });
    });