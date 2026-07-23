import { useEffect, useMemo, useState } from 'react'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const STATE_CLS = {
  idle: 'border-line bg-white text-ink border-b-4',
  sel: 'border-turquoise bg-turquoise/10 text-turquoise-deep border-b-4',
  wrong: 'border-coral bg-coral/12 text-coral-dark border-b-4 animate-shake',
  done: 'border-transparent bg-turquoise/15 text-turquoise-deep/40 border-b-2',
}

function Tile({ label, state, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={state === 'done'}
      className={`rounded-2xl border-2 px-3 py-3 text-[14px] font-bold transition ${STATE_CLS[state]}`}
    >
      {label}
    </button>
  )
}

/**
 * Exercice « Associe » : relier chaque mot kabyle à sa traduction.
 * Appelle onComplete() quand toutes les paires sont trouvées.
 */
export function MatchExercise({ pairs, onComplete }) {
  const left = useMemo(() => shuffle(pairs.map((p) => p.kab)), [pairs])
  const right = useMemo(() => shuffle(pairs.map((p) => p.fr)), [pairs])
  const [selKab, setSelKab] = useState(null)
  const [selFr, setSelFr] = useState(null)
  const [matched, setMatched] = useState(() => new Set())
  const [wrong, setWrong] = useState(null)

  useEffect(() => {
    if (matched.size === pairs.length) onComplete?.()
  }, [matched, pairs.length, onComplete])

  const isKabMatched = (k) => matched.has(k)
  const isFrMatched = (f) => pairs.some((p) => p.fr === f && matched.has(p.kab))

  function attempt(kab, fr) {
    if (pairs.some((p) => p.kab === kab && p.fr === fr)) {
      setMatched((m) => new Set(m).add(kab))
      setSelKab(null)
      setSelFr(null)
    } else {
      setWrong({ kab, fr })
      setTimeout(() => {
        setWrong(null)
        setSelKab(null)
        setSelFr(null)
      }, 550)
    }
  }

  function pickKab(k) {
    if (isKabMatched(k) || wrong) return
    setSelKab(k)
    if (selFr) attempt(k, selFr)
  }
  function pickFr(f) {
    if (isFrMatched(f) || wrong) return
    setSelFr(f)
    if (selKab) attempt(selKab, f)
  }

  const kabState = (k) => (isKabMatched(k) ? 'done' : wrong?.kab === k ? 'wrong' : selKab === k ? 'sel' : 'idle')
  const frState = (f) => (isFrMatched(f) ? 'done' : wrong?.fr === f ? 'wrong' : selFr === f ? 'sel' : 'idle')

  return (
    <div className="mt-2 grid grid-cols-2 gap-3">
      <div className="flex flex-col gap-2.5">
        {left.map((k) => (
          <Tile key={k} label={k} state={kabState(k)} onClick={() => pickKab(k)} />
        ))}
      </div>
      <div className="flex flex-col gap-2.5">
        {right.map((f) => (
          <Tile key={f} label={f} state={frState(f)} onClick={() => pickFr(f)} />
        ))}
      </div>
    </div>
  )
}
