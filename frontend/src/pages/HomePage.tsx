import { CharacterCard } from '@/components/game/CharacterCard'
import { ComingSoon } from '@/components/game/ComingSoon'
import { MessageWindow } from '@/components/game/MessageWindow'
import { useCharacter } from '@/features/character/api'

/** S3 ホーム（docs/design.md 2.1）。PC ではキャラクターと今日のクエストを横に並べる。 */
export function HomePage() {
  const { data: character, isPending, isError } = useCharacter()

  return (
    <div className="space-y-6">
      <h1 className="sr-only">ホーム</h1>
      <MessageWindow>
        {character ? (
          <p>
            おかえり、{character.name}！
            <br />
            きょうも ぼうけんに でかけよう。
          </p>
        ) : (
          <p>ギルドへ ようこそ。</p>
        )}
      </MessageWindow>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <section aria-label="キャラクター">
          {isPending && <p>よみこみちゅう...</p>}
          {isError && <p className="text-destructive">キャラクターの じょうほうを とれませんでした。</p>}
          {character && <CharacterCard character={character} />}
        </section>
        <section aria-labelledby="today-quests" className="space-y-3">
          <h2 id="today-quests" className="pixel-title text-xl text-primary">
            きょうの クエスト
          </h2>
          <ComingSoon title="クエストけいじばんは じゅんびちゅうです。">
            つぎの アップデートで クエストの じゅちゅうと たっせいが できるように なります。
          </ComingSoon>
        </section>
      </div>
    </div>
  )
}
