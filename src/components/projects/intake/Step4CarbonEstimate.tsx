// src/components/projects/intake/Step4CarbonEstimate.tsx
import { useState } from 'react';
import { useWizardStore } from '@/store/wizard.store';
import { Button } from '@/components/ui/Button';
import { formatINR } from '@/lib/utils/format';

const TONNES_OPTIONS = [500, 5000, 50000, 150000];
const LABELS = ['< 1,000 tonnes', '1,000 – 10,000 tonnes', '10,000 – 1,00,000 tonnes', '> 1,00,000 tonnes'];

export function Step4CarbonEstimate() {
  const { data, updateData, advance, back } = useWizardStore();
  const [sliderIdx, setSliderIdx] = useState(() => {
    const co2 = data.estimatedAnnualCo2;
    if (!co2) return 1;
    if (co2 < 1000) return 0;
    if (co2 < 10000) return 1;
    if (co2 < 100000) return 2;
    return 3;
  });

  const tonnes = TONNES_OPTIONS[sliderIdx];
  const conservative = { low: tonnes * 600, high: tonnes * 800 };
  const base = { low: tonnes * 850, high: tonnes * 1050 };
  const optimistic = { low: tonnes * 1200, high: tonnes * 1500 };

  const handleContinue = () => {
    updateData({ estimatedAnnualCo2: tonnes });
    advance();
  };

  return (
    <div>
      <div className="mb-8">
        <span className="font-display text-8xl font-bold italic text-cgs-forest/5 select-none">04</span>
        <h2 className="-mt-8 font-display text-3xl font-semibold italic text-cgs-forest">
          Estimated annual CO₂ reduction?
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          An honest estimate. Overestimates hurt your credibility assessment.
        </p>
      </div>

      <div className="max-w-lg">
        {/* Slider */}
        <div className="mb-4">
          <div className="mb-3 flex justify-between text-xs text-gray-500">
            {LABELS.map((l, i) => (
              <span key={i} className={i === sliderIdx ? 'font-semibold text-cgs-forest' : ''}>
                {i === 0 ? l.split(' ').slice(0, 2).join(' ') : i === 3 ? l.split(' ').slice(0, 2).join(' ') : l.split('–')[0].trim()}
              </span>
            ))}
          </div>
          <input
            type="range"
            min={0}
            max={3}
            step={1}
            value={sliderIdx}
            onChange={(e) => setSliderIdx(Number(e.target.value))}
            className="h-2 w-full cursor-pointer accent-cgs-sage"
          />
          <p className="mt-2 text-center font-semibold text-cgs-forest">{LABELS[sliderIdx]}</p>
        </div>

        {/* Revenue estimate card */}
        <div className="rounded-xl border border-cgs-mist/50 bg-cgs-cream/50 p-5">
          <p className="mb-3 text-sm font-semibold text-cgs-forest">
            Based on your estimate, your project could generate:
          </p>
          <div className="flex flex-col gap-2">
            {[
              { label: 'Conservative', range: conservative, price: '₹600/tonne', color: 'text-gray-600' },
              { label: 'Base case', range: base, price: '₹850/tonne', color: 'text-cgs-forest font-semibold' },
              { label: 'Optimistic', range: optimistic, price: '₹1,200/tonne', color: 'text-cgs-sage' },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between">
                <span className={`text-sm ${row.color}`}>{row.label}</span>
                <div className="text-right">
                  <span className={`text-sm ${row.color}`}>
                    {formatINR(row.range.low)} – {formatINR(row.range.high)} / year
                  </span>
                  <span className="ml-2 text-xs text-gray-400">({row.price})</span>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-gray-400">
            Estimates only. Actual revenue depends on verification outcome, quality score, and market conditions.
          </p>
        </div>

        <div className="mt-8 flex justify-between">
          <Button variant="ghost" onClick={back}>← Back</Button>
          <Button onClick={handleContinue} size="lg">Continue →</Button>
        </div>
      </div>
    </div>
  );
}
