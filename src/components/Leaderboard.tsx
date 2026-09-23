import { Crown, Medal, RotateCcw, Trophy } from 'lucide-react'
import { rankPlayers } from '../domain/gameLogic'
import type { Player } from '../domain/types'

interface LeaderboardProps {
  players: Record<string, Player>
  currentUserId: string
  final?: boolean
  isHost?: boolean
  busy?: boolean
  onRestart?: () => void
}

const MEDALS = ['🥇', '🥈', '🥉']

export function Leaderboard({ players, currentUserId, final = false, isHost, busy, onRestart }: LeaderboardProps) {
  const ranked = rankPlayers(Object.values(players))
  const currentRank = ranked.findIndex((player) => player.id === currentUserId) + 1

  if (final) {
    return (
      <section className="finale" aria-labelledby="finale-title">
        <div className="finale__burst" aria-hidden="true"><Trophy /></div>
        <span className="card-kicker">Kết quả chung cuộc</span>
        <h1 id="finale-title">Bục vinh danh</h1>
        <Podium players={ranked.slice(0, 3)} currentUserId={currentUserId} />
        {!isHost && currentRank > 0 && <p className="personal-rank">Bạn về đích ở vị trí <strong>#{currentRank}</strong></p>}
        {isHost && onRestart && (
          <button className="button button--primary" onClick={onRestart} disabled={busy}>
            <RotateCcw size={18} aria-hidden="true" /> Chơi lại từ đầu
          </button>
        )}
      </section>
    )
  }

  return (
    <section className="leaderboard" aria-labelledby="leaderboard-title">
      <div className="leaderboard__heading">
        <div><Crown aria-hidden="true" /><span className="card-kicker">Sau vòng này</span></div>
        <h1 id="leaderboard-title">Bảng xếp hạng</h1>
      </div>
      <ol className="ranking-list">
        {ranked.slice(0, 5).map((player, index) => (
          <li className={player.id === currentUserId ? 'is-current' : ''} key={player.id}>
            <span className="ranking-list__place">{MEDALS[index] ?? `#${index + 1}`}</span>
            <span className="ranking-list__avatar">{player.name.slice(0, 1).toUpperCase()}</span>
            <strong>{player.name}{player.id === currentUserId && <small>Bạn</small>}</strong>
            <span className="ranking-list__gain">+{player.lastRoundScore}</span>
            <b>{player.score.toLocaleString('vi-VN')}</b>
          </li>
        ))}
      </ol>
      {ranked.length === 0 && <p className="empty-player">Chưa có điểm để xếp hạng.</p>}
      {!isHost && currentRank > 5 && <p className="personal-rank">Bạn đang ở vị trí <strong>#{currentRank}</strong></p>}
    </section>
  )
}

function Podium({ players, currentUserId }: { players: Player[]; currentUserId: string }) {
  const displayOrder = [players[1], players[0], players[2]]
  const places = [2, 1, 3]

  return (
    <div className="podium" role="list" aria-label="Ba người dẫn đầu">
      {displayOrder.map((player, index) => player ? (
        <div className={`podium__place podium__place--${places[index]}`} role="listitem" key={player.id}>
          {places[index] === 1 && <Medal className="podium__medal" aria-hidden="true" />}
          <span className="podium__avatar">{player.name.slice(0, 1).toUpperCase()}</span>
          <strong>{player.name}{player.id === currentUserId ? ' · Bạn' : ''}</strong>
          <b>{player.score.toLocaleString('vi-VN')}</b>
          <div>{places[index]}</div>
        </div>
      ) : <div className={`podium__place podium__place--${places[index]} podium__place--empty`} key={places[index]} />)}
    </div>
  )
}
