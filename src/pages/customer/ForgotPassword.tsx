import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import PageBanner from '@/components/public/PageBanner';
import Button from '@/components/ui/Button';
import { isSupabaseConfigured } from '@/lib/supabaseClient';
import { requestPasswordReset } from '@/services/supabase/authService';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setError(null);

    if (isSupabaseConfigured) {
      setLoading(true);
      const result = await requestPasswordReset(email);
      setLoading(false);
      if (!result.success) {
        setError(result.error ?? 'Something went wrong. Please try again.');
        return;
      }
    }
    // Demo mode: no backend to actually send anything, so this just shows
    // the same confirmation screen a real request would produce.
    setSubmitted(true);
  };

  return (
    <>
      <PageBanner eyebrow="Customer Account" title="Reset Password" />
      <section className="container-lab flex justify-center py-16 lg:py-24">
        <div className="w-full max-w-md">
          {submitted ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <CheckCircle2 size={32} className="text-gold-500" />
              <p className="font-display text-lg text-ink">Check your email</p>
              <p className="text-sm text-ink-500">
                If an account exists for {email}, a reset link has been sent.
              </p>
              {!isSupabaseConfigured && (
                <p className="text-xs text-gold-700">
                  Demo mode — no real email is sent; this is just a preview of the flow.
                </p>
              )}
              <Link to="/login" className="mt-2 text-xs font-semibold uppercase tracking-wide text-rose-600">
                Back to Login
              </Link>
            </div>
          ) : (
            <>
              <p className="mb-6 text-sm text-ink-500">
                Enter the email associated with your account and we&apos;ll send you a reset link.
              </p>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wide text-ink-700">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-sm border border-ink/15 px-4 py-3 text-sm focus:border-gold-500"
                  />
                </div>
                {error && <p className="text-xs text-rose-600">{error}</p>}
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </form>
              <p className="mt-6 text-center text-sm text-ink-500">
                Remembered it?{' '}
                <Link to="/login" className="font-semibold text-rose-600">
                  Back to Login
                </Link>
              </p>
            </>
          )}
        </div>
      </section>
    </>
  );
}
