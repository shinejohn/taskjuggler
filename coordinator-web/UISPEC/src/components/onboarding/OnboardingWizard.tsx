import React, { useState } from 'react';
import { RoleSelectionStep } from './RoleSelectionStep';
import { IndustrySelectionStep } from './IndustrySelectionStep';
import { PersonaCustomizerStep } from './PersonaCustomizerStep';
import { BusinessPollStep } from './BusinessPollStep';
import { SetupCompleteStep } from './SetupCompleteStep';
export function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };
  const progressPercentage = currentStep / totalSteps * 100;
  return <div className="min-h-screen w-full bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Progress Header - Hide on final step for cleaner look */}
        {currentStep < 5 && <div className="mb-8 max-w-3xl mx-auto animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm font-semibold text-[#1B4F72]">
                Step {currentStep} of {totalSteps}
              </span>
              <span className="text-sm font-medium text-slate-500">
                {Math.round(progressPercentage)}% Complete
              </span>
            </div>
            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-[#1B4F72] rounded-full transition-all duration-500 ease-out" style={{
            width: `${progressPercentage}%`
          }} />
            </div>
          </div>}

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-10 lg:p-12 min-h-[600px]">
          {currentStep === 1 && <RoleSelectionStep onNext={handleNext} />}

          {currentStep === 2 && <IndustrySelectionStep onNext={handleNext} onBack={handleBack} />}

          {currentStep === 3 && <PersonaCustomizerStep onNext={handleNext} onBack={handleBack} />}

          {currentStep === 4 && <BusinessPollStep onNext={handleNext} onBack={handleBack} />}

          {currentStep === 5 && <SetupCompleteStep />}
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center space-x-6 text-sm text-slate-400">
          <a href="#" className="hover:text-[#1B4F72] transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-[#1B4F72] transition-colors">
            Terms of Service
          </a>
          <a href="#" className="hover:text-[#1B4F72] transition-colors">
            Contact Support
          </a>
        </div>
      </div>
    </div>;
}