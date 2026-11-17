import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLogin } from '@/features/auth/api'
import { ApiError } from '@/lib/api'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const login = useLogin()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/'

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    login.mutate({ email, password }, { onSuccess: () => navigate(from, { replace: true }) })
  }

  const errorMessage = login.error
    ? login.error instanceof ApiError
      ? (login.error.detail ?? 'ログインに失敗しました。')
      : 'サーバーに接続できませんでした。時間をおいて再度お試しください。'
    : null

  return (
    <AuthLayout>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">ギルドに入る</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="email">メールアドレス</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">パスワード</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {errorMessage && (
              <p role="alert" className="text-sm text-destructive">
                {errorMessage}
              </p>
            )}
            <Button type="submit" className="h-11 w-full text-base" disabled={login.isPending}>
              {login.isPending ? 'ログイン中...' : 'ログイン'}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            はじめての方は{' '}
            <Link to="/register" className="text-primary underline-offset-4 hover:underline">
              冒険者登録
            </Link>
          </p>
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
