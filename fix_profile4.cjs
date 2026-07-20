const fs = require('fs');

let profile = fs.readFileSync('src/components/Profile.tsx', 'utf8');

const strToFind = `</div></div></div></div></div><BirthdaySettings />`;

if (profile.includes(strToFind)) {
    profile = profile.replace(strToFind, `</div></div><BirthdaySettings />`);
    fs.writeFileSync('src/components/Profile.tsx', profile);
    console.log("REPLACED!");
} else {
    console.log("NOT FOUND!");
}
