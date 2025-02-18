
// Infinite Scrolling with API Fetch and Debounce

document.addEventListener("DOMContentLoaded", function () {
    const contentContainer = document.getElementById("content-container");
    let page = 1;
    let isLoading = false;

    // Fetch data from API
    async function fetchData() {
        if (isLoading) return;
        isLoading = true;
        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/posts?_limit=5&_page=${page}`);
            const data = await response.json();
            if (data.length > 0) {
                renderData(data);
                page++;
            } else {
                window.removeEventListener("scroll", debounceLoadMore);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            isLoading = false;
        }
    }

    // Render fetched data
    function renderData(posts) {
        posts.forEach(post => {
            const div = document.createElement("div");
            div.classList.add("post");
            div.innerHTML = `<h3>${post.title}</h3><p>${post.body}</p>`;
            contentContainer.appendChild(div);
        });
    }

    // Debounce function to optimize scrolling event
    function debounce(func, wait = 300) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // Check if the user has scrolled near the bottom
    function checkScroll() {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
            fetchData();
        }
    }

    const debounceLoadMore = debounce(checkScroll);
    window.addEventListener("scroll", debounceLoadMore);
    
    // Initial data load
    fetchData();
});

document.body.innerHTML += `
    <div id="content-container" style="padding: 20px; max-width: 600px; margin: auto;"></div>
    <style>
        .post { background: #f8f8f8; padding: 15px; margin: 10px 0; border-radius: 5px; }
    </style>
`;
