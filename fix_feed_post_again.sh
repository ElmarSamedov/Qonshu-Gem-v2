sed -i '91,95c\
      const newMoment = {\
        id: Date.now(),\
        author: user?.name || '\''You'\'',\
        avatar: user?.avatar || null,' src/components/Feed.tsx
