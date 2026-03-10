// src/components/layout/PageHeader.tsx
import { ChevronRight } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { cn } from '@/lib/utils/cn';

interface Breadcrumb {
  label: string;
  to?: string;
}

interface Props {
  title: string;
  subtitle?: string;
  breadcrumbs?: Breadcrumb[];
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, subtitle, breadcrumbs, actions, className }: Props) {
  return (
    <div className={cn('mb-6 flex items-start justify-between gap-4', className)}>
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="mb-1.5 flex items-center gap-1 text-xs text-gray-400">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1">
                {i > 0 && <ChevronRight size={12} />}
                {crumb.to ? (
                  <Link to={crumb.to} className="hover:text-cgs-sage">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-gray-600">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        <h1 className="font-display text-2xl font-bold italic text-cgs-forest">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
    </div>
  );
}
