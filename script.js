// Define allowed patterns
const namePattern = /^[a-zA-Z\s]*$/;       // Only letters and spaces
const subjectPattern = /^[a-zA-Z\s]*$/;    // Only letters and spaces
const messagePattern = /^[a-zA-Z0-9\s.,!?'-]*$/;  // Letters, numbers, common punctuation

// Define max lengths
const nameMax = 30;
const subjectMax = 30;
const messageMax = 400;

// Define form errors array to track all mistakes
let form_errors = [];
let current_errors = [];

// Define input fields and output elements
const inputs = [
    { field: document.getElementById("name"), pattern: namePattern, max: nameMax, countOutput: document.getElementById("name-count"), errorOutput: document.getElementById("name-error") },
    { field: document.getElementById("subject"), pattern: subjectPattern, max: subjectMax, countOutput: document.getElementById("subject-count"), errorOutput: document.getElementById("subject-error") },
    { field: document.getElementById("message"), pattern: messagePattern, max: messageMax, countOutput: document.getElementById("message-count"), errorOutput: document.getElementById("message-error") },
    { field: document.getElementById("email"), errorOutput: document.getElementById("email-error") }  // Email validation only
];

// Function to handle input and show error if needed
inputs.forEach(input => {
    input.field.addEventListener("input", () => {
        const { field, pattern, max, countOutput, errorOutput } = input;

        // Clear previous error for this field from current_errors
        current_errors = current_errors.filter(err => err.field !== field.id);

        // Handle character count display
        if (max && countOutput) {
            const remaining = max - field.value.length;
            countOutput.textContent = `${remaining} characters remaining`;
            countOutput.style.color = remaining <= max * 0.1 ? "red" : remaining <= max * 0.2 ? "orange" : "";
        }

        // Email-specific validation
        if (field.id === "email") {
            if (field.validity.valueMissing) {
                const error = "You need to enter an email address.";
                errorOutput.textContent = error;
                logError(field.id, error);
                current_errors.push({ field: "email", error });
                showError(errorOutput, field);
            } else if (field.validity.typeMismatch) {
                const error = "Entered value needs to be an email address.";
                errorOutput.textContent = error;
                logError(field.id, error);
                current_errors.push({ field: "email", error });
                showError(errorOutput, field);
            } else {
                errorOutput.textContent = "";
                field.style.borderColor = "";  // Remove red border if valid
            }
            return;
        }

        // Validation for name, subject, and message
        if (pattern && !pattern.test(field.value)) {
            const error = "Invalid character detected!";
            field.classList.add("invalid");
            errorOutput.textContent = error;
            logError(field.id, error);
            current_errors.push({ field: field.id, error });
            showError(errorOutput, field);
        } else {
            field.classList.remove("invalid");
            errorOutput.textContent = "";
            field.style.borderColor = "";  // Remove red border if valid
        }
    });
});

// Log all errors to form_errors array
function logError(field, error) {
    // Avoid logging the same error for the same field multiple times
    const alreadyLogged = form_errors.some(err => err.field === field && err.error === error);
    if (!alreadyLogged) {
        form_errors.push({ field, error });
    }
}

// Function to show error message and fade it out
function showError(errorOutput, field) {
    errorOutput.style.display = "block";
    field.style.borderColor = "red";

    // Flash effect
    setTimeout(() => {
        field.style.borderColor = "";
    }, 200);

    // Fade out the error message
    setTimeout(() => {
        errorOutput.style.display = "none";
    }, 2000);
}

// Form submission: save form_errors as JSON in hidden input
const form = document.querySelector("form");
form.addEventListener("submit", (event) => {
    const errorField = document.getElementById("form-errors");

    // Prevent submission if there are current errors
    if (current_errors.length > 0) {
        event.preventDefault();
        console.log("Form submission blocked due to current errors.");
    }

    // Save all errors (both past and current) to hidden input
    if (form_errors.length > 0) {
        errorField.value = JSON.stringify(form_errors);
    } else {
        errorField.value = "";  // Clear if no errors
    }
});



