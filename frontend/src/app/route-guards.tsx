import { Navigate, Outlet, useLocation } from 'react-router'
import { useMe } from '@/features/auth/api'
import { FullScreenMessage } from '@/components/layout/FullScreenMessage'

/** ログインが必要な画面。未ログインならログイン画面へ移動する。 */
export function RequireAuth() {
  const { data: me, isPending, isError } = useMe()
  const location = useLocation()

  if (isPending) return <FullScreenMessage>ギルドの扉を開いています...</FullScreenMessage>
  if (isError) return <FullScreenMessage>サーバーに接続できませんでした。時間をおいて再読み込みしてください。</FullScreenMessage>
  if (!me) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return <Outlet />
}

/** ログイン前だけ表示する画面（ログイン・新規登録）。ログイン済みならホームへ移動する。 */
export function GuestOnly() {
  const { data: me, isPending } = useMe()

  if (isPending) return <FullScreenMessage>ギルドの扉を開いています...</FullScreenMessage>
  if (me) return <Navigate to="/" replace />
  return <Outlet />
}
