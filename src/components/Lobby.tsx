import { useMemo, useState } from 'react'
import { Check, Copy, Play, Smartphone, UserRound, Users } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import type { Player, Room } from '../domain/types'

interface LobbyProps {
  room: Room
  isHost: boolean
  player?: Player
  busy: boolean
  onStart: () => void
}

export function Lobby({ room, isHost, player, busy, onStart }: LobbyProps) {
  const [copied, setCopied] = useState(false)
  const players = Object.values(room.players).sort((a, b) => a.joinedAt - b.joinedAt)
  const inviteUrl = useMemo(() => {
    const url = new URL(window.location.href)
    url.search = ''
    url.searchParams.set('room', room.code)
    return url.toString()
  }, [room.code])

  const copyInvite = async () => {
    await navigator.clipboard.writeText(inviteUrl)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  if (!isHost) {
    return (
      <main className="waiting-stage shell">
        <div className="waiting-orbit" aria-hidden="true"><Smartphone /></div>
        <span className="card-kicker">Bạn đã vào phòng {room.code}</span>
        <h1>Chào {player?.name ?? 'bạn'}!</h1>
        <p>Đang chờ người dẫn bắt đầu trận đấu.</p>
        <div className="waiting-dots" aria-label="Đang chờ"><i /><i /><i /></div>
        <div className="mini-rule">
          <strong>Mẹo nhỏ</strong>
          <span>Sau khi xem lựa chọn của cả lớp, bạn sẽ có 8 giây để giữ hoặc đổi đáp án.</span>
        </div>
      </main>
    )
  }

  return (
    <main className="lobby shell">
      <section className="lobby__join">
        <div className="section-heading">
          <span className="card-kicker">Sẵn sàng kết nối</span>
          <h1>Mời cả lớp vào phòng</h1>
          <p>Quét mã QR hoặc truy cập link và nhập mã phòng.</p>
        </div>
        <div className="join-ticket">
          <div className="qr-frame"><QRCodeSVG value={inviteUrl} size={184} level="M" /></div>
          <div className="room-code-display" aria-label={`Mã phòng ${room.code}`}>
            {room.code.split('').map((letter, index) => <span key={`${letter}-${index}`}>{letter}</span>)}
          </div>
          <button className="button button--soft" onClick={copyInvite}>
            {copied ? <Check size={17} /> : <Copy size={17} />} {copied ? 'Đã sao chép' : 'Sao chép link'}
          </button>
        </div>
      </section>

      <section className="lobby__players" aria-labelledby="players-heading">
        <div className="player-count">
          <div><Users aria-hidden="true" /><strong>{players.length}</strong></div>
          <span>người đã tham gia</span>
        </div>
        <h2 id="players-heading" className="sr-only">Danh sách người chơi</h2>
        <div className="player-cloud" aria-live="polite">
          {players.length ? players.map((item, index) => (
            <span className="player-chip" key={item.id} style={{ '--chip-index': index } as React.CSSProperties}>
              <UserRound size={17} aria-hidden="true" /> {item.name}
            </span>
          )) : <p className="empty-player">Chưa có ai vào phòng — mã QR đang chờ được quét.</p>}
        </div>
        <div className="lobby__footer">
          <p>Khuyến nghị 8–16 người · Không cần đăng nhập</p>
          <button className="button button--primary button--large" onClick={onStart} disabled={busy || players.length === 0}>
            <Play size={19} fill="currentColor" aria-hidden="true" /> Bắt đầu với {players.length} người
          </button>
        </div>
      </section>
    </main>
  )
}
