document.addEventListener("DOMContentLoaded", () => {
    const fields = [
        {
            id: "name",
            max: 30,
            pattern: /^[a-zA-Z\s]*$/,
            errorId: "name-error",
            restrictTyping: true,
        },
        {
            id: "email",
            max: 50,
            errorId: "email-error",
            pattern: /^[a-zA-Z0-9@._-]*$/, // restrict invalid chars
            validate: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
            message: "Please enter a valid email.",
            restrictTyping: true,
        },
        {
            id: "phone",
            max: 50,
            pattern: /^\+?[0-9]*$/,
            errorId: "phone-error",
            message: "Please enter a valid phone number in format +12300...",
            restrictTyping: true
        },
        {
            id: "subject",
            errorId: "subject-error",
            isSelect: true
        },
        {
            id: "message",
            max: 400,
            errorId: "message-error",
            pattern: /^[a-zA-Z0-9\s.,!?'"()-]*$/, // letters, numbers, safe punctuation
            restrictTyping: true,
        }
    ];

    const touched = {};

    fields.forEach(({ id, max, pattern, validate, message, restrictTyping, isSelect, errorId }) => {
        const field = document.getElementById(id);
        const output = document.getElementById(errorId);
        touched[id] = false;

        const updateOutput = () => {
            const value = field.value;

            // Character limit
            if (max && value.length >= max) {
                output.textContent = "Character limit reached.";
                output.style.display = "block";
                return;
            }

            // Do not show validation errors until user has interacted
            if (!touched[id]) {
                output.style.display = "none";
                return;
            }

            // Required
            if (value === "" || (isSelect && field.selectedIndex === 0)) {
                output.textContent = "This field is required.";
                output.style.display = "block";
            }
            // Email or phone format validation
            else if (validate && !validate(value)) {
                output.textContent = message;
                output.style.display = "block";
            } else {
                output.style.display = "none";
            }
        };

        // Restrict typing if pattern is defined
        if (restrictTyping && pattern) {
            field.addEventListener("keypress", (e) => {
                const char = String.fromCharCode(e.which);
                if (!pattern.test(char)) {
                    e.preventDefault();
                }
            });

            field.addEventListener("paste", (e) => {
                const paste = (e.clipboardData || window.clipboardData).getData("text");
                if (!pattern.test(paste)) {
                    e.preventDefault();
                }
            });
        }

        const eventType = isSelect ? "change" : "input";

        field.addEventListener(eventType, updateOutput);
        field.addEventListener("input", updateOutput);

        field.addEventListener("blur", () => {
            touched[id] = true;
            updateOutput();
        });

        // Hide errors at start
        output.style.display = "none";
    });

    document.querySelector("form").addEventListener("submit", (e) => {
        const errorsVisible = Array.from(document.querySelectorAll(".error"))
            .some(el => el.style.display === "block");

        if (errorsVisible) {
            e.preventDefault();
            console.log("Form blocked due to validation errors.");
        }
    });
});
