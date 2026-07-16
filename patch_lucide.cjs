const fs = require('fs');
let content = fs.readFileSync('src/components/Profile.tsx', 'utf8');

content = content.replace(
  "import { Bell, ShieldCheck, MapPin, Star, AlertTriangle, Store, MessageCircle, Calendar, LogOut, CheckCircle2, XCircle, Globe, Type, Moon, Sun, BadgeCheck, Camera } from 'lucide-react';",
  "import { Bell, ShieldCheck, MapPin, Star, AlertTriangle, Store, MessageCircle, Calendar, LogOut, CheckCircle2, XCircle, Globe, Type, Moon, Sun, BadgeCheck, Camera, Search, UserPlus, Wifi, Check, X } from 'lucide-react';"
);

fs.writeFileSync('src/components/Profile.tsx', content);
