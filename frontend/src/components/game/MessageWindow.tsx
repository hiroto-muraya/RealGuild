import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

/** RPG のメッセージウィンドウ。右下で ▼ が点滅する。 */
export function MessageWindow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('pixel-window relative px-5 py-4 pr-9 leading-relaxed', className)}>
      {children}
      <motion.span
        aria-hidden
        className="absolute right-4 bottom-2 text-xs"
        animate={{ opacity: [1, 1, 0, 0] }}
        transition={{ duration: 1, repeat: Infinity, times: [0, 0.5, 0.5, 1], ease: 'linear' }}
      >
        ▼
      </motion.span>
    </div>
  )
}
