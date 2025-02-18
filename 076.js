
// Lazy Loading Images with Smooth Transitions

document.addEventListener("DOMContentLoaded", function () {
    const images = document.querySelectorAll("img.lazy-load");

    function lazyLoad() {
        images.forEach(img => {
            if (img.getBoundingClientRect().top < window.innerHeight && img.dataset.src) {
                img.src = img.dataset.src;
                img.classList.add("fade-in");
                img.removeAttribute("data-src");
            }
        });
    }

    // Event listener for scrolling to trigger lazy loading
    window.addEventListener("scroll", lazyLoad);
    window.addEventListener("resize", lazyLoad);
    lazyLoad(); // Initial check
});

document.body.innerHTML += `
    <div style="max-width: 600px; margin: auto;">
        <h2>Lazy Loaded Images</h2>
        <img class="lazy-load" data-src="https://via.placeholder.com/600x400" src="https://via.placeholder.com/10x10" alt="Image 1" width="100%">
        <img class="lazy-load" data-src="https://via.placeholder.com/600x400/ff7f7f" src="https://via.placeholder.com/10x10" alt="Image 2" width="100%">
        <img class="lazy-load" data-src="https://via.placeholder.com/600x400/77ff77" src="https://via.placeholder.com/10x10" alt="Image 3" width="100%">
        <img class="lazy-load" data-src="https://via.placeholder.com/600x400/7777ff" src="https://via.placeholder.com/10x10" alt="Image 4" width="100%">
    </div>
    <style>
        .lazy-load { opacity: 0; transition: opacity 1s; }
        .lazy-load.fade-in { opacity: 1; }
    </style>
`;
