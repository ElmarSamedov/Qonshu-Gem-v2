const fs = require('fs');
let content = fs.readFileSync('firestore.rules', 'utf8');

const regex = /\/\/ --- CHATS ---\n\s*match \/chats\/\{chatId\} \{\n\s*allow create: if isSignedIn\(\) && request\.auth\.uid in incoming\(\)\.participants;\n\s*allow read, update, delete: if isSignedIn\(\) && \(existing\(\) == null \|\| request\.auth\.uid in existing\(\)\.participants\);\n\s*match \/messages\/\{messageId\} \{\n\s*allow read: if isSignedIn\(\) && request\.auth\.uid in get\(\/databases\/\$\(database\)\/documents\/chats\/\$\(chatId\)\)\.data\.participants;\n\s*allow create: if isSignedIn\(\) && request\.auth\.uid in get\(\/databases\/\$\(database\)\/documents\/chats\/\$\(chatId\)\)\.data\.participants && incoming\(\)\.senderId == request\.auth\.uid;\n\s*allow update: if isSignedIn\(\) && \(\n\s*\(incoming\(\)\.senderId == request\.auth\.uid && incoming\(\)\.diff\(existing\(\)\)\.affectedKeys\(\)\.hasOnly\(\['text', 'reactions'\]\)\) \|\|\n\s*incoming\(\)\.diff\(existing\(\)\)\.affectedKeys\(\)\.hasOnly\(\['reactions'\]\)\n\s*\);\n\s*allow delete: if isSignedIn\(\) && existing\(\)\.senderId == request\.auth\.uid;\n\s*\}\n\s*\}/;

const replacement = `// --- CHATS ---
    match /chats/{chatId} {
      allow create: if isSignedIn() && request.auth.uid in incoming().participants;
      allow read, update, delete: if isSignedIn() && request.auth.uid in existing().participants;
      
      match /messages/{messageId} {
        allow read: if isSignedIn() && request.auth.uid in get(/databases/$(database)/documents/chats/$(chatId)).data.participants;
        allow create: if isSignedIn() && request.auth.uid in get(/databases/$(database)/documents/chats/$(chatId)).data.participants && incoming().senderId == request.auth.uid;
        allow update: if isSignedIn() && request.auth.uid in get(/databases/$(database)/documents/chats/$(chatId)).data.participants && (
                        (incoming().senderId == request.auth.uid && incoming().diff(existing()).affectedKeys().hasOnly(['text', 'reactions'])) ||
                        incoming().diff(existing()).affectedKeys().hasOnly(['reactions'])
                      );
        allow delete: if isSignedIn() && request.auth.uid in get(/databases/$(database)/documents/chats/$(chatId)).data.participants && existing().senderId == request.auth.uid;
      }
    }`;

content = content.replace(regex, replacement);

fs.writeFileSync('firestore.rules', content);
console.log("Patched firestore.rules for chats");
