// Contact Page JavaScript (contact_script.js)

document.addEventListener("DOMContentLoaded", function() {
    console.log("Jason Clark Portfolio - Contact page loaded");

    const form = document.getElementById("contact-form");

    async function handleSubmit(event) {
        event.preventDefault();
        const status = document.createElement("p");
        const data = new FormData(event.target);
        fetch(event.target.action, {
            method: form.method,
            body: data,
            headers: {
                "Accept": "application/json"
            }
        }).then(response => {
            if (response.ok) {
                status.textContent = "Thanks for your submission!";
                status.style.color = "green";
                form.parentNode.insertBefore(status, form.nextSibling);
                form.reset();
            } else {
                response.json().then(data => {
                    if (Object.hasOwn(data, "errors")) {
                        status.textContent = data["errors"].map(error => error["message"]).join(", ");
                    } else {
                        status.textContent = "Oops! There was a problem submitting your form";
                    }
                    status.style.color = "red";
                    form.parentNode.insertBefore(status, form.nextSibling);
                })
            }
        }).catch(error => {
            status.textContent = "Oops! There was a problem submitting your form";
            status.style.color = "red";
            form.parentNode.insertBefore(status, form.nextSibling);
        });
    }
    form.addEventListener("submit", handleSubmit);
});

