interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: React.ReactNode;
}

export function Card({ children, className = '', title, icon }: CardProps) {
  return (
    <div
      className={`bg-vault-gray border-2 border-vault-yellow-dark rounded-lg overflow-hidden ${className}`}
    >
      {title && (
        <div className="bg-vault-blue px-4 py-3 border-b-2 border-vault-yellow-dark flex items-center gap-2">
          {icon && <span className="text-vault-yellow">{icon}</span>}
          <h2 className="text-vault-yellow font-bold text-lg uppercase tracking-wide">
            {title}
          </h2>
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}
