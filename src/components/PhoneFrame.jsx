/**
 * Coque de smartphone. Sur petit écran (vrai mobile), l'app remplit tout le
 * viewport (h-dvh) et défile naturellement — la coque décorative n'apparaît
 * qu'à partir du breakpoint sm (aperçu de développement / grand écran).
 */
export function PhoneFrame({ children, className = '' }) {
  return (
    <div
      className={[
        'relative flex h-dvh w-full flex-col overflow-hidden bg-cream',
        'sm:h-auto sm:w-[330px] sm:max-w-full sm:aspect-[330/680]',
        'sm:rounded-[44px] sm:border-[11px] sm:border-[#0f1319]',
        'sm:shadow-[0_40px_90px_-40px_rgba(15,19,25,0.55)]',
        className,
      ].join(' ')}
    >
      <div className="absolute top-0 left-1/2 z-30 hidden h-6 w-[130px] -translate-x-1/2 rounded-b-2xl bg-[#0f1319] sm:block" />
      {/* `min-h-0` est indispensable : sans lui, un enfant flex refuse de
          rétrécir sous la hauteur de son contenu, la zone de défilement
          s'étire et tout le bas de l'écran se retrouve coupé. */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-cream">{children}</div>
    </div>
  )
}
