const fs = require('fs');
let content = fs.readFileSync('src/components/MarketplaceProductModal.tsx', 'utf8');

if (!content.includes('useLanguageStore')) {
  content = content.replace("import { useAuthStore }", "import { useLanguageStore } from '../store/useLanguageStore';\nimport { t } from '../lib/i18n';\nimport { useAuthStore }");
  content = content.replace("export default function MarketplaceProductModal({ item, onClose }: { item: any, onClose: () => void }) {", "export default function MarketplaceProductModal({ item, onClose }: { item: any, onClose: () => void }) {\n  const { language } = useLanguageStore();");
}

content = content.replace('<span className="capitalize">{item.type}</span>', '<span className="capitalize">{t((\'market.\' + item.type) as any, language)}</span>');

fs.writeFileSync('src/components/MarketplaceProductModal.tsx', content);
