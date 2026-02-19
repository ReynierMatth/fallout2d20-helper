import type { SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, options, className = '', ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-vault-yellow text-sm font-medium uppercase tracking-wide">
          {label}
        </label>
      )}
      <select
        className={`bg-vault-gray-light text-vault-yellow border-2 border-vault-yellow-dark rounded px-3 py-2 focus:outline-none focus:border-vault-yellow ${className}`}
        {...props}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
