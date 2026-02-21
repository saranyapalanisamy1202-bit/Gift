# Birthday Surprise Website 🎂

A premium, highly animated birthday surprise website with smooth transitions, quizzes, memory gallery, and emotional messages.

## Quick Start

1. Open `index.html` in a modern web browser (Chrome, Firefox, Edge, Safari)
2. Or run a local server: `npx serve .` or `python -m http.server 8000`

## Customization

Edit the `CONFIG` object at the top of `script.js`:

```javascript
const CONFIG = {
    friendName: 'Bestie',           // Change to your friend's name
    password: 'bestie',             // Change the unlock password
    birthdayDate: new Date(2026, 2, 15),  // Year, Month-1, Day (e.g., March 15, 2026)
};
```

## Assets Setup

### Photos (Memory Gallery)
**Location:** `assets/photos/`

Place your photos with these exact names:
- `photo1.jpg` – First memory
- `photo2.jpg` – Second memory  
- `photo3.jpg` – Third memory
- `photo4.jpg` – Fourth memory

**Supported formats:** .jpg, .jpeg, .png, .gif, .webp

To add more slides, edit `index.html` (gallery section) and `script.js` (gallery logic).

### Background Music
**Location:** `assets/music/`

Place your birthday song:
- `birthday.mp3` (primary)
- `birthday.ogg` (fallback, optional)

The music autoplays on the Memory Gallery and Final Surprise pages. Browsers may require user interaction before playing audio.

### Sound Effects
**Location:** `assets/sounds/`

- `click.mp3` – Button click sound
- `gift-open.mp3` – Gift opening sound
- `scratch.mp3` – Scratch card sound (optional)

### Voice Message
**Location:** `assets/voice/`

- `voice-message.mp3` – Pre-recorded voice message for Story page (optional)

The site works without these files; sounds are optional.

## Folder Structure

```
birthday/
├── index.html
├── style.css
├── script.js
├── script-advanced.js
├── README.md
└── assets/
    ├── photos/
    ├── music/
    ├── sounds/
    └── voice/
```

## Features

### Core
- ✅ Name personalization (asked at start)
- ✅ Loading screen animation
- ✅ Typing text (Welcome page)
- ✅ Particle background
- ✅ Password-protected gift
- ✅ 3 Quiz pages
- ✅ Photo gallery with captions
- ✅ Story messages with voice message button
- ✅ Progress bar & localStorage

### Advanced
- ✅ Fake WhatsApp-style chat
- ✅ Interactive friendship timeline
- ✅ Catch the Hearts mini-game
- ✅ Secret letter envelope
- ✅ Balloon pop surprise
- ✅ Scratch card reveal
- ✅ Cinematic final reveal
- ✅ Secret ending with infinite hearts

## Customizing Quiz Questions

Edit **index.html** (around lines 80–125):

1. **Change the question text** – Edit the `<p class="quiz-question">` line, e.g.:
   - Quiz 1: `What is my favourite food?`
   - Quiz 2: `Where did we first meet?`
   - Quiz 3: `What nickname do you call me?`

2. **Change the answer options** – Edit the text inside each `<button class="quiz-btn">`.

3. **Set the correct answer** – Put `data-correct="true"` on the **one** correct option and `data-correct="false"` on the others.

Example for Quiz 1 if the right answer is "Pasta":

```html
<p class="quiz-question">What is my favourite food?</p>
<div class="quiz-options">
    <button class="quiz-btn" data-correct="false">Pizza</button>
    <button class="quiz-btn" data-correct="false">Burger</button>
    <button class="quiz-btn" data-correct="false">Biryani</button>
    <button class="quiz-btn" data-correct="true">Pasta</button>
</div>
```

## Browser Support

Modern browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
