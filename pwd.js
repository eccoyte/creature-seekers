// this whole page will be removed when the site is live

const pwdCorrect = "Mothra5678"; // if you're seeing this - enjoy perusing the code but please don't do anything mean!



// check if the entered password is correct
function checkPassword() {
    const pwdInput = document.getElementById("password-input").value;
    const errorMessage = document.getElementById("error-message");
    const passwordContainer = document.getElementById("password-container");
    const accessContainer = document.getElementById("pwd-access-container");

    // clear the error message first, if one is present
    errorMessage.style.display = "none";

    if (pwdInput === pwdCorrect) {

        // store session auth
        sessionStorage.setItem("authenticated", "true");

        // change what appears on the screen
        passwordContainer.style.display = "none";
        accessContainer.style.display = "block";
    } else {
        errorMessage.style.display = "block";
    }
}

// Allow pressing Enter to submit, if keyword-input is present - doesn't seem to work atm though
const passwordInput = document.getElementById("password-input");

if (passwordInput) {
    passwordInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            checkPassword();
        }
    });
}

