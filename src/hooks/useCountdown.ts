import { useEffect, useState } from 'react'

export function useCountdown(startedAt: number, durationMs: number) {
  const [now, setNow] = useState(Date.now)

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 200)
    return () => window.clearInterval(timer)
  }, [startedAt, durationMs])

  const remainingMs = Math.max(0, durationMs - (now - startedAt))

  return {
    remainingMs,
    seconds: Math.ceil(remainingMs / 1000),
    progress: durationMs > 0 ? remainingMs / durationMs : 0,
    expired: remainingMs === 0,
  }
}
