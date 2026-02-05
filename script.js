// GSAP Plugins Registration: Required for scroll animations
gsap.registerPlugin(ScrollTrigger);

/**
 * ====================================================================
 * CUSTOM CURSOR LOGIC
 * ====================================================================
 * Creates a custom dot and outline cursor that follows the mouse
 * and reacts to interactive elements.
 */
const cursorDot = document.querySelector('.cursor-dot'); // The small inner dot
const cursorOutline = document.querySelector('.cursor-outline'); // The larger outer circle

// Update cursor position on mouse movement
window.addEventListener('mousemove', (e) => {
    const posX = e.clientX; // Mouse X position
    const posY = e.clientY; // Mouse Y position

    // Move dot immediately
    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    // Move outline with a slight delay (smooth follow effect)
    gsap.to(cursorOutline, {
        x: posX - 20, // Center offset
        y: posY - 20,
        duration: 0.15,
        ease: "power2.out"
    });
});

// Add hover effects for clickable elements (Links, Buttons)
document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => {
        // Enlarge cursor on hover
        gsap.to(cursorOutline, { scale: 1.5, borderColor: '#fff' });
    });
    el.addEventListener('mouseleave', () => {
        // Reset cursor on leave
        gsap.to(cursorOutline, { scale: 1, borderColor: 'rgba(255, 213, 79, 0.5)' });
    });
});

/**
 * ====================================================================
 * THEME TOGGLE (Light/Dark Mode)
 * ====================================================================
 * Handles switching between light and dark themes and saving preference.
 */
const themeToggle = document.getElementById('themeToggle'); // The toggle button
const body = document.body; // Reference to body for attribute setting
const themeIcon = themeToggle.querySelector('i'); // The icon inside the button

// Load saved theme from LocalStorage (default to 'dark')
const savedTheme = localStorage.getItem('theme') || 'dark';
body.setAttribute('data-theme', savedTheme); // Apply theme
updateThemeIcon(savedTheme); // Set initial icon

// Event Listener for Toggle Click
themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    // Apply new theme
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme); // Save preference
    updateThemeIcon(newTheme); // Update icon
});

// Helper function to switch icon between Sun and Moon
function updateThemeIcon(theme) {
    if (theme === 'light') {
        themeIcon.className = 'fas fa-sun';
    } else {
        themeIcon.className = 'fas fa-moon';
    }
}

/**
 * ====================================================================
 * LANGUAGE TOGGLE (English/Hindi)
 * ====================================================================
 * Switches website content language dynamically based on data attributes.
 */
const langToggle = document.getElementById('langToggle'); // Language button
let currentLang = localStorage.getItem('lang') || 'en'; // Default language

// Function to update all text content on the page
function updateLanguage(lang) {
    // Find all elements with language data attributes
    const elements = document.querySelectorAll('[data-en]');
    elements.forEach(el => {
        // Set text content based on the selected language
        el.textContent = el.getAttribute(`data-${lang}`);
    });
    // Update button text
    langToggle.textContent = lang.toUpperCase();
    // Set body attribute for styling hooks
    document.body.setAttribute('data-lang', lang);
    // Save preference
    localStorage.setItem('lang', lang);
}

// Initial update on page load
updateLanguage(currentLang);

// Event Listener for Language Toggle
langToggle.addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'hi' : 'en';
    updateLanguage(currentLang);
});

/**
 * ====================================================================
 * MOBILE MENU LOGIC
 * ====================================================================
 * Controls the opening/closing of the navigation menu on mobile devices.
 */
const menuToggle = document.getElementById('menuToggle'); // Hamburger button
const navLinks = document.getElementById('navLinks'); // Menu links container

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('show'); // Toggle visibility class
    const icon = menuToggle.querySelector('i');
    // Switch icon between 'bars' and 'X'
    icon.className = navLinks.classList.contains('show') ? 'fas fa-times' : 'fas fa-bars';
});

// Close menu automatically when a link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('show'));
});

/**
 * ====================================================================
 * INTERACTIVE SHRINE (Bell & Diya)
 * ====================================================================
 * Adds animations and interactions to the shrine elements.
 */
const bellBtn = document.getElementById('ringBellBtn');
const bellSound = document.getElementById('bellSound');
const diyaBtn = document.getElementById('lightDiyaBtn');

// Ring Bell Interaction
if (bellBtn) {
    bellBtn.addEventListener('click', () => {
        // Play Bell Sound if available
        if (bellSound) {
            bellSound.currentTime = 0; // Rewind to start
            bellSound.play().catch(e => console.log("Audio blocked:", e));
        }
        // Animate Bell (Swinging motion)
        gsap.fromTo(bellBtn.querySelector('i'),
            { rotate: -20 },
            { rotate: 20, repeat: 5, yoyo: true, duration: 0.1 }
        );
    });
}

// Light Diya Interaction
if (diyaBtn) {
    diyaBtn.addEventListener('click', () => {
        // Icon Glow Animation (Gold to Orange Fire)
        gsap.fromTo(diyaBtn.querySelector('i'),
            { color: '#FFD700', textShadow: '0 0 20px #FFD700' },
            { color: '#FF5722', textShadow: 'none', duration: 1, ease: "power2.out" }
        );

        // Spiritual Glow Overlay Effect on the Hero Section
        gsap.fromTo('.hero-overlay',
            { opacity: 1 },
            { opacity: 0.6, backgroundColor: 'rgba(255, 160, 0, 0.3)', duration: 0.5, yoyo: true, repeat: 1 }
        );

        // Temporary Text Feedback ("Diya Lit")
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
 * ====================================================================
 * DYNAMIC TITHI (Hindu Calendar Date)
 * ====================================================================
 * Calculates a pseudo-tithi based on the date for display purposes.
 */
const tithiDisplay = document.getElementById('tithiDisplay');
const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
const today = new Date();
const dateString = today.toLocaleDateString('en-IN', options);

const tithisEn = ["Shukla Paksha Pratham", "Purnima", "Krishna Paksha Amavasya", "Shukla Paksha Ashtami"];
const tithisHi = ["शुक्ल पक्ष प्रथम", "पूर्णिमा", "कृष्ण पक्ष अमावस्या", "शुक्ल पक्ष अष्टमी"];

function updateTithi() {
    // Simple logic to cycle through tithis based on date
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
 * ====================================================================
 * DAILY AUTO DARSHAN IMAGE ROTATION
 * ====================================================================
 * Automatically rotates the Mata image daily from a local folder.
 */
function updateDailyDarshan() {
    const images = [
        './Images/Thawe_Mata/Mata.jpg',
        './Images/Thawe_Mata/Mata(1).jpg',
        './Images/Thawe_Mata/Mata(2).jpg',
        './Images/Thawe_Mata/Mata(3).jpg',
        './Images/Thawe_Mata/Mata(4).jpg'
    ];

    const day = new Date().getDate(); // Get Day of Month (1-31)
    const imageIndex = day % images.length; // Cycle through images
    const selectedImage = images[imageIndex];

    const darshanImg = document.getElementById('dailyDarshanImg');
    if (darshanImg) {
        darshanImg.src = selectedImage;
        console.log(`Divine Darshan Updated: Using image ${imageIndex + 1} for day ${day}. Path: ${selectedImage}`);
    }
}

// Ensure function runs after DOM Load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateDailyDarshan);
} else {
    updateDailyDarshan();
}

/**
 * ====================================================================
 * PRELOADER LOGIC
 * ====================================================================
 * Fades out the loading screen once the page is fully loaded.
 */
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.style.opacity = '0'; // Fade out
            setTimeout(() => {
                preloader.style.visibility = 'hidden'; // Remove from layout
            }, 1000);
        }, 1500); // Wait 1.5s to show the Om animation
    }
});

/**
 * ====================================================================
 * SCROLL ANIMATIONS (GSAP & ScrollTrigger)
 * ====================================================================
 * Animates elements as they enter the viewport.
 */

// Reveal Header Text
gsap.to('.reveal-text', {
    y: 0,
    opacity: 1,
    stagger: 0.2, // Delay between each element
    duration: 1,
    ease: "power2.out"
});

// Animate Gallery Items
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

// Animate Sewa Cards
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

// Kaithi Converter Section Animation
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

// Header Background Change on Scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    header.classList.toggle('scrolled', window.scrollY > 50);
});

/**
 * ====================================================================
 * KAITHI CONVERTER LOGIC (CORE FEATURE)
 * ====================================================================
 * Handles Drag & Drop, File Upload, API Call, and Result Display.
 */
const dropZone = document.getElementById('dropZone'); // Drag area
const fileInput = document.getElementById('kaithiUpload'); // Hidden input
const convertBtn = document.getElementById('convertBtn'); // Submit Button
const resultCard = document.getElementById('resultCard'); // Result Container
const resultBody = document.getElementById('resultBody'); // Text Output Area
const copyBtn = document.getElementById('copyBtn'); // Copy to Clipboard Button

if (dropZone) {
    // Click to Open File Dialog
    dropZone.addEventListener('click', () => fileInput.click());

    // Drag Over Effect
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });

    // Drag Leave Effect
    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-over');
    });

    // Drop Event
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });

    // File Input Change Event
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    });
}

// Handle File Selection (Visual Feedback)
function handleFile(file) {
    const p = dropZone.querySelector('p');
    p.textContent = `Selected: ${file.name}`; // Show Filename
    p.style.color = 'var(--accent)';

    // Pulse Animation on Drop
    gsap.fromTo(dropZone,
        { scale: 0.98, borderColor: 'var(--accent)' },
        { scale: 1, borderColor: 'var(--primary)', duration: 0.3 }
    );
}

// Convert Button Click Handler
if (convertBtn) {
    convertBtn.addEventListener('click', async () => {
        const file = fileInput.files[0];
        // Validation: Check if file exists
        if (!file) {
            alert(localStorage.getItem('lang') === 'hi' ? "कृपया पहले एक फ़ाइल चुनें!" : "Please select a file first!");
            return;
        }

        // Show Loading State (Disable Button)
        convertBtn.disabled = true;
        const originalText = convertBtn.textContent;
        convertBtn.textContent = localStorage.getItem('lang') === 'hi' ? "परिवर्तित कर रहा है..." : "Converting...";
        resultCard.style.display = 'none'; // Hide previous results

        try {
            // Convert file to base64 string
            const reader = new FileReader();
            const base64Promise = new Promise((resolve) => {
                reader.onloadend = () => resolve(reader.result.split(',')[1]); // Remove metadata prefix
            });
            reader.readAsDataURL(file);
            const base64Image = await base64Promise;

            const targetLang = document.getElementById('targetLang').value; // Get selected language

            // Call our secure Python backend API
            // Note: Uses logic from api/convert.py via Vercel Serverless
            const response = await fetch('/api/convert', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    image: base64Image,
                    mimeType: file.type,
                    targetLang: targetLang
                })
            });

            const data = await response.json();

            // Check for API errors
            if (data.error) {
                throw new Error(data.details || data.error);
            }

            // Success: Display Result
            displayResult(data.text);
            // Scroll to result
            resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        } catch (error) {
            console.error("Conversion Error detall:", error);
            alert("Error converting document: " + (error.message || "Unknown error"));
        } finally {
            // Reset Button State
            convertBtn.disabled = false;
            convertBtn.innerHTML = originalText;
        }
    });
}

// Display Result with Typewriter Effect
function displayResult(text) {
    // 1. Reset and Show Card
    resultCard.style.display = 'block';
    resultBody.textContent = "";

    // 2. Smooth reveal animation using GSAP
    gsap.fromTo(resultCard,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    );

    // 3. Robust Typewriter effect logic
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
    }, 15); // Speed of typing
}

const downloadBtn = document.getElementById('downloadBtn');

// Copy Button Logic
if (copyBtn) {
    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(resultBody.textContent);
        // Visual Feedback (Icon Change)
        const icon = copyBtn.querySelector('i');
        icon.className = 'fas fa-check';
        setTimeout(() => { icon.className = 'fas fa-copy'; }, 2000);
    });
}

// Download Button Logic
if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
        const text = resultBody.textContent;
        // Create Blob object from text
        const blob = new Blob([text], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');

        // Generate Filename with Date
        const timestamp = new Date().toISOString().slice(0, 10);
        a.href = url;
        a.download = `Kaithi_Conversion_${timestamp}.txt`;
        document.body.appendChild(a);
        a.click(); // Trigger Download

        // Cleanup
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        // Visual feedback
        const icon = downloadBtn.querySelector('i');
        icon.className = 'fas fa-check';
        setTimeout(() => { icon.className = 'fas fa-file-download'; }, 2000);
    });
}

/**
 * ====================================================================
 * FESTIVAL CALENDAR LOGIC (Interactive Grid)
 * ====================================================================
 * Fetches JSON data and renders a full month-view calendar.
 */
let allFestivals = [];
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

/**
 * ====================================================================
 * FESTIVAL CALENDAR LOGIC (Hybrid: JSON + Moon Phase Engine)
 * ====================================================================
 * Fetches JSON data for Static Festivals (Holi/Diwali).
 * Calculates Recurring Fasts (Ekadashi/Pradosh) algorithmically.
 */
// Reference New Moon (Amavasya) for calculation anchoring
// Epoc: Jan 18, 2026 12:00 UTC was Amavasya
const LUNAR_REF = new Date('2026-01-18T12:00:00Z');
const SYNODIC_MONTH = 29.53059; // Average lunar cycle in days

async function initCalendar() {
    try {
        const response = await fetch('festivals_2026.json');
        if (response.ok) {
            allFestivals = await response.json();
        } else {
            console.warn("Static calendar data missing, relying on Moon Engine.");
        }

        // Render initial calendar
        renderCalendar(currentMonth, currentYear);
        renderDetails(new Date().toISOString().slice(0, 10));

        // Setup Controls
        // Setup Controls
        const prevBtn = document.getElementById('prevMonth');
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentMonth--;
                if (currentMonth < 0) { currentMonth = 11; currentYear--; }
                renderCalendar(currentMonth, currentYear);
            });
        }

        const nextBtn = document.getElementById('nextMonth');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentMonth++;
                if (currentMonth > 11) { currentMonth = 0; currentYear++; }
                renderCalendar(currentMonth, currentYear);
            });
        }

    } catch (error) {
        console.error("Calendar Init Error:", error);
    }
}

// 🌑 THE MOON ENGINE 🌕
// Calculates Tithi based on lunar age from reference date works for any year
function getMoonEvent(dateStr) {
    const targetDate = new Date(dateStr + "T12:00:00Z"); // Noon UTC to avoid timezone edge cases

    // Days since reference
    const diffTime = targetDate - LUNAR_REF;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    // Lunar Age (0 to 29.53)
    let lunarAge = diffDays % SYNODIC_MONTH;
    if (lunarAge < 0) lunarAge += SYNODIC_MONTH; // Handle past dates

    // Tithi Calculation (roughly 1 Tithi = 0.98 days)
    // 0-15: Shukla (Waxing), 15-30: Krishna (Waning)
    // We target specific windows for Ekadashi (11th) and Pradosh (13th)

    // Tolerance window (+/- 0.5 day)
    const isEkadashi = (lunarAge >= 10 && lunarAge <= 11) || (lunarAge >= 24.5 && lunarAge <= 25.5);
    const isPradosh = (lunarAge >= 11.8 && lunarAge <= 12.8) || (lunarAge >= 26.5 && lunarAge <= 27.5);
    const isPurnima = (lunarAge >= 13.8 && lunarAge <= 14.8);
    const isAmavasya = (lunarAge >= 28.5 || lunarAge <= 0.5);
    const isSankashti = (lunarAge >= 17.5 && lunarAge <= 18.5); // Krishna Chaturthi

    if (isEkadashi) return { name: "Ekadashi Vrat", type: "Ekadashi", desc: "Day of Lord Vishnu. Fasting grants merit." };
    if (isPradosh) return { name: "Pradosh Vrat", type: "Pradosh", desc: "Day of Lord Shiva. Twilight worship." };
    if (isPurnima) return { name: "Purnima (Full Moon)", type: "Purnima", desc: "Full Moon day. Satyanarayan Puja." };
    if (isAmavasya) return { name: "Amavasya (New Moon)", type: "Amavasya", desc: "New Moon day. Pitru Tarpan." };
    if (isSankashti) return { name: "Sankashti Chaturthi", type: "Sankashti", desc: "Ganesh Puja. Removes obstacles." };

    return null;
}

function renderCalendar(month, year) {
    const grid = document.getElementById('calendarGrid');
    const monthTitle = document.getElementById('currentMonthYear');

    // Safety check: specific to index.html
    if (!grid || !monthTitle) return;

    monthTitle.textContent = `${new Date(year, month).toLocaleString('default', { month: 'long' })} ${year}`;
    grid.innerHTML = "";

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    for (let i = firstDay; i > 0; i--) {
        const div = document.createElement('div');
        div.textContent = prevMonthDays - i + 1;
        div.className = 'other-month';
        grid.appendChild(div);
    }

    const today = new Date().toISOString().slice(0, 10);

    for (let i = 1; i <= daysInMonth; i++) {
        const div = document.createElement('div');
        div.textContent = i;
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        div.setAttribute('data-date', dateStr);

        // 1. Check Static JSON first (Higher Priority)
        let event = allFestivals.find(f => f.date === dateStr);

        // 2. If no static event, check Moon Engine
        if (!event) {
            const moonEvent = getMoonEvent(dateStr);
            if (moonEvent) {
                div.classList.add('moon-event'); // Different style for calculated events?
                // We mark it as having an event
                event = moonEvent;
            }
        }

        if (event) div.classList.add('has-event');
        if (dateStr === today) div.classList.add('today');

        div.addEventListener('click', () => {
            document.querySelectorAll('.cal-grid div').forEach(el => el.classList.remove('selected'));
            div.classList.add('selected');
            renderDetails(dateStr);
        });

        grid.appendChild(div);
    }
}

function renderDetails(dateStr) {
    const detailDate = document.getElementById('detailDate');
    if (!detailDate) return; // Safety check

    const detailTitle = document.getElementById('detailTitle');
    const detailDesc = document.getElementById('detailDesc');
    const detailTithi = document.getElementById('detailTithi');

    const dateObj = new Date(dateStr);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    detailDate.textContent = dateObj.toLocaleDateString('en-IN', options);

    // Hybrid Lookup
    let event = allFestivals.find(f => f.date === dateStr);
    let type = "Daily Darshan";

    // Moon Engine Fallback
    if (!event) {
        event = getMoonEvent(dateStr);
        if (event) type = "Calculated Tithi";
    } else {
        type = "Major Festival";
    }

    gsap.fromTo('#selectedDateDetails', { opacity: 0.5 }, { opacity: 1, duration: 0.3 });

    if (event) {
        detailTitle.textContent = event.name;
        detailTitle.style.color = 'var(--primary)';
        detailDesc.textContent = event.desc || "Auspicious day according to Hindu Panchang.";
        detailTithi.textContent = event.type;
    } else {
        detailTitle.textContent = "No Major Festival";
        detailTitle.style.color = "var(--text-muted)";
        detailDesc.textContent = "It is a peaceful day for daily rituals and regular Aarti.";
        detailTithi.textContent = "Daily Darshan";
    }
}

initCalendar();


/**
 * ====================================================================
 * PWA SERVICE WORKER & INSTALL LOGIC
 * ====================================================================
 */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(req => console.log("Service Worker Registered!", req))
            .catch(err => console.log("Service Worker Failed", err));
    });
}

// Install App Logic
let deferredPrompt;
const installBtn = document.getElementById('installAppBtn');

function setupPWAInstallPrompt() {
    // 0. Show button IMMEDIATELY (User Requirement)
    if (installBtn) {
        installBtn.style.display = 'flex';
    }

    // 1. Listen for the install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
        console.log("👍 PWA Install Prompt Fired!");
        e.preventDefault();
        deferredPrompt = e;
        // Optional: Pulse animation to indicate "Ready for 1-click install"
        if (installBtn) gsap.to(installBtn, { scale: 1.1, yoyo: true, repeat: 3, duration: 0.5 });
    });

    // 2. Handle Button Click
    if (installBtn) {
        installBtn.addEventListener('click', async () => {
            if (deferredPrompt) {
                // Happy Path: Browser supports 1-click install
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                console.log(`User response: ${outcome}`);
                deferredPrompt = null;
                installBtn.style.display = 'none';
            } else {
                // Manual Path: Browser hasn't fired event yet (or is iOS)
                alert("To install Thawe Dham App:\n\n👉 Chrome/Edge: Click the three dots (⋮) -> 'Add to Home Screen' or 'Install App'.\n👉 iOS: Tap 'Share' -> 'Add to Home Screen'.");
            }
        });
    }
}

setupPWAInstallPrompt();

// Check if app is already installed
window.addEventListener('appinstalled', () => {
    console.log('Thawe Dham App Installed');
    if (installBtn) installBtn.style.display = 'none';
});

/**
 * ====================================================================
 * ANALYTICS TRACKING
 * ====================================================================
 * Sends pageview data to the serverless backend.
 */
function logAnalytics() {
    // Basic session check to avoid spamming on reload (optional)
    if (sessionStorage.getItem('view_logged')) return;

    const data = {
        path: window.location.pathname,
        timestamp: new Date().toISOString(),
        referrer: document.referrer,
        screen: `${window.screen.width}x${window.screen.height}`
    };

    fetch('/api/analytics', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(() => {
        console.log("Analytics sent");
        sessionStorage.setItem('view_logged', 'true');
    }).catch(e => console.error("Analytics failed", e));
}

// Log visit after a slight delay
setTimeout(logAnalytics, 3000);
