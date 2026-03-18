'use client';

/**
 * Renders ETG metapolicy_struct in a human-readable format.
 * Only shows sections that have data.
 */

interface MetapolicyDisplayProps {
  metapolicy: {
    struct?: Record<string, any>;
    extra?: string;
  };
}

const POLICY_LABELS: Record<string, string> = {
  check_in_check_out: 'Check-in / Check-out',
  children: 'Children Policy',
  pets: 'Pet Policy',
  internet: 'Internet',
  parking: 'Parking',
  meal: 'Meals',
  smoking: 'Smoking',
  extra_bed: 'Extra Bed',
  cots: 'Cots / Cribs',
  age_restriction: 'Age Restriction',
  deposit: 'Deposit',
  cards: 'Accepted Cards',
  shuttle: 'Airport Shuttle',
  visa: 'Visa / Documents',
};

function formatValue(val: any): string {
  if (val === null || val === undefined) return '';
  if (typeof val === 'boolean') return val ? 'Yes' : 'No';
  if (typeof val === 'string') return val;
  if (typeof val === 'number') return String(val);
  if (Array.isArray(val)) return val.map(formatValue).filter(Boolean).join(', ');
  if (typeof val === 'object') {
    return Object.entries(val)
      .map(([k, v]) => `${k.replace(/_/g, ' ')}: ${formatValue(v)}`)
      .join(' · ');
  }
  return String(val);
}

export default function MetapolicyDisplay({ metapolicy }: MetapolicyDisplayProps) {
  const struct = metapolicy?.struct || {};
  const extra = metapolicy?.extra || '';
  const entries = Object.entries(struct).filter(([, v]) => v !== null && v !== undefined);

  if (!entries.length && !extra) return null;

  return (
    <div className="mt-6 border border-gray-200 rounded-lg p-4">
      <h4 className="text-base font-semibold text-gray-900 mb-3">Hotel Policies</h4>
      <div className="space-y-2">
        {entries.map(([key, value]) => (
          <div key={key} className="flex gap-2 text-sm">
            <span className="font-medium text-gray-700 min-w-[140px]">
              {POLICY_LABELS[key] || key.replace(/_/g, ' ')}:
            </span>
            <span className="text-gray-600">{formatValue(value)}</span>
          </div>
        ))}
        {extra && (
          <div className="pt-2 border-t border-gray-100 text-sm text-gray-600">
            {extra}
          </div>
        )}
      </div>
    </div>
  );
}
