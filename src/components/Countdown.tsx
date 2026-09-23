import { Timer } from 'lucide-react'
import { useCountdown } from '../hooks/useCountdown'

interface CountdownProps {
  startedAt: number
  durationMs: number
  compact?: boolean
}

export function Countdown({ startedAt, durationMs, compact = false }: CountdownProps) {
  const { seconds, progress, expired } = useCountdown(startedAt, durationMs)
  const style = { '--timer-progress': `${Math.round(progress * 360)}deg` } as React.CSSProperties

  return (
    <div className={`countdown ${compact ? 'countdown--compact' : ''} ${expired ? 'countdown--expired' : ''}`} style={style} role="timer" aria-label={expired ? 'Đã hết giờ' : `Còn ${seconds} giây`}>
      <div className="countdown__face">
        {compact && <Timer size={16} aria-hidden="true" />}
        <strong>{expired ? '0' : seconds}</strong>
        {!compact && <span>giây</span>}
      </div>
    </div>
  )
}

