import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import PageBanner from '@/components/public/PageBanner';
import Button from '@/components/ui/Button';
import { isSupabaseConfigured, supabase } from '@/lib/supabaseClient';
import { updatePasswordAfterReset } from '@/services/supabase/authService';

// Reached by clicking the link in the password-reset email. Supabase's
// client automatically detects the recovery token in the URL and
// establishes a temporary session — we just need to confirm that
// happened before letting the person set a new password.
export default function ResetPassword() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    // Supabase fires PASSWORD_RECOVERY once it's parsed the token from the
    // URL. If the person already has a session by the time this mounts
    // (e.g. a fast redirect), fall back to checking for one directly.
    const { data: subscription } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setReady(true);
    });

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });

    return () => subscription.subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const result = await updatePasswordAfterReset(password);
    setLoading(false);

    if (!result.success) {
      setError(result.error ?? 'Something went wrong. Please try again.');
      return;
    }
    setDone(true);
    setTimeout(() => navigate('/login'), 2500);
  };

  if (!isSupabaseConfigured) {
    return (
      <>
        <PageBanner eyebrow="Customer Account" title="Reset Password" />
        <section className="container-lab flex flex-col items-center gap-4 py-24 text-center">
          <p className="max-w-md text-sm text-ink-500">
            Password reset requires a connected Supabase project — this link only works once the site
            is running in live mode.
          </p>
          <Link to="/login" className="text-xs font-semibold uppercase tracking-wide text-rose-600">
            Back to Login
          </Link>
        </section>
      </>
    );
  }

  return (
    <>
      <PageBanner eyebrow="Customer Account" title="Set a New Password" />
      <section className="container-lab flex justify-center py-16 lg:py-24">
        <div className="w-full max-w-md">
          {done ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <CheckCircle2 size={32} className="text-gold-500" />
              <p className="font-display text-lg text-ink">Password updated</p>
              <p className="text-sm text-ink-500">Taking you to login...</p>
            </div>
          ) : !ready ? (
            <p className="text-center text-sm text-ink-500">
              Confirming your reset link... if this doesn&apos;t update in a few seconds, the link may
              have expired — request a new one from the{' '}
              <Link to="/forgot-password" className="font-semibold text-rose-600">
                reset password
              </Link>{' '}
              page.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-ink-700">New Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-sm border border-ink/15 px-4 py-3 text-sm focus:border-gold-500"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-ink-700">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="rounded-sm border border-ink/15 px-4 py-3 text-sm focus:border-gold-500"
                />
              </div>
              {error && <p className="text-xs text-rose-600">{error}</p>}
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Updating...' : 'Update Password'}
              </Button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
