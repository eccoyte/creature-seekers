let foundCount = 0;   // how many creatures have been found

// nav menu behaviour
const burger = document.getElementById("burger");
const dropdownMenu = document.getElementById("dropdown-menu");
const closeDropdownMenu = document.getElementById("close-dropdown-menu");
const overlay = document.getElementById("menu-overlay");
const dropdownLinks = dropdownMenu.querySelectorAll("a");

// --- helper functions ---

function openMenu() {
    dropdownMenu.classList.add("open");
    overlay.classList.remove("hidden");
    burger.setAttribute("aria-expanded", "true");
}

function closeMenu() {
    dropdownMenu.classList.remove("open");
    overlay.classList.add("hidden");
    burger.setAttribute("aria-expanded", "false");
}


// event listeners

// open menu
burger.addEventListener("click", (e) => {
    e.stopPropagation(); // prevent triggering outside-click closes

    if (dropdownMenu.classList.contains("open")) {
        closeMenu();
    } else {
        openMenu();
    }
});

// close via X button
closeDropdownMenu.addEventListener("click", () => {
    closeMenu();
});

// clicking the overlay closes the menu
overlay.addEventListener("click", () => {
    closeMenu();
});

// clicking any dropdown link closes the menu
dropdownLinks.forEach(link => {
    link.addEventListener("click", () => {
        closeMenu();
    });
});


// keywords and associated data
const keyvalues = [
{category: "bee", congrats: "Wonderful!", prefix: "an", icon: "🐝",  fullname: "Ivy bee", sciname: "Colletes hederae", keyword: "autumn", tagline: "Come join the insect ivy league with this newcomer bee!", order: "Hymenoptera, the bees, wasps, ants and sawflies", intro: "The ivy bee was first recorded in the UK in 2001 and has been expanding its range ever since. Ivy bees look similar to honey bees, but with paler, more defined stripes and without such neat pollen baskets.", lifecycle: "Ivy bees don’t live in hives, like honey bees. Instead ivy bees live in tunnels in warm, sandy soil, often close to other ivy bees. Adults emerge in autumn when ivy is in flower. They lay their eggs and provide for their young with ivy pollen in these tunnels.", howtohelp: "Let some ivy grow wild if you can! Ivy is a wonderful plant that offers autumn flowers and berries, offering a much needed burst of food for ivy bees and dozens of other species as the cool weather approaches. It doesn’t damage the trees it climbs, and provides additional shelter for all kinds of creatures too. ", found: false},
{category: "beetle", congrats: "Amazing!", prefix: "a", icon: "🪲",  fullname: "Lesser stag beetle", sciname: "Dorcus parallelipipedus", keyword: "wood", tagline: "Wood-n’t you give this lovely beetle a helping hand?", order: "Coleoptera, the beetles ", intro: "These awesome beetles may not quite have the body or “antler” size of their more famous relatives, the greater stag beetle, they’re still pretty impressive! Adults usually come out at night during the summer", lifecycle: "Lesser stag beetles lay their eggs inside decaying deadwood, and that’s where they spend most of their quite long lives. The larvae eat the deadwood and help break it down, whereas the adults prefer tree sap. They spend 1-2 years as larvae, and 2-3 more years as adults!", howtohelp: "Providing untreated dead wood is the key to helping these lovely large beetles. Consider making a pile of logs or woodchip, ideally in contact with soil to help speed up the decay process. If you have old tree stumps, leave them to break down naturally rather than removing them - the beetle larvae will do the work for you!", found: false},
{category: "bug", congrats: "Terrific!",  prefix: "a", icon: "🛡️", fullname: "Green shield bug", sciname: "Palomena prasina", keyword: "sap", tagline: "Will you let this sturdy bug through your defences, and go green for them?", order: "Hemiptera, the true bugs", intro: "Shield bugs are actually named for their shape, rather than any particular defensive capabilities, so be gentle with them! They are also green by name and green by nature, but only for some of the year. Their summer green outfit turns more brown or bronze coloured in the late autumn, rather like the leaves they live on!", lifecycle: "Green shield bugs lay their eggs on the undersides of leaves, which hatch in late spring, The juveniles are more rounded than the adults, and commonly patterned with black markings. After 5 stages, they reach their adult form, sucking up the sap of various plants before hibernating in the winter.", howtohelp: "Green shield bugs are quite easy to please, so providing a range of trees, shrubs and herbaceous plants will suit them well. Also, leave some places for them to shelter over winter, such as leaf piles. These are a lifeline for all sorts of little creatures during the cold months.  ", found: false},
{category: "dragonfly", congrats: "Superb!", prefix: "a", icon: "🐉", fullname: "Common darter dragonfly", sciname: "Sympetrum striolatum", keyword: "nymph", tagline: "Are you red-dy to help this striped scarlet striker soar?", order: "Odonata, the dragonflies and damselflies", intro: "Only the males are bright red, though - females and young adults are more golden-brown. Both the larvae (called nymphs) and the adults are fierce and accurate predators, but in different domains!", lifecycle: "These dragonflies spend much of their life underwater, as juveniles called nymphs. They catch smaller creatures with extendable jaws! When they are ready, they crawl out of the water and shed their skin, into their new adult form. After a short rest, they take to the air and resume their hunting in the air above!", howtohelp: "Provide freshwater sources wherever you can. A pond is best, but it can be as small as a partially submerged sink or other container. Be sure to provide exit ramps for other wildlife! If you don’t have the option to do this, providing a range of native wildflowers will support the small insects dragonflies feed on, helping them too!", found: false},
{category: "hoverfly", congrats: "Marvellous!", prefix: "a", icon: "🪰", fullname: "Marmalade hoverfly", sciname: "Episyrphus balteatus", keyword: "aphid", tagline: "Come and jam with this agile pollinator!", order: "Dipetra, the flies", intro: "The wasp-like stripes help trick birds and other potential predators into leaving them well alone, even though they don’t have any sting! You can tell them apart from a wasp or bee by looking for their huge eyes, and the hovering flight they are named for.", lifecycle: "Marmalade hoverflies lay their eggs on plants with aphids on them. When the larvae hatch, they feast on these aphids continually as they grow. As adults, they become agile pollinators, flying from flower to flower, using their big eyes to scope out food and avoid danger.", howtohelp: "Hoverflies don’t have long tongues like bees, so they especially love open flowers rather than tube-shaped ones. Their favourites include cow parsley, tansy, asters, knapweed, apple blossom and more. They’ll thank you by helping take care of aphid pests for you!", found: false},
{category: "moth", congrats: "Awesome!",  prefix: "a", icon: "🦋", fullname: "Mint moth", sciname: "Pyrausta aurata", keyword: "herb", tagline: "Make some thyme to provide for this lovely little herb-ivore!", order: "Lepidoptera, the butterflies and moths", intro: "The mint moth is also called the ‘small purple and gold’, which is pretty descriptive in terms of visuals! With a wingspan under 2 cm, they are very little, but their majestic colour scheme makes them a bit easier to spot!", lifecycle: "The caterpillars start out small and green with black spots, turning more purple like the adults as they mature. They spend their time munching on herbs in the mint family, including thyme, sage, rosemary and of course mint! The adults are nectar-drinking pollinators, and often seen resting on the herbs during the day.", howtohelp: "Treat yourself to more herbs! Many of these are quite straightforward to grow and can be kept in pots, so you don’t need much space, just some sunshine. The caterpillars are only little and don’t take much, there’ll be plenty for your culinary needs!", found: false},
]

const defaultvalues = {category: "default", congrats: "Great!",  prefix: "a", keyword: "default", icon: "?", fullname: "Mystery creature!", sciname: "It's unknown... for now.", tagline: "Find my artwork in BS6 to unlock info about me.", order: "One of the insects, who knows!", intro: "I bet this insect is lovely.", lifecycle: "This will be revealed in time.", howtohelp: "Unlock this insect to find out!", found: false}

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
    

    saveProgress();
    updateDisplay();

    // Show the popup modal
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




// finds matching hex link using its category and replaces the ? with relevant emoji
// also updates the foundWordBox - will be phased out but handy for now
function updateDisplay() {

    // Update hex icons  
    keyvalues.forEach(item => {
        const hex = document.getElementById(`${item.category}-hex`);
        if (hex) {
            hex.textContent = item.found ? item.icon : "?";
        }
    });

    // Update foundWordBox (only if it exists on this page)
    const container = document.getElementById("foundWordBox");
    if (container) {
        const foundList = keyvalues
            .filter(item => item.found)
            .map(item => item.keyword);

        container.innerHTML = foundList.join(", ");
    }
}


// Handle reset
function handleReset() {
  keyvalues.forEach(item => item.found = false);
  localStorage.clear();
  updateDisplay();
}



// guarantees that the hexes exist before the JavaScript tries to update them.
document.addEventListener("DOMContentLoaded", () => {
    const profileHexes = document.querySelectorAll(".hex-profile");

    profileHexes.forEach(hex => {
        const category = hex.dataset.category;
        const item = keyvalues.find(k => k.category === category);
        const found = localStorage.getItem(category) === "true";

        hex.textContent = found ? item.icon : "?";
    });
});

function showRewardModal(item) {
    const overlay = document.getElementById("reward-modal-overlay");
    const emoji = document.getElementById("modal-emoji");
    const textBox = document.getElementById("modal-text");
    const profileBtn = document.getElementById("go-to-profile-btn");

    emoji.textContent = item.icon;

    // dynamic text with the codeword they entered
    textBox.innerHTML = `
        <p>${item.congrats} You've found ${item.prefix} <strong>${item.fullname.toLowerCase()}</strong>!</p>

        <p>Let's learn a little more about them.</p>`;

    // show modal
    overlay.classList.remove("hidden");

    // clicking anywhere on the modal overlay goes to the profile
    overlay.onclick = () => {
        window.location.href = `profiles.html#${item.category}-box`;
    };

    // clicking the button goes to profile
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
            window.location.href = `profiles.html#${item.category}-box`;
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
        const category = profile.id.replace("-box", "");  // e.g., "fruit"
        const item = keyvalues.find(k => k.category === category);
        const data = item && item.found ? item : defaultvalues;

        // populate fields
        profile.querySelector('[data-field="fullname"]').textContent = item.found ? item.fullname : defaultvalues.fullname;
        profile.querySelector('[data-field="tagline"]').textContent = item.found ? item.tagline : defaultvalues.tagline;
        profile.querySelector('[data-field="sciname"]').textContent = item.found ? item.sciname : defaultvalues.sciname;
        profile.querySelector('[data-field="lifecycle"]').textContent = item.found ? item.lifecycle : defaultvalues.lifecycle;
        profile.querySelector('[data-field="howtohelp"]').textContent = item.found ? item.howtohelp : defaultvalues.howtohelp;

        // Add/remove the "found" class dynamically
        if (item && item.found) {
            profile.classList.add("found");
        } else {
            profile.classList.remove("found");
        }
    });
}




//QUIZ SETTINGS

function getQuizMessage() {
    
    // Determine message
    if (foundCount === 0) {
        return "Complete the trail to unlock the quiz!";
    } else if (foundCount < keyvalues.length) {
        return `Complete the trail to unlock the quiz! You have found ${foundCount} of ${keyvalues.length} codewords so far - keep it up!`;
    } else {
        return "Quiz unlocked!";
    }
}


document.addEventListener("DOMContentLoaded", () => {
    loadProgress();
    updateDisplay();
    updateProfilesContent();
        // Update quiz box
    const quizBox = document.getElementById('quiz-box');
    const quizApp = document.getElementById('quiz-app');

    if (quizBox && quizApp) {
        quizBox.textContent = getQuizMessage();

    // hide box when all found
    if (foundCount >= 6) {
        quizBox.style.display = "none";   
        quizApp.style.display = "block";   
    } else {
        quizBox.style.display = "block";
        quizApp.style.display = "none";  
    }  
    }

});
