import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import type { InputHTMLAttributes, ReactNode } from 'react';

const fieldBase =
  'w-full rounded-2xl border border-line-strong bg-bg px-4 text-[1rem] outline-none transition-[border-color,box-shadow] focus:border-accent focus:shadow-[0_0_0_4px_color-mix(in_srgb,var(--accent)_18%,transparent)]';

export function Field({ label, multiline, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string; multiline?: boolean }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-muted">{label}</span>
      {multiline ? (
        <textarea name={props.name} rows={4} className={`${fieldBase} resize-none py-3`} />
      ) : (
        <input {...props} className={`${fieldBase} h-12`} />
      )}
    </label>
  );
}

export function SuccessPanel({ title, body, children }: { title: string; body: string; children?: ReactNode }) {
  return (
    <div className="mx-auto flex min-h-[80svh] max-w-md flex-col items-center justify-center px-6 pt-24 text-center">
      <motion.span
        className="grid h-20 w-20 place-items-center rounded-full bg-ok text-white shadow-lift"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 16 }}
      >
        <motion.span initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
          <Check size={36} strokeWidth={2.4} />
        </motion.span>
      </motion.span>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.6 }}>
        <h1 className="mt-8 font-display text-4xl">{title}</h1>
        <p className="mt-3 text-muted">{body}</p>
        <div className="mt-8 flex justify-center">{children}</div>
      </motion.div>
    </div>
  );
}
