// GSAP Plugins Registration
gsap.registerPlugin(ScrollTrigger);

/**
 * CUSTOM CURSOR
 */
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    gsap.to(cursorOutline, {
        x: posX - 20,
        y: posY - 20,
        duration: 0.15,
        ease: "power2.out"
    });
});

document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => {
        gsap.to(cursorOutline, { scale: 1.5, borderColor: '#fff' });
    });
    el.addEventListener('mouseleave', () => {
        gsap.to(cursorOutline, { scale: 1, borderColor: 'rgba(255, 213, 79, 0.5)' });
    });
});

/**
 * THEME TOGGLE (Light/Dark)
 */
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const themeIcon = themeToggle.querySelector('i');

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'dark';
body.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    if (theme === 'light') {
        themeIcon.className = 'fas fa-sun';
    } else {
        themeIcon.className = 'fas fa-moon';
    }
}

/**
 * LANGUAGE TOGGLE (English/Hindi)
 */
const langToggle = document.getElementById('langToggle');
let currentLang = localStorage.getItem('lang') || 'en';

function updateLanguage(lang) {
    const elements = document.querySelectorAll('[data-en]');
    elements.forEach(el => {
        el.textContent = el.getAttribute(`data-${lang}`);
    });
    langToggle.textContent = lang.toUpperCase();
    document.body.setAttribute('data-lang', lang);
    localStorage.setItem('lang', lang);
}

// Initial update
updateLanguage(currentLang);

langToggle.addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'hi' : 'en';
    updateLanguage(currentLang);
});

/**
 * MOBILE MENU
 */
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('show');
    const icon = menuToggle.querySelector('i');
    icon.className = navLinks.classList.contains('show') ? 'fas fa-times' : 'fas fa-bars';
});

// Close menu on click
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('show'));
});

/**
 * INTERACTIVE SHRINE
 */
const bellBtn = document.getElementById('ringBellBtn');
const bellSound = document.getElementById('bellSound');
const diyaBtn = document.getElementById('lightDiyaBtn');

if (bellBtn) {
    bellBtn.addEventListener('click', () => {
        if (bellSound) {
            bellSound.currentTime = 0;
            bellSound.play().catch(e => console.log("Audio blocked:", e));
        }
        gsap.fromTo(bellBtn.querySelector('i'),
            { rotate: -20 },
            { rotate: 20, repeat: 5, yoyo: true, duration: 0.1 }
        );
    });
}

if (diyaBtn) {
    diyaBtn.addEventListener('click', () => {
        // Icon Glow Animation
        gsap.fromTo(diyaBtn.querySelector('i'),
            { color: '#FFD700', textShadow: '0 0 20px #FFD700' },
            { color: '#FF5722', textShadow: 'none', duration: 1, ease: "power2.out" }
        );

        // Hero Overlay spiritual glow effect
        gsap.fromTo('.hero-overlay',
            { opacity: 1 },
            { opacity: 0.6, backgroundColor: 'rgba(255, 160, 0, 0.3)', duration: 0.5, yoyo: true, repeat: 1 }
        );

        // Feedback Text
        const span = diyaBtn.querySelector('span');
        if (span) {
            const originalText = span.textContent;
            span.textContent = "Diya Lit 🪔";
            setTimeout(() => {
                span.textContent = originalText;
            }, 2000);
        }
    });
}

/**
 * DYNAMIC TITHI
 */
const tithiDisplay = document.getElementById('tithiDisplay');
const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
const today = new Date();
const dateString = today.toLocaleDateString('en-IN', options);

const tithisEn = ["Shukla Paksha Pratham", "Purnima", "Krishna Paksha Amavasya", "Shukla Paksha Ashtami"];
const tithisHi = ["शुक्ल पक्ष प्रथम", "पूर्णिमा", "कृष्ण पक्ष अमावस्या", "शुक्ल पक्ष अष्टमी"];

function updateTithi() {
    const tithiIndex = today.getDate() % tithisEn.length;
    const lang = localStorage.getItem('lang') || 'en';
    const tithi = lang === 'hi' ? tithisHi[tithiIndex] : tithisEn[tithiIndex];
    if (tithiDisplay) {
        tithiDisplay.textContent = `📅 ${dateString} | 🕉️ ${tithi}`;
    }
}

updateTithi();
// Re-run tithi update when language changes
langToggle.addEventListener('click', updateTithi);

/**
 * DAILY AUTO DARSHAN IMAGE ROTATION
 * Rotates images from 'Images/Thawe_Mata/' based on the day
 */
function updateDailyDarshan() {
    const images = [
        './Images/Thawe_Mata/Mata.jpg',
        './Images/Thawe_Mata/Mata(1).jpg',
        './Images/Thawe_Mata/Mata(2).jpg',
        './Images/Thawe_Mata/Mata(3).jpg',
        './Images/Thawe_Mata/Mata(4).jpg'
    ];

    const day = new Date().getDate();
    const imageIndex = day % images.length;
    const selectedImage = images[imageIndex];

    const darshanImg = document.getElementById('dailyDarshanImg');
    if (darshanImg) {
        darshanImg.src = selectedImage;
        console.log(`Divine Darshan Updated: Using image ${imageIndex + 1} for day ${day}. Path: ${selectedImage}`);
    }
}

// Initial update call
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateDailyDarshan);
} else {
    updateDailyDarshan();
}

/**
 * PRELOADER LOGIC
 */
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.visibility = 'hidden';
            }, 1000);
        }, 1500); // Wait 1.5s to show the Om animation
    }
});

/**
 * SCROLL ANIMATIONS (GSAP)
 */
gsap.to('.reveal-text', {
    y: 0,
    opacity: 1,
    stagger: 0.2,
    duration: 1,
    ease: "power2.out"
});

gsap.from('.gallery-item, .gallery-item-large', {
    scrollTrigger: {
        trigger: '.gallery-grid',
        start: "top 85%"
    },
    y: 100,
    opacity: 0,
    stagger: 0.1,
    duration: 1,
    ease: "power3.out"
});

gsap.from('.sewa-card', {
    scrollTrigger: {
        trigger: '.sewa-section',
        start: "top 80%"
    },
    y: 50,
    opacity: 0,
    stagger: 0.2,
    duration: 0.8
});

// Kaithi Scroll Animation
gsap.from('.upload-card', {
    scrollTrigger: {
        trigger: '.kaithi-section',
        start: "top 95%",
        toggleActions: "play none none none"
    },
    y: 50,
    opacity: 0,
    duration: 1.2,
    ease: "power3.out"
});

window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    header.classList.toggle('scrolled', window.scrollY > 50);
});

/**
 * KAITHI CONVERTER LOGIC
 */
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('kaithiUpload');
const convertBtn = document.getElementById('convertBtn');
const resultCard = document.getElementById('resultCard');
const resultBody = document.getElementById('resultBody');
const copyBtn = document.getElementById('copyBtn');

if (dropZone) {
    dropZone.addEventListener('click', () => fileInput.click());

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    });
}

function handleFile(file) {
    const p = dropZone.querySelector('p');
    p.textContent = `Selected: ${file.name}`;
    p.style.color = 'var(--accent)';

    gsap.fromTo(dropZone,
        { scale: 0.98, borderColor: 'var(--accent)' },
        { scale: 1, borderColor: 'var(--primary)', duration: 0.3 }
    );
}

if (convertBtn) {
    convertBtn.addEventListener('click', async () => {
        const file = fileInput.files[0];
        if (!file) {
            alert(localStorage.getItem('lang') === 'hi' ? "कृपया पहले एक फ़ाइल चुनें!" : "Please select a file first!");
            return;
        }

        // Show Loading State
        convertBtn.disabled = true;
        const originalText = convertBtn.textContent;
        convertBtn.textContent = localStorage.getItem('lang') === 'hi' ? "परिवर्तित कर रहा है..." : "Converting...";
        resultCard.style.display = 'none';

        try {
            // Convert file to base64
            const reader = new FileReader();
            const base64Promise = new Promise((resolve) => {
                reader.onloadend = () => resolve(reader.result.split(',')[1]);
            });
            reader.readAsDataURL(file);
            const base64Image = await base64Promise;

            const targetLang = document.getElementById('targetLang').value;

            // Call our secure Python backend API
            const response = await fetch('http://localhost:5000/api/convert', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    image: base64Image,
                    mimeType: file.type,
                    targetLang: targetLang
                })
            });

            const data = await response.json();

            if (data.error) {
                throw new Error(data.details || data.error);
            }

            displayResult(data.text);
            resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        } catch (error) {
            console.error("Conversion Error detall:", error);
            alert("Error converting document: " + (error.message || "Unknown error"));
        } finally {
            convertBtn.disabled = false;
            convertBtn.innerHTML = originalText;
        }
    });
}

function displayResult(text) {
    // 1. Reset and Show Card
    resultCard.style.display = 'block';
    resultBody.textContent = "";

    // 2. Smooth reveal animation
    gsap.fromTo(resultCard,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    );

    // 3. Robust Typewriter effect
    let i = 0;
    // Clear any previous interval just in case
    if (window.typingInterval) clearInterval(window.typingInterval);

    window.typingInterval = setInterval(() => {
        if (i < text.length) {
            resultBody.textContent += text.charAt(i);
            i++;
            // Scroll along with typing if it gets long
            if (i % 10 === 0) {
                resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        } else {
            clearInterval(window.typingInterval);
        }
    }, 15);
}

const downloadBtn = document.getElementById('downloadBtn');

if (copyBtn) {
    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(resultBody.textContent);
        const icon = copyBtn.querySelector('i');
        icon.className = 'fas fa-check';
        setTimeout(() => { icon.className = 'fas fa-copy'; }, 2000);
    });
}

if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
        const text = resultBody.textContent;
        const blob = new Blob([text], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');

        const timestamp = new Date().toISOString().slice(0, 10);
        a.href = url;
        a.download = `Kaithi_Conversion_${timestamp}.txt`;
        document.body.appendChild(a);
        a.click();

        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        // Visual feedback
        const icon = downloadBtn.querySelector('i');
        icon.className = 'fas fa-check';
        setTimeout(() => { icon.className = 'fas fa-file-download'; }, 2000);
    });
}
