import { NavLink, Outlet, useNavigate } from 'react-router'
import { PaletteSwitcher } from '@/components/game/PaletteSwitcher'
import { Logo } from '@/components/layout/Logo'
import { navItems } from '@/components/layout/nav-items'
import { useLogout } from '@/features/auth/api'
import { useCharacter } from '@/features/character/api'
import { cn } from '@/lib/utils'

/**
 * ログイン後の共通レイアウト（docs/design.md 2.3）。
 *   - スマホ (< md): 上部ヘッダー + 下部コマンドメニュー
 *   - PC (>= md):    左のコマンドウィンドウ
 */
export function AppLayout() {
  return (
    <div className="min-h-svh md:grid md:grid-cols-[15rem_1fr] md:gap-6 md:p-6">
      <SideNav />
      <div className="flex min-h-svh flex-col md:min-h-0">
        <MobileHeader />
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 pt-4 pb-28 md:p-0">
          <Outlet />
        </main>
      </div>
      <BottomNav />
    </div>
  )
}

function LogoutButton({ className }: { className?: string }) {
  const logout = useLogout()
  const navigate = useNavigate()
  return (
    <button
      type="button"
      className={cn('pixel-cursor text-left', className)}
      disabled={logout.isPending}
      onClick={() => logout.mutate(undefined, { onSuccess: () => navigate('/login', { replace: true }) })}
    >
      ログアウト
    </button>
  )
}

function SideNav() {
  return (
    <aside className="sticky top-6 hidden h-[calc(100svh-3rem)] flex-col gap-4 md:flex">
      <Logo className="px-2 text-2xl" />
      <nav className="pixel-window flex flex-col gap-3 py-5 pr-4 pl-10" aria-label="メインメニュー">
        {navItems.map(({ to, label }) => (
          <NavLink key={to} to={to} end={to === '/'} className="pixel-cursor text-lg">
            {label}
          </NavLink>
        ))}
        <LogoutButton className="mt-2 text-sm text-muted-foreground" />
      </nav>
      <div className="mt-auto">
        <PaletteSwitcher />
      </div>
    </aside>
  )
}

function MobileHeader() {
  const { data: character } = useCharacter()
  return (
    <header className="pixel-window sticky top-2 z-10 mx-2 mt-2 flex items-center justify-between px-4 py-2 md:hidden">
      <Logo className="text-xl" />
      <div className="flex items-center gap-3 text-sm">
        {character && <span className="text-primary">Lv {character.level}</span>}
        <LogoutButton className="text-xs text-muted-foreground" />
      </div>
    </header>
  )
}

function BottomNav() {
  return (
    <nav
      className="pixel-window fixed inset-x-2 bottom-2 z-10 grid grid-cols-4 pb-[env(safe-area-inset-bottom)] md:hidden"
      aria-label="メインメニュー"
    >
      {navItems.map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            cn('relative py-3 text-center text-[13px]', isActive ? 'text-primary' : 'text-card-foreground/70')
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <span aria-hidden className="absolute top-1 left-1/2 -translate-x-1/2 text-[10px] leading-none">
                  ▼
                </span>
              )}
              {label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
