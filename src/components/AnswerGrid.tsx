import { Check, LockKeyhole } from 'lucide-react'
import { ANSWERS, type Answer, type Question } from '../domain/types'

interface AnswerGridProps {
  question: Question
  selected?: Answer | null
  initial?: Answer | null
  correct?: Answer | null
  disabled?: boolean
  onSelect?: (answer: Answer) => void
}

export function AnswerGrid({ question, selected, initial, correct, disabled, onSelect }: AnswerGridProps) {
  return (
    <div className="answer-grid" role="group" aria-label="Các phương án trả lời">
      {ANSWERS.map((answer) => {
        const isSelected = selected === answer
        const wasInitial = initial === answer
        const isCorrect = correct === answer
        const isWrongSelection = Boolean(correct && isSelected && !isCorrect)
        const state = [
          isSelected && 'answer-card--selected',
          wasInitial && 'answer-card--initial',
          isCorrect && 'answer-card--correct',
          isWrongSelection && 'answer-card--wrong',
        ].filter(Boolean).join(' ')

        return (
          <button
            key={answer}
            className={`answer-card answer-card--${answer.toLowerCase()} ${state}`}
            onClick={() => onSelect?.(answer)}
            disabled={disabled || !onSelect}
            aria-pressed={isSelected}
          >
            <span className="answer-card__letter">{answer}</span>
            <span className="answer-card__text">{question.options[answer]}</span>
            <span className="answer-card__state" aria-hidden="true">
              {isCorrect ? <Check /> : isSelected ? <LockKeyhole /> : null}
            </span>
          </button>
        )
      })}
    </div>
  )
}

