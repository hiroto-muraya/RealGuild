import type { ReactNode } from 'react'
import { HeroSprite } from '@/components/game/HeroSprite'
import { PaletteSwitcher } from '@/components/game/PaletteSwitcher'
import { Logo } from '@/components/layout/Logo'

/** ログイン・新規登録用の、中央寄せのレイアウト（タイトル画面風）。 */
export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 px-4 py-10">
      <div className="flex flex-col items-center gap-3 text-center">
        <HeroSprite className="size-20" />
        <Logo className="text-4xl sm:text-5xl" />
        <p className="text-sm">げんじつの どりょくを、ぼうけんの せいかに。</p>
      </div>
      <div className="w-full max-w-sm">{children}</div>
      <PaletteSwitcher className="w-full max-w-sm" />
    </main>
  )
}
