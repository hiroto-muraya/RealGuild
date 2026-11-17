import { cn } from '@/lib/utils'

/**
 * オリジナルの 16×16 ドット絵の冒険者。
 * 色は CSS 変数（--sprite-*）から取るので、配色パレットに合わせて自動で変わる。
 *   k: 輪郭 / h: 髪 / s: 肌 / a: 服 / b: 革（ベルト・靴・剣の柄） / m: 金属（剣）
 */
const SPRITE = [
  '................',
  '.....kkkkkk.....',
  '....khhhhhhk..m.',
  '...khhhhhhhhk.m.',
  '...khhsssshhk.m.',
  '...kskssssksk.m.',
  '...kssssssssk.m.',
  '....kssssssk..m.',
  '...kaaaaaaaak.m.',
  '..kaaaaaaaaaakm.',
  '..ksaaaaaaaaskb.',
  '..kkbbbbbbbbkk..',
  '...kaaaaaaaak...',
  '...kaaakkaaak...',
  '...kbbbkkbbbk...',
  '...kkkk..kkkk...',
]

const COLORS: Record<string, string> = {
  k: 'var(--sprite-k)',
  h: 'var(--sprite-h)',
  s: 'var(--sprite-s)',
  a: 'var(--sprite-a)',
  b: 'var(--sprite-b)',
  m: 'var(--sprite-m)',
}

export function HeroSprite({ className, title = '冒険者' }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={cn('pixel-art', className)}
      role="img"
      aria-label={title}
    >
      {SPRITE.flatMap((row, y) =>
        [...row].map((cell, x) =>
          COLORS[cell] ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={COLORS[cell]} /> : null,
        ),
      )}
    </svg>
  )
}
