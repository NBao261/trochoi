import { ArrowRight, CheckCircle2, Eye, Lightbulb, LockKeyhole, Users } from 'lucide-react'
import { QUESTIONS } from '../domain/questions'
import type { Answer, GamePhase, Player, Room } from '../domain/types'
import { useCountdown } from '../hooks/useCountdown'
import { AnswerGrid } from './AnswerGrid'
import { Countdown } from './Countdown'
import { Leaderboard } from './Leaderboard'
import { VoteBars } from './VoteBars'

interface GameScreenProps {
  room: Room
  isHost: boolean
  player?: Player
  userId: string
  busy: boolean
  onAdvance: (phase: GamePhase) => void
  onInitialAnswer: (answer: Answer) => void
  onFinalAnswer: (answer: Answer) => void
  onRestart: () => void
}

const NEXT_LABEL: Partial<Record<GamePhase, string>> = {
  initial: 'Xem ý kiến cả lớp',
  reconsider: 'Công bố đáp án',
  reveal: 'Xem bảng xếp hạng',
  leaderboard: 'Câu tiếp theo',
}

export function GameScreen(props: GameScreenProps) {
  const { room, isHost, player, userId, busy, onAdvance, onInitialAnswer, onFinalAnswer, onRestart } = props
  const { phase, questionIndex } = room.game
  const question = QUESTIONS[questionIndex]
  const roundSubmissions = room.submissions[String(questionIndex)] ?? {}
  const ownSubmission = roundSubmissions[userId]
  const phaseDuration = phase === 'initial' ? room.game.initialDurationMs : phase === 'reconsider' ? room.game.reconsiderDurationMs : 0
  const { expired } = useCountdown(room.game.phaseStartedAt, phaseDuration)

  if (phase === 'finished') {
    return (
      <main className="game-shell game-shell--centered shell">
        <Leaderboard players={room.players} currentUserId={userId} final isHost={isHost} busy={busy} onRestart={onRestart} />
      </main>
    )
  }

  if (phase === 'leaderboard') {
    return (
      <main className="game-shell game-shell--centered shell">
        <Leaderboard players={room.players} currentUserId={userId} isHost={isHost} />
        {isHost && <HostControls phase={phase} busy={busy} onAdvance={onAdvance} />}
      </main>
    )
  }

  if (!question) return null

  if (isHost) {
    const answeredCount = Object.keys(roundSubmissions).length
    return (
      <main className="game-shell game-shell--host shell">
        <section className="question-stage">
          <div className="question-meta">
            <span>Câu {questionIndex + 1} / {QUESTIONS.length}</span>
            {questionIndex === QUESTIONS.length - 1 && <strong>Câu cuối · x2 điểm</strong>}
          </div>
          <h1>{question.prompt}</h1>
          {phase === 'initial' && <AnswerGrid question={question} />}
          {phase === 'reconsider' && (
            <div className="host-results">
              <div className="host-results__title"><Eye aria-hidden="true" /><div><span className="card-kicker">Lựa chọn ban đầu</span><h2>Đa số đang nghĩ gì?</h2></div></div>
              <VoteBars submissions={roundSubmissions} stage="initial" />
            </div>
          )}
          {phase === 'reveal' && (
            <div className="reveal-panel">
              <div className="reveal-panel__answer"><CheckCircle2 aria-hidden="true" /><span>Đáp án đúng</span><strong>{question.correct}</strong><p>{question.options[question.correct]}</p></div>
              <div className="explanation"><Lightbulb aria-hidden="true" /><p>{question.explanation}</p></div>
              <VoteBars submissions={roundSubmissions} stage="final" correct={question.correct} />
            </div>
          )}
        </section>

        <aside className="host-rail">
          <Countdown
            startedAt={room.game.phaseStartedAt}
            durationMs={phase === 'initial' ? room.game.initialDurationMs : phase === 'reconsider' ? room.game.reconsiderDurationMs : 0}
          />
          <div className="response-count"><Users aria-hidden="true" /><strong>{answeredCount}/{Object.keys(room.players).length}</strong><span>đã trả lời</span></div>
          <div className="phase-note">
            {phase === 'initial' && <><LockKeyhole aria-hidden="true" /><p>Mỗi người đang chọn độc lập. Kết quả được giữ kín.</p></>}
            {phase === 'reconsider' && <><Eye aria-hidden="true" /><p>Người chơi đã thấy tỷ lệ và đang cân nhắc giữ hoặc đổi.</p></>}
            {phase === 'reveal' && <><CheckCircle2 aria-hidden="true" /><p>Điểm đã được cộng tự động. Sẵn sàng xem thứ hạng.</p></>}
          </div>
        </aside>
        <HostControls phase={phase} busy={busy} onAdvance={onAdvance} />
      </main>
    )
  }

  if (!player) return <main className="center-stage"><p>Bạn không có lượt trong trận đấu này.</p></main>

  const selected = ownSubmission?.final ?? ownSubmission?.initial
  const phaseTitle = phase === 'initial' ? 'Chọn câu trả lời của bạn' : phase === 'reconsider' ? 'Giữ vững hay đổi ý?' : 'Kết quả vòng này'

  return (
    <main className="player-game shell">
      <div className="player-progress">
        <span>Câu {questionIndex + 1}/{QUESTIONS.length}</span>
        <div><i style={{ width: `${((questionIndex + 1) / QUESTIONS.length) * 100}%` }} /></div>
        <strong>{player.score.toLocaleString('vi-VN')} điểm</strong>
      </div>
      <section className="player-question">
        <div className="player-question__heading">
          <div><span className="card-kicker">{phaseTitle}</span><h1>{question.prompt}</h1></div>
          {phase !== 'reveal' && <Countdown compact startedAt={room.game.phaseStartedAt} durationMs={phase === 'initial' ? room.game.initialDurationMs : room.game.reconsiderDurationMs} />}
        </div>

        {phase === 'reconsider' && (
          <div className="reconsider-block">
            <VoteBars submissions={roundSubmissions} stage="initial" />
            <p><Eye size={17} aria-hidden="true" /> Tỷ lệ chỉ để tham khảo. Chạm một phương án để chốt lựa chọn cuối.</p>
          </div>
        )}

        {phase === 'reveal' && (
          <div className={`personal-result ${selected === question.correct ? 'personal-result--correct' : 'personal-result--wrong'}`} role="status">
            <span>{selected === question.correct ? 'Chính xác!' : 'Chưa chính xác'}</span>
            <strong>+{player.lastRoundScore.toLocaleString('vi-VN')}</strong>
            <small>điểm vòng này</small>
          </div>
        )}

        <AnswerGrid
          question={question}
          selected={selected}
          initial={phase !== 'initial' ? ownSubmission?.initial : null}
          correct={phase === 'reveal' ? question.correct : null}
          disabled={busy || expired || phase === 'reveal' || (phase === 'initial' && Boolean(ownSubmission)) || (phase === 'reconsider' && !ownSubmission)}
          onSelect={phase === 'initial' ? onInitialAnswer : phase === 'reconsider' ? onFinalAnswer : undefined}
        />

        {phase === 'initial' && ownSubmission && <p className="locked-note"><LockKeyhole size={16} aria-hidden="true" /> Đã khóa lựa chọn. Chờ cả lớp trả lời nhé.</p>}
        {phase === 'reveal' && <div className="explanation explanation--player"><Lightbulb aria-hidden="true" /><p>{question.explanation}</p></div>}
      </section>
    </main>
  )
}

function HostControls({ phase, busy, onAdvance }: { phase: GamePhase; busy: boolean; onAdvance: (phase: GamePhase) => void }) {
  return (
    <div className="host-controls">
      <span>Điều khiển trận đấu</span>
      <button className="button button--primary button--large" onClick={() => onAdvance(phase)} disabled={busy}>
        {NEXT_LABEL[phase] ?? 'Tiếp tục'} <ArrowRight size={19} aria-hidden="true" />
      </button>
    </div>
  )
}
