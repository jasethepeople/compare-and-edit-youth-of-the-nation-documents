document.addEventListener("DOMContentLoaded", () => {
    const startMenuButton = document.getElementById("start-menu-button");
    const startMenu = document.getElementById("start-menu");
    const taskbarIconsContainer = document.getElementById("open-windows-icons");
    const windowsContainer = document.getElementById("windows-container");
    const currentTimeDisplay = document.getElementById("current-time");

    let activeWindowZIndex = 100;
    const openWindows = {}; // To keep track of open windows and their state

    // --- Clock --- //
    function updateClock() {
        const now = new Date();
        let hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        currentTimeDisplay.textContent = `${hours}:${minutes} ${ampm}`;
    }
    setInterval(updateClock, 1000);
    updateClock();

    // --- Start Menu --- //
    startMenuButton.addEventListener("click", (event) => {
        event.stopPropagation();
        startMenu.classList.toggle("start-menu-hidden");
    });

    document.addEventListener("click", () => {
        if (!startMenu.classList.contains("start-menu-hidden")) {
            startMenu.classList.add("start-menu-hidden");
        }
    });

    startMenu.addEventListener("click", (event) => {
        event.stopPropagation(); // Prevent clicks inside menu from closing it
    });

    // --- Window Creation and Management --- //
    function createWindow(id, title, contentHTML) {
        if (openWindows[id] && !openWindows[id].minimized && openWindows[id].element.style.display !== 'none') { 
            bringToFront(openWindows[id].element);
            return;
        } else if (openWindows[id] && (openWindows[id].minimized || openWindows[id].element.style.display === 'none')) {
            restoreWindow(id);
            return;
        }

        const windowElement = document.createElement("div");
        windowElement.classList.add("window");
        windowElement.id = id;
        windowElement.style.left = `${Math.random() * 150 + 20}px`; 
        windowElement.style.top = `${Math.random() * 100 + 20}px`;
        windowElement.style.width = '550px'; // Default width
        windowElement.style.height = '400px'; // Default height
        activeWindowZIndex++;
        windowElement.style.zIndex = activeWindowZIndex;

        windowElement.innerHTML = `
            <div class="title-bar">
                <img src="images/icons/default_icon.png" class="window-title-icon" alt="">
                <span class="title">${title}</span>
                <div class="title-bar-controls">
                    <button class="minimize" data-window-id="${id}" title="Minimize">_</button>
                    <button class="maximize" data-window-id="${id}" title="Maximize">[]</button>
                    <button class="close" data-window-id="${id}" title="Close">X</button>
                </div>
            </div>
            <div class="window-body">
                ${contentHTML || `<p>Content for ${title} goes here.</p><p>This is a placeholder.</p>`}
            </div>
        `;

        windowsContainer.appendChild(windowElement);
        makeDraggable(windowElement.querySelector(".title-bar"), windowElement);
        addWindowControls(windowElement, id, title);
        createTaskbarIcon(id, title, windowElement);

        openWindows[id] = { element: windowElement, title: title, minimized: false, taskbarIcon: null }; // taskbarIcon assigned in createTaskbarIcon
        setActiveWindow(windowElement);
    }

    function setActiveWindow(windowElement) {
        document.querySelectorAll('.window').forEach(win => win.classList.remove('active'));
        windowElement.classList.add('active');
        activeWindowZIndex++;
        windowElement.style.zIndex = activeWindowZIndex;

        document.querySelectorAll('.taskbar-icon').forEach(icon => icon.classList.remove('active'));
        const taskbarIcon = document.querySelector(`.taskbar-icon[data-window-id="${windowElement.id}"]`);
        if (taskbarIcon) {
            taskbarIcon.classList.add('active');
        }
    }

    function bringToFront(windowElement) {
        setActiveWindow(windowElement);
    }

    function addWindowControls(windowElement, id, title) {
        const closeButton = windowElement.querySelector(".close");
        const minimizeButton = windowElement.querySelector(".minimize");
        const maximizeButton = windowElement.querySelector(".maximize");

        closeButton.addEventListener("click", () => closeWindow(id));
        minimizeButton.addEventListener("click", () => minimizeWindow(id));
        
        maximizeButton.addEventListener("click", () => {
            const currentWindow = openWindows[id].element;
            if(currentWindow.classList.contains('maximized')) {
                currentWindow.style.width = currentWindow.dataset.prevWidth || '550px';
                currentWindow.style.height = currentWindow.dataset.prevHeight || '400px';
                currentWindow.style.top = currentWindow.dataset.prevTop || `${Math.random() * 100 + 20}px`;
                currentWindow.style.left = currentWindow.dataset.prevLeft || `${Math.random() * 150 + 20}px`;
                currentWindow.classList.remove('maximized');
            } else {
                currentWindow.dataset.prevWidth = currentWindow.style.width;
                currentWindow.dataset.prevHeight = currentWindow.style.height;
                currentWindow.dataset.prevTop = currentWindow.style.top;
                currentWindow.dataset.prevLeft = currentWindow.style.left;
                currentWindow.style.width = 'calc(100% - 20px)';
                currentWindow.style.height = 'calc(100% - 20px)'; // Adjusted to be within #windows-container padding
                currentWindow.style.top = '0px';
                currentWindow.style.left = '0px';
                currentWindow.classList.add('maximized');
            }
        });

        windowElement.addEventListener('mousedown', () => setActiveWindow(windowElement));
    }

    function closeWindow(id) {
        if (openWindows[id]) {
            openWindows[id].element.remove();
            if (openWindows[id].taskbarIcon) openWindows[id].taskbarIcon.remove();
            delete openWindows[id];
        }
    }

    function minimizeWindow(id) {
        if (openWindows[id]) {
            openWindows[id].element.style.display = "none";
            openWindows[id].minimized = true;
            if (openWindows[id].taskbarIcon) openWindows[id].taskbarIcon.classList.remove('active');
        }
    }

    function restoreWindow(id) {
        if (openWindows[id] && openWindows[id].minimized) {
            openWindows[id].element.style.display = "flex";
            openWindows[id].minimized = false;
            bringToFront(openWindows[id].element);
        }
    }

    function createTaskbarIcon(id, title, windowElement) {
        const icon = document.createElement("button");
        icon.classList.add("taskbar-icon");
        icon.innerHTML = `<img src="images/icons/default_icon_small.png" alt="" class="taskbar-window-icon"> ${title}`;
        icon.dataset.windowId = id;
        icon.title = title;
        icon.addEventListener("click", () => {
            if (openWindows[id]) {
                if (openWindows[id].minimized || windowElement.style.display === 'none') {
                    restoreWindow(id);
                } else if (windowElement.classList.contains('active')) {
                    minimizeWindow(id);
                } else {
                    bringToFront(windowElement);
                }
            }
        });
        taskbarIconsContainer.appendChild(icon);
        if(openWindows[id]) openWindows[id].taskbarIcon = icon; 
    }

    function makeDraggable(titleBar, windowElement) {
        let offsetX, offsetY;
        let isDragging = false;

        titleBar.addEventListener("mousedown", (e) => {
            if (e.target.classList.contains('minimize') || e.target.classList.contains('maximize') || e.target.classList.contains('close')) {
                return; // Don't drag if clicking on buttons
            }
            isDragging = true;
            offsetX = e.clientX - windowElement.offsetLeft;
            offsetY = e.clientY - windowElement.offsetTop;
            titleBar.style.cursor = "grabbing";
            setActiveWindow(windowElement);
        });

        document.addEventListener("mousemove", (e) => {
            if (!isDragging) return;
            let newX = e.clientX - offsetX;
            let newY = e.clientY - offsetY;
            
            const parentRect = windowsContainer.getBoundingClientRect();
            const taskbarHeight = document.getElementById('taskbar').offsetHeight;

            newX = Math.max(0, Math.min(newX, parentRect.width - windowElement.offsetWidth));
            newY = Math.max(0, Math.min(newY, parentRect.height - windowElement.offsetHeight - taskbarHeight + 20)); // Adjusted for taskbar and padding

            windowElement.style.left = `${newX}px`;
            windowElement.style.top = `${newY}px`;
        });

        document.addEventListener("mouseup", () => {
            if(isDragging) {
                isDragging = false;
                titleBar.style.cursor = "move"; 
            }
        });
    }

    const resumeLinkHTML = `<div class="resume-download-link" style="margin-bottom:10px; padding-bottom:10px; border-bottom: 1px solid #808080;"><img src="images/icons/resume_icon.png" alt="Resume Icon" style="width:16px; height:16px; vertical-align:middle; margin-right:5px;"> Looking for my full resume? <a href="#" data-action="open-window-inline" data-window-id="resume-window" data-title="My Resume">Click here to view it!</a></div>`;

    document.querySelectorAll("[data-action='open-window'], [data-action='open-window-inline']").forEach(item => {
        item.addEventListener("click", (e) => {
            e.preventDefault(); // Prevent default link behavior if it's an anchor
            const windowId = item.dataset.windowId;
            const windowTitle = item.dataset.title;
            let content = `Loading content for ${windowTitle}...`;
            
            if (windowId === "about-window") {
                content = `
                    <h2 style="margin-top:0;">About Jason Clark</h2>
                    <img src="../user_portfolio_content/images/profile.jpg" alt="Jason Clark" style="width: 100px; height: auto; float: left; margin-right: 10px; border: 1px solid #808080;">
                    <p>Welcome! I'm Jason Clark, a multifaceted creative professional specializing in Development, Photography, Books, and Music.</p>
                    <p>Thank you for taking the time to check out my portfolio. I really hope you enjoy exploring it as much as I enjoyed building it. If you have any questions or comments, feel free to contact me using the contact section or shoot an email at <a href="mailto:jasonclarkagain@gmail.com">jasonclarkagain@gmail.com</a>.</p>
                    <div style="clear:both;"></div>
                    <h3>My Journey</h3>
                    <p>My journey into the creative and technical fields has been driven by a lifelong curiosity and a passion for building and expressing ideas. From early explorations in technology to honing my skills in photography, writing, and music production, I strive to bring a unique perspective and dedicated craftsmanship to every project.</p>
                `;
            } else if (windowId === "resume-window") {
                 content = `<h2 style="margin-top:0;">My Resume</h2><p style="margin-bottom:10px;">The following is my resume. You can also download it or view it in a separate page.</p><iframe src="../user_portfolio_content/pages/resume.html" style="width:100%; height: calc(100% - 70px); border:1px solid #808080;"></iframe>`;
            } else if (windowId === "contact-window") {
                content = `
                    <h2 style="margin-top:0;">Contact Me</h2>
                    <p>I'm always open to new opportunities and collaborations. You can reach me via my personal email, or fill out the form below!</p>
                    <p><strong>Email:</strong> <a href="mailto:jasonclarkagain@gmail.com">jasonclarkagain@gmail.com</a></p>
                    <form id="contact-form-os" action="https://formspree.io/f/jasonclarkagain@gmail.com" method="POST" style="margin-top:15px;">
                        <div style="margin-bottom:10px;"><label for="name-os" style="display:block; margin-bottom:3px;">*Your name:</label><input type="text" name="name" id="name-os" required style="width:95%; padding:5px; border:1px solid #808080;"></div>
                        <div style="margin-bottom:10px;"><label for="email-os" style="display:block; margin-bottom:3px;">*Email:</label><input type="email" name="_replyto" id="email-os" required style="width:95%; padding:5px; border:1px solid #808080;"></div>
                        <div style="margin-bottom:10px;"><label for="company-os" style="display:block; margin-bottom:3px;">Company (optional):</label><input type="text" name="company" id="company-os" style="width:95%; padding:5px; border:1px solid #808080;"></div>
                        <div style="margin-bottom:10px;"><label for="message-os" style="display:block; margin-bottom:3px;">*Message:</label><textarea name="message" id="message-os" rows="4" required style="width:95%; padding:5px; border:1px solid #808080;"></textarea></div>
                        <button type="submit" class="win95-button" style="padding:5px 15px;">Send Message</button>
                    </form>
                    <p style="margin-top:10px;"><small>* = required. All messages get forwarded straight to my personal email.</small></p>
                `;
            } else if (windowId === "experience-window") {
                content = `
                    <h2 style="margin-top:0;">Professional Experience</h2>
                    ${resumeLinkHTML}
                    <h4>Computer Consultant</h4>
                    <p><strong>Victoria Supply Company | Ramona, CA</strong> (May 2019 - Present)</p>
                    <ul style="margin-top:5px; padding-left:20px;">
                        <li>Network administrator/engineer responsible for maintaining and managing the organization's computer networks, encompassing hardware installation and configuration, performance monitoring, troubleshooting, security, user support, and network architecture design, backups, and updates.</li>
                        <li>Designed computer network to meet the needs of the organization.</li>
                        <li>Maintain computer network and resolve technical issues.</li>
                        <li>Created several custom systems to store and retrieve data.</li>
                        <li>Keep the computer network up to date with new technology.</li>
                        <li>Implemented and maintain network security measures.</li>
                    </ul>
                    <hr style="margin:10px 0;">
                    <h4>Quality Control & Laboratory Technician</h4>
                    <p><strong>Biofire Diagnostics | Salt Lake City, UT</strong> (January 2018 - May 2019)</p>
                    <ul style="margin-top:5px; padding-left:20px;">
                        <li>Quality control and laboratory specialist responsible for overseeing product testing, material analysis, and process validation, while managing data systems to ensure compliance with industry standards. Conduct laboratory experiments, analyze results, and maintain equipment to support quality assurance and operational efficiency.</li>
                        <li>Perform laboratory testing on raw materials and finished products to verify compliance with specifications, using tools such as spectrometers, calipers, and micromet
(Content truncated due to size limit. Use line ranges to read in chunks)