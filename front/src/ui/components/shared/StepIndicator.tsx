import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { WizardStep } from './StepWizard';

interface StepIndicatorProps {
  steps: WizardStep[];
  currentStep: number;
  onStepClick: (index: number) => void;
}

const dotColor: Record<string, string> = {
  default: 'bg-vault-yellow-dark',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  error: 'bg-red-500',
};

const badgeText: Record<string, string> = {
  default: 'text-vault-yellow-dark',
  success: 'text-green-400',
  warning: 'text-yellow-400',
  error: 'text-red-400',
};

export function StepIndicator({ steps, currentStep, onStepClick }: StepIndicatorProps) {
  const { t } = useTranslation();

  const canGoPrev = currentStep > 0;
  const canGoNext = currentStep < steps.length - 1;
  const activeStep = steps[currentStep];

  return (
    <div className="flex-shrink-0 px-3 pt-3 pb-2" role="tablist">
      {/* Row: prev arrow — node rail — next arrow */}
      <div className="flex items-center gap-2">
        {/* Prev arrow */}
        <button
          type="button"
          onClick={() => canGoPrev && onStepClick(currentStep - 1)}
          disabled={!canGoPrev}
          className={`p-1 rounded transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center ${
            canGoPrev
              ? 'text-vault-yellow hover:bg-vault-yellow/10'
              : 'text-gray-700 cursor-default'
          }`}
          aria-label={t('wizard.previousStep')}
        >
          <ChevronLeft size={18} />
        </button>

        {/* Node rail */}
        <div className="flex-1 flex items-center justify-center">
          {steps.map((step, index) => {
            const isActive = index === currentStep;
            const isPast = index < currentStep;
            const color = step.badgeColor ?? 'default';

            return (
              <div key={step.id} className="flex items-center">
                {/* Connector line */}
                {index > 0 && (
                  <div
                    className={`h-px w-3 sm:w-5 md:w-7 transition-colors ${
                      index <= currentStep ? 'bg-vault-yellow-dark/50' : 'bg-gray-700/40'
                    }`}
                  />
                )}

                {/* Node */}
                <button
                  type="button"
                  role="tab"
                  id={`wizard-tab-${step.id}`}
                  aria-selected={isActive}
                  aria-controls={`wizard-panel-${step.id}`}
                  aria-label={t(step.labelKey)}
                  onClick={() => onStepClick(index)}
                  className={`
                    relative w-7 h-7 rounded-full flex items-center justify-center
                    text-[11px] font-bold font-mono transition-all duration-200
                    border flex-shrink-0
                    ${isActive
                      ? 'border-vault-yellow bg-vault-yellow text-vault-blue-dark shadow-[0_0_8px_rgba(244,208,63,0.35)]'
                      : isPast
                      ? `border-vault-yellow-dark/50 ${dotColor[color]} text-vault-blue-dark hover:border-vault-yellow`
                      : 'border-gray-600/60 bg-vault-gray-light/50 text-gray-500 hover:border-gray-400 hover:text-gray-300'
                    }
                  `}
                >
                  {index + 1}

                  {/* Badge dot */}
                  {step.badge !== undefined && step.badge !== '' && !isActive && (
                    <span
                      className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full border border-vault-gray ${
                        dotColor[color]
                      }`}
                    />
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Next arrow */}
        <button
          type="button"
          onClick={() => canGoNext && onStepClick(currentStep + 1)}
          disabled={!canGoNext}
          className={`p-1 rounded transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center ${
            canGoNext
              ? 'text-vault-yellow hover:bg-vault-yellow/10'
              : 'text-gray-700 cursor-default'
          }`}
          aria-label={t('wizard.nextStep')}
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Current step label + badge */}
      <div className="flex items-center justify-center gap-2 mt-1.5">
        <span className="text-[11px] font-bold text-vault-yellow tracking-wider uppercase">
          {t(activeStep.labelKey)}
        </span>
        {activeStep.badge !== undefined && activeStep.badge !== '' && (
          <span className={`text-[11px] font-mono font-bold ${badgeText[activeStep.badgeColor ?? 'default']}`}>
            {activeStep.badge}
          </span>
        )}
      </div>
    </div>
  );
}
