const fs = require('fs');
let content = fs.readFileSync('src/components/onboarding/OnboardingWizard.tsx', 'utf8');

content = content.replace("style={{ width: `\\${progressPercentage}%` }}", "style={{ width: `${progressPercentage}%` }}");
content = content.replace("className={`flex items-center gap-3 transition-opacity duration-300 \\${isActive ? 'opacity-100' : isPast ? 'opacity-70' : 'opacity-40'}`}", "className={`flex items-center gap-3 transition-opacity duration-300 ${isActive ? 'opacity-100' : isPast ? 'opacity-70' : 'opacity-40'}`}");
content = content.replace("className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 \\${", "className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 ${");
content = content.replace("span className={`text-sm font-bold \\${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400'}`}", "span className={`text-sm font-bold ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400'}`}");
content = content.replace("className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 \\${currentStepData.bgColor} \\${currentStepData.color}`}", "className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${currentStepData.bgColor} ${currentStepData.color}`}");

fs.writeFileSync('src/components/onboarding/OnboardingWizard.tsx', content);
