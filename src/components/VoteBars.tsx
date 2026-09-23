import { ANSWERS, type Answer, type Submission } from '../domain/types'

interface VoteBarsProps {
  submissions: Record<string, Submission>
  stage: 'initial' | 'final'
  correct?: Answer
}

export function VoteBars({ submissions, stage, correct }: VoteBarsProps) {
  const votes = Object.values(submissions)
  const counts = Object.fromEntries(ANSWERS.map((answer) => [answer, 0])) as Record<Answer, number>
  votes.forEach((vote) => {
    const answer = stage === 'final' ? (vote.final ?? vote.initial) : vote.initial
    counts[answer] += 1
  })
  const total = Math.max(votes.length, 1)

  return (
    <div className="vote-bars" aria-label={`Kết quả ${votes.length} lượt chọn`}>
      {ANSWERS.map((answer) => {
        const percent = Math.round((counts[answer] / total) * 100)
        return (
          <div className={`vote-row vote-row--${answer.toLowerCase()} ${correct === answer ? 'vote-row--correct' : ''}`} key={answer}>
            <span className="vote-row__letter">{answer}</span>
            <div className="vote-row__track">
              <span style={{ width: `${percent}%` }} />
            </div>
            <strong>{percent}%</strong>
            <small>{counts[answer]} chọn</small>
          </div>
        )
      })}
    </div>
  )
}
