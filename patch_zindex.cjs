const fs = require('fs');

// Patch App.tsx
let appCode = fs.readFileSync('src/App.tsx', 'utf8');
appCode = appCode.replace('<div className="bg-[#FFFDF9] py-12">', '<div className="bg-[#FFFDF9] py-12 relative z-10">');
appCode = appCode.replace('<div className="py-12 bg-[#FFFDF9]">', '<div className="py-12 bg-[#FFFDF9] relative z-10">');
fs.writeFileSync('src/App.tsx', appCode);

// Patch Footer.tsx
let footerCode = fs.readFileSync('src/components/Footer.tsx', 'utf8');
footerCode = footerCode.replace('<footer className="bg-[#0F5C94] text-white pt-16 pb-12 border-t-8 border-[#FB4504] relative overflow-hidden">', '<footer className="bg-[#0F5C94] text-white pt-16 pb-12 border-t-8 border-[#FB4504] relative z-10 overflow-hidden">');
fs.writeFileSync('src/components/Footer.tsx', footerCode);

