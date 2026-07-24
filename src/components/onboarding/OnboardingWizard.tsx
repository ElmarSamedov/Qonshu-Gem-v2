import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, MapPin, ShieldCheck, Star, ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { useLanguageStore } from '../../store/useLanguageStore';
import { t } from '../../lib/i18n';

export default function OnboardingWizard() {
  const navigate = useNavigate();
  const { language } = useLanguageStore();
  
  const [currentStep, setCurrentStep] = useState(() => {
    const saved = localStorage.getItem('onboardingStep');
    return saved ? parseInt(saved, 10) : 0;
  });

  useEffect(() => {
    localStorage.setItem('onboardingStep', currentStep.toString());
  }, [currentStep]);

  const steps = [
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
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(curr => curr + 1);
    } else {
      // Go to actual auth screen
      localStorage.removeItem('onboardingStep');
      navigate('/auth');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(curr => curr - 1);
    } else {
      navigate(-1);
    }
  };

  const currentStepData = steps[currentStep];
  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 px-1">
            <span>Step {currentStep + 1} of {steps.length}</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-600 transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        <Card className="glass-panel border-black/10 dark:border-white/10 shadow-2xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Sidebar / Steps Indicator */}
            <div className="bg-slate-100 dark:bg-slate-800/50 p-6 md:w-1/3 border-b md:border-b-0 md:border-r border-black/5 dark:border-white/5">
              <div className="space-y-6">
                {steps.map((step, idx) => {
                  const isActive = idx === currentStep;
                  const isPast = idx < currentStep;
                  
                  return (
                    <div key={step.id} className={`flex items-center gap-3 transition-opacity duration-300 ${isActive ? 'opacity-100' : isPast ? 'opacity-70' : 'opacity-40'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 ${
                        isActive ? 'border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 
                        isPast ? 'border-emerald-500 bg-emerald-500 text-white' : 
                        'border-slate-300 dark:border-slate-600 text-slate-400'
                      }`}>
                        {isPast ? <CheckCircle2 className="w-4 h-4" /> : <span>{idx + 1}</span>}
                      </div>
                      <span className={`text-sm font-bold ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400'}`}>
                        {step.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Content Area */}
            <div className="p-8 md:w-2/3 flex flex-col justify-between min-h-[400px]">
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${currentStepData.bgColor} ${currentStepData.color}`}>
                  {currentStepData.icon}
                </div>
                
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
                  {currentStepData.title}
                </h2>
                
                <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                  {currentStepData.description}
                </p>

                <div className="space-y-3 mb-8">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">What you'll get</h4>
                  {currentStepData.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 mt-auto pt-4 border-t border-black/5 dark:border-white/5">
                <Button 
                  variant="outline" 
                  className="flex-1 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800"
                  onClick={handleBack}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Back
                </Button>
                <Button 
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20"
                  onClick={handleNext}
                >
                  {currentStep === steps.length - 1 ? 'Start Registration' : 'Next'} <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
