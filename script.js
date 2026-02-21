/**
 * Birthday Surprise Website - Main Script
 * Premium animated multi-page experience
 */

// ===== Configuration =====
const CONFIG = {
    friendName: 'Panda',
    password: 'panda',
    pages: ['welcome', 'password', 'quiz1', 'quiz2', 'quiz3', 'chat', 'timeline', 'game', 'letter', 'balloons', 'scratch', 'story', 'important', 'reveal', 'final', 'ending'],
    totalPages: 16
};

// ===== State =====
let currentPageIndex = 0;
let typedInstance = null;

// ===== DOM Elements =====
const elements = {
    loadingScreen: document.getElementById('loading-screen'),
    progressBar: document.querySelector('.progress-fill'),
    mainContainer: document.getElementById('main-container'),
    pages: document.querySelectorAll('.page'),
    btnStart: document.getElementById('btn-start'),
    giftBox: document.getElementById('gift-box'),
    passwordModal: document.getElementById('password-modal'),
    passwordInput: document.getElementById('password-input'),
    passwordError: document.getElementById('password-error'),
    btnSubmitPassword: document.getElementById('btn-submit-password'),
    btnNextStory: document.getElementById('btn-next-story'),
    finalGiftBox: document.getElementById('final-gift-box'),
    finalSurprise: document.getElementById('final-surprise'),
    finalMessage: document.getElementById('final-message'),
    friendNameFinal: document.getElementById('friend-name-final'),
    btnRestart: document.getElementById('btn-restart'),
    clickSound: document.getElementById('click-sound'),
    giftSound: document.getElementById('gift-sound')
};

// ===== Audio Helpers =====
function playSound(audioElement, volume = 0.5) {
    if (!audioElement) return;
    try {
        audioElement.volume = volume;
        const playPromise = audioElement.play();
        if (playPromise) playPromise.catch(() => {});
    } catch (e) {}
}

function stopSound(audioElement) {
    if (!audioElement) return;
    try {
        audioElement.pause();
        audioElement.currentTime = 0;
    } catch (e) {}
}

// ===== Loading Screen =====
function initLoadingScreen() {
    const progress = document.querySelector('.loading-progress');
    if (progress) {
        progress.style.width = '100%';
    }
    
    setTimeout(() => {
        elements.loadingScreen.classList.add('hidden');
        setTimeout(() => {
            elements.loadingScreen.style.display = 'none';
        }, 800);
    }, 2500);
}

// ===== Particles Background =====
function initParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-welcome', {
            particles: {
                number: { value: 50 },
                color: { value: ['#ff6b9d', '#c44569', '#ffd700'] },
                shape: { type: 'circle' },
                opacity: { value: 0.5 },
                size: { value: 3 },
                move: {
                    enable: true,
                    speed: 2,
                    direction: 'none',
                    random: true,
                    straight: false,
                    outModes: { default: 'bounce' }
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: { enable: true, mode: 'repulse' }
                }
            }
        });
    }
}

// ===== Typed.js Welcome =====
function initTypedText() {
    const friendName = (typeof userName !== 'undefined' ? userName : null) || CONFIG.friendName;
    const line1 = document.getElementById('typed-line1');
    const line2 = document.getElementById('typed-line2');
    
    if (typedInstance) {
        typedInstance.destroy();
        typedInstance = null;
    }
    if (line1) line1.innerHTML = '';
    if (line2) line2.innerHTML = '';
    
    if (typeof Typed !== 'undefined' && line1) {
        typedInstance = new Typed(line1, {
            strings: [`Hey ${friendName}...`],
            typeSpeed: 80,
            showCursor: true,
            onComplete: () => {
                setTimeout(() => {
                    if (line2) {
                        new Typed(line2, {
                            strings: ['I have something special for you...'],
                            typeSpeed: 60,
                            showCursor: true
                        });
                    }
                }, 500);
            }
        });
    } else {
        if (line1) line1.textContent = `Hey ${friendName}...`;
        if (line2) line2.textContent = 'I have something special for you...';
    }
}

// ===== Page Navigation =====
function goToPage(pageIndex, transitionType = 'fade') {
    const nextPage = elements.pages[pageIndex];
    const currentPage = elements.pages[currentPageIndex];
    
    if (!nextPage) return;
    
    currentPage.classList.add('transition-out');
    
    setTimeout(() => {
        currentPage.classList.remove('active', 'transition-out');
        nextPage.classList.add('active', 'transition-in');
        currentPageIndex = pageIndex;
        
        saveProgress();
        updateProgressBar();
        
        if (nextPage.id === 'page-welcome') initTypedText();
        if (nextPage.id === 'page-story') {
            initStory();
            const lastMsg = document.getElementById('story-msg-last');
            const name = typeof userName !== 'undefined' ? userName : CONFIG.friendName;
            if (lastMsg) lastMsg.innerHTML = `I'm so grateful for you, ${name}! ✨`;
        }
        if (nextPage.id === 'page-final') initFinalPage();
        if (typeof initChat === 'function' && nextPage.id === 'page-chat') initChat();
        if (typeof initTimeline === 'function' && nextPage.id === 'page-timeline') initTimeline();
        if (typeof initGame === 'function' && nextPage.id === 'page-game') initGame();
        if (typeof initLetter === 'function' && nextPage.id === 'page-letter') initLetter();
        if (typeof initBalloons === 'function' && nextPage.id === 'page-balloons') initBalloons();
        if (typeof initScratch === 'function' && nextPage.id === 'page-scratch') initScratch();
        if (typeof initItsImportant === 'function' && nextPage.id === 'page-important') initItsImportant();
        if (typeof initRomanticReveal === 'function' && nextPage.id === 'page-reveal') initRomanticReveal();
        if (typeof initEnding === 'function' && nextPage.id === 'page-ending') initEnding();
        if (typeof initFloatingParticles === 'function') initFloatingParticles(nextPage);
        
        setTimeout(() => nextPage.classList.remove('transition-in'), 600);
    }, 400);
}

function showPage(pageId) {
    const index = CONFIG.pages.indexOf(pageId.replace('page-', ''));
    if (index >= 0) goToPage(index);
}

// ===== Progress =====
function updateProgressBar() {
    if (elements.progressBar) {
        const percent = ((currentPageIndex + 1) / CONFIG.totalPages) * 100;
        elements.progressBar.style.width = `${percent}%`;
    }
}

function saveProgress() {
    try {
        localStorage.setItem('birthdaySurprise_progress', currentPageIndex.toString());
    } catch (e) {}
}

function loadProgress() {
    try {
        const saved = localStorage.getItem('birthdaySurprise_progress');
        if (saved) {
            const idx = parseInt(saved, 10);
            if (idx > 0 && idx < CONFIG.totalPages) {
                currentPageIndex = idx;
                elements.pages.forEach((p, i) => {
                    p.classList.toggle('active', i === idx);
                });
                goToPage(idx);
            }
        }
    } catch (e) {}
}

// ===== Password Page =====
function initPasswordPage() {
    const openModal = () => {
        playSound(elements.clickSound, 0.3);
        elements.passwordModal.classList.add('active');
        elements.passwordInput.value = '';
        elements.passwordError.textContent = '';
        elements.passwordInput.focus();
    };
    
    const closeModal = () => {
        elements.passwordModal.classList.remove('active');
    };
    
    elements.giftBox?.addEventListener('click', (e) => {
        if (!elements.passwordModal.classList.contains('active')) openModal();
    });
    
    elements.btnSubmitPassword?.addEventListener('click', () => {
        const input = elements.passwordInput.value.trim().toLowerCase();
        playSound(elements.clickSound, 0.3);
        
        if (input === CONFIG.password.toLowerCase()) {
            elements.passwordError.textContent = '';
            closeModal();
            
            elements.giftBox.classList.add('opening');
            playConfetti();
            playSound(elements.giftSound, 0.6);
            
            setTimeout(() => {
                goToPage(2); // Go to Quiz 1
            }, 1500);
        } else {
            elements.giftBox.classList.remove('opening');
            elements.giftBox.classList.add('shake');
            elements.passwordError.textContent = 'Oops wrong password';
            setTimeout(() => elements.giftBox.classList.remove('shake'), 500);
        }
    });
    
    elements.passwordInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') elements.btnSubmitPassword.click();
    });
    
    elements.passwordModal?.addEventListener('click', (e) => {
        if (e.target === elements.passwordModal) closeModal();
    });
}

// ===== Confetti =====
function playConfetti() {
    if (typeof confetti !== 'undefined') {
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#ff6b9d', '#c44569', '#ffd700', '#667eea']
        });
    }
}

// ===== Quiz =====
function initQuiz(pageId, nextPageIndex) {
    const page = document.getElementById(pageId);
    if (!page) return;
    
    const options = page.querySelectorAll('.quiz-btn');
    const feedback = page.querySelector('.quiz-feedback');
    
    options.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.classList.contains('disabled')) return;
            playSound(elements.clickSound, 0.3);
            
            const isCorrect = btn.dataset.correct === 'true';
            
            if (isCorrect) {
                options.forEach(b => b.classList.add('disabled'));
                btn.classList.add('correct');
                feedback.textContent = 'Correct! ❤️';
                feedback.classList.remove('wrong');
                feedback.classList.add('correct');
                playConfetti();
                
                setTimeout(() => {
                    goToPage(nextPageIndex);
                }, 2000);
            } else {
                btn.classList.add('shake');
                feedback.textContent = 'Wrong answer, try again';
                feedback.classList.remove('correct');
                feedback.classList.add('wrong');
                setTimeout(() => btn.classList.remove('shake'), 500);
            }
        });
    });
}

// ===== Story =====
let storyMsgIndex = 0;

function initStory() {
    storyMsgIndex = 0;
    const messages = document.querySelectorAll('.story-msg');
    messages.forEach((m, i) => m.classList.toggle('active', i === 0));
    
    const btn = document.getElementById('btn-next-story');
    if (!btn) return;
    
    btn.onclick = () => {
        playSound(elements.clickSound, 0.3);
        if (storyMsgIndex < messages.length - 1) {
            messages[storyMsgIndex].classList.remove('active');
            storyMsgIndex++;
            messages[storyMsgIndex].classList.add('active');
        } else {
            goToPage(12);  // Story -> It's Important
        }
    };
}

// ===== Final Page =====
function initFinalPage() {
    const giftBox = elements.finalGiftBox;
    const surprise = elements.finalSurprise;
    
    if (!giftBox || !surprise) return;
    
    surprise.classList.remove('visible');
    giftBox.classList.remove('opened');
    
    giftBox.onclick = () => {
        playSound(elements.clickSound, 0.3);
        giftBox.classList.add('opened');
        giftBox.onclick = null;
        
        playSound(elements.giftSound, 0.6);
        playConfetti();
        
        setTimeout(() => {
            surprise.classList.add('visible');
            const name = (typeof userName !== 'undefined' ? userName : null) || CONFIG.friendName;
            elements.friendNameFinal.textContent = `${name}!`;
            
            typeFinalMessage();
            startFireworks();
            startBalloons();
            const btnLast = document.getElementById('btn-one-last-thing');
            if (btnLast) btnLast.classList.add('visible');
        }, 1000);
    };
}

function typeFinalMessage() {
    const msg = "You're the most amazing friend anyone could ask for. Thank you for every smile, every laugh, and every memory we've shared. Here's to another wonderful year! 🎂💕";
    
    const el = elements.finalMessage;
    if (!el) return;
    
    el.textContent = '';
    let i = 0;
    const speed = 30;
    
    function type() {
        if (i < msg.length) {
            el.textContent += msg.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

function startFireworks() {
    if (typeof confetti !== 'undefined') {
        const end = Date.now() + 5000;
        const colors = ['#ff6b9d', '#c44569', '#ffd700', '#667eea', '#00f2fe'];
        
        (function frame() {
            confetti({
                particleCount: 3,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors
            });
            confetti({
                particleCount: 3,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors
            });
            if (Date.now() < end) requestAnimationFrame(frame);
        }());
        
        setTimeout(() => {
            const end2 = Date.now() + 3000;
            (function frame2() {
                confetti({
                    particleCount: 5,
                    spread: 100,
                    origin: { y: 0.6 },
                    colors
                });
                if (Date.now() < end2) requestAnimationFrame(frame2);
            }());
        }, 2000);
    }
}

function startBalloons() {
    const container = document.querySelector('.balloons-container');
    if (!container) return;
    
    const emojis = ['🎈', '🎀', '💕', '❤️'];
    
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const balloon = document.createElement('div');
            balloon.className = 'balloon';
            balloon.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            balloon.style.left = `${Math.random() * 100}%`;
            balloon.style.animationDuration = `${6 + Math.random() * 4}s`;
            balloon.style.setProperty('--drift', `${(Math.random() - 0.5) * 50}px`);
            container.appendChild(balloon);
            
            setTimeout(() => balloon.remove(), 10000);
        }, i * 300);
    }
}

// ===== Restart =====
function initRestart() {
    elements.btnRestart?.addEventListener('click', () => {
        playSound(elements.clickSound, 0.3);
        try { localStorage.removeItem('birthdaySurprise_progress'); } catch (e) {}
        currentPageIndex = 0;
        elements.pages.forEach((p, i) => p.classList.toggle('active', i === 0));
        updateProgressBar();
        goToPage(0);
        
        const finalPage = document.getElementById('page-final');
        if (finalPage) {
            const gift = finalPage.querySelector('.final-gift-box');
            if (gift) gift.classList.remove('opened');
        }
        const finalSurprise = document.getElementById('final-surprise');
        if (finalSurprise) finalSurprise.classList.remove('visible');
        const btnLast = document.getElementById('btn-one-last-thing');
        if (btnLast) btnLast.classList.remove('visible');
    });
}

// ===== Event Listeners =====
function initEventListeners() {
    elements.btnStart?.addEventListener('click', () => {
        playSound(elements.clickSound, 0.3);
        goToPage(1);
    });
    
    initPasswordPage();
    initQuiz('page-quiz1', 3);  // Quiz 1 -> Quiz 2
    initQuiz('page-quiz2', 4);  // Quiz 2 -> Quiz 3
    initQuiz('page-quiz3', 5);  // Quiz 3 -> Chat
    document.getElementById('btn-chat-next')?.addEventListener('click', () => {
        playSound(elements.clickSound, 0.3);
        goToPage(6);  // Chat -> Timeline
    });
    document.getElementById('btn-timeline-continue')?.addEventListener('click', () => {
        playSound(elements.clickSound, 0.3);
        goToPage(7);  // Timeline -> Game
    });
    document.getElementById('btn-letter-continue')?.addEventListener('click', () => {
        playSound(elements.clickSound, 0.3);
        goToPage(9);  // Letter -> Balloons
    });
    document.getElementById('btn-reveal-continue')?.addEventListener('click', () => {
        playSound(elements.clickSound, 0.3);
        goToPage(14);  // Romantic Reveal -> Final
    });
    document.getElementById('btn-scratch-continue')?.addEventListener('click', () => {
        playSound(elements.clickSound, 0.3);
        goToPage(11);  // Scratch -> Story
    });
    document.getElementById('btn-one-last-thing')?.addEventListener('click', () => {
        playSound(elements.clickSound, 0.3);
        goToPage(15);  // Final -> Ending
    });
    document.getElementById('btn-restart-ending')?.addEventListener('click', () => {
        playSound(elements.clickSound, 0.3);
        try { localStorage.removeItem('birthdaySurprise_progress'); } catch (e) {}
        currentPageIndex = 0;
        elements.pages.forEach((p, i) => p.classList.toggle('active', i === 0));
        updateProgressBar();
        goToPage(0);
    });
    initRestart();
}


// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    if (typeof initNameModal === 'function') initNameModal();
    initLoadingScreen();
    initParticles();
    initTypedText();
    initEventListeners();
    updateProgressBar();
    
    setTimeout(loadProgress, 100);
});
