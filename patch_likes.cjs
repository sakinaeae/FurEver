const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  /  \/\/ Helper to persist likes for current user[\s\S]*?  \};/g,
  `  // Helper to persist likes for current user
  const updateLikesForCurrentUser = (newUserLikedPetIds: string[]) => {
    setLikedPetIds(newUserLikedPetIds);
  };`
);

fs.writeFileSync('src/App.tsx', content);
