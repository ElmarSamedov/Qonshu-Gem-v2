const fs = require('fs');
let content = fs.readFileSync('firestore.rules', 'utf8');

// Replace allow read: if isSignedIn(); with allow read: if true; for specific collections
content = content.replace(/match \/users\/\{userId\} {\s*allow read: if isSignedIn\(\);/, 'match /users/{userId} {\n      allow read: if true;');
content = content.replace(/match \/posts\/\{postId\} {\s*allow read: if isSignedIn\(\);/, 'match /posts/{postId} {\n      allow read: if true;');
content = content.replace(/match \/comments\/\{commentId\} {\s*allow read: if isSignedIn\(\);/, 'match /comments/{commentId} {\n        allow read: if true;');
content = content.replace(/match \/moments\/\{momentId\} {\s*allow read: if isSignedIn\(\);/, 'match /moments/{momentId} {\n      allow read: if true;');

fs.writeFileSync('firestore.rules', content);
