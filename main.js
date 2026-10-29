// Main JavaScript for Jason Clark Portfolio (Mimic Design)

document.addEventListener("DOMContentLoaded", () => {
    console.log("Portfolio JS Initialized");

    // Smooth scrolling for internal links
    document.querySelectorAll("a[href^=\"#\"]").forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            const targetId = this.getAttribute("href");
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: "smooth" });
            }
        });
    });

    // Mobile Navigation Toggle
    const burger = document.querySelector(".burger");
    const navLinks = document.querySelector(".nav-links");
    const navLinkItems = document.querySelectorAll(".nav-links li");

    if (burger && navLinks) {
        burger.addEventListener("click", () => {
            navLinks.classList.toggle("nav-active");
            burger.classList.toggle("toggle");

            // Animate Links
            navLinkItems.forEach((link, index) => {
                if (link.style.animation) {
                    link.style.animation = "";
                } else {
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                }
            });
        });
    }

    // Fade-in animation on scroll
    const observerOptions = {
        root: null, // relative to document viewport
        rootMargin: "0px",
        threshold: 0.1 // 10% visible
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                // Optional: Stop observing once visible
                // observer.unobserve(entry.target);
            }
            // Optional: Remove class if scrolling back up
            // else {
            //     entry.target.classList.remove("visible");
            // }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    const fadeElements = document.querySelectorAll(".fade-in");
    fadeElements.forEach(el => observer.observe(el));

    // Placeholder for initializing background WebGL effect
    // initBackgroundEffect();
});

// Add CSS for mobile nav and animations if not already present
/*
@media screen and (max-width: 768px) {
    .nav-links {
        position: absolute;
        right: 0px;
        height: 92vh;
        top: 8vh;
        background-color: var(--background-color);
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 50%;
        transform: translateX(100%);
        transition: transform 0.5s ease-in;
    }
    .nav-links li {
        opacity: 0;
    }
    .burger {
        display: block; // Show burger on mobile
        cursor: pointer;
    }
}

.nav-active {
    transform: translateX(0%);
}

@keyframes navLinkFade {
    from {
        opacity: 0;
        transform: translateX(50px);
    }
    to {
        opacity: 1;
        transform: translateX(0px);
    }
}

.burger div {
    width: 25px;
    height: 3px;
    background-color: var(--text-color);
    margin: 5px;
    transition: all 0.3s ease;
}

.burger.toggle .line1 {
    transform: rotate(-45deg) translate(-5px, 6px);
}
.burger.toggle .line2 {
    opacity: 0;
}
.burger.toggle .line3 {
    transform: rotate(45deg) translate(-5px, -6px);
}
*/

