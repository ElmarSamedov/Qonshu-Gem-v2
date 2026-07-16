sed -i '/id: Date.now(),/i\
    const newPost: any = {' src/components/Feed.tsx
sed -i 's/author: user?.name || '\''You'\'',/author: postAnonymously ? '\''Anonymous'\'' : (user?.isAnonymous ? '\''Anonymous'\'' : (user?.name || '\''You'\'')),/' src/components/Feed.tsx
sed -i 's/avatar: user?.avatar || null,/avatar: postAnonymously ? null : (user?.isAnonymous ? null : (user?.avatar || null)),/' src/components/Feed.tsx
