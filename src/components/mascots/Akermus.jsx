/**
 * Akermus — la mascotte de Tama Speak : un petit figuier de barbarie.
 * (Nom kabyle proposé, graphie à confirmer par un locuteur natif.)
 *
 * Règle maison absolue : JAMAIS d'yeux. L'émotion passe par la posture,
 * les joues corail (ellipses larges et basses, SOUS la ligne de bouche)
 * et la bouche. Épines douces sur les flancs, aréoles claires basses et
 * asymétriques, fruit corail sur la tête.
 *
 * États : 'idle' (flottement doux) · 'celebrate' (saut squash & stretch,
 * une passe — remonter le composant via `key` pour rejouer) · 'console'
 * (penché doux + tapotement) · 'curious' (bascule interrogative).
 * Les classes ak-* (origines + animations) vivent dans index.css.
 */
const STATE_CLS = {
  idle: '',
  celebrate: 'ak-celebrate',
  console: 'ak-console',
  curious: 'ak-curious',
}

export function Akermus({ height = 120, state = 'idle', float = false, className = '' }) {
  const width = Math.round((height * 90) / 104)

  return (
    <div className={`${STATE_CLS[state] ?? ''} ${float ? 'animate-float' : ''} ${className}`.trim()}>
      <svg width={width} height={height} viewBox="0 0 90 104" aria-hidden="true">
        <ellipse cx="45" cy="99" rx="19" ry="4" fill="rgba(0,0,0,.10)" />
        <g className="ak-pose">
          <g className="ak-arm ak-arm-l">
            <rect x="13" y="52" width="9" height="24" rx="4.5" fill="#0a8f7a" />
          </g>
          <g className="ak-arm ak-arm-r">
            <rect x="68" y="52" width="9" height="24" rx="4.5" fill="#0a8f7a" />
          </g>

          {/* Corps en raquette de cactus */}
          <path d="M45 22c15 0 22 10 22 24v24c0 13-9 20-22 20s-22-7-22-20V46c0-14 7-24 22-24z" fill="var(--color-turquoise)" />
          <path d="M30 55c0-4 2.5-7 6-8v37c-3.5-1-6-3.5-6-7z" fill="#FFF6E9" />
          <path d="M60 55c0-4-2.5-7-6-8v37c3.5-1 6-3.5 6-7z" fill="#FFF6E9" />

          {/* Fruit de figuier de barbarie */}
          <ellipse cx="45" cy="15.5" rx="5" ry="6.5" fill="var(--color-coral)" />
          <circle cx="43.6" cy="13.5" r=".9" fill="var(--color-coral-deep)" />
          <circle cx="46.8" cy="16.5" r=".9" fill="var(--color-coral-deep)" />
          <circle cx="44.2" cy="19" r=".9" fill="var(--color-coral-deep)" />

          {/* Épines douces */}
          <path
            d="M23.5 40l-5-1.5M23.5 50l-5 .5M25 32l-4.5-2.5M66.5 40l5-1.5M66.5 50l5 .5M65 32l4.5-2.5"
            stroke="var(--color-turquoise-deep)"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Aréoles (basses, asymétriques — jamais en position de regard) */}
          <circle cx="39" cy="78" r="1.5" fill="#5BDCC6" />
          <circle cx="50" cy="80" r="1.5" fill="#5BDCC6" />
          <circle cx="45" cy="84" r="1.5" fill="#5BDCC6" />

          {/* Joues : ellipses larges et basses, SOUS la bouche */}
          <ellipse cx="33" cy="67" rx="6" ry="3" fill="var(--color-coral)" opacity=".5" />
          <ellipse cx="57" cy="67" rx="6" ry="3" fill="var(--color-coral)" opacity=".5" />

          {/* Bouche selon l'état */}
          {state === 'console' ? (
            <path d="M39 66q6-4 12 0" fill="none" stroke="var(--color-turquoise-deep)" strokeWidth="2.8" strokeLinecap="round" />
          ) : state === 'curious' ? (
            <circle cx="45" cy="63.5" r="3" fill="#fff" />
          ) : (
            <path d="M39 61q6 6 12 0" fill="none" stroke="var(--color-turquoise-deep)" strokeWidth="2.8" strokeLinecap="round" />
          )}

          <ellipse cx="37" cy="92" rx="6" ry="3.4" fill="#0a8f7a" />
          <ellipse cx="53" cy="92" rx="6" ry="3.4" fill="#0a8f7a" />
        </g>
      </svg>
    </div>
  )
}
