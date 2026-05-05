// MongoDB Setup for SnapSphere
// Run this in MongoDB Compass or mongo shell

// Switch to snapsphere database
use snapsphere_db;

// Create collections
db.createCollection("users");
db.createCollection("categories");
db.createCollection("media");

// Create indexes
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "username": 1 }, { unique: true });
db.media.createIndex({ "userId": 1 });
db.media.createIndex({ "category": 1 });
db.media.createIndex({ "uploadDate": -1 });

// Insert default categories
db.categories.insertMany([
  { name: "Photography", createdAt: new Date() },
  { name: "Nature", createdAt: new Date() },
  { name: "Travel", createdAt: new Date() }
]);

print("✅ MongoDB database setup complete!");
print("Collections created: users, categories, media");