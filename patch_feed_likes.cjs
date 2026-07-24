const fs = require('fs');
let content = fs.readFileSync('src/components/Feed.tsx', 'utf8');

// Update handleLike
const likeRegex = /const handleLike = async \(postId: string\) => \{[\s\S]*?\}\n  \};/;
const likeReplacement = `const handleLike = async (postId: string) => {
    if (!user) return;
    const post = posts.find(p => p.id === postId);
    if (post) {
      try {
        const likedBy = post.likedBy || [];
        if (likedBy.includes(user.uid)) {
          await updateDoc(doc(db, 'posts', postId), {
            likes: Math.max(0, (post.likes || 1) - 1),
            likedBy: likedBy.filter((id: string) => id !== user.uid)
          });
        } else {
          await updateDoc(doc(db, 'posts', postId), {
            likes: (post.likes || 0) + 1,
            likedBy: [...likedBy, user.uid]
          });
        }
      } catch (e) {
        console.error('Failed to like post:', e);
      }
    }
  };`;
content = content.replace(likeRegex, likeReplacement);

// Update button UI
const btnRegex = /<button onClick=\{\(\) => handleLike\(post\.id\)\} className="flex items-center space-x-1 hover:text-blue-400 transition-colors">/;
const btnReplacement = `<button onClick={() => handleLike(post.id)} className={\`flex items-center space-x-1 transition-colors \${post.likedBy?.includes(user?.uid || '') ? 'text-rose-500' : 'hover:text-rose-400'}\`}>`;
content = content.replace(btnRegex, btnReplacement);

// We should also replace the Heart icon with filled if liked
const heartRegex = /<Heart className="h-4 w-4" \/>/;
// Note: there are multiple Heart icons. We only want to replace the one in the Like button.
// Actually, it's safer to just replace the whole button block.
const blockRegex = /<button onClick=\{\(\) => handleLike\(post\.id\)\}[\s\S]*?<\/button>/;
const blockReplacement = `<button onClick={() => handleLike(post.id)} className={\`flex items-center space-x-1 transition-colors \${post.likedBy?.includes(user?.uid || '') ? 'text-rose-500' : 'hover:text-rose-400'}\`}>
                    <Heart className={\`h-4 w-4 \${post.likedBy?.includes(user?.uid || '') ? 'fill-current' : ''}\`} />
                    <span>{post.likes || 0} {t('common.helpful', language)}</span>
                  </button>`;
content = content.replace(blockRegex, blockReplacement);

fs.writeFileSync('src/components/Feed.tsx', content);
console.log("Patched Feed.tsx for likes");
