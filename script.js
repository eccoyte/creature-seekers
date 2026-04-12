// authentication - to be removed upon release
const ENABLE_AUTH = false;

// if on, "care about authentication"
if (ENABLE_AUTH) {
    const publicPages = ["/", "/login.html"];
    const currentPage = window.location.pathname.replace(/\/+$/, "") || "/";

    // this value is set in the other script
    const isAuthenticated = sessionStorage.getItem("authenticated") === "true";

    if (!isAuthenticated && !publicPages.includes(currentPage)) {
        window.location.href = "/login.html";
    }
}

// start of the core functionality

let foundCount = 0;   // how many creatures have been found

// --- helper functions ---

// helper function for protecting data fields when populating, so it skips over them if something is missing rather than crashing
function setField(profile, field, value) {
    const el = profile.querySelector(`[data-field="${field}"]`);
    if (el) el.innerHTML = value;
}


// keywords and associated data
const keyvalues = [
    { category: "bee", congrats: "Wonderful!", prefix: "an", icon: "🐝", fullname: "Ivy bee", sciname: "Colletes hederae", keyword: "autumn", tagline: "&quot;Come join the insect ivy league with this newcomer bee!&quot;", order: "Hymenoptera, the bees, wasps, ants and sawflies", intro: "<p>The ivy bee was first recorded in the UK in 2001 and has been expanding its range ever since.</p><p>Ivy bees look similar to honey bees, but with paler, more defined stripes and without such neat pollen baskets.</p>", lifecycle: "<p>Ivy bees don’t live in hives, like honey bees. Instead ivy bees live in tunnels in warm, sandy soil, often close to other ivy bees.</p><p>Adults emerge in autumn when ivy is in flower. They lay their eggs and provide for their young with ivy pollen in these tunnels.</p>", howtohelp: "<p>Let some ivy grow wild if you can! Ivy offers autumn flowers and berries, offering a much needed burst of food for ivy bees and dozens of other species as the cool weather approaches.</p><p>Ivy is an evergreen, so it also provides shelter for all kinds of creatures, all year round.</p>", outlineimgsrc: "images/ivy-bee-outline-hex.svg", fullimgsrc: "images/ivy-bee-fullcolour-hex.svg", unfoundimgsrc: "images/bee-mystery-hex.svg", animationsrc: "images/bee-animation.svg", found: false },
    { category: "beetle", congrats: "Amazing!", prefix: "a", icon: "🪲", fullname: "Lesser stag beetle", sciname: "Dorcus parallelipipedus", keyword: "wood", tagline: "&quot;Wood-n’t you give this fantastic beetle a helping hand?&quot;", order: "Coleoptera, the beetles ", intro: "<p>These awesome beetles may not quite have the body or “antler” size of their more famous relative, the greater stag beetle, they’re still pretty impressive!</p><p>Adults usually come out at night during the summer, sheltering in deadwood during the day.</p>", lifecycle: "<p>Lesser stag beetles lay their eggs inside decaying deadwood, and that’s where they spend most of their quite long lives.</p><p>The larvae eat the deadwood and help break it down, whereas the adults prefer tree sap. They spend 1-2 years as larvae, and 2-3 more years as adults!</p>", howtohelp: "<p>Providing untreated dead wood is the key to helping these lovely large beetles. Consider making a pile of logs or woodchip, ideally in contact with soil to help speed up the decay process.</p><p>If you have old tree stumps, leave them to break down naturally rather than removing them - the beetle larvae will do the work for you!</p>", outlineimgsrc: "images/lesser-stag-beetle-outline-hex.svg", fullimgsrc: "images/lesser-stag-beetle-fullcolour-hex.svg", unfoundimgsrc: "images/beetle-mystery-hex.svg", animationsrc: "images/beetle-animation.svg", found: false },
    { category: "bug", congrats: "Terrific!", prefix: "a", icon: "🛡️", fullname: "Green shield bug", sciname: "Palomena prasina", keyword: "sap", tagline: "&quot;Will you let this sturdy bug through your defences, and go green for them?&quot;", order: "Hemiptera, the true bugs", intro: "<p>Shield bugs are actually named for their shape, rather than any particular defensive capabilities, so be gentle with them! They are also green by name and green by nature, but only for some of the year.</p><p>Their summer green outfit turns more brown or bronze coloured in the late autumn, rather like the leaves they live on!</p>", lifecycle: "<p>Green shield bugs lay their eggs on the undersides of leaves, which hatch in late spring. The juveniles are more rounded than the adults, and commonly patterned with black markings.</p><p>After 5 stages, they reach their adult form, sucking up the sap of various plants before hibernating in the winter.</p>", howtohelp: "<p>Green shield bugs are quite easy to please, so providing a range of trees, shrubs and herbaceous plants will suit them well.</p><p>Also, leave some places for them to shelter over winter, such as leaf piles. These are a lifeline for all sorts of little creatures during the cold months.</p>", outlineimgsrc: "images/green-shield-bug-outline-hex.svg", fullimgsrc: "images/green-shield-bug-fullcolour-hex.svg", unfoundimgsrc: "images/bug-mystery-hex.svg", animationsrc: "images/bug-animation.svg", found: false },
    { category: "dragonfly", congrats: "Superb!", prefix: "a", icon: "🐉", fullname: "Common darter dragonfly", sciname: "Sympetrum striolatum", keyword: "nymph", tagline: "&quot;Are you red-dy to help this striped scarlet striker soar?&quot;", order: "Odonata, the dragonflies and damselflies", intro: "<p>Like other dragonflies, common darter dragonflies are fierce, accurate predators, first on water and then in the air.</p><p>Only the males of this species are bright red, females and young adults are more golden-brown.</p>", lifecycle: "<p>These dragonflies spend much of their life underwater, as juveniles called nymphs. They catch smaller creatures with extendable jaws! </p><p>When they are ready, they crawl out of the water and shed their skin, into their new adult form. After a short rest, they take to the air and resume their hunting in the air above!</p>", howtohelp: "<p>Provide freshwater sources wherever you can. A pond is best, but it can be as small as a partially submerged sink or other container. Be sure to provide exit ramps for other wildlife!</p><p>If you don’t have the option to do this, providing a range of native wildflowers will support the small insects dragonflies feed on, helping them too!</p>", outlineimgsrc: "images/darter-dragonfly-outline-hex.svg", fullimgsrc: "images/darter-dragonfly-fullcolour-hex.svg", unfoundimgsrc: "images/dragonfly-mystery-hex.svg", animationsrc: "images/dragonfly-animation.svg", found: false },
    { category: "hoverfly", congrats: "Marvellous!", prefix: "a", icon: "🪰", fullname: "Marmalade hoverfly", sciname: "Episyrphus balteatus", keyword: "aphid", tagline: "&quot;Come and jam with this agile pollinator!&quot;", order: "Dipetra, the flies", intro: "<p>The wasp-like stripes help trick birds and other potential predators into leaving them well alone, even though they don’t have any sting!</p><p>You can tell them apart from a wasp or bee by looking for their huge eyes, and the hovering flight they are named for.</p>", lifecycle: "<p>Marmalade hoverflies lay their eggs on plants with aphids on them. When the larvae hatch, they feast on these aphids continually as they grow.</p><p>As adults, they become agile pollinators, flying from flower to flower, using their big eyes to scope out food and avoid danger.</p>", howtohelp: "<p>Hoverflies don’t have long tongues like bees, so they especially love open flowers rather than tube-shaped ones. Their favourites include cow parsley, tansy, asters, knapweed, apple blossom and more.</p><p>They’ll thank you by helping take care of aphid pests for you!</p>", outlineimgsrc: "images/marmalade-hoverfly-outline-hex.svg", fullimgsrc: "images/marmalade-hoverfly-fullcolour-hex.svg", unfoundimgsrc: "images/hoverfly-mystery-hex.svg", animationsrc: "images/hoverfly-animation.svg", found: false },
    { category: "moth", congrats: "Awesome!", prefix: "a", icon: "🦋", fullname: "Mint moth", sciname: "Pyrausta aurata", keyword: "herb", tagline: "&quot;Make some thyme to provide for this lovely little herb-ivore!&quot;", order: "Lepidoptera, the butterflies and moths", intro: "<p>The mint moth is also called the ‘small purple and gold’, which is pretty descriptive in terms of visuals!</p><p>With a wingspan under 2 cm, they are very little, but their majestic colour scheme makes them a bit easier to spot!</p>", lifecycle: "<p>The caterpillars start out small and green with black spots, turning more purple like the adults as they mature. They spend their time munching on herbs in the mint family, including thyme, sage, rosemary and of course mint!</p><p>The adults are nectar-drinking pollinators, and often seen resting on the herbs during the day.</p>", howtohelp: "<p>Treat yourself to more herbs! Many of these are quite straightforward to grow and can be kept in pots, so you don’t need much space, just some sunshine.</p><p>The caterpillars are only little and don’t take much, there’ll be plenty for your culinary needs!</p>", outlineimgsrc: "images/mint-moth-outline-hex.svg", fullimgsrc: "images/mint-moth-fullcolour-hex.svg", unfoundimgsrc: "images/moth-mystery-hex.svg", animationsrc: "images/moth-animation.svg", found: false },
]

const defaultvalues = { category: "default", congrats: "Great!", prefix: "a", keyword: "default", icon: "?", fullname: "Mystery creature!", sciname: "It's unknown... for now.", tagline: "Find my codeword to unlock info about me.", order: "One of the insects, who knows!", intro: "Get to know this creature more later!", lifecycle: "This will be revealed in time.", howtohelp: "Unlock this creature to find out!", fullimgsrc: "images/mystery-bug-fullcolour-hex.svg", unfoundimgsrc: "images/mystery-bug-fullcolour-hex.svg", found: false }


// load progress from localStorage
function loadProgress() {
    keyvalues.forEach(item => {
        const stored = localStorage.getItem(item.category);
        if (stored === "true") {
            item.found = true;
        }
    });
    // update global foundCount
    foundCount = keyvalues.filter(item => item.found).length;

}


// Save progress to localStorage
function saveProgress() {
    keyvalues.forEach(item => {
        localStorage.setItem(item.category, item.found);
    });
}


// handle submission
function handleKeywordGuess() {
    const input = document.getElementById('keyword-input');
    const guessMsg = document.getElementById('guess-msg');
    const value = input.value.trim().toLowerCase();
    input.value = '';

    if (!value) return;

    const match = keyvalues.find(k => k.keyword === value);

    if (!match) {
        guessMsg.textContent = "Sorry - that's not right!";
        guessMsg.className = "error";
        return;
    } else if (match.found) {
        guessMsg.textContent = "Already added!";
        guessMsg.className = "error";
        return;
    } else {
        match.found = true;
        foundCount += 1;
        guessMsg.textContent = "Correct!";
        guessMsg.className = "correct";

        // remove focus if correct, ensuring the modal is shown
        input.blur();

        saveProgress();
        updateDisplay();
        updateBottomNav();

        // Show the popup modal on the matched insect
        showRewardModal(match);
    }
}


// Allow pressing Enter to submit, if keyword-input is present
const keywordInput = document.getElementById("keyword-input");

if (keywordInput) {
    keywordInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            handleKeywordGuess();
        }
    });
}




// finds matching hex link using its category and replaces the ? with relevant insect image
function updateDisplay() {

    // Update hex icons  
    keyvalues.forEach(item => {
        const hex = document.getElementById(`${item.category}-hex`);
        if (hex) {

            if (item && item.found) {
                hex.innerHTML = `<img src="${item.fullimgsrc}" alt="${item.fullname}">`;
            } else {
                hex.innerHTML = `<img src="${item.unfoundimgsrc}" alt="${item.category}">`;
            }

        }
    });
}


// Handle reset
function handleReset() {
    keyvalues.forEach(item => item.found = false);
    localStorage.clear();
    loadProgress();
    updateDisplay();
    initSettings();
}

// bottom nav menu setting - codeword when not all found, feedback when all found
function updateBottomNav() {
    const nav = document.getElementById("progressNav");
    const icon = document.getElementById("progressNavIcon");
    const label = document.getElementById("progressNavLabel");

    if (!nav || !icon || !label) return;

    if (foundCount < keyvalues.length) {
        nav.href = "codeword.html";
        icon.src = "images/codeword-icon.svg";
        label.textContent = "Codeword";
    } else {
        nav.href = "feedback.html";
        icon.src = "images/feedback-icon.svg";
        label.textContent = "Feedback";
    }
}


function triggerConfetti() {
    const container = document.querySelector(".confetti-container");
    if (!container) return;

    const CONFETTI_COLOURS = [
        "#78e7be",
        "#d3f0a4",
        "#fab88c",
        "#f7918c",
        "#D5AAFF",
        "#A0C4FF"
    ];

    const count = 24; // keep low for performance

    for (let i = 0; i < count; i++) {
        const piece = document.createElement("div");
        piece.classList.add("confetti");

        // random pastel colour
        piece.style.background = CONFETTI_COLOURS[
            Math.floor(Math.random() * CONFETTI_COLOURS.length)
        ];

        // random direction and distance travelled
        const angle = (Math.random() - 0.5) * Math.PI;
        // 👆 limits spread to a half-circle (left ↔ right, but mostly upward)

        const distance = 120 + Math.random() * 90;

        const x = Math.sin(angle) * distance * 0.8 + "px";
        const y = -(Math.cos(angle) * distance * 1.4 + 60) + "px";

        piece.style.setProperty("--x", x);
        piece.style.setProperty("--y", y);

        // random duration
        const duration = 700 + Math.random() * 400;
        piece.style.animation = `confettiBurst ${duration}ms ease-out forwards`;

        // start point
        piece.style.left = "50%";
        piece.style.top = "70%";

        container.appendChild(piece);

        // cleanup
        setTimeout(() => {
            piece.remove();
        }, duration);
    }
}


function showRewardModal(item) {
    const overlay = document.getElementById("reward-modal-overlay");
    const outlineImg = document.getElementById("modal-image");
    const textBox = document.getElementById("modal-text");
    const profileBtn = document.getElementById("go-to-profile-btn");
    const unlockBtn = document.getElementById("unlock-btn");

    let isUnlocked = false;

    // show modal
    overlay.classList.remove("hidden");

    // hide profile button until unlocked
    profileBtn.style.display = "none";

    // show unlock button
    unlockBtn.style.display = "inline-block";

    if (outlineImg) {
        outlineImg.innerHTML = `
        <img class="reward-img outline img-visible" src="${item.outlineimgsrc}" alt="${item.fullname}">
        <img class="reward-img full img-hidden" src="${item.fullimgsrc}" alt="${item.fullname}">
    `;
    }


    const outline = document.querySelector(".reward-img.outline");
    const full = document.querySelector(".reward-img.full");

    /* original image appearing code
        // iprotective "if" statement, in case the structure changes so there isn't an image
            if (image) {
        image.innerHTML = `<img src="${item.fullimgsrc}" alt="${item.fullname}">`;
            }
        */

    /* should I use animated svgs instead, this can be used
        if (image) {
      image.innerHTML = `
        <object type="image/svg+xml" data="${item.animationsrc}">
          <img src="${item.animationsrc}" alt="${item.fullname}">
        </object>
      `;
    }  */

    // dynamic text with the codeword they entered
    if (textBox) {
        textBox.innerHTML = `
        <p>${item.congrats} You've found ${item.prefix} <br/><strong>${item.fullname.toLowerCase()}</strong>!</p>`;
    }


    // --- UNLOCK BUTTON LOGIC ---
    unlockBtn.onclick = () => {

        // animation step 1: outline pulls back
        outline.classList.add("animate-outline");


        // aniation step 2: after pullback, jiggle outline img and swap images
        setTimeout(() => {
            outline.classList.add("animate-jiggle");

            // when jiggle ends, swap to full image
            outline.addEventListener("animationend", () => {
                outline.classList.add("img-hidden");

                full.classList.remove("img-hidden");
                full.classList.add("img-visible");

                // trigger animations
                full.classList.add("animate-full");

                triggerConfetti();
            }, { once: true });

        }, 900);

        // animation step 3: finish + buttons
        setTimeout(() => {
            unlockBtn.style.display = "none";
            profileBtn.style.display = "inline-block";
            isUnlocked = true;
        }, 1800);


        // start gentle looping motion **after popIn finishes**
        setTimeout(() => {
            full.classList.add("animate-float");
        }, 1900); // slightly after popIn ends


        // additional: toggle buttons
        unlockBtn.style.display = "none";
        profileBtn.style.display = "inline-block";

        // affects what "enter button does"
        isUnlocked = true;


    };



    // profile button logic
    profileBtn.onclick = () => {
        window.location.href = `profiles.html#${item.category}-box`;
    };


    // clicking outside modal closes it
    overlay.onclick = (e) => {
        if (e.target === overlay) {
            overlay.classList.add("hidden");
        }
    };

    // Enter key takes user to profile as the button does, escape allows user to exit modal
    function handleModalKey(e) {
        if (e.key === "Enter") {

            if (!isUnlocked) {
                unlockBtn.click(); // simulate button press
            } else {
                profileBtn.click(); // go to profile
            }
        } else if (e.key === "Escape") {
            closeModal();
        }
    }

    function closeModal() {
        overlay.classList.add("hidden");
        document.removeEventListener("keydown", handleModalKey);
    }

    document.addEventListener("keydown", handleModalKey);
}




function updateProfilesContent() {
    document.querySelectorAll(".profile").forEach(profile => {
        const category = profile.id.replace("-box", "");  // e.g., "bee"
        const item = keyvalues.find(k => k.category === category);
        const data = (item && item.found) ? item : defaultvalues;

        // populate fields
        setField(profile, "fullname", data.fullname);
        setField(profile, "tagline", data.tagline);
        setField(profile, "sciname", data.sciname);
        setField(profile, "intro", data.intro);
        setField(profile, "lifecycle", data.lifecycle);
        setField(profile, "howtohelp", data.howtohelp);

        // Add/remove the "found" class dynamically
        if (item && item.found) {
            profile.classList.add("found");
        } else {
            profile.classList.remove("found");
        }
    });
}

// Profiles tab functionality
document.addEventListener("click", function (e) {

    if (!e.target.classList.contains("profile-tab-btn")) return;

    const btn = e.target;
    const profile = btn.closest(".profile");
    const tab = btn.dataset.tab;

    // deactivate buttons
    profile.querySelectorAll(".profile-tab-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    // hide all sections
    profile.querySelectorAll(".profile-tab-content").forEach(c => c.classList.remove("active"));

    // show selected section
    profile.querySelector(`.profile-tab-content[data-content="${tab}"]`).classList.add("active");

});


// Homepage messages depending on how many codewords have been found

function getHomepageTextMessages() {

    if (foundCount === 0) {
        return {
            message: "<h2>Welcome to Creature Seekers!</h2><p>I'm Hexie, your guide!</p><p>Find all six Creature Seeker stations in St Andrews Park, and get to know some lovely little local insects!</p>",
        };
    } else if (foundCount < keyvalues.length) {
        return {
            message: `<p>You're on the way!</p><p>You have found ${foundCount} of ${keyvalues.length} codewords so far - keep it up!</p>`,
        };
    } else {
        return {
            message: "<p>Hooray! You've found every creature on the trail!</p><p>Hexie hint: Next, check out the quiz, and please tell us your thoughts about Creature Seekers on the feedback page.</p>",
        };
    }
}


function getProgressMessage() {

    return `<p><i>Progress: <b>${foundCount}</b> out of <b>${keyvalues.length}</b> codewords currently found</i></p>`;
}


//QUIZ SETTINGS

function getQuizMessage() {

    // Determine message
    if (foundCount === 0) {
        return "<h2>Come back later!</h2><p>Complete the trail and find all the creatures to unlock the Creature Seeker quiz!</p>";
    } else if (foundCount < keyvalues.length) {
        return `<p>Complete the trail to unlock the quiz!</p><p>You have found ${foundCount} of ${keyvalues.length} codewords so far - keep it up!</p>`;
    } else {
        return "Quiz unlocked! Check out the creature profile information and see how you do!";
    }
}



// darkmode settings

function toggleDarkmode() {
    // toggle the class in the body
    document.body.classList.toggle("darkmode");

    // Save preference in localStorage
    const isDark = document.body.classList.contains("darkmode");
    localStorage.setItem("darkmode", isDark ? "true" : "false");
}

// when page loads, check and apply saved preference
document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("darkmode") === "true") {
        document.body.classList.add("darkmode");
    }
}
);


// INITIALISATION FUNCTIONS

// progress and hex display
function initCore() {
    loadProgress();
    updateDisplay();
}



// menus initialisation
function initMenu() {

    const burger = document.getElementById("burger");
    const dropdownMenu = document.getElementById("dropdown-menu");
    const overlay = document.getElementById("menu-overlay");

    if (!burger || !dropdownMenu || !overlay) return;

    const dropdownLinks = dropdownMenu.querySelectorAll("a");

    function openMenu() {
        // always appears just below the header banner, dynamically calcs it
        const header = document.getElementById("floating-header");
        const headerHeight = header.offsetHeight;

        dropdownMenu.style.top = headerHeight + "px";
        dropdownMenu.classList.add("open");

        dropdownMenu.setAttribute("aria-hidden", "false");
        overlay.setAttribute("aria-hidden", "true");

        overlay.classList.remove("hidden");
        burger.setAttribute("aria-expanded", "true");
        document.getElementById("burger-icon").textContent = "✖";

        // move focus to first link
        dropdownLinks[0].focus();
    }

    function closeMenu() {
        dropdownMenu.classList.remove("open");
        dropdownMenu.setAttribute("aria-hidden", "true");

        overlay.classList.add("hidden");
        burger.setAttribute("aria-expanded", "false");
        document.getElementById("burger-icon").textContent = "☰";

        // move focus to the burger menu
        burger.focus();
    }

    burger.addEventListener("click", (e) => {
        e.stopPropagation();

        if (dropdownMenu.classList.contains("open")) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    overlay.addEventListener("click", closeMenu);

    dropdownLinks.forEach(link => {
        link.addEventListener("click", closeMenu);
    });

}

// profile cards initialisation
function initProfiles() {

    updateProfilesContent();

    // ensure first tab active in each profile
    document.querySelectorAll(".profile").forEach(profile => {

        const firstBtn = profile.querySelector(".profile-tab-btn");
        const firstContent = profile.querySelector(".profile-tab-content");

        if (firstBtn) firstBtn.classList.add("active");
        if (firstContent) firstContent.classList.add("active");

    });
}

// homepage text and buttons initialisation
function initHomepage() {

    const homepageHexieText = document.getElementById('homepage-hexie-speech');


    if (!homepageHexieText) return;

    const homepageMessage = getHomepageTextMessages();

    homepageHexieText.innerHTML = homepageMessage.message;

}

function initFlexiButtons() {

    const codeFbkButton = document.getElementById('codeword-fbk-btn');
    const helpButton = document.getElementById('help-btn');


    if (codeFbkButton) {

        if (foundCount === 0) {

            codeFbkButton.style.display = "inline-block";
            codeFbkButton.textContent = "Found a codeword? Press here!";
            codeFbkButton.href = "codeword.html";

        } else if (foundCount < keyvalues.length) {

            codeFbkButton.textContent = "Enter a codeword";

        } else {

            codeFbkButton.style.display = "inline-block";
            codeFbkButton.textContent = "Give feedback";
            codeFbkButton.href = "feedback.html";

        }
    }

    if (helpButton) {
        if (foundCount === 0) {

            helpButton.style.display = "inline-block";
            helpButton.textContent = "How does this work?";
            helpButton.href = "help-how-to-use.html";

        } else {

            helpButton.style.display = "none";
        }
    }


}

function initSettings() {
    const progressMsg = document.getElementById("progress-message");

    if (progressMsg) {
        progressMsg.innerHTML = getProgressMessage();
    }
}

// quiz setting initialisation
function initQuiz() {

    const quizBox = document.getElementById('quiz-box');
    const quizBoxText = document.getElementById('quiz-para-text');
    const quizApp = document.getElementById('quiz-app');

    if (!quizBox || !quizApp) return;

    quizBoxText.innerHTML = getQuizMessage();

    if (foundCount >= keyvalues.length) {
        quizBox.style.display = "none";
        quizApp.style.display = "block";
    } else {
        quizBox.style.display = "block";
        quizApp.style.display = "none";
    }
}

function initSurvey() {

    const container = document.getElementById("survey-container");
    const loading = document.getElementById("survey-loading");

    if (!container) return;

    const formId = container.dataset.formId;

    // If this page doesn't have a survey, do nothing
    if (!formId) return;

    window.addEventListener("load", function () {
        const script = document.createElement("script");
        script.src = `https://form.jotform.com/jsform/${formId}`;

        container.appendChild(script);

        setTimeout(function () {

            if (loading) { loading.style.display = "none"; }

        }, 2500); // hide the loading message after 3 seconds, around the time it takes to load
    });
}

document.addEventListener("DOMContentLoaded", () => {

    // progress and hex display initialisation
    initCore();

    // bottom navigate adjusgement
    updateBottomNav();

    // menus initialisation
    initMenu();

    // profile cards initialisation
    initProfiles();

    // homepage text and buttons initialisation
    initHomepage();

    //initialise contextual buttons
    initFlexiButtons();

    // initialise settings page
    initSettings()

    // quiz setting initialisation
    initQuiz();

    // survey initialisation
    initSurvey();

});