/**
 * Duolingo-style pressable button with a solid bottom shadow that
 * "compresses" on press. Variants map to the brand palette.
 */
const VARIANTS = {
  primary: 'bg-turquoise text-white shadow-[0_5px_0_var(--color-turquoise-dark)]',
  coral: 'bg-coral text-white shadow-[0_5px_0_var(--color-coral-dark)]',
  ghost: 'bg-transparent text-turquoise-deep shadow-none',
  neutral: 'bg-sand-2 text-ink shadow-[0_5px_0_var(--color-line)]',
}

export function Button({ variant = 'primary', className = '', children, ...props }) {
  return (
    <button
      className={[
        'w-full rounded-2xl py-[15px] text-[15px] font-extrabold tracking-tight',
        'transition-transform duration-75 active:translate-y-[2px]',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-turquoise-dark',
        'disabled:opacity-60 disabled:cursor-not-allowed',
        VARIANTS[variant],
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </button>
  )
}
