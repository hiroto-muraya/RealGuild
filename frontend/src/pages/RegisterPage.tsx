import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { FieldError } from '@/components/game/FieldError'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRegister } from '@/features/auth/api'
import { ApiError } from '@/lib/api'

const CHARACTER_NAME_MAX = 20

export function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [characterName, setCharacterName] = useState('')
  const register = useRegister()
  const navigate = useNavigate()

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    register.mutate(
      { email, password, characterName },
      { onSuccess: () => navigate('/', { replace: true }) },
    )
  }

  const error = register.error
  const fieldErrors = error instanceof ApiError ? error.fieldErrors : {}
  const generalError =
    error && !(error instanceof ApiError)
      ? 'サーバーに接続できませんでした。時間をおいて再度お試しください。'
      : error instanceof ApiError && Object.keys(fieldErrors).length === 0
        ? (error.detail ?? error.title ?? '登録に失敗しました。')
        : null

  return (
    <AuthLayout>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">冒険者登録</CardTitle>
          <CardDescription>あなたの分身となるキャラクターを作成します。</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="characterName">キャラクター名</Label>
              <Input
                id="characterName"
                autoComplete="nickname"
                maxLength={CHARACTER_NAME_MAX}
                required
                value={characterName}
                onChange={(e) => setCharacterName(e.target.value)}
                aria-describedby="characterName-error"
                aria-invalid={!!fieldErrors.characterName}
              />
              <FieldError id="characterName-error" messages={fieldErrors.characterName} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">メールアドレス</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-describedby="email-error"
                aria-invalid={!!fieldErrors.email}
              />
              <FieldError id="email-error" messages={fieldErrors.email} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">パスワード</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-describedby="password-hint password-error"
                aria-invalid={!!fieldErrors.password}
              />
              <p id="password-hint" className="text-xs text-muted-foreground">
                8 文字以上で、英字と数字を含めてください。
              </p>
              <FieldError id="password-error" messages={fieldErrors.password} />
            </div>
            {generalError && (
              <p role="alert" className="text-sm text-destructive">
                {generalError}
              </p>
            )}
            <Button type="submit" className="h-11 w-full text-base" disabled={register.isPending}>
              {register.isPending ? '登録中...' : '冒険をはじめる'}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            登録済みの方は{' '}
            <Link to="/login" className="text-primary underline-offset-4 hover:underline">
              ログイン
            </Link>
          </p>
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
