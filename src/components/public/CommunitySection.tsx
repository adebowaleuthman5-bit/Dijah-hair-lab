import { FormEvent, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

// Frontend-only demo state. Structured so submission can later call
// services/customerService.ts -> a real newsletter/community endpoint.
export default function CommunitySection() {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !email.trim()) {
      setError('Please fill in both fields.');
      return;
    }
    setError(null);
    // Demo only — no backend call yet.
    setSubmitted(true);
  };

  return (
    <section id="community" className="bg-ink py-20 text-cream lg:py-28">
      <div className="container-lab flex flex-col items-center text-center">
        <span className="eyebrow text-gold-500">Community</span>
        <h2 className="mt-4 max-w-xl font-display text-3xl font-medium leading-tight sm:text-4xl">
          Join the DIJAH HAIR LAB Community
        </h2>
        <p className="mt-4 max-w-md text-sm text-cream/60">
          Stay inspired with new styles, beauty tips, special offers and the latest updates from
          DIJAH HAIR LAB.
        </p>

        {submitted ? (
          <div className="mt-8 flex items-center gap-2 rounded-sm bg-cream/10 px-5 py-4 text-sm">
            <CheckCircle2 size={18} className="text-gold-400" />
            You&apos;re in, {firstName}! Welcome to the community.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row">
            <input
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full rounded-sm border border-cream/20 bg-transparent px-4 py-3 text-sm placeholder:text-cream/40 focus:border-gold-500"
              aria-label="First name"
            />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-sm border border-cream/20 bg-transparent px-4 py-3 text-sm placeholder:text-cream/40 focus:border-gold-500"
              aria-label="Email address"
            />
            <button
              type="submit"
              className="shrink-0 whitespace-nowrap rounded-sm bg-gold-500 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-ink hover:bg-gold-600"
            >
              Join the Community
            </button>
          </form>
        )}
        {error && <p className="mt-3 text-xs text-rose-400">{error}</p>}
      </div>
    </section>
  );
}
