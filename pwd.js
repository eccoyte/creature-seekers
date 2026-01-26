// this whole page will be removed when the site is live

const pwdCorrect = "scorched carpet"; // global password for accessing the site



// check if the entered password is correct
function checkPassword() {
    const pwdInput = document.getElementById("password-input").value;
    const errorMessage = document.getElementById("error-message");
    const passwordContainer = document.getElementById("password-container");
    const accessContainer = document.getElementById("pwd-access-container");

    // clear the error message first, if one is present
    errorMessage.style.display = "none"; 

    if (pwdInput === pwdCorrect) {
        passwordContainer.style.display = "none"; 
        accessContainer.style.display = "block"; 
    } else {
        errorMessage.style.display = "block"; 
    }
}

// Allow pressing Enter to submit, if keyword-input is present - doesn't seem to work atm though
const passwordInput = document.getElementById("password-input");

if (passwordInput) {
    passwordInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            checkPassword();
        }
    });
}

