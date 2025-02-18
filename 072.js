
// Image Gallery with Upload, Preview, and Drag-and-Drop Reordering

document.addEventListener("DOMContentLoaded", function () {
    const fileInput = document.getElementById("file-input");
    const gallery = document.getElementById("gallery");

    fileInput.addEventListener("change", handleFileUpload);

    function handleFileUpload(event) {
        const files = event.target.files;
        for (let file of files) {
            if (file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    createImageElement(e.target.result);
                };
                reader.readAsDataURL(file);
            }
        }
    }

    function createImageElement(src) {
        const imgContainer = document.createElement("div");
        imgContainer.classList.add("image-container");
        imgContainer.setAttribute("draggable", true);

        const img = document.createElement("img");
        img.src = src;
        imgContainer.appendChild(img);

        const removeBtn = document.createElement("button");
        removeBtn.innerText = "Remove";
        removeBtn.classList.add("remove-btn");
        removeBtn.onclick = () => imgContainer.remove();
        imgContainer.appendChild(removeBtn);

        gallery.appendChild(imgContainer);
        addDragAndDropHandlers(imgContainer);
    }

    function addDragAndDropHandlers(imgContainer) {
        imgContainer.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("text/plain", imgContainer.outerHTML);
            setTimeout(() => imgContainer.classList.add("hidden"), 0);
        });

        imgContainer.addEventListener("dragover", (e) => e.preventDefault());

        imgContainer.addEventListener("drop", (e) => {
            e.preventDefault();
            const draggedHTML = e.dataTransfer.getData("text/plain");
            imgContainer.insertAdjacentHTML("beforebegin", draggedHTML);
            imgContainer.classList.remove("hidden");
            imgContainer.previousSibling.remove();
        });

        imgContainer.addEventListener("dragend", () => imgContainer.classList.remove("hidden"));
    }
});

document.body.innerHTML += `
    <input type="file" id="file-input" multiple accept="image/*">
    <div id="gallery" class="gallery"></div>
    <style>
        .gallery { display: flex; flex-wrap: wrap; gap: 10px; }
        .image-container { position: relative; width: 100px; height: 100px; }
        .image-container img { width: 100%; height: 100%; object-fit: cover; }
        .remove-btn { position: absolute; top: 5px; right: 5px; background: red; color: white; border: none; cursor: pointer; }
        .hidden { display: none; }
    </style>
`;
