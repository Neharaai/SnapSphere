// ============================================================
// SAMPLE DATA — shown when backend is unavailable (fallback only)
// ============================================================
const mediaData = [
    { id: 1,  title: "Mountain Lake Serenity",   image: "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=600",   user: "Alex Chen",        date: "March 15, 2026",   description: "A tranquil morning at Lake Moraine in the Canadian Rockies.",                                 category: "Nature",       location: "Moraine Lake, Canada",          resolution: "5472 × 3648", tags: ["lake","mountains","canada"] },
    { id: 2,  title: "Urban Geometry",            image: "https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg?auto=compress&cs=tinysrgb&w=600",   user: "Sarah Williams",   date: "Feb 23, 2026",     description: "The striking architecture of The Shard creates geometric patterns against the sky.",           category: "Architecture", location: "London, UK",                    resolution: "4000 × 6000", tags: ["london","architecture","shard"] },
    { id: 3,  title: "Autumn Symphony",           image: "https://images.pexels.com/photos/33109/fall-autumn-red-season.jpg?auto=compress&cs=tinysrgb&w=600",  user: "Rachel Green",     date: "March 12, 2026",   description: "Maple and birch trees explode in shades of orange, red, and gold.",                            category: "Nature",       location: "White Mountains, USA",          resolution: "7360 × 4912", tags: ["autumn","forest","usa"] },
    { id: 4,  title: "Cherry Blossom Trees",      image: "https://images.pexels.com/photos/1440476/pexels-photo-1440476.jpeg?auto=compress&cs=tinysrgb&w=600", user: "Yuki Tanaka",      date: "March 4, 2026",    description: "Cherry blossom trees bloom in soft pink colors during spring.",                                category: "Nature",       location: "Kyoto, Japan",                  resolution: "6000 × 4000", tags: ["japan","blossom","spring"] },
    { id: 5,  title: "Tropical Paradise Cove",    image: "https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=600", user: "Mike Johnson",     date: "March 5, 2026",    description: "Hidden away in the Phi Phi Islands, this secluded cove offers the perfect escape.",            category: "Travel",       location: "Phi Phi Islands, Thailand",     resolution: "6000 × 4000", tags: ["beach","thailand","sea"] },
    { id: 6,  title: "Statue of Liberty",         image: "https://images.pexels.com/photos/290386/pexels-photo-290386.jpeg?auto=compress&cs=tinysrgb&w=600",   user: "Jessica Lee",      date: "Feb 22, 2026",     description: "A colossal copper monument on Liberty Island symbolising freedom.",                            category: "Travel",       location: "New York, USA",                 resolution: "7952 × 5304", tags: ["newyork","landmark","usa"] },
    { id: 7,  title: "Mountain Trail Adventure",  image: "https://images.pexels.com/photos/414171/pexels-photo-414171.jpeg?auto=compress&cs=tinysrgb&w=600",   user: "Adventure Alex",   date: "March 2, 2026",    description: "The Highline Trail offers stunning views of alpine meadows.",                                  category: "Travel",       location: "Glacier National Park, USA",    resolution: "7360 × 4912", tags: ["hiking","mountains","usa"] },
    { id: 8,  title: "Ancient Greek Temple",      image: "https://images.pexels.com/photos/951531/pexels-photo-951531.jpeg?auto=compress&cs=tinysrgb&w=600",   user: "Luca Ferrari",     date: "Feb 28, 2026",     description: "Ancient Doric columns stand against a clear blue sky.",                                        category: "Architecture", location: "Athens, Greece",                resolution: "5472 × 3648", tags: ["greece","ancient","architecture"] },
    { id: 9,  title: "Majestic Waterfall",        image: "https://images.pexels.com/photos/210186/pexels-photo-210186.jpeg?auto=compress&cs=tinysrgb&w=600",   user: "David Miller",     date: "March 13, 2026",   description: "Skógafoss thunders down 60 metres with rainbows appearing in the mist.",                      category: "Nature",       location: "Skógar, Iceland",               resolution: "6000 × 4000", tags: ["iceland","waterfall","nature"] },
    { id: 10, title: "Winter Wonderland",         image: "https://images.pexels.com/photos/688660/pexels-photo-688660.jpeg?auto=compress&cs=tinysrgb&w=600",   user: "Winter Lover",     date: "March 8, 2026",    description: "Fresh powder blankets the trees after a major snowstorm in the Swiss Alps.",                   category: "Nature",       location: "Zermatt, Switzerland",          resolution: "5472 × 3648", tags: ["snow","alps","winter"] },
    { id: 11, title: "Tropical Island",           image: "https://images.pexels.com/photos/753626/pexels-photo-753626.jpeg?auto=compress&cs=tinysrgb&w=600",   user: "Island Explorer",  date: "Feb 25, 2026",     description: "Crystal-clear waters and sun-kissed shores of Bora Bora.",                                     category: "Travel",       location: "Bora Bora, French Polynesia",   resolution: "6000 × 4000", tags: ["borabora","paradise","tropical"] },
    { id: 12, title: "Manhattan Skyline",         image: "https://images.pexels.com/photos/290595/pexels-photo-290595.jpeg?auto=compress&cs=tinysrgb&w=600",   user: "Amanda Lee",       date: "Feb 18, 2026",     description: "The world-famous skyline of glass towers reflected in the water.",                             category: "Photography",  location: "New York, USA",                 resolution: "5184 × 3456", tags: ["newyork","skyline","cityscape"] },
    { id: 13, title: "Enchanted Forest Trail",    image: "https://images.pexels.com/photos/38136/pexels-photo-38136.jpeg?auto=compress&cs=tinysrgb&w=600",     user: "Emma Davis",       date: "March 14, 2026",   description: "Morning light filters through ancient maple trees draped in moss.",                            category: "Nature",       location: "Olympic National Park, USA",    resolution: "5184 × 3456", tags: ["forest","usa","nature"] },
    { id: 14, title: "Venice Canal Boats",        image: "https://images.pexels.com/photos/208701/pexels-photo-208701.jpeg?auto=compress&cs=tinysrgb&w=600",   user: "Marco Rossi",      date: "March 1, 2026",    description: "Colourful gondolas float along Venice's historic canals.",                                     category: "Travel",       location: "Venice, Italy",                 resolution: "5472 × 3648", tags: ["venice","italy","gondola"] },
    { id: 15, title: "Aurora Borealis",           image: "https://images.pexels.com/photos/1938348/pexels-photo-1938348.jpeg?auto=compress&cs=tinysrgb&w=600", user: "Tom Wilson",       date: "Feb 21, 2026",     description: "The Northern Lights dance across the Arctic sky in green and purple.",                         category: "Photography",  location: "Tromsø, Norway",                resolution: "7952 × 5304", tags: ["aurora","norway","northernlights"] },
    { id: 16, title: "Snow Covered Mountain",     image: "https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg?auto=compress&cs=tinysrgb&w=600",   user: "Emily Stone",      date: "March 10, 2026",   description: "A breathtaking snow-covered mountain peak rises above the clouds.",                            category: "Nature",       location: "Alps, Switzerland",             resolution: "6000 × 4000", tags: ["mountains","snow","alps"] },
    { id: 17, title: "Coffee Shop Vibes",         image: "https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=600",   user: "Coffee Lover",     date: "Feb 19, 2026",     description: "Morning light streams through the windows as steam rises from freshly brewed coffee.",         category: "Street",       location: "Seattle, USA",                  resolution: "5472 × 3648", tags: ["coffee","seattle","cafe"] },
    { id: 18, title: "Bali Rice Terraces",        image: "https://images.pexels.com/photos/247599/pexels-photo-247599.jpeg?auto=compress&cs=tinysrgb&w=600",   user: "Dewi Putra",       date: "Feb 23, 2026",     description: "Lush green rice terraces cascade down the hillside in Bali.",                                  category: "Travel",       location: "Bali, Indonesia",               resolution: "5184 × 3456", tags: ["bali","rice","indonesia"] },
    { id: 19, title: "Dramatic Storm Clouds",     image: "https://images.pexels.com/photos/1114690/pexels-photo-1114690.jpeg?auto=compress&cs=tinysrgb&w=600", user: "Samuel Garcia",    date: "March 6, 2026",    description: "Storm clouds gather over a vast prairie creating a powerful atmospheric scene.",               category: "Nature",       location: "Kansas, USA",                   resolution: "6000 × 4000", tags: ["storm","weather","usa"] },
    { id: 20, title: "Aurora Night Sky",          image: "https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&cs=tinysrgb&w=600", user: "Hannah Brown",     date: "Feb 15, 2026",     description: "Ancient rice terraces form a stunning series of curved green steps.",                          category: "Photography",  location: "Bali, Indonesia",               resolution: "6000 × 4000", tags: ["bali","aerial","photography"] },
    { id: 21, title: "Tokyo Night Streets",       image: "https://images.pexels.com/photos/315191/pexels-photo-315191.jpeg?auto=compress&cs=tinysrgb&w=600",   user: "Kenji Sato",       date: "Feb 27, 2026",     description: "Bright neon lights illuminate the lively streets of Tokyo at night.",                         category: "Street",       location: "Tokyo, Japan",                  resolution: "5184 × 3456", tags: ["tokyo","night","japan"] },
    { id: 22, title: "The Golden Wine Village",   image: "https://images.pexels.com/photos/842711/pexels-photo-842711.jpeg?auto=compress&cs=tinysrgb&w=600",   user: "Alex Carter",      date: "Feb 16, 2026",     description: "One of Germany's most beautiful municipalities bathed in golden light.",                       category: "Travel",       location: "Durbach, Germany",              resolution: "5472 × 3648", tags: ["germany","village","travel"] },
    { id: 23, title: "Macro Flower Shot",         image: "https://images.pexels.com/photos/36753/flower-purple-lical-blosso.jpg?auto=compress&cs=tinysrgb&w=600", user: "Lily Adams",    date: "Feb 13, 2026",     description: "A macro photograph capturing delicate flower petals in vivid colour.",                         category: "Photography",  location: "Amsterdam, Netherlands",        resolution: "6000 × 4000", tags: ["macro","flower","purple"] },
    { id: 24, title: "Dubai Skyline Sunset",      image: "https://images.pexels.com/photos/3787839/pexels-photo-3787839.jpeg?auto=compress&cs=tinysrgb&w=600", user: "Ahmed Hassan",     date: "Feb 26, 2026",     description: "Modern skyscrapers glow in golden light as the sun sets over the city.",                       category: "Architecture", location: "Dubai, UAE",                    resolution: "6000 × 4000", tags: ["dubai","sunset","skyline"] },
    { id: 25, title: "Sydney Harbour Bridge",     image: "https://images.pexels.com/photos/995764/pexels-photo-995764.jpeg?auto=compress&cs=tinysrgb&w=600",   user: "Ryan Walker",      date: "Feb 20, 2026",     description: "The famous Sydney Harbour Bridge stretches across sparkling blue waters.",                     category: "Travel",       location: "Sydney, Australia",             resolution: "5472 × 3648", tags: ["sydney","australia","bridge"] },
    { id: 26, title: "Golden Desert Dunes",       image: "https://images.pexels.com/photos/1001435/pexels-photo-1001435.jpeg?auto=compress&cs=tinysrgb&w=600", user: "Ahmed Karim",      date: "March 8, 2026",    description: "Rolling sand dunes glow golden under the warm desert sun.",                                    category: "Nature",       location: "Sahara Desert, Morocco",        resolution: "6000 × 4000", tags: ["desert","sahara","dunes"] },
    { id: 27, title: "Great Wall Landscape",      image: "https://images.pexels.com/photos/2412603/pexels-photo-2412603.jpeg?auto=compress&cs=tinysrgb&w=600", user: "Li Wei",           date: "Feb 25, 2026",     description: "The historic Great Wall stretches across green mountains.",                                    category: "Architecture", location: "Beijing, China",                resolution: "5472 × 3648", tags: ["china","greatwall","history"] },
    { id: 28, title: "Night City Long Exposure",  image: "https://images.pexels.com/photos/2363/france-landmark-lights-night.jpg?auto=compress&cs=tinysrgb&w=600", user: "Victor Lane",  date: "Feb 12, 2026",     description: "Long exposure captures colourful light trails across city streets.",                           category: "Photography",  location: "Paris, France",                 resolution: "5472 × 3648", tags: ["paris","longexposure","night"] },
    { id: 29, title: "Arc de Triomphe",           image: "https://images.pexels.com/photos/1796722/pexels-photo-1796722.jpeg?auto=compress&cs=tinysrgb&w=600", user: "Grace Wang",       date: "Feb 27, 2026",     description: "A monumental Neoclassical arc honouring those who fought for France.",                         category: "Architecture", location: "Paris, France",                 resolution: "5472 × 3648", tags: ["paris","france","monument"] },
    { id: 30, title: "Swiss Alpine Village",      image: "https://images.pexels.com/photos/210243/pexels-photo-210243.jpeg?auto=compress&cs=tinysrgb&w=600",   user: "Lucas Meyer",      date: "Feb 21, 2026",     description: "A charming alpine village surrounded by snow-capped mountains.",                               category: "Travel",       location: "Zermatt, Switzerland",          resolution: "6000 × 4000", tags: ["switzerland","village","alps"] },
    { id: 31, title: "Vintage Camera",            image: "https://images.pexels.com/photos/821738/pexels-photo-821738.jpeg?auto=compress&cs=tinysrgb&w=600",   user: "Robert Chen",      date: "Feb 16, 2026",     description: "A beautiful vintage camera sits on an old wooden desk.",                                       category: "Photography",  location: "Paris, France",                 resolution: "5472 × 3648", tags: ["camera","vintage","photography"] }
];

// ============================================================
// API CONFIG
// ============================================================

const API_BASE_URL = 'https://snapsphere-api-gng2afcpftawdqcr.francecentral-01.azurewebsites.net/api';

let authToken   = localStorage.getItem('snapsphere_token') || null;
let currentUser = JSON.parse(localStorage.getItem('snapsphere_user')) || null;

// ============================================================
// API HELPER
// ============================================================
async function apiRequest(endpoint, options = {}) {
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    if (authToken) headers['Authorization'] = `Bearer ${authToken}`;
    const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
    if (!response.ok) {
        const err = await response.json().catch(() => ({ error: response.statusText }));
        throw new Error(err.error || 'Request failed');
    }
    return response.json();
}

// ============================================================
// LOAD & DISPLAY MEDIA
// ============================================================
async function loadAllMedia() {
    try {
        const media = await apiRequest('/media');
        const allMedia = [...media, ...mediaData];
        displayMediaGrid(allMedia);
    } catch {
        displayMediaGrid(mediaData);
    }
}

function formatFileSize(bytes) {
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function displayMediaGrid(data) {
    const grid = document.getElementById('mediaGrid');
    grid.innerHTML = '';

    if (data.length === 0) {
        grid.innerHTML = `<div class="no-media">
            <i class="fas fa-camera-retro"></i>
            <h3>Your sphere is empty</h3>
            <p>Upload your first snapshot!</p>
        </div>`;
        return;
    }

    data.forEach(media => {
        const card = document.createElement('div');
        card.className = 'media-card';
        card.onclick = () => openMediaDetails(media.media_id || media.id);

        const title     = media.title || 'Untitled';
        const username  = media.username || media.user || 'Unknown';
        let imagePath   = media.image_path || media.image || '';

        // Fix relative paths from old local uploads
        if (imagePath && !imagePath.startsWith('http')) {
            imagePath = `http://localhost:5001${imagePath}`;
        }

        const uploadDate = media.upload_date || media.date || new Date().toLocaleDateString();
        const mediaId    = media.media_id || media.id;
        const tagsArr    = media.tags || [];
        const isUserUpload = currentUser && (
            (media.user_id && currentUser.id && media.user_id.toString() === currentUser.id.toString()) ||
            (media.user === currentUser.name)
        );

        card.innerHTML = `
            <img src="${imagePath}" alt="${title}" loading="lazy"
                 onerror="this.src='https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=600'">
            ${isUserUpload ? '<span class="uploaded-badge">Mine</span>' : ''}
            ${isUserUpload ? `<button class="delete-btn" onclick="deleteMedia('${mediaId}', event)"><i class="fas fa-trash"></i></button>` : ''}
            <div class="media-info">
                <div class="media-title">${title}</div>
                <div class="media-user">${username}</div>
                <div class="media-date">${new Date(uploadDate).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' })}</div>
                ${tagsArr.length ? `<div class="media-tags">${tagsArr.slice(0,3).map(t=>`<span class="tag">#${t}</span>`).join('')}</div>` : ''}
            </div>
        `;
        grid.appendChild(card);
    });
}

// ============================================================
// DELETE
// ============================================================
async function deleteMedia(id, event) {
    event.stopPropagation();
    if (!currentUser) { alert('Please login first'); return; }
    if (!confirm('Permanently delete this image?')) return;
    try {
        await apiRequest(`/media/${id}`, { method: 'DELETE' });
        alert('Deleted successfully!');
        loadAllMedia();
    } catch (error) {
        alert('Failed to delete: ' + error.message);
    }
}

// ============================================================
// AUTH
// ============================================================
function switchTab(tab) {
    document.getElementById('loginForm').classList.toggle('active', tab === 'login');
    document.getElementById('signupForm').classList.toggle('active', tab === 'signup');
    document.querySelectorAll('.tab-btn').forEach((b, i) =>
        b.classList.toggle('active', (i === 0) === (tab === 'login'))
    );
}

function showLoginModal() {
    document.getElementById('loginModal').style.display = 'flex';
    document.getElementById('userMenu').classList.remove('show');
    switchTab('login');
}

async function login() {
    const email    = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    if (!email || !password) { alert('Please fill in all fields'); return; }
    try {
        const data = await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        setLoggedIn(data);
        document.getElementById('loginModal').style.display = 'none';
        document.getElementById('loginEmail').value = '';
        document.getElementById('loginPassword').value = '';
        loadAllMedia();
    } catch (error) {
        alert(error.message);
    }
}

async function signup() {
    const name     = document.getElementById('signupName').value;
    const email    = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirm  = document.getElementById('signupConfirm').value;
    const terms    = document.getElementById('termsCheck').checked;

    if (!name || !email || !password || !confirm) { alert('Please fill in all fields'); return; }
    if (password !== confirm) { alert('Passwords do not match'); return; }
    if (password.length < 6) { alert('Password must be at least 6 characters'); return; }
    if (!terms) { alert('Please accept the Terms and Conditions'); return; }

    try {
        const data = await apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ username: name, email, password })
        });
        setLoggedIn(data);
        document.getElementById('loginModal').style.display = 'none';
        ['signupName','signupEmail','signupPassword','signupConfirm'].forEach(id => {
            document.getElementById(id).value = '';
        });
        document.getElementById('termsCheck').checked = false;
        loadAllMedia();
        alert('Account created! Welcome to SnapSphere!');
    } catch (error) {
        alert(error.message);
    }
}

function setLoggedIn(data) {
    authToken   = data.token;
    currentUser = data.user;
    localStorage.setItem('snapsphere_token', authToken);
    localStorage.setItem('snapsphere_user', JSON.stringify(currentUser));
    document.getElementById('profileName').textContent = currentUser.username || currentUser.name;
    const authMenuItem = document.getElementById('authMenuItem');
    if (authMenuItem) {
        authMenuItem.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
        authMenuItem.onclick = logout;
    }
}

function logout() {
    authToken   = null;
    currentUser = null;
    localStorage.removeItem('snapsphere_token');
    localStorage.removeItem('snapsphere_user');
    document.getElementById('profileName').textContent = 'Guest';
    const authMenuItem = document.getElementById('authMenuItem');
    if (authMenuItem) {
        authMenuItem.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login / Sign Up';
        authMenuItem.onclick = showLoginModal;
    }
    document.getElementById('userMenu').classList.remove('show');
    loadAllMedia();
}

// ============================================================
// UPLOAD — with rich metadata fields
// ============================================================
function openUploadPage() {
    if (!currentUser) { alert('Please login first to upload images'); return; }
    document.querySelector('.media-grid').style.display   = 'none';
    document.querySelector('.categories').style.display   = 'none';
    document.querySelector('.hero').style.display         = 'none';
    document.getElementById('uploadPage').style.display   = 'block';
}

async function publishMedia() {
    const title        = document.getElementById('mediaTitle').value.trim();
    const location     = document.getElementById('mediaLocation').value.trim();
    const desc         = document.getElementById('mediaDesc').value.trim();
    const cat          = document.getElementById('mediaCategory').value;
    const tags         = document.getElementById('mediaTags').value.trim();
    const cameraModel  = document.getElementById('mediaCameraModel').value.trim();
    const focalLength  = document.getElementById('mediaFocalLength').value.trim();
    const aperture     = document.getElementById('mediaAperture').value.trim();
    const iso          = document.getElementById('mediaISO').value.trim();
    const shutterSpeed = document.getElementById('mediaShutterSpeed').value.trim();
    const dateTaken    = document.getElementById('mediaDateTaken').value;
    const visibility   = document.getElementById('mediaVisibility').value;
    const fileInput    = document.getElementById('fileInput');

    if (!title || !location || !desc) { alert('Please fill in Title, Location and Description'); return; }
    if (!fileInput.files || fileInput.files.length === 0) { alert('Please select an image file'); return; }

    const file = fileInput.files[0];
    if (!file.type.startsWith('image/')) { alert('Please select an image file'); return; }
    if (file.size > 10 * 1024 * 1024) { alert('File too large. Maximum 10 MB.'); return; }

    // Detect image dimensions before uploading
    const img = new Image();
    img.onload = async function () {
        const resolution  = `${this.width} × ${this.height}`;
        const imageWidth  = this.width;
        const imageHeight = this.height;

        const formData = new FormData();
        formData.append('title',          title);
        formData.append('location',       location);
        formData.append('description',    desc);
        formData.append('category',       cat);
        formData.append('tags',           tags);
        formData.append('resolution',     resolution);
        formData.append('image_width',    imageWidth);
        formData.append('image_height',   imageHeight);
        formData.append('camera_model',   cameraModel);
        formData.append('focal_length',   focalLength);
        formData.append('aperture',       aperture);
        formData.append('iso',            iso);
        formData.append('shutter_speed',  shutterSpeed);
        formData.append('visibility',     visibility);
        if (dateTaken) formData.append('date_taken', dateTaken);
        formData.append('image', file);

        const token = localStorage.getItem('snapsphere_token');
        try {
            const response = await fetch(`${API_BASE_URL}/media`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });
            if (!response.ok) {
                const err = await response.json().catch(() => ({}));
                throw new Error(err.error || response.statusText);
            }
            alert('Uploaded successfully!');
            // Clear form
            ['mediaTitle','mediaLocation','mediaDesc','mediaTags',
             'mediaCameraModel','mediaFocalLength','mediaAperture',
             'mediaISO','mediaShutterSpeed','mediaDateTaken'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.value = '';
            });
            document.getElementById('fileInput').value = '';
            document.getElementById('dropArea').querySelector('p').innerHTML =
                'or <span class="browse-link" onclick="document.getElementById(\'fileInput\').click()">browse</span>';
            goHome();
        } catch (error) {
            alert('Upload failed: ' + error.message);
        }
    };
    img.onerror = () => alert('Could not read image file. Please try another.');
    img.src = URL.createObjectURL(file);
}

// ============================================================
// OPEN MEDIA DETAILS MODAL
// ============================================================
async function openMediaDetails(id) {
    try {
        const media = await apiRequest(`/media/${id}`);
        renderModal(media, true);
    } catch {
        // Fallback for sample data
        const media = mediaData.find(m => m.id == id);
        if (media) renderModal(media, false);
    }
}

function renderModal(media, fromDB) {
    const modal   = document.getElementById('mediaModal');
    const content = document.getElementById('mediaModalContent');

    const isOwner = currentUser && fromDB && media.user_id &&
                    media.user_id.toString() === currentUser.id.toString();

    let imagePath = media.image_path || media.image || '';
    if (imagePath && !imagePath.startsWith('http')) imagePath = `http://localhost:5001${imagePath}`;

    const uploadDate = new Date(media.upload_date || media.date).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'long', year: 'numeric'
    });

    const tagsArr    = media.tags || [];
    const tagsHTML   = tagsArr.length
        ? `<div class="modal-tags">${tagsArr.map(t => `<span class="tag">#${t}</span>`).join('')}</div>` : '';

    // Camera settings row — only show fields that exist
    const camParts = [];
    if (media.camera_model)  camParts.push(`<span><i class="fas fa-camera"></i> ${media.camera_model}</span>`);
    if (media.focal_length)  camParts.push(`<span>${media.focal_length}</span>`);
    if (media.aperture)      camParts.push(`<span>${media.aperture}</span>`);
    if (media.iso)           camParts.push(`<span>ISO ${media.iso}</span>`);
    if (media.shutter_speed) camParts.push(`<span>${media.shutter_speed}</span>`);
    const camHTML = camParts.length
        ? `<div class="modal-camera">${camParts.join(' · ')}</div>` : '';

    const fileSizeStr = media.file_size ? ` · ${formatFileSize(media.file_size)}` : '';
    const dateTakenStr = media.date_taken
        ? `<div class="meta-item"><i class="fas fa-calendar-alt"></i> Taken: ${new Date(media.date_taken).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' })}</div>` : '';
    const downloadCount = media.downloads != null ? media.downloads : '';

    content.innerHTML = `
        <button class="modal-close" onclick="document.getElementById('mediaModal').classList.remove('show')">✕</button>
        <img src="${imagePath}" class="modal-media"
             onerror="this.src='https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=600'">
        <div class="modal-details">
            <h2>${media.title}</h2>
            <div class="modal-user">
                <i class="fas fa-user-circle"></i>
                ${media.username || media.user || 'Unknown'} &bull; ${uploadDate}
            </div>
            <div class="modal-meta-row">
                ${media.resolution ? `<div class="meta-item"><i class="fas fa-expand-arrows-alt"></i> ${media.resolution}${fileSizeStr}</div>` : ''}
                ${media.location   ? `<div class="meta-item"><i class="fas fa-map-marker-alt"></i> ${media.location}</div>` : ''}
                <div class="meta-item"><i class="fas fa-tag"></i> ${media.category || media.category}</div>
                ${dateTakenStr}
            </div>
            ${camHTML}
            <p class="modal-description">${media.description}</p>
            ${tagsHTML}
            <div class="modal-stats">
                <span><i class="fas fa-eye"></i> ${media.views ?? 0} views</span>
                <span><i class="fas fa-heart"></i> <span id="likeCount">${media.likes ?? 0}</span> likes</span>
                ${downloadCount !== '' ? `<span><i class="fas fa-download"></i> ${downloadCount} downloads</span>` : ''}
                ${media.visibility === 'private' ? '<span><i class="fas fa-lock"></i> Private</span>' : ''}
            </div>
            <div class="modal-actions">
                <button class="action-btn like-btn" onclick="likeMedia('${media.media_id || media.id}')">
                    <i class="fas fa-heart"></i> Like
                </button>
                <button class="action-btn download-btn" onclick="downloadMedia('${media.media_id || media.id}', '${imagePath}')">
                    <i class="fas fa-download"></i> Download
                </button>
                ${isOwner ? `
                    <button class="action-btn edit-btn" onclick="openEditModal('${media.media_id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="action-btn delete-btn-modal" onclick="deleteMedia('${media.media_id}', event); document.getElementById('mediaModal').classList.remove('show')">
                        <i class="fas fa-trash"></i> Delete
                    </button>` : ''}
            </div>
        </div>
    `;
    modal.classList.add('show');
}

// ============================================================
// LIKE & DOWNLOAD
// ============================================================
async function likeMedia(id) {
    if (!currentUser) { alert('Please login to like images'); return; }
    try {
        const result = await apiRequest(`/media/${id}/like`, { method: 'POST' });
        const el = document.getElementById('likeCount');
        if (el) el.textContent = result.likes;
    } catch (error) {
        alert('Could not like: ' + error.message);
    }
}

async function downloadMedia(id, imageUrl) {
    try {
        // Increment download counter
        await apiRequest(`/media/${id}/download`, { method: 'POST' });
    } catch { /* non-critical */ }
    // Trigger browser download
    const a = document.createElement('a');
    a.href     = imageUrl;
    a.download = `snapsphere-${id}.jpg`;
    a.target   = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// ============================================================
// EDIT MODAL
// ============================================================
async function openEditModal(mediaId) {
    document.getElementById('mediaModal').classList.remove('show');
    try {
        const media = await apiRequest(`/media/${mediaId}`);
        // Populate upload form with existing values
        openUploadPage();
        document.getElementById('mediaTitle').value       = media.title || '';
        document.getElementById('mediaLocation').value    = media.location || '';
        document.getElementById('mediaDesc').value        = media.description || '';
        document.getElementById('mediaCategory').value    = media.category || 'Photography';
        document.getElementById('mediaTags').value        = (media.tags || []).join(', ');
        document.getElementById('mediaCameraModel').value = media.camera_model || '';
        document.getElementById('mediaFocalLength').value = media.focal_length || '';
        document.getElementById('mediaAperture').value    = media.aperture || '';
        document.getElementById('mediaISO').value         = media.iso || '';
        document.getElementById('mediaShutterSpeed').value= media.shutter_speed || '';
        document.getElementById('mediaVisibility').value  = media.visibility || 'public';
        if (media.date_taken) {
            document.getElementById('mediaDateTaken').value = media.date_taken.split('T')[0];
        }

        // Change publish button to save changes
        const publishBtn = document.querySelector('.publish-btn');
        publishBtn.textContent = 'Save Changes';
        publishBtn.onclick = async function () {
            const token = localStorage.getItem('snapsphere_token');
            const updatedFields = {
                title:        document.getElementById('mediaTitle').value,
                location:     document.getElementById('mediaLocation').value,
                description:  document.getElementById('mediaDesc').value,
                category:     document.getElementById('mediaCategory').value,
                tags:         document.getElementById('mediaTags').value,
                cameraModel:  document.getElementById('mediaCameraModel').value,
                focalLength:  document.getElementById('mediaFocalLength').value,
                aperture:     document.getElementById('mediaAperture').value,
                iso:          document.getElementById('mediaISO').value,
                shutterSpeed: document.getElementById('mediaShutterSpeed').value,
                visibility:   document.getElementById('mediaVisibility').value,
                dateTaken:    document.getElementById('mediaDateTaken').value
            };
            try {
                await fetch(`${API_BASE_URL}/media/${mediaId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify(updatedFields)
                });
                alert('Changes saved!');
                goHome();
                // Restore button
                publishBtn.textContent = 'Publish';
                publishBtn.onclick = publishMedia;
            } catch (err) {
                alert('Failed to save: ' + err.message);
            }
        };
    } catch (err) {
        alert('Could not load media for editing: ' + err.message);
    }
}

// ============================================================
// NAVIGATION & FILTERING
// ============================================================
function goHome() {
    document.querySelector('.media-grid').style.display = 'grid';
    document.querySelector('.categories').style.display = 'flex';
    document.querySelector('.hero').style.display       = 'block';
    document.getElementById('uploadPage').style.display = 'none';
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.cat === 'all');
    });
    loadAllMedia();
}

async function filterCategory(cat) {
    document.querySelectorAll('.category-btn').forEach(btn =>
        btn.classList.toggle('active', btn.dataset.cat === cat)
    );
    if (cat === 'all') {
        loadAllMedia();
    } else if (cat === 'mine') {
        if (!currentUser) { alert('Please login first'); return; }
        try {
            const userMedia = await apiRequest(`/user/${currentUser.id}/media`);
            displayMediaGrid(userMedia);
        } catch { displayMediaGrid([]); }
    } else {
        try {
            const uploaded = await apiRequest(`/category/${cat}`);
            const sample   = mediaData.filter(m => m.category === cat);
            displayMediaGrid([...uploaded, ...sample]);
        } catch {
            displayMediaGrid(mediaData.filter(m => m.category === cat));
        }
    }
}

async function showMyMedia() {
    if (!currentUser) { alert('Please login first'); return; }
    try {
        const media = await apiRequest(`/user/${currentUser.id}/media`);
        displayMediaGrid(media);
    } catch { alert('Failed to load your media'); }
    document.getElementById('userMenu').classList.remove('show');
}

function toggleUserMenu() {
    document.getElementById('userMenu').classList.toggle('show');
}

// ============================================================
// SEARCH
// ============================================================
document.getElementById('searchInput')?.addEventListener('input', async function (e) {
    const term = e.target.value.toLowerCase().trim();
    if (term.length > 2) {
        try {
            const results = await apiRequest(`/search/${encodeURIComponent(term)}`);
            displayMediaGrid(results);
        } catch {
            displayMediaGrid(mediaData.filter(m =>
                m.title.toLowerCase().includes(term) ||
                (m.tags || []).some(t => t.includes(term)) ||
                (m.location || '').toLowerCase().includes(term)
            ));
        }
    } else if (term.length === 0) {
        loadAllMedia();
    }
});

// ============================================================
// DRAG & DROP
// ============================================================
const dropArea = document.getElementById('dropArea');
if (dropArea) {
    dropArea.addEventListener('dragover', e => { e.preventDefault(); dropArea.style.borderColor = '#00f2fe'; });
    dropArea.addEventListener('dragleave', () => { dropArea.style.borderColor = ''; });
    dropArea.addEventListener('drop', e => {
        e.preventDefault();
        dropArea.style.borderColor = '';
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            document.getElementById('fileInput').files = files;
            updateFileLabel(files[0]);
        }
    });
}
document.getElementById('fileInput')?.addEventListener('change', function (e) {
    if (e.target.files[0]) updateFileLabel(e.target.files[0]);
});
function updateFileLabel(file) {
    const p = document.getElementById('dropArea')?.querySelector('p');
    if (p) p.innerHTML = `Selected: <strong>${file.name}</strong> (${formatFileSize(file.size)})`;
}

// Click outside to close menu
document.addEventListener('click', function (e) {
    if (!e.target.closest('.user-profile') && !e.target.closest('#userMenu')) {
        document.getElementById('userMenu')?.classList.remove('show');
    }
});

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('loginModal').style.display  = 'none';
    document.getElementById('mainWebsite').style.display = 'block';

    if (currentUser) {
        document.getElementById('profileName').textContent = currentUser.username || currentUser.name;
        const authMenuItem = document.getElementById('authMenuItem');
        if (authMenuItem) {
            authMenuItem.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
            authMenuItem.onclick = logout;
        }
    } else {
        document.getElementById('profileName').textContent = 'Guest';
    }

    loadAllMedia();
});