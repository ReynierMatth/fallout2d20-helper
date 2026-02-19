import { Minus, Plus } from 'lucide-react';

interface SpecialInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  className?: string;
}

export function SpecialInput({
  label,
  value,
  onChange,
  min = 1,
  max = 10,
  disabled = false,
  className = '',
}: SpecialInputProps) {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      onChange(newValue);
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-vault-yellow font-bold text-sm uppercase w-24 truncate">
        {label}
      </span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={disabled || value <= min}
          className="w-7 h-7 flex items-center justify-center rounded bg-vault-blue border border-vault-yellow-dark text-vault-yellow hover:bg-vault-blue-light disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Minus size={14} />
        </button>
        <input
          type="number"
          value={value}
          onChange={handleInputChange}
          disabled={disabled}
          min={min}
          max={max}
          className="w-12 h-7 text-center bg-gray-800 border border-vault-yellow-dark rounded text-vault-yellow font-bold text-lg appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <button
          type="button"
          onClick={handleIncrement}
          disabled={disabled || value >= max}
          className="w-7 h-7 flex items-center justify-center rounded bg-vault-blue border border-vault-yellow-dark text-vault-yellow hover:bg-vault-blue-light disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}
