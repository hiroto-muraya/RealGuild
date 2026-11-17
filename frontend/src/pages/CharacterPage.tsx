import { CharacterCard } from '@/components/game/CharacterCard'
import { PaletteSwitcher } from '@/components/game/PaletteSwitcher'
import { useCharacter } from '@/features/character/api'

export function CharacterPage() {
  const { data: character, isPending, isError } = useCharacter()

  return (
    <div className="space-y-6">
      <h1 className="pixel-title text-2xl text-primary">ステータス</h1>
      {isPending && <p>よみこみちゅう...</p>}
      {isError && <p className="text-destructive">キャラクターの じょうほうを とれませんでした。</p>}
      {character && (
        <div className="max-w-xl space-y-4">
          <CharacterCard character={character} />
          <p className="text-sm">るいけい けいけんち: {character.totalXp}</p>
        </div>
      )}
      <section aria-label="せってい" className="max-w-xl">
        <PaletteSwitcher />
      </section>
    </div>
  )
}
