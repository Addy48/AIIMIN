const fs = require('fs');
const path = require('path');

function replaceCards(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    let original = content;

    // In Finance.jsx, replace nordic-card with immersive card styling
    content = content.replace(/className="nordic-card"[^>]*style={{([^}]*)}}/g, (match, styleInner) => {
        // Parse the style inner to remove conflicting background, border, etc
        let newStyle = styleInner
            .replace(/background:\s*['"][^'"]+['"],?\s*/g, '')
            .replace(/border:\s*['"][^'"]+['"],?\s*/g, '')
            .replace(/borderRadius:\s*['"][^'"]+['"],?\s*/g, '')
            .replace(/boxShadow:\s*['"][^'"]+['"],?\s*/g, '');
        
        let customStyle = `background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, var(--color-surface) 40%, var(--color-surface) 100%)', border: '1px solid var(--border)', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', ${newStyle}`;
        // Clean up trailing commas in style
        customStyle = customStyle.replace(/,\s*$/, '');
        return `className="glass-panel" style={{ ${customStyle} }}`;
    });
    
    // Replace standalone backgrounds like background: 'rgba(255,255,255,0.02)'
    content = content.replace(/background:\s*['"]rgba?\(255,\s*255,\s*255,\s*0\.0[123]\)['"]/g, `background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, var(--color-surface) 40%, var(--color-surface) 100%)'`);
    
    // In Placements.jsx, replace card-hover backgrounds
    content = content.replace(/className="card-hover"[^>]*style={{([^}]*)}}/g, (match, styleInner) => {
        let newStyle = styleInner
            .replace(/background:\s*['"][^'"]+['"],?\s*/g, '')
            .replace(/border:\s*['"][^'"]+['"],?\s*/g, '')
            .replace(/borderRadius:\s*['"][^'"]+['"],?\s*/g, '')
            .replace(/boxShadow:\s*['"][^'"]+['"],?\s*/g, '')
            .replace(/backdropFilter:\s*['"][^'"]+['"],?\s*/g, '');
            
        let customStyle = `background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, var(--color-surface) 40%, var(--color-surface) 100%)', border: '1px solid var(--border)', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', ${newStyle}`;
        customStyle = customStyle.replace(/,\s*$/, '').replace(/,\s*,/g, ',');
        return `className="glass-panel" style={{ ${customStyle} }}`;
    });

    if (content !== original) {
        fs.writeFileSync(filePath, content);
        console.log('Updated ' + filePath);
    }
}

replaceCards('/Users/aaditya/Desktop/DASHBOARD PROJECT/frontend/src/pages/Finance.jsx');
replaceCards('/Users/aaditya/Desktop/DASHBOARD PROJECT/frontend/src/pages/Placements.jsx');
