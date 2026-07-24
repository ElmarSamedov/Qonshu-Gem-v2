const fs = require('fs');
let content = fs.readFileSync('src/components/AuthScreen.tsx', 'utf8');

content = content.replace(/const \[street, setStreet\] = useState\('Nizami St'\);/, "const [street, setStreet] = useState('');");
content = content.replace(/const \[building, setBuilding\] = useState\('42'\);/, "const [building, setBuilding] = useState('');");
content = content.replace(/const \[entrance, setEntrance\] = useState\('2'\);/, "const [entrance, setEntrance] = useState('');");
content = content.replace(/const \[apartment, setApartment\] = useState\('15'\);/, "const [apartment, setApartment] = useState('');");
content = content.replace(/const \[phone, setPhone\] = useState\('\+994501234567'\);/, "const [phone, setPhone] = useState('');");

fs.writeFileSync('src/components/AuthScreen.tsx', content);
