import { Link } from 'react-router'
import { AuthLayout } from '@/components/layout/AuthLayout'

export function NotFoundPage() {
  return (
    <AuthLayout>
      <div className="space-y-4 text-center">
        <p className="text-xl">この先は未踏の地のようです。</p>
        <Link to="/" className="text-primary underline-offset-4 hover:underline">
          ホームへ戻る
        </Link>
      </div>
    </AuthLayout>
  )
}
