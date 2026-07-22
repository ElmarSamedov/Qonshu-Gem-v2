const fs = require('fs');
let content = fs.readFileSync('src/components/MarketplaceProductModal.tsx', 'utf8');

// remove CheckCircle2
content = content.replace(/,\s*CheckCircle2/, '');

// remove escrow state
content = content.replace(/const \[escrowStatus, setEscrowStatus\] = useState<'none' \| 'pending' \| 'success'>\('none'\);\s*/g, '');

// remove handleEscrow
content = content.replace(/const handleEscrow = \(\) => \{\s*setEscrowStatus\('pending'\);\s*setTimeout\(\(\) => \{\s*setEscrowStatus\('success'\);\s*\}, 1500\);\s*\};\s*/g, '');

// remove the entire block for item.type === 'sell' && ( ... escrow ui )
const escrowBlockRegex = /\{item\.type === 'sell' && \(\s*<div className="bg-orange-50[^]*?<\/div>\s*\)\}/;
content = content.replace(escrowBlockRegex, '');

fs.writeFileSync('src/components/MarketplaceProductModal.tsx', content);
