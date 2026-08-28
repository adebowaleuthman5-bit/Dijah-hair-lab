import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageBanner from '@/components/public/PageBanner';
import Button from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    const result = await register({ fullName, email, phone, password });
    setLoading(false);
    if (result.success) {
      navigate('/account');
    } else {
      setError(result.error ?? 'Something went wrong. Please try again.');
    }
  };

  return (
    <>
      <PageBanner eyebrow="Customer Account" title="Create Account" />
      <section className="container-lab flex justify-center py-16 lg:py-24">
        <div className="w-full max-w-md">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Field label="Full Name" value={fullName} onChange={setFullName} required />
            <Field label="Email" type="email" value={email} onChange={setEmail} required />
            <Field label="Phone Number" type="tel" value={phone} onChange={setPhone} required />
            <Field label="Password" type="password" value={password} onChange={setPassword} required />

            {error && <p className="text-xs text-rose-600">{error}</p>}

            <Button type="submit" disabled={loading} className="mt-2 w-full">
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-rose-600">
              Login
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
