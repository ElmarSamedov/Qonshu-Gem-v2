const fs = require('fs');
let content = fs.readFileSync('src/store/useChatStore.ts', 'utf8');

const regex = /openOrCreateChat: async \(id, name, type\) => \{\n\s*const exists = get\(\).chats.some\(c => c.id === id\);\n\s*if \(!exists\) \{\n\s*const newChat: Omit<ChatSession, 'messages'> = \{\n\s*id,\n\s*name,\n\s*type,\n\s*lastMessage: '',\n\s*unread: 0\n\s*\};/;

const replacement = `openOrCreateChat: async (id, name, type) => {
    const exists = get().chats.some(c => c.id === id);
    if (!exists) {
      // Extract uids from the deterministic chatId, e.g. "uid1_uid2"
      const parts = id.split('_');
      // Some targets might have dashes, but the user UIDs generally don't contain underscores.
      // Actually, since we generate the ID, we can safely just add the current user's UID to participants.
      // Wait, what if the other participant's UID is not easily extracted?
      // Since it's deterministic [user.uid, target.uid].sort().join('_'), parts will be [uid1, targetId].
      const participants = parts.length >= 2 ? parts : [id];
      const newChat: Omit<ChatSession, 'messages'> = {
        id,
        name,
        type,
        lastMessage: '',
        unread: 0,
        participants
      };`;

content = content.replace(regex, replacement);
fs.writeFileSync('src/store/useChatStore.ts', content);
console.log("Patched useChatStore.ts");
