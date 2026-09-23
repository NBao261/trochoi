import type { Answer, GamePhase, Player, Submission } from './types'

interface RoundScoreInput {
  initial: Answer
  final: Answer | null
  correct: Answer
  multiplier?: number
}

const ROOM_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

export function calculateRoundScore({
  initial,
  final,
  correct,
  multiplier = 1,
}: RoundScoreInput): number {
  const finalChoice = final ?? initial
  let baseScore = 0

  if (initial === correct) {
    baseScore = finalChoice === correct ? 1000 : 800
  } else if (finalChoice === correct) {
    baseScore = 600
  }

  return baseScore * multiplier
}

export function rankPlayers<T extends Pick<Player, 'score' | 'answerTimeMs' | 'name'>>(
  players: readonly T[],
): T[] {
  return [...players].sort(
    (a, b) => b.score - a.score || a.answerTimeMs - b.answerTimeMs || a.name.localeCompare(b.name, 'vi'),
  )
}

export function createRoomCode(random: () => number = Math.random): string {
  return Array.from({ length: 4 }, () => {
    const index = Math.min(Math.floor(random() * ROOM_ALPHABET.length), ROOM_ALPHABET.length - 1)
    return ROOM_ALPHABET[index]
  }).join('')
}

export function scoreRoundPlayers(
  players: Record<string, Player>,
  submissions: Record<string, Submission>,
  correct: Answer,
  phaseStartedAt: number,
  multiplier: number,
): Record<string, Player> {
  return Object.fromEntries(
    Object.entries(players).map(([id, player]) => {
      const submission = submissions[id]
      if (!submission) {
        return [id, { ...player, lastRoundScore: 0 }]
      }

      const roundScore = calculateRoundScore({
        initial: submission.initial,
        final: submission.final,
        correct,
        multiplier,
      })

      return [
        id,
        {
          ...player,
          score: player.score + roundScore,
          answerTimeMs: player.answerTimeMs + Math.max(0, submission.initialAt - phaseStartedAt),
          lastRoundScore: roundScore,
        },
      ]
    }),
  )
}

export function nextPhase(
  phase: GamePhase,
  questionIndex: number,
  questionCount: number,
): Pick<import('./types').GameState, 'phase' | 'questionIndex'> {
  switch (phase) {
    case 'lobby':
      return { phase: 'initial', questionIndex: 0 }
    case 'initial':
      return { phase: 'reconsider', questionIndex }
    case 'reconsider':
      return { phase: 'reveal', questionIndex }
    case 'reveal':
      return { phase: 'leaderboard', questionIndex }
    case 'leaderboard':
      return questionIndex >= questionCount - 1
        ? { phase: 'finished', questionIndex }
        : { phase: 'initial', questionIndex: questionIndex + 1 }
    case 'finished':
      return { phase, questionIndex }
  }
}
