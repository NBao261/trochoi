export const ANSWERS = ['A', 'B', 'C', 'D'] as const

export type Answer = (typeof ANSWERS)[number]

export type GamePhase =
  | 'lobby'
  | 'initial'
  | 'reconsider'
  | 'reveal'
  | 'leaderboard'
  | 'finished'

export interface Question {
  id: number
  prompt: string
  options: Record<Answer, string>
  correct: Answer
  explanation: string
}

export interface Player {
  id: string
  name: string
  score: number
  answerTimeMs: number
  joinedAt: number
  lastRoundScore: number
}

export interface Submission {
  initial: Answer
  final: Answer | null
  initialAt: number
  finalAt: number | null
}

export interface GameState {
  phase: GamePhase
  questionIndex: number
  phaseStartedAt: number
  initialDurationMs: number
  reconsiderDurationMs: number
}

export interface Room {
  code: string
  hostId: string
  createdAt: number
  game: GameState
  players: Record<string, Player>
  submissions: Record<string, Record<string, Submission>>
}

