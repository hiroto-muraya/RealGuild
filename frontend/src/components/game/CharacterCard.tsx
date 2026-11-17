import { HeroSprite } from '@/components/game/HeroSprite'
import { StatGrid } from '@/components/game/StatGrid'
import { XpBar } from '@/components/game/XpBar'
import type { Character } from '@/features/character/api'

/** キャラクターのステータスウィンドウ。 */
export function CharacterCard({ character }: { character: Character }) {
  return (
    <div className="pixel-window space-y-4 p-5">
      <div className="flex items-center gap-4">
        <div className="shrink-0 border-2 border-border bg-(--xp-empty) p-1">
          <HeroSprite className="size-16" title={`${character.name}のすがた`} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xl">{character.name}</p>
          <p className="text-lg text-primary">Lv {character.level}</p>
        </div>
      </div>
      <XpBar character={character} />
      <StatGrid stats={character.stats} />
    </div>
  )
}
