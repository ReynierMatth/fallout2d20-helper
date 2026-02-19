import { Children, type ReactNode } from 'react';

export interface WizardStep {
  id: string;
  labelKey: string;
  icon?: ReactNode;
  badge?: string | number;
  badgeColor?: 'default' | 'success' | 'warning' | 'error';
}

interface StepWizardProps {
  steps: WizardStep[];
  currentStep: number;
  onStepChange: (index: number) => void;
  stickyHeader?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}

export function StepWizard({
  steps: _steps,
  currentStep,
  onStepChange: _onStepChange,
  stickyHeader,
  footer,
  children,
}: StepWizardProps) {
  const childArray = Children.toArray(children);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {stickyHeader}

      {/* Active panel — simple conditional render, no scroll-snap */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          {childArray[currentStep] ?? null}
        </div>
      </div>

      {footer}
    </div>
  );
}
