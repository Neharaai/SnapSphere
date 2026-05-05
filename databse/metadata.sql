-- SnapSphere Database Schema
DROP DATABASE IF EXISTS snapsphere_db;
CREATE DATABASE snapsphere_db;
USE snapsphere_db;

-- USERS TABLE
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    profile_pic VARCHAR(500) DEFAULT 'default-avatar.png'
);

-- CATEGORIES TABLE
CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- MEDIA TABLE
CREATE TABLE media (
    media_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_path VARCHAR(500) NOT NULL,
    resolution VARCHAR(50),
    location VARCHAR(255),
    category_id INT,
    user_id INT,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    views INT DEFAULT 0,
    likes INT DEFAULT 0,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE SET NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- INDEXES
CREATE INDEX idx_media_user ON media(user_id);
CREATE INDEX idx_media_category ON media(category_id);
CREATE INDEX idx_media_upload ON media(upload_date);

-- DEFAULT CATEGORIES
INSERT INTO categories (category_name) VALUES 
    ('Photography'),
    ('Nature'),
    ('Travel');

-- VIEW FOR MEDIA DETAILS
CREATE VIEW media_details AS
SELECT 
    m.media_id,
    m.title,
    m.description,
    m.image_path,
    m.resolution,
    m.location,
    c.category_name AS category,
    u.username,
    u.user_id,
    u.profile_pic,
    m.upload_date,
    m.views,
    m.likes
FROM media m
LEFT JOIN users u ON m.user_id = u.user_id
LEFT JOIN categories c ON m.category_id = c.category_id
ORDER BY m.upload_date DESC;

-- SEARCH PROCEDURE
DELIMITER //
CREATE PROCEDURE SearchMedia(IN search_term VARCHAR(255))
BEGIN
    SELECT * FROM media_details 
    WHERE title LIKE CONCAT('%', search_term, '%')
       OR description LIKE CONCAT('%', search_term, '%')
       OR location LIKE CONCAT('%', search_term, '%')
       OR username LIKE CONCAT('%', search_term, '%');
END //
DELIMITER ;

-- LOGIN TRIGGER
DELIMITER //
CREATE TRIGGER update_last_login
BEFORE UPDATE ON users
FOR EACH ROW
BEGIN
    IF NEW.last_login != OLD.last_login THEN
        SET NEW.last_login = NOW();
    END IF;
END //
DELIMITER ;

SHOW TABLES;
SELECT 'Database created successfully!' AS Status;