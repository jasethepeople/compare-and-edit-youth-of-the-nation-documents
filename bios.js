document.addEventListener("DOMContentLoaded", () => {
    const loadingProgress = document.getElementById("loading-progress");
    const launchingMessage = document.getElementById("launching-message");
    const blinkingCursorBios = document.getElementById("blinking-cursor-bios");
    const biosScreen = document.getElementById("bios-screen");
    const startPrompt = document.getElementById("start-prompt");
    const actualStartButton = document.getElementById("actual-start-button");
    const osInterfacePlaceholder = document.getElementById("os-interface-placeholder");
    const systemDate = document.getElementById("system-date");

    // Set system date
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const year = today.getFullYear();
    systemDate.textContent = `${month}/${day}/${year}`;

    const assets = [
        { name: "System Drivers", time: 300 },
        { name: "Graphics Interface", time: 400 },
        { name: "Sound Card", time: 250 },
        { name: "Network Protocols", time: 350 },
        { name: "Core Libraries", time: 500 },
        { name: "User Profile", time: 200 },
        { name: "Desktop Environment", time: 600 },
        { name: "Security Modules", time: 300 },
        { name: "Font Packages", time: 200 },
        { name: "Application Shaders", time: 450 }
    ];

    let loadedPercentage = 0;
    let assetIndex = 0;

    function simulateLoading() {
        if (assetIndex < assets.length) {
            const asset = assets[assetIndex];
            const p = document.createElement("p");
            p.textContent = `Loaded ${asset.name}`;
            loadingProgress.appendChild(p);
            
            // Simulate time to load this asset
            setTimeout(() => {
                // Fake percentage update - not linear to number of assets
                const increment = Math.floor(Math.random() * 10) + 5; // Random increment between 5-14
                loadedPercentage += increment;
                if (loadedPercentage > 100) loadedPercentage = 100;
                p.textContent += ` ... ${loadedPercentage}%`;
                
                // Scroll to bottom of bios-body
                const biosBody = document.querySelector(".bios-body");
                biosBody.scrollTop = biosBody.scrollHeight;

                assetIndex++;
                simulateLoading();
            }, asset.time);
        } else {
            // Finished loading assets
            setTimeout(() => {
                launchingMessage.style.display = "block";
                const biosBody = document.querySelector(".bios-body");
                biosBody.scrollTop = biosBody.scrollHeight;
                setTimeout(() => {
                    blinkingCursorBios.style.display = "none";
                    biosScreen.style.transition = "opacity 0.5s ease-out";
                    biosScreen.style.opacity = "0";
                    setTimeout(() => {
                        biosScreen.style.display = "none";
                        startPrompt.style.display = "flex";
                    }, 500);
                }, 1500);
            }, 500);
        }
    }

    actualStartButton.addEventListener("click", () => {
        startPrompt.style.transition = "opacity 0.3s ease-out";
        startPrompt.style.opacity = "0";
        setTimeout(() => {
            startPrompt.style.display = "none";
            // Here we would typically load the main OS interface
            // For now, redirect to a placeholder or the actual os.html page
            window.location.href = "os.html"; // Assuming os.html will be the main interface
        }, 300);
    });

    // Start the BIOS loading sequence
    simulateLoading();
});
