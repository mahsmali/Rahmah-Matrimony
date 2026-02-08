// Main Interactions

document.addEventListener('DOMContentLoaded', () => {

    // Header Scroll Effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(5, 5, 5, 0.95)';
            header.style.padding = '15px 0';
        } else {
            header.style.background = 'rgba(10, 10, 10, 0.8)';
            header.style.padding = '20px 0';
        }
    });

    // Reveal Animations on Scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Fade Up Animation Class
    const elementsToAnimate = document.querySelectorAll('.feature-card, .profile-card, .section-title');
    elementsToAnimate.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add CSS for visible state
    const style = document.createElement('style');
    style.innerHTML = `
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // Digital Clock & Date
    function updateClock() {
        const timeEl = document.getElementById('digital-clock-time');
        const dateEl = document.getElementById('digital-clock-date');

        if (timeEl && dateEl) {
            const now = new Date();

            // Time: 09:41 AM
            timeEl.innerText = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

            // Date: Mon, 29 Jan 2026
            const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
            dateEl.innerText = now.toLocaleDateString('en-GB', options);
        }
    }
    setInterval(updateClock, 1000);
    updateClock();

    // --- Search & Profiles Logic ---

    const mockProfiles = [
        { id: 1, name: "Amina", age: 24, gender: "Bride", location: "Sri Lanka", city: "Colombo", img: "assets/images/avatar-1.png", isNew: true },
        { id: 2, name: "Mohamed", age: 28, gender: "Groom", location: "Sri Lanka", city: "Kandy", img: "assets/images/avatar-2.png", isNew: false },
        { id: 3, name: "Fatima", age: 22, gender: "Bride", location: "UAE", city: "Dubai", img: "assets/images/avatar-1.png", isNew: true },
        { id: 4, name: "Ahmed", age: 31, gender: "Groom", location: "UK", city: "London", img: "assets/images/avatar-2.png", isNew: false },
        { id: 5, name: "Zainab", age: 26, gender: "Bride", location: "Sri Lanka", city: "Galle", img: "assets/images/avatar-1.png", isNew: false },
        { id: 6, name: "Yusuf", age: 29, gender: "Groom", location: "Sri Lanka", city: "Negombo", img: "assets/images/avatar-2.png", isNew: true }
    ];

    const profilesGrid = document.getElementById('profiles-grid');
    const searchBtn = document.getElementById('hero-search-btn');

    function renderProfiles(profiles) {
        if (!profilesGrid) return;
        profilesGrid.innerHTML = "";

        if (profiles.length === 0) {
            profilesGrid.innerHTML = "<p style='grid-column: 1/-1; text-align: center; color: white;'>No profiles found matching your criteria.</p>";
            return;
        }

        profiles.forEach(profile => {
            const card = document.createElement('div');
            card.className = 'profile-card visible'; // Add visible for animation
            const badgeHtml = profile.isNew ? '<div class="badge">New</div>' : '';

            card.innerHTML = `
                <div class="profile-img">
                    <img src="${profile.img}" alt="${profile.name}">
                    ${badgeHtml}
                </div>
                <div class="profile-info">
                    <h3>${profile.name}, ${profile.age}</h3>
                    <p>${profile.city}, ${profile.location}</p>
                    <div class="btm-row">
                        <button onclick="handleProfileUnlock(${profile.id}, '${profile.name}')" class="btn" style="width:100%; padding: 8px 0; font-size: 0.9rem; background: transparent; border: 1px solid var(--accent-gold); color: var(--accent-gold); cursor:pointer;">
                            <i class="fas fa-lock" style="margin-right:5px;"></i> Unlock Profile
                        </button>
                    </div>
                </div>
            `;
            profilesGrid.appendChild(card);
        });
    }

    // Initial Render
    renderProfiles(mockProfiles);

    // Search Filter Logic
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            const genderVal = document.getElementById('search-gender').value;
            const ageVal = document.getElementById('search-age').value;
            const locVal = document.getElementById('search-location').value;

            const filtered = mockProfiles.filter(p => {
                // Filter by Gender
                if (genderVal && p.gender !== genderVal) return false;

                // Filter by Location
                if (locVal && p.location !== locVal) return false;

                // Filter by Age
                if (ageVal) {
                    const [min, max] = ageVal.split('-').map(Number);
                    if (p.age < min || p.age > max) return false;
                }

                return true;
            });

            renderProfiles(filtered);
        });
    }

    // --- Success Stories Click-to-Cycle Logic ---
    const successStack = document.getElementById('success-stories-stack');
    if (successStack) {
        successStack.addEventListener('click', () => {
            const currentTop = successStack.querySelector('.stack-card:not(.shift-right)');
            if (currentTop) {
                currentTop.classList.add('shift-right');
                setTimeout(() => {
                    currentTop.classList.remove('shift-right');
                    successStack.appendChild(currentTop);
                }, 800);
            }
        });
    }

    // --- Vertical 3D Post Carousel Logic ---
    const stackContainer = document.getElementById('features-stack-container');
    const cards = document.querySelectorAll('.post-card');
    const dots = document.querySelectorAll('.dot');
    let currentIndex = 0;

    if (stackContainer) {
        stackContainer.addEventListener('click', () => {
            const oldIndex = currentIndex;
            currentIndex = (currentIndex + 1) % cards.length;
            cards[oldIndex].classList.add('exit');
            cards[oldIndex].classList.remove('active');

            setTimeout(() => {
                cards.forEach((card, i) => {
                    card.classList.remove('active', 'next', 'last', 'exit');
                    if (i === currentIndex) card.classList.add('active');
                    else if (i === (currentIndex + 1) % cards.length) card.classList.add('next');
                    else card.classList.add('last');
                });
                dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
            }, 300);
        });
    }

    console.log("Rahmah Matrimony Script Loaded");
});

// Mock Logic for User Requests

function handleRegistration(event) {
    event.preventDefault(); // Stop page reload

    // 1. Get Values
    const pass = document.getElementById('password').value;
    const confirmPass = document.getElementById('confirmPassword').value;
    const country = document.getElementById('countrySelect').value;
    const gender = document.getElementById('genderSelect').value;

    // 2. Validate Password
    if (pass !== confirmPass) {
        alert("❌ Passwords do not match! Please change them.");
        return;
    }

    // 3. Generate Reference ID
    let countryCode = "UN";
    if (country.includes("Sri Lanka")) countryCode = "LK";
    else if (country.includes("Emirates")) countryCode = "AE";
    else if (country.includes("Kingdom")) countryCode = "UK";
    else countryCode = country.substring(0, 2).toUpperCase();

    let genderCode = (gender === "Male") ? "G" : "B"; // G=Groom, B=Bride
    let randomNum = Math.floor(Math.random() * 900) + 100; // 100-999
    let refID = `REF-${countryCode}-${genderCode}-${randomNum}`;

    // 4. Success Message (Simulate WhatsApp/Email)
    let message = `✅ REGISTRATION SUCCESSFUL!\n\n`;
    message += `--------------------------------\n`;
    message += `🆔 YOUR ID: ${refID}\n`;
    message += `--------------------------------\n\n`;
    message += `📨 SYSTEM EMAIL:\n`;
    message += `   "Welcome to Rahmah! Please verify your email." (Simulated)\n\n`;
    message += `📱 WHATSAPP:\n`;
    message += `   "Assalamu Alaikum! Your Rahmah ID is ${refID}." (Simulated)`;

    alert(message);

    console.log(`[EMAIL SERVER]: Sent verification to user. ID: ${refID}`);
    console.log(`[WHATSAPP API]: Sent message to user phone. Msg: "Welcome! Your ID is ${refID}."`);

    // Auto-login redirect
    window.location.href = 'dashboard.html';
}

function handleLogin(event) {
    event.preventDefault();
    alert("🔐 MEMBER LOGIN\n\nLogging you in secure dashboard... (Simulated)");
    window.location.href = 'dashboard.html';
}

function handlePayment(planName, amount) {
    // If specific plan, use view payment logic
    if (planName === '10 Views') {
        handleViewPayment();
        return;
    }

    let details = `🏦 BANK TRANSFER DETAILS\n\n`;
    details += `Bank: Commercial Bank PLC\n`;
    details += `A/C Number: 123-456-7890\n`;
    details += `A/C Name: Rahmah Matrimony Global\n`;
    details += `Branch: Colombo Main\n\n`;
    details += `Amount: ${amount}\n`;
    details += `Reference: Use your Phone Number\n\n`;
    details += `Click OK once you have made the transfer.`;

    if (confirm(details)) {
        alert("✅ PAYMENT SUBMITTED\n\nAdmin will verify and upgrade your account within 24 hours.\nReceipt sent to email.");
    }
}

// --- Credit System Logic ---

function handleProfileUnlock(profileId, profileName) {
    let credits = parseInt(localStorage.getItem('rahmah_view_credits') || '0');

    if (credits > 0) {
        if (confirm(`View ${profileName}'s Profile?\n\nCredits Remaining: ${credits}\nCost: 1 Credit`)) {
            credits--;
            localStorage.setItem('rahmah_view_credits', credits);

            // Show Mock Profile Details
            alert(`🔓 PROFILE UNLOCKED: ${profileName}\n\nPhone: +94 77 123 4567\nEmail: contact@rahmah.lk\nAddress: 123, Main Street, ${profileName}'s City\n\n(Credits Left: ${credits})`);

            // Reload strictly to update any UI counters if we added them, though not critical here.
            // location.reload(); 
        }
    } else {
        const payNow = confirm(`🔒 LOCKED\n\nYou have 0 credits remaining.\n\nOffer: Get 10 Profile Views?\n\n- Sri Lankans: LKR 5,000\n- Overseas: $40\n\nClick OK to Get This Offer.`);
        if (payNow) {
            handleViewPayment();
        }
    }
}

function handleViewPayment(selectedPlan = null) {
    // If no plan is passed, user clicked "Get Offer" from unlock popup. Ask for location.
    // If we had user data, we would know. For now, we ask or show both.

    let currency = "LKR";
    let amount = "5,000";
    let mode = "Local Bank Transfer";
    let creditsToAdd = 10; // Default to 10 pack
    let planTitle = "10 PROFILE VIEWS PACK"; // Default

    if (selectedPlan === 'Overseas') {
        currency = "USD";
        amount = "40";
        mode = "PayPal / Credit Card";
    } else if (selectedPlan === 'Local') {
        currency = "LKR";
        amount = "5,000";
        mode = "Local Bank Transfer";
    } else if (selectedPlan === 'LocalSingle') {
        currency = "LKR";
        amount = "599";
        mode = "Local Bank Transfer";
        creditsToAdd = 1;
        planTitle = "SINGLE PROFILE VIEW";
    } else if (selectedPlan === 'OverseasSingle') {
        currency = "USD";
        amount = "5";
        mode = "PayPal / Credit Card";
        creditsToAdd = 1;
        planTitle = "SINGLE PROFILE VIEW";
    } else {
        // Prompt user
        const isOverseas = confirm("Are you paying from Overseas (Outside Sri Lanka)?\n\nClick OK for Overseas ($40).\nClick Cancel for Local (LKR 5,000).");
        if (isOverseas) {
            currency = "USD";
            amount = "40";
            mode = "PayPal / Credit Card";
        }
    }

    let details = `💳 ${planTitle}\n\n`;
    details += `Amount: ${currency} ${amount}\n`;
    details += `Payment Mode: ${mode}\n`;
    details += `Ref: Your Phone Number\n\n`;
    details += `Click OK to Confirm Payment.`;

    if (confirm(details)) {
        let current = parseInt(localStorage.getItem('rahmah_view_credits') || '0');
        let newTotal = current + creditsToAdd;
        localStorage.setItem('rahmah_view_credits', newTotal);

        alert(`✅ PAYMENT SUCCESSFUL!\n\nYou now have ${newTotal} profile view(s).\n\nGo ahead and unlock your match!`);
        location.reload();
    }
}

// Quran Player with Persistence
function playSurah(surahId) {
    const audio = document.getElementById('quran-audio');
    audio.src = `https://server8.mp3quran.net/afs/${surahId}.mp3`;
    audio.play();

    // Save State
    localStorage.setItem('rahmah_quran_playing', 'true');
    localStorage.setItem('rahmah_quran_surah', surahId);
}

// Persist Audio Logic
document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('quran-audio');
    const selector = document.getElementById('quran-selector');

    if (audio && selector) {
        // Restore State
        const isPlaying = localStorage.getItem('rahmah_quran_playing');
        const savedSurah = localStorage.getItem('rahmah_quran_surah');
        const savedTime = localStorage.getItem('rahmah_quran_time');

        if (savedSurah) {
            selector.value = savedSurah; // Update Dropdown
            // Only auto-play if it was actually playing (Browser policy might block this without user interaction first)
            if (isPlaying === 'true') {
                audio.src = `https://server8.mp3quran.net/afs/${savedSurah}.mp3`;
                if (savedTime) audio.currentTime = parseFloat(savedTime);

                // Attempt to play (might fail if no user interaction yet on this page load)
                const playPromise = audio.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.log("Audio Autoplay prevented by browser: User must interact first.");
                    });
                }
            }
        }

        // Save progress every second
        audio.ontimeupdate = () => {
            localStorage.setItem('rahmah_quran_time', audio.currentTime);
        };

        audio.onplay = () => {
            localStorage.setItem('rahmah_quran_playing', 'true');
        };

        audio.onpause = () => {
            localStorage.setItem('rahmah_quran_playing', 'false');
        };

        // Update surah ID on manual change
        selector.onchange = (e) => {
            playSurah(e.target.value);
        }
    }
});

// --- Dynamic Dropdown Data (Data Model) ---
const countriesData = {
    "Sri Lanka": ["Colombo", "Kandy", "Galle", "Negombo", "Jaffna", "Trinco", "Batticaloa", "Kurunegala", "Gampaha", "Matara", "Anuradhapura", "Ratnapura", "Kalutara"],
    "United Arab Emirates": ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah", "Fujairah", "Umm Al Quwain"],
    "United Kingdom": ["London", "Birmingham", "Manchester", "Glasgow", "Leeds", "Liverpool", "Newcastle", "Sheffield", "Bristol"],
    "Qatar": ["Doha", "Al Rayyan", "Umm Salal", "Al Wakrah", "Al Khor"],
    "Saudi Arabia": ["Riyadh", "Jeddah", "Mecca", "Medina", "Dammam", "Khobar"],
    "Kuwait": ["Kuwait City", "Al Ahmadi", "Hawalli", "Al Farwaniyah"],
    "Malaysia": ["Kuala Lumpur", "George Town", "Johor Bahru", "Ipoh", "Shah Alam"],
    "Singapore": ["Singapore"],
    "India": ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Kerala - Cochin", "Kerala - Calicut"],
    "Pakistan": ["Karachi", "Lahore", "Islamabad", "Faisalabad", "Rawalpindi"],
    "Australia": ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide"],
    "Canada": ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa"],
    "USA": ["New York", "Los Angeles", "Chicago", "Houston", "Florida", "Texas"],
    "Other": ["Other"]
};

// --- Initialization Logic ---
document.addEventListener('DOMContentLoaded', () => {

    // 1. Populate Years (1960 - 2008)
    const yearSelect = document.getElementById('yearOfBirth');
    if (yearSelect && yearSelect.options.length <= 1) { // Populate only if empty
        const currentYear = new Date().getFullYear();
        const minAge = 18;
        const maxAge = 70;

        for (let i = currentYear - minAge; i >= currentYear - maxAge; i--) {
            let option = document.createElement('option');
            option.value = i;
            option.text = i;
            yearSelect.add(option);
        }
    }

    // 2. Populate Countries for both Citizenship & Residence
    const countrySelect = document.getElementById('countrySelect');
    const citizenshipSelect = document.getElementById('citizenshipSelect');

    // Use the keys of countriesData for the country list
    const countryList = Object.keys(countriesData);

    if (countrySelect && countrySelect.options.length <= 1) {
        countryList.forEach(country => {
            let option = document.createElement('option');
            option.value = country;
            option.text = country;
            countrySelect.add(option);
        });
    }

    if (citizenshipSelect && citizenshipSelect.options.length <= 1) {
        countryList.forEach(country => {
            let option = document.createElement('option');
            option.value = country;
            option.text = country;
            citizenshipSelect.add(option);
        });
    }
});

// --- Dynamic City Logic ---
// --- Dynamic City Logic Removed (City is now a text input) ---


function toggleProfileDetails() {
    const checkBox = document.getElementById("createProfileCheck");
    const advancedSection = document.getElementById("advanced-profile-options");
    // Find the closest form container to toggle the class
    const formContainer = checkBox.closest('.form-container');

    if (checkBox && advancedSection) {
        advancedSection.style.display = checkBox.checked ? "grid" : "none";

        // Toggle the 'lifted' class for easier filling
        if (formContainer) {
            if (checkBox.checked) {
                formContainer.classList.add('active-filling');
            } else {
                formContainer.classList.remove('active-filling');
            }
        }
    }
}
