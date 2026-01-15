let foundCount = 0;   // how many items have been found

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


// --- event listeners ---

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
    {category: "fruit", congrats: "Wonderful!", prefix: "an", keyword: "apple", icon: "🍎",  fullname: "Apple", sciname: "Apple McAppleFace", subtitle: "How do you like them apples?", size: "10 cm maybe idk?", lifecycle: "Starts off as a bud, then a flower, then an apple, then a snacky", howtohelp: "Grow lots of different types of apples, then you can have lots of different types of apple. Or buy them, idk your life.", found: false},
{category: "sports", congrats: "Amazing!", prefix: "a", keyword: "baseball", icon: "⚾",  fullname: "Baseball", sciname: "Ed Balls", subtitle: "Ed Balls Ed Balls Ed Balls Ed Balls", size: "I'm assuming 9cm at a guess", lifecycle: "The ball is made, the ball is thrown. Maybe the ball is caught. Maybe not.", howtohelp: "There are many different kinds of balls in the world, so let's celebrate the diversity.", found: false},
{category: "animal", congrats: "Terrific!",  prefix: "a", keyword: "cat", icon: "🐱", fullname: "Cat", sciname: "Pasta Batman", subtitle: "How do you like them apples", size: "around the size of a cat", lifecycle: "First a kitten, then a scrungly little teen, then a grown up cat. Still just a baby. An elderly baby.", howtohelp: "Adopt, don't shop! Please adopt a kitty if you can, and if you like them. But they aren't always great for wildlife...", found: false},
{category: "instrument", congrats: "Superb!", prefix: "a", keyword: "drum", icon: "🥁", fullname: "Drum", sciname: "Rumpa-pum-pum", subtitle: "Do you march to the beat of your drum?", size: "often kinda big?", lifecycle: "The drum is made, the drum is hit, over and over again until it breaks, or languishes in an attice.", howtohelp: "Check with your local music store to see if a drum is right for you and your family", found: false},
{category: "species", congrats: "Marvellous!", prefix: "an", keyword: "elf", icon: "🧝", fullname: "Elf", sciname: "Hugo Weaving", subtitle: "Tell me where is Gandalf, for I much desire to speak with him", size: "at least 6 foot", lifecycle: "Very very long, by our standards. Unnaturally, some might say. Still, it seems to work for them.", howtohelp: "Take the hobbits to Isengard. Or stop taking the hobbits to Isengard. Or consider bringing giant eagles into the mix.", found: false},
{category: "element", congrats: "Awesome!",  prefix: "a", keyword: "fire", icon: "🔥", fullname: "Fire", sciname: "Hestia", subtitle: "Will you fight fire with fire, or go down in flames?", size: "literally any size", lifecycle: "The ball is made, the ball is thrown. Maybe the ball is caught", howtohelp: "It needs heat, fuel and an oxidising agent, like oxygen! Consider whether you need to help the fire though, or stop the fire as soon as possible. It's circumstantial like that.", found: false},
]

const defaultvalues = {category: "default", keyword: "default", icon: "?", fullname: "Mystery creature!", sciname: "It's unknown... for now.", subtitle: "Find my artwork to unlock info about me.", size: "Could be any size (probably quite small?)", lifecycle: "This will be revealed in time.", howtohelp: "Unlock this insect to find out!", found: false}

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
        <p>${item.congrats} You've found ${item.prefix} <strong>${item.keyword}</strong>!</p>
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
        profile.querySelector('[data-field="subtitle"]').textContent = item.found ? item.subtitle : defaultvalues.subtitle;
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
