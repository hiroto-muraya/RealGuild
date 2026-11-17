import type { ReactNode } from 'react'
import { MessageWindow } from '@/components/game/MessageWindow'

export function FullScreenMessage({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <MessageWindow className="w-full max-w-sm">{children}</MessageWindow>
    </div>
  )
}
