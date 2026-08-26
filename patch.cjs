const fs = require('fs');

// Patch App.tsx
let appCode = fs.readFileSync('src/App.tsx', 'utf8');
appCode = appCode.replace(
  "import { Footer } from './components/Footer';",
  "import { Footer } from './components/Footer';\nimport { FloatingBackgroundIcons } from './components/FloatingBackgroundIcons';"
);
appCode = appCode.replace(
  '<div className="min-h-screen bg-[#ffca42] flex flex-col selection:bg-[#FB4504] selection:text-white relative">',
  '<div className="min-h-screen bg-[#ffca42] flex flex-col selection:bg-[#FB4504] selection:text-white relative">\n      <FloatingBackgroundIcons />'
);
fs.writeFileSync('src/App.tsx', appCode);

// Patch HeroSection.tsx
let heroCode = fs.readFileSync('src/components/HeroSection.tsx', 'utf8');
heroCode = heroCode.replace("import { FloatingBackgroundIcons } from './FloatingBackgroundIcons';\n", "");
heroCode = heroCode.replace("      <FloatingBackgroundIcons />\n", "");
heroCode = heroCode.replace(' className="relative overflow-hidden pt-8 pb-14 lg:pt-12 lg:pb-20 z-0"', ' className="relative overflow-hidden pt-8 pb-14 lg:pt-12 lg:pb-20"');
heroCode = heroCode.replace(' className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 relative z-10"', ' className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 relative"');
fs.writeFileSync('src/components/HeroSection.tsx', heroCode);

// Patch FloatingBackgroundIcons.tsx
let floatingCode = fs.readFileSync('src/components/FloatingBackgroundIcons.tsx', 'utf8');
floatingCode = floatingCode.replace('className="absolute inset-0 overflow-hidden pointer-events-none -z-10"', 'className="fixed inset-0 overflow-hidden pointer-events-none z-0"');
fs.writeFileSync('src/components/FloatingBackgroundIcons.tsx', floatingCode);

