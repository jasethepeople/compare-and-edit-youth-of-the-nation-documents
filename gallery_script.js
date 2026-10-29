// Gallery Page JavaScript (gallery_script.js)

document.addEventListener("DOMContentLoaded", function() {
    console.log("Jason Clark Portfolio - Gallery page loaded");

    // This script can be enhanced to dynamically load images if needed,
    // especially if there are many images or if they are fetched from a data source.
    // For now, we assume images will be listed directly in the HTML or
    // this script will be adapted for specific gallery needs (e.g., photography vs. books).

    // Example for Photography Gallery (if images are in a known path and named sequentially or listed in an array)
    const photoGalleryGrid = document.querySelector(".gallery-grid");
    const pageTitle = document.title;

    if (photoGalleryGrid && pageTitle.includes("Photography")) {
        // Path to the unzipped photos from 1.zip
        const photoBasePath = "../user_photos/1/"; // Relative to the HTML file in the build directory
        const photoFiles = [
            "92538753.jpg", "92538764.jpg", "92538767.jpg", "92626241.jpg", "92626306.jpg",
            "92632160.jpg", "92632173.jpg", "93213200.jpg", "94138869.jpg", "94138871.jpg",
            "94138896.jpg", "94138903.jpg", "94138924.jpg", "94253041.jpg", "94331228.jpg",
            "94331242.jpg", "94331244.jpg", "94951561.jpg", "94951588.jpg", "94951589.jpg",
            "94951739.jpg", "94951742.jpg", "94951743.jpg", "94955539.jpg", "94976634.jpg",
            "95190625.jpg", "95190705.jpg", "95316063.jpg", "95316071.jpg", "95316098.jpg",
            "95316174.jpg", "96447932.jpg", "96447946.jpg", "96447961.jpg", "96447968.jpg",
            "96458010.jpg", "96458067.jpg", "96458098.jpg", "96458116.jpg", "96487068.jpg",
            "96490751.jpg", "96564011.jpg", "96564033.jpg", "96564585.jpg", "96635065.jpg",
            "96635066.jpg", "96635075.jpg", "96635097.jpg", "96654656.jpg", "96781173.jpg",
            "96837112.jpg", "96837124.jpg", "96837128.jpg", "96876427.jpg", "96881688.jpg",
            "96881690.jpg", "96881693.jpg", "96881695.jpg", "96957060.jpg"
        ];

        // Select a subset of images or all, for example, the first 12 for a nice grid
        const imagesToDisplay = photoFiles.slice(0, 20); // Displaying 20 images for now

        imagesToDisplay.forEach(fileName => {
            const galleryItem = document.createElement("div");
            galleryItem.classList.add("gallery-item");

            const img = document.createElement("img");
            img.src = photoBasePath + fileName;
            img.alt = "Photography by Jason Clark"; // Generic alt text, can be improved
            
            galleryItem.appendChild(img);
            photoGalleryGrid.appendChild(galleryItem);
        });
    }
});

