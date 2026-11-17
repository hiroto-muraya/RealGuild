import { useState } from 'react'
import { applyPalette, loadPalette, palettes, type PaletteId } from '@/lib/palette'
import { cn } from '@/lib/utils'

/** 配色パレットの切り替え（ユーザー設定）。選択はブラウザに保存される。 */
export function PaletteSwitcher({ className }: { className?: string }) {
  const [current, setCurrent] = useState<PaletteId>(loadPalette)

  return (
    <div className={cn('pixel-window p-3 text-xs', className)}>
      <p className="mb-2 text-muted-foreground">はいしょく</p>
      <div className="flex flex-wrap gap-2">
        {palettes.map((p) => (
          <button
            key={p.id}
            type="button"
            aria-pressed={current === p.id}
            onClick={() => {
              applyPalette(p.id)
              setCurrent(p.id)
            }}
            className={cn(
              'border-2 border-border px-2 py-1',
              current === p.id ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary',
            )}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  )
}
