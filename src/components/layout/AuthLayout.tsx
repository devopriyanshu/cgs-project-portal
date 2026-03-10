// src/components/layout/AuthLayout.tsx
export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cgs-cream">
      {/* Decorative background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-cgs-sage/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-cgs-moss/10 blur-3xl" />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
