import { motion } from 'motion/react'
import type { Character } from '@/features/character/api'

const SEGMENTS = 20

/** ブロック状の経験値ゲージ。1 マスずつ左から溜まっていく。 */
export function XpBar({ character }: { character: Character }) {
  const { xpIntoLevel, xpForNextLevel, isMaxLevel } = character
  const ratio = isMaxLevel ? 1 : xpForNextLevel > 0 ? xpIntoLevel / xpForNextLevel : 0
  const filled = Math.floor(ratio * SEGMENTS)

  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span>EXP</span>
        <span className="tabular-nums">{isMaxLevel ? 'MAX' : `${xpIntoLevel}/${xpForNextLevel}`}</span>
      </div>
      <div
        className="grid gap-[2px] border-2 border-border bg-border p-[2px]"
        style={{ gridTemplateColumns: `repeat(${SEGMENTS}, minmax(0, 1fr))` }}
        role="progressbar"
        aria-label="次のレベルまでの経験値"
        aria-valuemin={0}
        aria-valuemax={isMaxLevel ? 1 : xpForNextLevel}
        aria-valuenow={isMaxLevel ? 1 : xpIntoLevel}
      >
        {Array.from({ length: SEGMENTS }, (_, i) => (
          <div key={i} className="h-3 bg-(--xp-empty)">
            {i < filled && (
              <motion.div
                className="h-full bg-(--xp-fill)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.04, duration: 0 }}
              />
            )}
          </div>
        ))}
      </div>
      {!isMaxLevel && (
        <p className="mt-1 text-right text-xs text-muted-foreground">
          つぎのレベルまで あと {xpForNextLevel - xpIntoLevel}
        </p>
      )}
    </div>
  )
}
