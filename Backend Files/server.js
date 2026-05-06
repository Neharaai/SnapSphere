const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { CosmosClient } = require('@azure/cosmos');
const { BlobServiceClient } = require('@azure/storage-blob');
require('dotenv').config();

const app = express();

// ============================================================
// MIDDLEWARE
// ============================================================
app.use(cors());
app.use(express.json());

const path = require('path');
app.use(express.static(path.join(__dirname, '.')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ============================================================
// AZURE COSMOS DB CLIENT (NoSQL)
// ============================================================
const cosmosClient = new CosmosClient(process.env.MONGODB_URI);
const dbName = 'snapsphere';

let database, usersContainer, mediaContainer, categoriesContainer;

async function initCosmosDB() {
    // Create database if it doesn't exist
    const { database: db } = await cosmosClient.databases.createIfNotExists({ id: dbName });
    database = db;

    // Create containers (like collections in MongoDB)
    const { container: users } = await database.containers.createIfNotExists({
        id: 'users',
        partitionKey: { paths: ['/id'] }
    });
    const { container: media } = await database.containers.createIfNotExists({
        id: 'media',
        partitionKey: { paths: ['/id'] }
    });
    const { container: categories } = await database.containers.createIfNotExists({
        id: 'categories',
        partitionKey: { paths: ['/id'] }
    });

    usersContainer      = users;
    mediaContainer      = media;
    categoriesContainer = categories;

    console.log('✅ Cosmos DB connected and containers ready');
    await initCategories();
}

async function initCategories() {
    const defaults = [
        { id: uuidv4(), name: 'Photography',  description: 'General photography',        icon: 'fa-camera',   mediaCount: 0 },
        { id: uuidv4(), name: 'Nature',        description: 'Landscapes, flora & fauna',  icon: 'fa-leaf',     mediaCount: 0 },
        { id: uuidv4(), name: 'Travel',        description: 'Places around the world',    icon: 'fa-plane',    mediaCount: 0 },
        { id: uuidv4(), name: 'Architecture',  description: 'Buildings and structures',   icon: 'fa-building', mediaCount: 0 },
        { id: uuidv4(), name: 'Wildlife',      description: 'Animals in the wild',        icon: 'fa-paw',      mediaCount: 0 },
        { id: uuidv4(), name: 'Street',        description: 'Urban street photography',   icon: 'fa-road',     mediaCount: 0 },
        { id: uuidv4(), name: 'Portrait',      description: 'People and faces',           icon: 'fa-user',     mediaCount: 0 },
        { id: uuidv4(), name: 'Abstract',      description: 'Abstract and conceptual',    icon: 'fa-shapes',   mediaCount: 0 },
    ];

    for (const cat of defaults) {
        // Check if category already exists
        const { resources } = await categoriesContainer.items
            .query(`SELECT * FROM c WHERE c.name = '${cat.name}'`)
            .fetchAll();
        if (resources.length === 0) {
            await categoriesContainer.items.create(cat);
        }
    }
    console.log('✅ Default categories ready');
}

// ============================================================
// AZURE BLOB STORAGE
// ============================================================
const blobServiceClient = BlobServiceClient.fromConnectionString(
    process.env.AZURE_STORAGE_CONNECTION_STRING
);
const containerClient = blobServiceClient.getContainerClient(
    process.env.AZURE_CONTAINER_NAME || 'uploads'
);

async function uploadToAzureBlob(buffer, originalName, mimeType) {
    const ext = path.extname(originalName).toLowerCase();
    const blobName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.uploadData(buffer, {
        blobHTTPHeaders: { blobContentType: mimeType }
    });
    return blockBlobClient.url;
}

async function deleteFromAzureBlob(blobUrl) {
    try {
        const urlParts = blobUrl.split('/');
        const blobName = urlParts[urlParts.length - 1];
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        await blockBlobClient.deleteIfExists();
    } catch (err) {
        console.warn('Could not delete blob:', err.message);
    }
}

// ============================================================
// MULTER — memory storage for Azure Blob upload
// ============================================================
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|gif|webp/;
        const ext  = allowed.test(path.extname(file.originalname).toLowerCase());
        const mime = allowed.test(file.mimetype);
        cb(ext && mime ? null : new Error('Only images allowed'), ext && mime);
    }
});

// ============================================================
// AUTH MIDDLEWARE
// ============================================================
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Token required' });
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch {
        res.status(403).json({ error: 'Invalid or expired token' });
    }
};

// ============================================================
// AUTH ROUTES
// ============================================================

// POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password)
            return res.status(400).json({ error: 'username, email and password are required' });

        // Check if user exists
        const { resources: existing } = await usersContainer.items
            .query(`SELECT * FROM c WHERE c.email = '${email}' OR c.username = '${username}'`)
            .fetchAll();
        if (existing.length > 0)
            return res.status(400).json({ error: 'Username or email already in use' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = {
            id:          uuidv4(),
            username,
            email,
            password:    hashedPassword,
            profilePic:  null,
            bio:         '',
            uploadCount: 0,
            createdAt:   new Date().toISOString(),
            lastLogin:   new Date().toISOString()
        };

        await usersContainer.items.create(user);

        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({ token, user: { id: user.id, username, email } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const { resources } = await usersContainer.items
            .query(`SELECT * FROM c WHERE c.email = '${email}'`)
            .fetchAll();

        if (resources.length === 0)
            return res.status(401).json({ error: 'Invalid credentials' });

        const user = resources[0];
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

        // Update last login
        user.lastLogin = new Date().toISOString();
        await usersContainer.item(user.id, user.id).replace(user);

        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({ token, user: { id: user.id, username: user.username, email: user.email, bio: user.bio } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============================================================
// HELPER — format media item for API response
// ============================================================
function formatMedia(item) {
    return {
        media_id:          item.id,
        title:             item.title,
        description:       item.description,
        image_path:        item.imagePath,
        original_filename: item.originalFilename,
        mime_type:         item.mimeType,
        file_size:         item.fileSize,
        resolution:        item.resolution,
        image_width:       item.imageWidth,
        image_height:      item.imageHeight,
        location:          item.location,
        coordinates:       item.coordinates,
        date_taken:        item.dateTaken,
        category:          item.category,
        tags:              item.tags || [],
        camera_model:      item.cameraModel,
        focal_length:      item.focalLength,
        aperture:          item.aperture,
        iso:               item.iso,
        shutter_speed:     item.shutterSpeed,
        username:          item.username,
        user_id:           item.userId,
        upload_date:       item.uploadDate,
        last_modified:     item.lastModified,
        views:             item.views,
        likes:             item.likes,
        downloads:         item.downloads,
        visibility:        item.visibility,
        featured:          item.featured
    };
}

// ============================================================
// MEDIA ROUTES
// ============================================================

// GET /api/media — all public media
app.get('/api/media', async (req, res) => {
    try {
        const { resources } = await mediaContainer.items
            .query('SELECT * FROM c WHERE c.visibility = "public" ORDER BY c.uploadDate DESC OFFSET 0 LIMIT 50')
            .fetchAll();
        res.json(resources.map(formatMedia));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/media/:id — single item
app.get('/api/media/:id', async (req, res) => {
    try {
        const { resources } = await mediaContainer.items
            .query(`SELECT * FROM c WHERE c.id = '${req.params.id}'`)
            .fetchAll();
        if (resources.length === 0) return res.status(404).json({ error: 'Media not found' });

        const media = resources[0];
        media.views = (media.views || 0) + 1;
        await mediaContainer.item(media.id, media.id).replace(media);
        res.json(formatMedia(media));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/media — upload new image
app.post('/api/media', authenticateToken, upload.single('image'), async (req, res) => {
    try {
        const {
            title, description, location, category, resolution,
            image_width, image_height, date_taken, tags,
            camera_model, focal_length, aperture, iso, shutter_speed,
            coordinates_lat, coordinates_lng, visibility
        } = req.body;

        if (!title || !category)
            return res.status(400).json({ error: 'title and category are required' });
        if (!req.file)
            return res.status(400).json({ error: 'Image file is required' });

        const azureUrl = await uploadToAzureBlob(req.file.buffer, req.file.originalname, req.file.mimetype);

        // Get username for denormalised storage
        const { resources: users } = await usersContainer.items
            .query(`SELECT * FROM c WHERE c.id = '${req.user.id}'`)
            .fetchAll();
        const username = users.length > 0 ? users[0].username : 'Unknown';

        const mediaDoc = {
            id:               uuidv4(),
            title,
            description:      description || '',
            imagePath:        azureUrl,
            originalFilename: req.file.originalname,
            mimeType:         req.file.mimetype,
            fileSize:         req.file.size,
            resolution:       resolution || null,
            imageWidth:       image_width  ? Number(image_width)  : null,
            imageHeight:      image_height ? Number(image_height) : null,
            location:         location || null,
            coordinates: (coordinates_lat && coordinates_lng) ? {
                lat: Number(coordinates_lat),
                lng: Number(coordinates_lng)
            } : null,
            dateTaken:    date_taken || null,
            category,
            tags:         tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
            cameraModel:  camera_model  || null,
            focalLength:  focal_length  || null,
            aperture:     aperture      || null,
            iso:          iso ? Number(iso) : null,
            shutterSpeed: shutter_speed || null,
            userId:       req.user.id,
            username,
            uploadDate:   new Date().toISOString(),
            lastModified: new Date().toISOString(),
            views:        0,
            likes:        0,
            downloads:    0,
            visibility:   visibility === 'private' ? 'private' : 'public',
            featured:     false
        };

        await mediaContainer.items.create(mediaDoc);

        // Increment user upload count
        if (users.length > 0) {
            const user = users[0];
            user.uploadCount = (user.uploadCount || 0) + 1;
            await usersContainer.item(user.id, user.id).replace(user);
        }

        res.status(201).json(formatMedia(mediaDoc));
    } catch (error) {
        console.error('Upload error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/media/:id — update metadata
app.put('/api/media/:id', authenticateToken, async (req, res) => {
    try {
        const { resources } = await mediaContainer.items
            .query(`SELECT * FROM c WHERE c.id = '${req.params.id}'`)
            .fetchAll();
        if (resources.length === 0) return res.status(404).json({ error: 'Media not found' });

        const media = resources[0];
        if (media.userId !== req.user.id)
            return res.status(403).json({ error: 'Unauthorized' });

        const allowed = ['title','description','location','category','cameraModel',
                         'focalLength','aperture','iso','shutterSpeed','dateTaken','visibility'];
        allowed.forEach(field => {
            if (req.body[field] !== undefined) media[field] = req.body[field];
        });
        if (req.body.tags) {
            media.tags = typeof req.body.tags === 'string'
                ? req.body.tags.split(',').map(t => t.trim()).filter(Boolean)
                : req.body.tags;
        }
        media.lastModified = new Date().toISOString();

        await mediaContainer.item(media.id, media.id).replace(media);
        res.json(formatMedia(media));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /api/media/:id
app.delete('/api/media/:id', authenticateToken, async (req, res) => {
    try {
        const { resources } = await mediaContainer.items
            .query(`SELECT * FROM c WHERE c.id = '${req.params.id}'`)
            .fetchAll();
        if (resources.length === 0) return res.status(404).json({ error: 'Media not found' });

        const media = resources[0];
        if (media.userId !== req.user.id)
            return res.status(403).json({ error: 'Unauthorized' });

        await deleteFromAzureBlob(media.imagePath);
        await mediaContainer.item(media.id, media.id).delete();

        res.json({ message: 'Media deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/media/:id/like
app.post('/api/media/:id/like', authenticateToken, async (req, res) => {
    try {
        const { resources } = await mediaContainer.items
            .query(`SELECT * FROM c WHERE c.id = '${req.params.id}'`)
            .fetchAll();
        if (resources.length === 0) return res.status(404).json({ error: 'Media not found' });

        const media = resources[0];
        media.likes = (media.likes || 0) + 1;
        await mediaContainer.item(media.id, media.id).replace(media);
        res.json({ likes: media.likes });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/media/:id/download
app.post('/api/media/:id/download', async (req, res) => {
    try {
        const { resources } = await mediaContainer.items
            .query(`SELECT * FROM c WHERE c.id = '${req.params.id}'`)
            .fetchAll();
        if (resources.length === 0) return res.status(404).json({ error: 'Media not found' });

        const media = resources[0];
        media.downloads = (media.downloads || 0) + 1;
        await mediaContainer.item(media.id, media.id).replace(media);
        res.json({ downloads: media.downloads, image_path: media.imagePath });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============================================================
// SEARCH & FILTER ROUTES
// ============================================================

// GET /api/search/:term
app.get('/api/search/:term', async (req, res) => {
    try {
        const term = req.params.term.toLowerCase();
        const { resources } = await mediaContainer.items
            .query(`SELECT * FROM c WHERE c.visibility = "public" AND (
                CONTAINS(LOWER(c.title), '${term}') OR
                CONTAINS(LOWER(c.description), '${term}') OR
                CONTAINS(LOWER(c.location), '${term}')
            ) ORDER BY c.uploadDate DESC`)
            .fetchAll();
        res.json(resources.map(formatMedia));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/category/:category
app.get('/api/category/:category', async (req, res) => {
    try {
        const { resources } = await mediaContainer.items
            .query(`SELECT * FROM c WHERE c.category = '${req.params.category}' AND c.visibility = "public" ORDER BY c.uploadDate DESC`)
            .fetchAll();
        res.json(resources.map(formatMedia));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/tags/:tag
app.get('/api/tags/:tag', async (req, res) => {
    try {
        const tag = req.params.tag.toLowerCase();
        const { resources } = await mediaContainer.items
            .query(`SELECT * FROM c WHERE c.visibility = "public" AND ARRAY_CONTAINS(c.tags, '${tag}') ORDER BY c.uploadDate DESC`)
            .fetchAll();
        res.json(resources.map(formatMedia));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/user/:userId/media
app.get('/api/user/:userId/media', async (req, res) => {
    try {
        const { resources } = await mediaContainer.items
            .query(`SELECT * FROM c WHERE c.userId = '${req.params.userId}' AND c.visibility = "public" ORDER BY c.uploadDate DESC`)
            .fetchAll();
        res.json(resources.map(formatMedia));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/categories
app.get('/api/categories', async (req, res) => {
    try {
        const { resources } = await categoriesContainer.items
            .query('SELECT * FROM c ORDER BY c.name')
            .fetchAll();
        res.json(resources);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/stats
app.get('/api/stats', async (req, res) => {
    try {
        const { resources: allMedia } = await mediaContainer.items
            .query('SELECT * FROM c WHERE c.visibility = "public"')
            .fetchAll();
        const { resources: allUsers } = await usersContainer.items
            .query('SELECT * FROM c')
            .fetchAll();
        const topLiked = [...allMedia].sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, 5);

        res.json({
            total_media: allMedia.length,
            total_users: allUsers.length,
            top_liked:   topLiked.map(formatMedia)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /health
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString(), service: 'SnapSphere API', version: '2.0.0' });
});

// ============================================================
// START SERVER
// ============================================================
const PORT = process.env.PORT || 5001;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend Files', 'index.html'));
});

initCosmosDB()
    .then(() => {
        app.listen(PORT, () => console.log(`🚀 SnapSphere API running on port ${PORT}`));
    })
    .catch(err => {
        console.error('❌ Failed to connect to Cosmos DB:', err.message);
        process.exit(1);
    });