import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { apiService } from '../services/api';
import { UserSession } from '../types';

interface TwoFactorPageProps {
  email: string;
  organization?: string;
  onVerifySuccess: (user: UserSession) => void;
  onBackToSignIn: () => void;
}

export const TwoFactorPage: React.FC<TwoFactorPageProps> = ({
  email,
  organization = 'CO-LEAD',
  onVerifySuccess,
  onBackToSignIn,
}) => {
  const [digits, setDigits] = useState(['1', '2', '3', '4', '5', '6']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleDigitChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }
    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const code = digits.join('');
    if (code.length !== 6) {
      setError('Please enter all 6 digits of your verification code');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await apiService.verify2FA({ code, email, organization });
      onVerifySuccess(res.user);
    } catch (err: any) {
      setError(err.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    setResendMessage('A new verification code has been dispatched to your email.');
    setTimeout(() => setResendMessage(null), 4000);
  };

  return (
    <div className="min-h-screen w-full bg-[#F3F0E9] flex flex-col justify-between text-[#342F2A] relative">
      <div className="flex-1 max-w-lg mx-auto w-full px-6 py-16 flex flex-col justify-center">
        <div className="rounded-2xl border border-[#B8A48D]/50 bg-[#FBF9F5] p-8 sm:p-10 shadow-xl space-y-6">
          <button
            onClick={onBackToSignIn}
            className="inline-flex items-center gap-1.5 text-xs text-[#5B5045] hover:text-[#342F2A] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to sign in</span>
          </button>

          <div className="space-y-2 text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#E8DED2] text-[#342F2A] mx-auto border border-[#B8A48D]">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-[#342F2A]">
              Verify your account
            </h1>
            <p className="text-xs text-[#5B5045] leading-relaxed max-w-sm mx-auto">
              Enter the verification code sent to <strong className="text-[#342F2A]">{email || 'your email'}</strong>.
            </p>
          </div>

          {error && (
            <div className="rounded-lg border border-red-800 bg-red-50 p-3 text-xs text-red-900 text-center">
              {error}
            </div>
          )}

          {resendMessage && (
            <div className="rounded-lg border border-emerald-800 bg-emerald-50 p-3 text-xs text-emerald-900 text-center flex items-center justify-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-700" />
              <span>{resendMessage}</span>
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-6">
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              {digits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    inputRefs.current[idx] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className="w-11 h-13 sm:w-12 sm:h-14 text-center font-mono text-xl font-bold rounded-lg border border-[#B8A48D] bg-[#F3F0E9] text-[#342F2A] focus:outline-none focus:border-[#342F2A] shadow-sm transition-all"
                />
              ))}
            </div>

            <div className="space-y-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-lg bg-[#342F2A] hover:bg-[#5B5045] text-[#F3F0E9] text-xs font-semibold tracking-wide transition-all shadow-md disabled:opacity-50"
              >
                <span>{loading ? 'Verifying...' : 'Verify'}</span>
              </button>

              <button
                type="button"
                onClick={handleResend}
                className="w-full text-center text-xs text-[#5B5045] hover:text-[#342F2A] font-semibold underline underline-offset-2 transition-colors"
              >
                Resend Code
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
