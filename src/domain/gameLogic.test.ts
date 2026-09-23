import { describe, expect, it } from 'vitest'
import {
  calculateRoundScore,
  createRoomCode,
  nextPhase,
  rankPlayers,
} from './gameLogic'

describe('calculateRoundScore', () => {
  it('awards 1000 points when a correct initial answer is kept', () => {
    expect(calculateRoundScore({ initial: 'A', final: 'A', correct: 'A' })).toBe(1000)
  })

  it('awards 800 points when the initial answer was correct but changed incorrectly', () => {
    expect(calculateRoundScore({ initial: 'A', final: 'B', correct: 'A' })).toBe(800)
  })

  it('awards 600 points when a wrong answer is changed to the correct one', () => {
    expect(calculateRoundScore({ initial: 'B', final: 'A', correct: 'A' })).toBe(600)
  })

  it('awards no points when the final answer is wrong and the initial answer was wrong', () => {
    expect(calculateRoundScore({ initial: 'B', final: 'C', correct: 'A' })).toBe(0)
  })

  it('doubles the result for the final question', () => {
    expect(
      calculateRoundScore({ initial: 'B', final: 'A', correct: 'A', multiplier: 2 }),
    ).toBe(1200)
  })

  it('treats a missing final choice as keeping the initial answer', () => {
    expect(calculateRoundScore({ initial: 'A', final: null, correct: 'A' })).toBe(1000)
  })
})

describe('rankPlayers', () => {
  it('sorts by score, then by lower accumulated answer time', () => {
    const players = [
      { id: 'an', name: 'An', score: 2000, answerTimeMs: 9000 },
      { id: 'binh', name: 'Bình', score: 2400, answerTimeMs: 12000 },
      { id: 'chi', name: 'Chi', score: 2400, answerTimeMs: 8000 },
    ]

    expect(rankPlayers(players).map((player) => player.id)).toEqual(['chi', 'binh', 'an'])
  })

  it('does not mutate the original player array', () => {
    const players = [
      { id: 'an', name: 'An', score: 100, answerTimeMs: 200 },
      { id: 'binh', name: 'Bình', score: 200, answerTimeMs: 300 },
    ]

    rankPlayers(players)

    expect(players[0]?.id).toBe('an')
  })
})

describe('createRoomCode', () => {
  it('creates an unambiguous four-character room code', () => {
    const code = createRoomCode(() => 0.1)

    expect(code).toMatch(/^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{4}$/)
  })
})

describe('nextPhase', () => {
  it('moves through a complete round and stops after the final reveal', () => {
    expect(nextPhase('lobby', 0, 8)).toEqual({ phase: 'initial', questionIndex: 0 })
    expect(nextPhase('initial', 0, 8)).toEqual({ phase: 'reconsider', questionIndex: 0 })
    expect(nextPhase('reconsider', 0, 8)).toEqual({ phase: 'reveal', questionIndex: 0 })
    expect(nextPhase('reveal', 0, 8)).toEqual({ phase: 'leaderboard', questionIndex: 0 })
    expect(nextPhase('leaderboard', 0, 8)).toEqual({ phase: 'initial', questionIndex: 1 })
    expect(nextPhase('leaderboard', 7, 8)).toEqual({ phase: 'finished', questionIndex: 7 })
  })
})
