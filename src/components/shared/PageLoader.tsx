// src/components/shared/PageLoader.tsx
export function PageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cgs-cream">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-cgs-mist border-t-cgs-sage" />
          <div className="absolute inset-3 rounded-full bg-cgs-sage/20" />
        </div>
        <p className="font-display text-lg italic text-cgs-forest opacity-80">
          Common Ground Solutions
        </p>
      </div>
    </div>
  );
}
