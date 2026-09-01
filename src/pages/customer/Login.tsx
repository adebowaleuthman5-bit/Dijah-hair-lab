import { FormEvent, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import PageBanner from '@/components/public/PageBanner';
import Button from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { demoCustomer } from '@/data/customers';
import { isSupabaseConfigured } from '@/lib/supabaseClient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      const redirectTo = (location.state as { from?: string })?.from ?? '/account';
      navigate(redirectTo);
    } else {
      setError(result.error ?? 'Something went wrong. Please try again.');
    }
  };

  return (
    <>
      <PageBanner eyebrow="Customer Account" title="Login" />
      <section className="container-lab flex justify-center py-16 lg:py-24">
        <div className="w-full max-w-md">
          {!isSupabaseConfigured && (
            <div className="mb-6 rounded-sm border border-gold-200 bg-gold-50 px-4 py-3 text-xs text-gold-700">
              Demo mode — log in with <strong>{demoCustomer.email}</strong> (any password), or register
              a new account below.
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Field label="Email" type="email" value={email} onChange={setEmail} required />
            <Field label="Password" type="password" value={password} onChange={setPassword} required />

            {error && <p className="text-xs text-rose-600">{error}</p>}

            <div className="flex items-center justify-between text-xs">
              <Link to="/forgot-password" className="font-semibold text-ink-500 hover:text-rose-600">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-500">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-semibold text-rose-600">
              Register
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-wide text-ink-700">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-sm border border-ink/15 px-4 py-3 text-sm focus:border-gold-500"
      />
    </div>
  );
}
