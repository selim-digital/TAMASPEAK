/**
 * Feedback banner shown after checking an answer.
 * IMPORTANT: rendered in normal flow ABOVE the action button (never
 * absolutely positioned), so it can't overlap the button.
 */
export function FeedbackBar({ correct, word, answer }) {
  const showPair = word && word !== answer // évite « X » = X sur les questions sans mot source
  return (
    <div
      className={`animate-rise rounded-2xl px-4 py-3 ${correct ? 'bg-turquoise/15' : 'bg-coral/15'}`}
      role="status"
    >
      <div className={`flex items-center gap-2 text-[15px] font-extrabold ${correct ? 'text-turquoise-deep' : 'text-coral-dark'}`}>
        <span aria-hidden="true">{correct ? '✓' : '✕'}</span>
        {correct ? 'Igerrez ! (Excellent !)' : 'Presque !'}
      </div>
      <div className="mt-0.5 text-[12.5px] text-ink-soft">
        {correct ? (
          showPair ? (
            <>
              « {word} » = <b className="text-ink">{answer}</b>
            </>
          ) : (
            <b className="text-ink">{answer}</b>
          )
        ) : (
          <>
            La bonne réponse : <b className="text-ink">{answer}</b>
          </>
        )}
      </div>
    </div>
  )
}
