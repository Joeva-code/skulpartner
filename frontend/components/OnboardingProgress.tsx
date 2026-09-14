const steps = ['Verify', 'KYC', 'Beneficiary', 'Next of Kin', 'Consent'];

export default function OnboardingProgress({ step }: { step: number }) {
  const pct = Math.round((step / steps.length) * 100);

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between text-xs font-semibold text-gray-500">
        <span>
          Step {step} of {steps.length}
        </span>
        <span>{steps[step - 1]}</span>
      </div>

      <div className="mt-2 h-1.5 w-full rounded-full bg-gray-200">
        <div
          className="h-1.5 rounded-full bg-[#6d8f52] transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}