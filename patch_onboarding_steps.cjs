const fs = require('fs');
let content = fs.readFileSync('src/components/onboarding/OnboardingWizard.tsx', 'utf8');

const regex = /const steps = \[\s*\{\s*id: 'account',\s*title: 'Create Account',\s*description: 'Set up your secure account. We just need your basic details to get started.',[\s\S]*?features: \['Personalized feed', 'Relevant events', 'Meet like-minded people'\]\s*\}\s*\];/;
const replacement = `const steps = [
    {
      id: 'account',
      title: (t('onboarding.step0.title' as any, language) as string) || 'Create Account',
      description: (t('onboarding.step0.desc' as any, language) as string) || 'Set up your secure account. We just need your basic details to get started.',
      icon: <User className="w-8 h-8" />,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      features: ['Secure login', 'Basic profile setup', 'Privacy controls']
    },
    {
      id: 'address',
      title: (t('onboarding.step1.title' as any, language) as string) || 'Your Location',
      description: (t('onboarding.step1.desc' as any, language) as string) || 'Select your country, city, street, and building to join your local neighborhood.',
      icon: <MapPin className="w-8 h-8" />,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
      features: ['Find your neighborhood', 'Local news feed', 'Connect with neighbors']
    },
    {
      id: 'verification',
      title: (t('onboarding.step2.title' as any, language) as string) || 'Verification',
      description: (t('onboarding.step2.desc' as any, language) as string) || 'Verify your identity to unlock all community features and build trust.',
      icon: <ShieldCheck className="w-8 h-8" />,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
      features: ['Unlock posting', 'Marketplace access', 'Trusted status']
    },
    {
      id: 'interests',
      title: (t('onboarding.step3.title' as any, language) as string) || 'Interests',
      description: (t('onboarding.step3.desc' as any, language) as string) || 'Pick topics you care about to personalize your feed and discover local events.',
      icon: <Star className="w-8 h-8" />,
      color: 'text-amber-500',
      bgColor: 'bg-amber-100 dark:bg-amber-900/30',
      features: ['Personalized feed', 'Relevant events', 'Meet like-minded people']
    }
  ];`;

content = content.replace(regex, replacement);
fs.writeFileSync('src/components/onboarding/OnboardingWizard.tsx', content);
console.log("Patched OnboardingWizard.tsx");
