const fs = require('fs');
let content = fs.readFileSync('src/components/Notifications.tsx', 'utf8');

const importRegex = /import React, \{ useEffect, useState \} from 'react';/;
const importReplacement = `import React, { useEffect, useState, useRef } from 'react';`;
content = content.replace(importRegex, importReplacement);

const stateRegex = /const \[showDropdown, setShowDropdown\] = useState\(false\);/;
const stateReplacement = `const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);`;
content = content.replace(stateRegex, stateReplacement);

const jsxRegex = /<div className="relative">/;
const jsxReplacement = `<div className="relative" ref={dropdownRef}>`;
content = content.replace(jsxRegex, jsxReplacement);

fs.writeFileSync('src/components/Notifications.tsx', content);
console.log("Patched Notifications.tsx click outside");
