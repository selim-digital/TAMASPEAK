/**
 * A single answer choice in an exercise.
 * state: 'idle' | 'selected' | 'correct' | 'wrong' | 'dim'
 */
const STATES = {
  idle: 'border-line bg-white text-ink',
  selected: 'border-turquoise bg-turquoise/10 text-turquoise-deep',
  correct: 'border-turquoise bg-turquoise/15 text-turquoise-deep',
  wrong: 'border-coral bg-coral/12 text-coral-dark',
  dim: 'border-line bg-white text-ink opacity-50',
}

const KEY_STATES = {
  idle: 'bg-sand-2 text-ink-soft',
  selected: 'bg-turquoise text-white',
  correct: 'bg-turquoise text-white',
  wrong: 'bg-coral text-white',
  dim: 'bg-sand-2 text-ink-soft',
}

export function ExerciseChoice({ letter, text, state = 'idle', disabled, onClick }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-pressed={state === 'selected'}
      className={`flex items-center gap-2.5 rounded-2xl border-2 border-b-4 px-4 py-3.5 text-left text-[15px] font-bold transition-transform active:translate-y-px disabled:cursor-default ${STATES[state]}`}
    >
      <span className={`grid h-[22px] w-[22px] flex-none place-items-center rounded-md text-[11px] font-extrabold ${KEY_STATES[state]}`}>
        {letter}
      </span>
      {text}
    </button>
  )
}
