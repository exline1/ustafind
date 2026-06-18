import { Star } from '@phosphor-icons/react';

interface RatingProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  count?: number;
  interactive?: boolean;
  onChange?: (value: number) => void;
}

const sizeMap: Record<string, string> = {
  sm: 'w-3.5 h-3.5',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

export default function Rating({
  value,
  max = 5,
  size = 'md',
  showValue = false,
  count,
  interactive = false,
  onChange,
}: RatingProps) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5" aria-label={`Reyting: ${value} dan ${max}`}>
        {Array.from({ length: max }, (_, i) => {
          const filled = i < Math.floor(value);
          const half = !filled && i < value;

          return (
            <button
              key={i}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onChange?.(i + 1)}
              className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform duration-300`}
              aria-label={`${i + 1} yulduz`}
            >
              <Star
                weight={filled || half ? 'fill' : 'regular'}
                className={`${sizeMap[size]} ${filled || half ? 'text-rating' : 'text-gray-light'}`}
              />
            </button>
          );
        })}
      </div>
      {showValue && (
        <span className="text-sm font-semibold text-brand-dark">{value.toFixed(1)}</span>
      )}
      {count !== undefined && <span className="text-sm text-gray-muted">({count})</span>}
    </div>
  );
}
