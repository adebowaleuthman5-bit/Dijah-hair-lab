import { FormEvent, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { isSupabaseConfigured } from '@/lib/supabaseClient';

export default function AdminLogin() {
  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const from = (location.state as { from?: string } | null)?.from ?? '/admin';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error ?? 'Login failed.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4 py-12">
      <div className="w-full max-w-sm rounded-sm bg-white p-8">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-50 text-gold-600">
            <ShieldCheck size={22} />
          </span>
          <h1 className="font-display text-2xl font-medium text-ink">Admin Login</h1>
          <p className="text-xs text-ink-500">DIJAH HAIR LAB management dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-ink-700">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-sm border border-ink/15 px-4 py-2.5 text-sm focus:border-gold-500"
              placeholder="admin@dijahhairlab.com"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-ink-700">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-sm border border-ink/15 px-4 py-2.5 text-sm focus:border-gold-500"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-xs text-rose-600">{error}</p>}

          <Button type="submit" className="mt-2 w-full">
            Sign In
          </Button>
        </form>

        {!isSupabaseConfigured && (
          <div className="mt-6 rounded-sm bg-cream-100 p-3 text-center text-[11px] text-ink-500">
            Demo access: <span className="font-semibold">admin@dijahhairlab.com</span> — any password
          </div>
        )}

        <Link to="/" className="mt-4 block text-center text-xs font-semibold uppercase tracking-wide text-ink-500 hover:text-rose-600">
          Back to Website
        </Link>
      </div>
    </div>
  );
}
