/** フォーム項目ごとのエラーメッセージ。 */
export function FieldError({ id, messages }: { id: string; messages?: string[] }) {
  if (!messages?.length) return null
  return (
    <ul id={id} className="space-y-0.5 text-xs text-destructive">
      {messages.map((m) => (
        <li key={m}>{m}</li>
      ))}
    </ul>
  )
}
