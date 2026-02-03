/* ===== STORAGE ===== */
const USERS_KEY = "journal_users";
let currentUser = null;
let entries = [];
let selectedImages = [];


function getUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || {};
}

function setUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

/* ===== AUTH ===== */
function createUser() {
    const u = username.value.trim();
    const p = password.value;

    if (!u || !p) {
        alert("Please fill all fields");
        return;
    }

    const users = getUsers();
    if (users[u]) {
        alert("User already exists");
        return;
    }

    users[u] = { password: p, entries: [] };
    setUsers(users);
    alert("User created. Now login.");
}

function login() {
    const u = username.value.trim();
    const p = password.value;
    const users = getUsers();

    if (!users[u] || users[u].password !== p) {
        alert("Wrong username or password");
        return;
    }

    currentUser = u;
    entries = users[u].entries || [];

    document.getElementById("auth").style.display = "none";
    document.getElementById("editorApp").style.display = "flex";

    openEditor();
}

function logout() {
    document.getElementById("editorApp").style.display = "none";
    document.getElementById("auth").style.display = "grid";
    currentUser = null;
    
}

/* ===== EDITOR ===== */
function openEditor() {
    editor.innerHTML = "";
    location.value = "";
    weather.value = "";

    const now = new Date();
    dateLabel.textContent = now.toLocaleString();

    updateStats();
    editor.focus();
}

function formatText(cmd) {
    document.execCommand(cmd);
}

editor.addEventListener("input", updateStats);

function updateStats() {
    const text = editor.innerText;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    stats.textContent = `Words ${words} · Characters ${text.length}`;
}

function saveEntry() {
    if (!editor.innerText.trim() && selectedImages.length === 0) {
        alert("Write something or add an image first");
        return;
    }

    const entry = {
        content: editor.innerHTML,
        images: selectedImages,
        date: new Date().toLocaleString(),
        location: location.value,
        weather: weather.value
    };

    entries.push(entry);

    const users = getUsers();
    users[currentUser].entries = entries;
    setUsers(users);

    // Reset editor
    editor.innerHTML = "";
    selectedImages = [];
    renderImages();
    updateStats();

    alert("Entry saved!");
}

/* ===== IMAGE UPLOAD =====Handle multiple image selection */
imageInput.addEventListener("change", () => {
    const files = Array.from(imageInput.files);

    files.forEach(file => {
        const reader = new FileReader();

        reader.onload = e => {
            selectedImages.push(e.target.result);
            renderImages();
        };

        reader.readAsDataURL(file);
    });

    imageInput.value = "";
});
function renderImages() {
    imagePreview.innerHTML = "";

    selectedImages.forEach((src, index) => {
        const img = document.createElement("img");
        img.src = src;
        img.title = "Click to remove";

        img.onclick = () => {
            selectedImages.splice(index, 1);
            renderImages();
        };

        imagePreview.appendChild(img);
    });
}
function openEditor() {
    editor.innerHTML = "";
    location.value = "";
    weather.value = "";

    selectedImages = [];
    renderImages();

    dateLabel.textContent = new Date().toLocaleString();
    updateStats();
    editor.focus();
}


/* ESC to exit editor */
document.addEventListener("keydown", e => {
    if (e.key === "Escape" && editorApp.style.display === "flex") {
        logout();
    }
});
