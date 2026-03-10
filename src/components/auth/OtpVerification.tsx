// src/components/auth/OtpVerification.tsx
import * as React from 'react';
import { useRef, useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';

interface OtpVerificationProps {
  title: string;
  subtitle: string;
  onVerify: (otp: string) => void;
  onResend: () => void;
  isPending?: boolean;
  isResendPending?: boolean;
}

export function OtpVerification({
  title,
  subtitle,
  onVerify,
  onResend,
  isPending,
  isResendPending,
}: OtpVerificationProps) {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleChange = useCallback(
    (index: number, value: string) => {
      if (!/^\d*$/.test(value)) return;
      const newOtp = [...otp];
      newOtp[index] = value.slice(-1);
      setOtp(newOtp);
      // Auto-advance
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [otp]
  );

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (text) {
      setOtp([...text.split(''), ...Array(6 - text.length).fill('')]);
      inputRefs.current[Math.min(text.length, 5)]?.focus();
    }
  };

  const handleResend = () => {
    onResend();
    setCountdown(60);
  };

  const fullOtp = otp.join('');

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-6"
    >
      <div className="text-center">
        <h2 className="font-display text-2xl font-bold italic text-cgs-forest">{title}</h2>
        <p className="mt-2 text-sm text-gray-500">{subtitle}</p>
      </div>

      <div className="flex gap-3" onPaste={handlePaste}>
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={(el) => { inputRefs.current[i] = el; }}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            maxLength={1}
            inputMode="numeric"
            className={cn(
              'h-14 w-12 rounded-xl border-2 text-center text-2xl font-bold text-cgs-forest transition-all',
              'focus:border-cgs-sage focus:outline-none focus:ring-2 focus:ring-cgs-sage/20',
              digit ? 'border-cgs-sage bg-cgs-sage/5' : 'border-cgs-mist bg-white'
            )}
          />
        ))}
      </div>

      <Button
        onClick={() => onVerify(fullOtp)}
        loading={isPending}
        disabled={fullOtp.length !== 6}
        size="lg"
        className="w-full"
      >
        Verify OTP
      </Button>

      <div className="text-sm text-gray-500">
        {countdown > 0 ? (
          <span>Resend OTP in <strong className="text-cgs-forest">{countdown}s</strong></span>
        ) : (
          <button
            onClick={handleResend}
            disabled={isResendPending}
            className="font-medium text-cgs-sage hover:underline disabled:opacity-50"
          >
            Resend OTP
          </button>
        )}
      </div>
    </motion.div>
  );
}
