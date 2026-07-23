/**
 * A smartphone shell used to preview screens during development
 * (and later, as the framed layout on wide viewports). On real
 * mobile the app fills the viewport, so this is presentation-only.
 */
export function PhoneFrame({ children, className = '' }) {
  return (
    <div
      className={[
        'relative w-[330px] max-w-full aspect-[330/680] flex flex-col overflow-hidden',
        'rounded-[44px] border-[11px] border-[#0f1319] bg-cream',
        'shadow-[0_40px_90px_-40px_rgba(15,19,25,0.55)]',
        className,
      ].join(' ')}
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[130px] h-6 bg-[#0f1319] rounded-b-2xl z-30" />
      <div className="flex-1 flex flex-col overflow-hidden bg-cream">{children}</div>
    </div>
  )
}
