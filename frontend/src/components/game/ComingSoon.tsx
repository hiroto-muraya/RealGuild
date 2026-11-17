import { MessageWindow } from '@/components/game/MessageWindow'

/** まだ実装していない機能の仮表示。 */
export function ComingSoon({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <MessageWindow>
      <p>{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{children ?? 'このきのうは じゅんびちゅうです。'}</p>
    </MessageWindow>
  )
}
