import type { CharacterStats } from '@/features/character/api'

const statItems = [
  { key: 'int', label: 'ちりょく', sub: '勉強' },
  { key: 'str', label: 'たいりょく', sub: '運動' },
  { key: 'dex', label: 'ぎりょう', sub: '仕事' },
  { key: 'cha', label: 'かんせい', sub: '趣味' },
] as const

/** 能力値の一覧（RPG のステータス画面風）。 */
export function StatGrid({ stats }: { stats: CharacterStats }) {
  return (
    <dl className="grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-2">
      {statItems.map(({ key, label, sub }) => (
        <div key={key} className="flex items-baseline justify-between gap-2 border-b-2 border-dotted border-border/40 py-1">
          <dt>
            {label}
            <span className="ml-1 text-xs text-muted-foreground">（{sub}）</span>
          </dt>
          <dd className="text-lg tabular-nums">{stats[key]}</dd>
        </div>
      ))}
    </dl>
  )
}
