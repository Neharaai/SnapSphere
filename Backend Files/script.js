// ============================================================
// API CONFIG
// ============================================================
const API_BASE_URL = 'https://snapsphere-api-gng2afcpftawdqcr.francecentral-01.azurewebsites.net/api';

// ── Logic App URLs ───────────────────────────────────────────
const LOGIC_APP_GET    = 'https://prod-21.francecentral.logic.azure.com:443/workflows/e75ae775574d4794809b3c44991b68ca/triggers/When_an_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_an_HTTP_request_is_received%2Frun&sv=1.0&sig=KTgWObKTxJDpAiUUVYiQplXy6iVCUk6CPwkh0F5ucDo';
const LOGIC_APP_CREATE = 'https://prod-13.francecentral.logic.azure.com:443/workflows/412c9b5ea0d9488993fedebe948519d3/triggers/When_an_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_an_HTTP_request_is_received%2Frun&sv=1.0&sig=Q8ORZXpmxFBQcv_3kxLTRYOmZjooIU-P9Wl5NbC5tHc';
const LOGIC_APP_UPDATE = 'https://prod-30.francecentral.logic.azure.com:443/workflows/fb2370318271499db29dd26ec5859e40/triggers/When_an_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_an_HTTP_request_is_received%2Frun&sv=1.0&sig=pnupFCDc1VTuQiYZujP6JLASL3vP4C3jIokBX7Q_MU4';
const LOGIC_APP_DELETE = 'https://prod-29.francecentral.logic.azure.com:443/workflows/fe927b14a1084d63a4d76aab9ed46d6b/triggers/When_an_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_an_HTTP_request_is_received%2Frun&sv=1.0&sig=cbF2-qELBa6u6JxO3WnV5ZlLWODu9W8JlMSXhYhi_ew';

let authToken   = localStorage.getItem('snapsphere_token') || null;
let currentUser = JSON.parse(localStorage.getItem('snapsphere_user')) || null;

// ============================================================
// API HELPER (Express backend — auth, upload, blob)
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
// LOGIC APP UPDATE HELPER
// ============================================================
async function logicAppUpdate(mediaDoc) {
    await fetch(LOGIC_APP_UPDATE, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mediaDoc)
    });
}

// ============================================================
// LOAD & DISPLAY MEDIA — newest first
// ============================================================
async function loadAllMedia() {
    try {
        const response = await fetch(LOGIC_APP_GET);
        const media = await response.json();
        if (!Array.isArray(media)) { displayMediaGrid([]); return; }

        // Sort newest first by uploadDate
        const sorted = media.sort((a, b) => {
            const dateA = new Date(a.uploadDate || a.upload_date || 0);
            const dateB = new Date(b.uploadDate || b.upload_date || 0);
            return dateB - dateA;
        });

        displayMediaGrid(sorted);
    } catch {
        displayMediaGrid([]);
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

    if (!data || data.length === 0) {
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

        const mediaId  = media.media_id || media.id;
        const title    = media.title || 'Untitled';
        const username = media.username || 'Unknown';
        let imagePath  = media.image_path || media.imagePath || '';

        if (imagePath && !imagePath.startsWith('http')) {
            imagePath = `https://snapsphere-api-gng2afcpftawdqcr.francecentral-01.azurewebsites.net${imagePath}`;
        }

        const uploadDate = media.upload_date || media.uploadDate || new Date().toISOString();
        const tagsArr    = media.tags || [];
        const userId     = media.user_id || media.userId;

        const isUserUpload = !!(
            currentUser &&
            userId &&
            currentUser.id &&
            userId.toString() === currentUser.id.toString()
        );

        card.onclick = () => openMediaDetails(mediaId, media);

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
// DELETE — via Logic App
// ============================================================
async function deleteMedia(id, event) {
    event.stopPropagation();
    if (!currentUser) { alert('Please login first'); return; }
    if (!confirm('Permanently delete this image?')) return;
    try {
        await fetch(LOGIC_APP_DELETE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        try { await apiRequest(`/media/${id}`, { method: 'POST' }); } catch { }
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
// UPLOAD
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

        try {
            // Step 1: Upload image to Azure Blob via Express
            const response = await fetch(`${API_BASE_URL}/media`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${authToken}` },
                body: formData
            });
            if (!response.ok) {
                const err = await response.json().catch(() => ({}));
                throw new Error(err.error || response.statusText);
            }
            const newMedia = await response.json();

            const uploadDate = new Date().toISOString();

            // Step 2: Save metadata to Cosmos DB via Logic App CREATE
            await fetch(LOGIC_APP_CREATE, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id:               newMedia.media_id,
                    title,
                    description:      desc,
                    imagePath:        newMedia.image_path,
                    originalFilename: file.name,
                    mimeType:         file.type,
                    fileSize:         file.size,
                    resolution,
                    imageWidth,
                    imageHeight,
                    location,
                    dateTaken:        dateTaken || null,
                    category:         cat,
                    tags:             tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
                    cameraModel:      cameraModel || null,
                    focalLength:      focalLength || null,
                    aperture:         aperture    || null,
                    iso:              iso ? Number(iso) : null,
                    shutterSpeed:     shutterSpeed || null,
                    userId:           currentUser.id,
                    username:         currentUser.username,
                    uploadDate,
                    lastModified:     uploadDate,
                    views:            0,
                    likes:            0,
                    downloads:        0,
                    visibility:       visibility === 'private' ? 'private' : 'public',
                    featured:         false
                })
            });

            alert('Uploaded successfully!');
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
// MEDIA DETAILS MODAL — increments views via Logic App
// ============================================================
function openMediaDetails(id, mediaObj) {
    if (mediaObj) {
        // Increment view count via Logic App
        const updatedMedia = { ...mediaObj, views: (mediaObj.views || 0) + 1, lastModified: new Date().toISOString() };
        logicAppUpdate(updatedMedia).catch(() => {});
        renderModal(updatedMedia);
    } else {
        fetch(LOGIC_APP_GET)
            .then(r => r.json())
            .then(all => {
                const found = all.find(m => (m.id || m.media_id) === id);
                if (found) {
                    const updatedMedia = { ...found, views: (found.views || 0) + 1, lastModified: new Date().toISOString() };
                    logicAppUpdate(updatedMedia).catch(() => {});
                    renderModal(updatedMedia);
                }
            })
            .catch(() => {});
    }
}

function renderModal(media) {
    const modal   = document.getElementById('mediaModal');
    const content = document.getElementById('mediaModalContent');

    const mediaId  = media.media_id || media.id;
    const userId   = media.user_id  || media.userId;

    const isOwner = !!(
        currentUser &&
        userId &&
        currentUser.id &&
        userId.toString() === currentUser.id.toString()
    );

    let imagePath = media.image_path || media.imagePath || '';
    if (imagePath && !imagePath.startsWith('http'))
        imagePath = `https://snapsphere-api-gng2afcpftawdqcr.francecentral-01.azurewebsites.net${imagePath}`;

    const uploadDate = new Date(media.upload_date || media.uploadDate || Date.now())
        .toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

    const tagsArr  = media.tags || [];
    const tagsHTML = tagsArr.length
        ? `<div class="modal-tags">${tagsArr.map(t => `<span class="tag">#${t}</span>`).join('')}</div>` : '';

    const camModel  = media.camera_model  || media.cameraModel;
    const focalLen  = media.focal_length  || media.focalLength;
    const shutter   = media.shutter_speed || media.shutterSpeed;
    const camParts  = [];
    if (camModel)        camParts.push(`<span><i class="fas fa-camera"></i> ${camModel}</span>`);
    if (focalLen)        camParts.push(`<span>${focalLen}</span>`);
    if (media.aperture)  camParts.push(`<span>${media.aperture}</span>`);
    if (media.iso)       camParts.push(`<span>ISO ${media.iso}</span>`);
    if (shutter)         camParts.push(`<span>${shutter}</span>`);
    const camHTML = camParts.length ? `<div class="modal-camera">${camParts.join(' · ')}</div>` : '';

    const fileSize     = media.file_size || media.fileSize;
    const fileSizeStr  = fileSize ? ` · ${formatFileSize(fileSize)}` : '';
    const resolution   = media.resolution || '';
    const dateTaken    = media.date_taken || media.dateTaken;
    const dateTakenStr = dateTaken
        ? `<div class="meta-item"><i class="fas fa-calendar-alt"></i> Taken: ${new Date(dateTaken).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' })}</div>` : '';
    const downloads = media.downloads ?? 0;
    const views     = media.views     ?? 0;
    const likes     = media.likes     ?? 0;
    const location  = media.location  || '';
    const category  = media.category  || '';
    const visibility = media.visibility || 'public';

    content.innerHTML = `
        <button class="modal-close" onclick="document.getElementById('mediaModal').classList.remove('show')">✕</button>
        <img src="${imagePath}" class="modal-media"
             onerror="this.src='https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=600'">
        <div class="modal-details">
            <h2>${media.title}</h2>
            <div class="modal-user">
                <i class="fas fa-user-circle"></i>
                ${media.username || 'Unknown'} &bull; ${uploadDate}
            </div>
            <div class="modal-meta-row">
                ${resolution ? `<div class="meta-item"><i class="fas fa-expand-arrows-alt"></i> ${resolution}${fileSizeStr}</div>` : ''}
                ${location   ? `<div class="meta-item"><i class="fas fa-map-marker-alt"></i> ${location}</div>` : ''}
                ${category   ? `<div class="meta-item"><i class="fas fa-tag"></i> ${category}</div>` : ''}
                ${dateTakenStr}
            </div>
            ${camHTML}
            <p class="modal-description">${media.description || ''}</p>
            ${tagsHTML}
            <div class="modal-stats">
                <span><i class="fas fa-eye"></i> ${views} views</span>
                <span><i class="fas fa-heart"></i> <span id="likeCount">${likes}</span> likes</span>
                <span><i class="fas fa-download"></i> ${downloads} downloads</span>
                ${visibility === 'private' ? '<span><i class="fas fa-lock"></i> Private</span>' : ''}
            </div>
            <div class="modal-actions">
                <button class="action-btn like-btn" onclick="likeMedia('${mediaId}', ${JSON.stringify(media).replace(/'/g, "&#39;")})">
                    <i class="fas fa-heart"></i> Like
                </button>
                <button class="action-btn download-btn" onclick="downloadMedia('${mediaId}', '${imagePath}', ${JSON.stringify(media).replace(/'/g, "&#39;")})">
                    <i class="fas fa-download"></i> Download
                </button>
                ${isOwner ? `
                    <button class="action-btn edit-btn" onclick="openEditModal('${mediaId}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="action-btn delete-btn-modal" onclick="deleteMedia('${mediaId}', event); document.getElementById('mediaModal').classList.remove('show')">
                        <i class="fas fa-trash"></i> Delete
                    </button>` : ''}
            </div>
        </div>
    `;
    modal.classList.add('show');
}

// ============================================================
// LIKE — via Logic App UPDATE
// ============================================================
async function likeMedia(id, mediaObj) {
    if (!currentUser) { alert('Please login to like images'); return; }
    try {
        // Get latest media data
        let media = mediaObj;
        if (!media) {
            const response = await fetch(LOGIC_APP_GET);
            const all = await response.json();
            media = all.find(m => (m.id || m.media_id) === id);
        }
        if (!media) return;

        const updatedMedia = { ...media, likes: (media.likes || 0) + 1, lastModified: new Date().toISOString() };

        // Update via Logic App
        await logicAppUpdate(updatedMedia);

        // Update display
        const el = document.getElementById('likeCount');
        if (el) el.textContent = updatedMedia.likes;
    } catch (error) {
        alert('Could not like: ' + error.message);
    }
}

// ============================================================
// DOWNLOAD — increments downloads via Logic App
// ============================================================
async function downloadMedia(id, imageUrl, mediaObj) {
    try {
        let media = mediaObj;
        if (!media) {
            const response = await fetch(LOGIC_APP_GET);
            const all = await response.json();
            media = all.find(m => (m.id || m.media_id) === id);
        }
        if (media) {
            const updatedMedia = { ...media, downloads: (media.downloads || 0) + 1, lastModified: new Date().toISOString() };
            logicAppUpdate(updatedMedia).catch(() => {});
        }
    } catch { /* non-critical */ }

    const a = document.createElement('a');
    a.href     = imageUrl;
    a.download = `snapsphere-${id}.jpg`;
    a.target   = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// ============================================================
// EDIT — via Logic App UPDATE
// ============================================================
async function openEditModal(mediaId) {
    document.getElementById('mediaModal').classList.remove('show');
    try {
        const response = await fetch(LOGIC_APP_GET);
        const all = await response.json();
        const media = all.find(m => (m.id || m.media_id) === mediaId);
        if (!media) { alert('Could not load media for editing'); return; }

        openUploadPage();
        document.getElementById('mediaTitle').value        = media.title || '';
        document.getElementById('mediaLocation').value     = media.location || '';
        document.getElementById('mediaDesc').value         = media.description || '';
        document.getElementById('mediaCategory').value     = media.category || 'Photography';
        document.getElementById('mediaTags').value         = (media.tags || []).join(', ');
        document.getElementById('mediaCameraModel').value  = media.cameraModel || media.camera_model || '';
        document.getElementById('mediaFocalLength').value  = media.focalLength || media.focal_length || '';
        document.getElementById('mediaAperture').value     = media.aperture || '';
        document.getElementById('mediaISO').value          = media.iso || '';
        document.getElementById('mediaShutterSpeed').value = media.shutterSpeed || media.shutter_speed || '';
        document.getElementById('mediaVisibility').value   = media.visibility || 'public';
        if (media.dateTaken || media.date_taken) {
            const dt = media.dateTaken || media.date_taken;
            document.getElementById('mediaDateTaken').value = dt.split('T')[0];
        }

        const publishBtn = document.querySelector('.publish-btn');
        publishBtn.textContent = 'Save Changes';
        publishBtn.onclick = async function () {
            const updatedFields = {
                ...media,
                title:        document.getElementById('mediaTitle').value,
                location:     document.getElementById('mediaLocation').value,
                description:  document.getElementById('mediaDesc').value,
                category:     document.getElementById('mediaCategory').value,
                tags:         document.getElementById('mediaTags').value.split(',').map(t => t.trim()).filter(Boolean),
                cameraModel:  document.getElementById('mediaCameraModel').value || null,
                focalLength:  document.getElementById('mediaFocalLength').value || null,
                aperture:     document.getElementById('mediaAperture').value || null,
                iso:          Number(document.getElementById('mediaISO').value) || null,
                shutterSpeed: document.getElementById('mediaShutterSpeed').value || null,
                visibility:   document.getElementById('mediaVisibility').value,
                dateTaken:    document.getElementById('mediaDateTaken').value || null,
                lastModified: new Date().toISOString()
            };
            try {
                await logicAppUpdate(updatedFields);
                alert('Changes saved!');
                goHome();
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
    try {
        const response = await fetch(LOGIC_APP_GET);
        const all = await response.json();
        const sorted = all.sort((a, b) => new Date(b.uploadDate || b.upload_date || 0) - new Date(a.uploadDate || a.upload_date || 0));

        if (cat === 'all') {
            displayMediaGrid(sorted);
        } else if (cat === 'mine') {
            if (!currentUser) { alert('Please login first'); return; }
            displayMediaGrid(sorted.filter(m => (m.userId || m.user_id) === currentUser.id));
        } else {
            displayMediaGrid(sorted.filter(m => m.category === cat));
        }
    } catch {
        displayMediaGrid([]);
    }
}

async function showMyMedia() {
    if (!currentUser) { alert('Please login first'); return; }
    try {
        const response = await fetch(LOGIC_APP_GET);
        const all = await response.json();
        const mine = all
            .filter(m => (m.userId || m.user_id) === currentUser.id)
            .sort((a, b) => new Date(b.uploadDate || 0) - new Date(a.uploadDate || 0));
        displayMediaGrid(mine);
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
            const response = await fetch(LOGIC_APP_GET);
            const all = await response.json();
            const results = all
                .filter(m =>
                    (m.title || '').toLowerCase().includes(term) ||
                    (m.description || '').toLowerCase().includes(term) ||
                    (m.location || '').toLowerCase().includes(term) ||
                    (m.tags || []).some(t => t.toLowerCase().includes(term))
                )
                .sort((a, b) => new Date(b.uploadDate || 0) - new Date(a.uploadDate || 0));
            displayMediaGrid(results);
        } catch {
            displayMediaGrid([]);
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