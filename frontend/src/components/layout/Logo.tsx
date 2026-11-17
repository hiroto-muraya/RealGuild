import { cn } from '@/lib/utils'

export function Logo({ className }: { className?: string }) {
  return <span className={cn('pixel-title inline-block tracking-wider text-primary', className)}>RealGuild</span>
}
