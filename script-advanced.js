/**
 * Advanced Features - Birthday Surprise Extensions
 */

// User name - set by name modal (CONFIG.pages extended in script.js)
let userName = typeof CONFIG !== 'undefined' ? CONFIG.friendName : 'Panda';

// ===== Name Modal =====
function initNameModal() {
    const friendName = typeof CONFIG !== 'undefined' ? CONFIG.friendName : 'Panda';
    const modal = document.getElementById('name-modal');
    const input = document.getElementById('user-name-input');
    const btn = document.getElementById('btn-submit-name');
    
    const savedName = localStorage.getItem('birthdaySurprise_userName');
    if (savedName) {
        userName = savedName;
        if (modal) modal.classList.remove('active');
        return;
    }
    
    btn?.addEventListener('click', () => {
        const name = input?.value.trim() || friendName;
        userName = name || friendName;
        localStorage.setItem('birthdaySurprise_userName', userName);
        modal?.classList.remove('active');
        updateUserNameEverywhere();
    });
    
    input?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') btn?.click();
    });
}

function updateUserNameEverywhere() {
    document.querySelectorAll('.friend-name-display, #friend-name-final, .friend-name').forEach(el => {
        if (el.id !== 'friend-name-final') el.textContent = `${userName}!`;
    });
    const final = document.getElementById('friend-name-final');
    if (final) final.textContent = `${userName}!`;
}

// ===== Chat Page =====
const CHAT_MESSAGES = [
    { from: 'you', text: 'Hey' },
    { from: 'friend', text: 'Hey' },
    { from: 'you', text: 'Do you know what day it is?' },
    { from: 'friend', text: 'No' },
    { from: 'you', text: "It's your birthday ❤️" },
    { from: 'friend', text: 'Click next for your surprise' }
];

function initChat() {
    const container = document.getElementById('chat-messages');
    const typing = document.getElementById('typing-indicator');
    const btnNext = document.getElementById('btn-chat-next');
    
    if (!container) return;
    
    container.innerHTML = '';
    typing.style.display = 'flex';
    if (btnNext) btnNext.style.display = 'none';
    
    let i = 0;
    const showNext = () => {
        if (i >= CHAT_MESSAGES.length) {
            typing.style.display = 'none';
            if (btnNext) btnNext.style.display = 'block';
            return;
        }
        
        const msg = CHAT_MESSAGES[i];
        const bubble = document.createElement('div');
        bubble.className = `chat-bubble ${msg.from}`;
        bubble.textContent = msg.text;
        container.appendChild(bubble);
        container.scrollTop = container.scrollHeight;
        
        i++;
        setTimeout(showNext, 1500);
    };
    
    setTimeout(showNext, 800);
}

// ===== Timeline =====
function initTimeline() {
    const items = document.querySelectorAll('.timeline-item');
    items.forEach((item, i) => {
        item.classList.remove('visible');
        setTimeout(() => item.classList.add('visible'), i * 300);
    });
}

// ===== Catch Hearts Game =====
function initGame() {
    const area = document.getElementById('game-area');
    const scoreEl = document.getElementById('game-score');
    const wonEl = document.getElementById('game-won');
    
    if (!area) return;
    
    area.innerHTML = '';
    if (scoreEl) scoreEl.textContent = '0';
    if (wonEl) wonEl.style.display = 'none';
    
    let score = 0;
    
    const handleHeartClick = (heart) => {
        if (!heart.parentNode) return;
        score++;
        if (scoreEl) scoreEl.textContent = score;
        heart.remove();
        playSound(elements.clickSound, 0.3);
        if (score >= 10) {
            if (wonEl) wonEl.style.display = 'block';
            playConfetti();
            setTimeout(() => goToPage(8), 2000);
        }
    };
    
    const spawnHeart = () => {
        const heart = document.createElement('div');
        heart.className = 'game-heart';
        heart.textContent = '❤️';
        heart.style.left = `${10 + Math.random() * 70}%`;
        heart.style.top = '-50px';
        heart.setAttribute('role', 'button');
        heart.setAttribute('tabindex', '0');
        heart.addEventListener('click', (e) => {
            e.stopPropagation();
            handleHeartClick(heart);
        });
        heart.addEventListener('touchend', (e) => {
            e.preventDefault();
            handleHeartClick(heart);
        });
        heart.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleHeartClick(heart);
            }
        });
        area.appendChild(heart);
        setTimeout(() => { if (heart.parentNode) heart.remove(); }, 4500);
    };
    
    spawnHeart();
    const interval = setInterval(spawnHeart, 1000);
    setTimeout(() => clearInterval(interval), 20000);
}

// ===== Secret Letter =====
function getLetterText() {
    const name = userName || CONFIG.friendName;
    return `Dear ${name}, I wanted to write you this letter to tell you how much you mean to me. Every moment we've shared has been special. You've brought so much joy into my life. Thank you for being the amazing person you are. Happy Birthday! ❤️`;
}

function initLetter() {
    const envelope = document.getElementById('envelope');
    const letterContainer = document.getElementById('letter-container');
    const letterText = document.getElementById('letter-text');
    const btnContinue = document.getElementById('btn-letter-continue');
    
    if (!envelope || !letterContainer) return;
    
    envelope.classList.remove('open');
    letterContainer.classList.remove('visible');
    if (btnContinue) btnContinue.style.display = 'none';
    
    envelope.onclick = () => {
        playSound(elements.clickSound, 0.3);
        envelope.classList.add('open');
        envelope.onclick = null;
        
        setTimeout(() => {
            letterContainer.classList.add('visible');
            letterText.textContent = getLetterText();
            if (btnContinue) btnContinue.style.display = 'block';
        }, 800);
    };
}

function typeLetter(text, el, speed = 40) {
    if (!el) return;
    el.textContent = '';
    let i = 0;
    function type() {
        if (i < text.length) {
            el.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// ===== Balloon Pop =====
const BALLOON_CONTENTS = [
    'You are amazing! ✨',
    'Best friend ever! 💕',
    '❤️',
    '🎂',
    'So grateful for you!',
    'Final surprise unlocked'
];

function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function initBalloons() {
    const grid = document.getElementById('balloons-grid');
    const reveal = document.getElementById('balloon-reveal');
    
    if (!grid) return;
    
    grid.innerHTML = '';
    if (reveal) reveal.textContent = '';
    
    const contents = shuffle(BALLOON_CONTENTS);
    
    for (let i = 0; i < 6; i++) {
        const balloon = document.createElement('div');
        balloon.className = 'balloon-item';
        balloon.textContent = '🎈';
        const content = contents[i];
        
        balloon.addEventListener('click', () => {
            if (balloon.classList.contains('popped')) return;
            balloon.classList.add('popped');
            if (reveal) reveal.textContent = content;
            playSound(elements.clickSound, 0.3);
            if (content === 'Final surprise unlocked') {
                playConfetti();
                setTimeout(() => goToPage(10), 1500);
            }
        });
        grid.appendChild(balloon);
    }
}

// ===== Scratch Card =====
function initScratch() {
    const canvas = document.getElementById('scratch-canvas');
    const container = document.querySelector('.scratch-container');
    const btnContinue = document.getElementById('btn-scratch-continue');
    
    if (!canvas || !container) return;
    
    const width = 300;
    const height = 150;
    
    canvas.width = width;
    canvas.height = height;
    
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#888';
    ctx.fillRect(0, 0, width, height);
    
    const scratchSound = document.getElementById('scratch-sound');
    const threshold = 0.6;
    
    const getPos = (e) => {
        const rect = canvas.getBoundingClientRect();
        const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
        const clientY = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
        return {
            x: ((clientX - rect.left) / rect.width) * width,
            y: ((clientY - rect.top) / rect.height) * height
        };
    };
    
    const checkRevealed = () => {
        const imageData = ctx.getImageData(0, 0, width, height);
        let transparent = 0;
        for (let i = 3; i < imageData.data.length; i += 4) {
            if (imageData.data[i] < 128) transparent++;
        }
        if ((transparent / (width * height)) >= threshold) {
            canvas.style.pointerEvents = 'none';
            if (btnContinue) btnContinue.style.display = 'block';
            playConfetti();
        }
    };
    
    const scratch = (x, y) => {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, 25, 0, Math.PI * 2);
        ctx.fill();
        checkRevealed();
    };
    
    const handleScratch = (e) => {
        e.preventDefault();
        playSound(scratchSound, 0.2);
        const pos = getPos(e);
        scratch(pos.x, pos.y);
    };
    
    canvas.addEventListener('mousedown', (e) => {
        handleScratch(e);
        canvas.addEventListener('mousemove', handleScratch);
    });
    canvas.addEventListener('mouseup', () => canvas.removeEventListener('mousemove', handleScratch));
    canvas.addEventListener('touchstart', handleScratch, { passive: false });
    canvas.addEventListener('touchmove', handleScratch, { passive: false });
}

// ===== It's Important Page =====
function initItsImportant() {
    const questionArea = document.getElementById('important-question-area');
    const noResponse = document.getElementById('important-no-response');
    const yesResponse = document.getElementById('important-yes-response');
    const subtitle = document.getElementById('important-subtitle');
    const goodBoyText = document.getElementById('good-boy-text');
    const openGiftText = document.getElementById('open-gift-text');
    const btnYes = document.getElementById('btn-important-yes');
    const btnNo = document.getElementById('btn-important-no');
    const btnOpenGift = document.getElementById('btn-open-gift');
    const page = document.getElementById('page-important');
    const errorSound = document.getElementById('error-sound');

    if (!questionArea || !noResponse || !yesResponse) return;

    questionArea.style.display = 'block';
    noResponse.classList.remove('visible');
    yesResponse.classList.remove('visible');
    goodBoyText.textContent = '';
    openGiftText.textContent = '';
    btnOpenGift.style.display = 'none';

    if (typeof Typed !== 'undefined' && subtitle) {
        new Typed(subtitle, {
            strings: ['Answer this question correctly to reveal your gift...'],
            typeSpeed: 50,
            showCursor: false
        });
    } else if (subtitle) {
        subtitle.textContent = 'Answer this question correctly to reveal your gift...';
    }

    btnYes.onclick = () => {
        playSound(elements.clickSound, 0.5);
        questionArea.style.display = 'none';
        yesResponse.classList.add('visible');

        if (typeof confetti !== 'undefined') {
            confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
        }

        const typeText = (el, text, delay, then) => {
            setTimeout(() => {
                if (typeof Typed !== 'undefined' && el) {
                    new Typed(el, {
                        strings: [text],
                        typeSpeed: 60,
                        showCursor: false,
                        onComplete: then
                    });
                } else if (el) {
                    el.textContent = text;
                    if (then) then();
                }
            }, delay);
        };

        typeText(goodBoyText, 'Good boy 💖', 300, () => {
            setTimeout(() => {
                typeText(openGiftText, 'Now you can open your gift 🎁', 0, () => {
                    setTimeout(() => {
                        btnOpenGift.style.display = 'block';
                    }, 300);
                });
            }, 1500);
        });
    };

    btnNo.onclick = () => {
        playSound(errorSound, 0.5);
        page.classList.add('shake');
        setTimeout(() => page.classList.remove('shake'), 500);
        questionArea.style.display = 'none';
        noResponse.classList.add('visible');
    };

    document.getElementById('btn-try-again')?.addEventListener('click', () => {
        playSound(elements.clickSound, 0.3);
        noResponse.classList.remove('visible');
        questionArea.style.display = 'block';
        btnNo.style.transform = '';
    });

    btnOpenGift.onclick = () => {
        playSound(elements.clickSound, 0.3);
        playSound(elements.giftSound, 0.5);
        goToPage(13);
    };
}

// ===== Romantic Reveal Page =====
function initRomanticReveal() {
    const revealMe = document.getElementById('reveal-me');
    if (!revealMe) return;

    revealMe.textContent = '';
    if (typeof Typed !== 'undefined') {
        new Typed(revealMe, {
            strings: ['Me ❤️'],
            typeSpeed: 80,
            showCursor: false
        });
    } else {
        revealMe.textContent = 'Me ❤️';
    }
}

// ===== Cinematic Final =====
function initCinematicFinal() {
    const overlay = document.getElementById('cinematic-overlay');
    const giftBox = elements.finalGiftBox;
    const surprise = elements.finalSurprise;
    const btnLastThing = document.getElementById('btn-one-last-thing');
    
    overlay.style.opacity = '1';
    setTimeout(() => { overlay.style.opacity = '0'; }, 1500);
}

// ===== Secret Ending =====
function initEnding() {
    const container = document.getElementById('infinite-hearts');
    if (!container) return;
    
    container.innerHTML = '';
    
    const spawnHeart = () => {
        const heart = document.createElement('span');
        heart.className = 'ending-heart';
        heart.textContent = ['❤️', '💕', '💖'][Math.floor(Math.random() * 3)];
        heart.style.left = `${Math.random() * 100}%`;
        heart.style.bottom = '-30px';
        heart.style.setProperty('--dx', `${(Math.random() - 0.5) * 100}px`);
        container.appendChild(heart);
        setTimeout(() => heart.remove(), 8000);
    };
    
    setInterval(spawnHeart, 300);
}

// ===== Particle Upgrade - Floating hearts, stars, sparkles =====
const PARTICLE_CHARS = ['❤️', '💕', '✨', '💫', '⭐'];

function spawnFloatingParticle(container) {
    if (!container) return;
    const p = document.createElement('span');
    p.className = 'floating-particle';
    p.textContent = PARTICLE_CHARS[Math.floor(Math.random() * PARTICLE_CHARS.length)];
    p.style.left = `${Math.random() * 100}%`;
    p.style.setProperty('--dx', `${(Math.random() - 0.5) * 60}px`);
    p.style.animationDuration = `${5 + Math.random() * 5}s`;
    p.style.animationDelay = `${Math.random() * 2}s`;
    container.appendChild(p);
    setTimeout(() => p.remove(), 10000);
}

function initFloatingParticles(page) {
    if (!page) return;
    let container = page.querySelector('.floating-particles-layer');
    if (!container) {
        container = document.createElement('div');
        container.className = 'floating-particles-layer';
        page.insertBefore(container, page.firstChild);
    }
    spawnFloatingParticle(container);
    setInterval(() => spawnFloatingParticle(container), 1500);
}

