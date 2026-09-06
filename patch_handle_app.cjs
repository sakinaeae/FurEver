const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  /  const handleNewApplication = async \(newApp: AdoptionApplication\) => \{[\s\S]*?  \};/g,
  `  const handleNewApplication = async (newApp: AdoptionApplication) => {
    if (!userProfile) return;
    newApp.userId = userProfile.userId || '';
    setApplications(prev => [newApp, ...prev]);
    setPets(prev => prev.map(p => p.id === newApp.petId ? { ...p, status: 'PENDING' } : p));
    showToast(\`Application for \${newApp.petName} submitted successfully!\`);
  };`
);

fs.writeFileSync('src/App.tsx', content);
