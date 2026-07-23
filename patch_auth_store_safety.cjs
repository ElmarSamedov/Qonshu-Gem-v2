const fs = require('fs');
let content = fs.readFileSync('src/store/useAuthStore.ts', 'utf8');

const safetyCheckInInterface = `export interface SafetyCheckIn {
  enabled: boolean;
  deadlineTime: string; // e.g. "12:00"
  contactUids: string[];
  pendingContactUids: string[];
  lastCheckInDate?: string;
  escalatedDate?: string;
}

`;

content = content.replace("export interface UserLocation {", safetyCheckInInterface + "export interface UserLocation {");
content = content.replace("  badges?: string[];", "  badges?: string[];\n  safetyCheckIn?: SafetyCheckIn;");

fs.writeFileSync('src/store/useAuthStore.ts', content);
console.log("Patched useAuthStore.ts");
