const fs = require('fs');
let content = fs.readFileSync('src/components/AuthScreen.tsx', 'utf8');

// Add required markers
content = content.replace(/>First Name</g, '>* First Name<');
content = content.replace(/>Last Name</g, '>* Last Name<');
content = content.replace(/>Country</g, '>* Country<');
content = content.replace(/>City</g, '>* City<');
content = content.replace(/>District</g, '>* District<');
content = content.replace(/>Street</g, '>* Street<');
content = content.replace(/>Building</g, '>* Building<');
content = content.replace(/>Apartment</g, '>* Apartment<');

// Add HTML5 required attributes
content = content.replace(/onChange={\(e\) => setFirstName\(e.target.value\)}/g, 'onChange={(e) => setFirstName(e.target.value)} required');
content = content.replace(/onChange={\(e\) => setLastName\(e.target.value\)}/g, 'onChange={(e) => setLastName(e.target.value)} required');
content = content.replace(/onChange={\(e\) => setStreet\(e.target.value\)}/g, 'onChange={(e) => setStreet(e.target.value)} required');
content = content.replace(/onChange={\(e\) => setBuilding\(e.target.value\)}/g, 'onChange={(e) => setBuilding(e.target.value)} required');
content = content.replace(/onChange={\(e\) => setApartment\(e.target.value\)}/g, 'onChange={(e) => setApartment(e.target.value)} required');

// Ensure error is set
content = content.replace(
  "setError('Please fill out all required fields');",
  "setError('Please fill out all required fields'); alert('Please fill out all required fields marked with *');"
);

fs.writeFileSync('src/components/AuthScreen.tsx', content);
