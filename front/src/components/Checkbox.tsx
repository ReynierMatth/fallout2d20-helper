import type { InputHTMLAttributes } from 'react';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
}

export function Checkbox({ label, className = '', ...props }: CheckboxProps) {
  return (
    <label className={`flex items-center gap-2 cursor-pointer ${className}`}>
      <input
        type="checkbox"
        className="w-5 h-5 rounded border-2 border-vault-yellow-dark bg-vault-gray-light text-vault-yellow focus:ring-vault-yellow focus:ring-2 accent-vault-yellow"
        {...props}
      />
      <span className="text-vault-yellow text-sm">{label}</span>
    </label>
  );
}
