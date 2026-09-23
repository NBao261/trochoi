import { describe, expect, it } from 'vitest'
import { QUESTIONS } from './questions'

describe('MLN131 question catalog', () => {
  it('contains exactly the 15 ordered questions from the supplied material', () => {
    expect(QUESTIONS.map((question) => question.id)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
    ])
  })

  it('keeps the supplied answer key without duplicate questions', () => {
    expect(QUESTIONS.map((question) => question.correct).join('')).toBe('BBCACBBABAAABBA')
    expect(new Set(QUESTIONS.map((question) => question.prompt)).size).toBe(15)
  })
})
