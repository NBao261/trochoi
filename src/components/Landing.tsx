import { useState, type FormEvent } from 'react'
import { ArrowRight, Gamepad2, Presentation, Sparkles, Users } from 'lucide-react'
import { QUESTIONS } from '../domain/questions'
import { normalizeRoomCode, type ServiceMode } from '../services/roomService'

interface LandingProps {
  busy: boolean
  invitedCode: string
  mode: ServiceMode
  onCreate: () => void
  onJoin: (code: string, name: string) => void
}

export function Landing({ busy, invitedCode, mode, onCreate, onJoin }: LandingProps) {
  const [code, setCode] = useState(normalizeRoomCode(invitedCode))
  const [name, setName] = useState('')

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (code.length === 4 && name.trim()) onJoin(code, name.trim().slice(0, 24))
  }

  return (
    <main className="landing shell">
      <section className="hero" aria-labelledby="hero-title">
        <div className="eyebrow"><Sparkles size={16} aria-hidden="true" /> MLN131 · Trò chơi tương tác</div>
        <h1 id="hero-title">Đa số<br /><em>chưa chắc đúng.</em></h1>
        <p className="hero__lead">
          Chọn đáp án, xem cả lớp nghĩ gì, rồi quyết định: giữ vững lập trường hay đổi ý?
        </p>
        <div className="hero__facts" aria-label="Thông tin trận đấu">
          <span><Users size={18} aria-hidden="true" /> Tối ưu 12 người</span>
          <span><Gamepad2 size={18} aria-hidden="true" /> {QUESTIONS.length} câu · 10 phút</span>
        </div>
      </section>

      <section className="entry-panel" aria-label="Bắt đầu trò chơi">
        {mode === 'demo' && (
          <div className="demo-note" role="status">
            <strong>Đang ở chế độ demo.</strong> Hai tab trên cùng máy có thể chơi thử. Cấu hình Firebase để điện thoại tham gia.
          </div>
        )}

        <article className="entry-card entry-card--host">
          <div className="entry-card__icon"><Presentation aria-hidden="true" /></div>
          <div>
            <span className="card-kicker">Dành cho người thuyết trình</span>
            <h2>Tạo phòng mới</h2>
            <p>Chiếu câu hỏi, điều khiển từng vòng và xem bảng xếp hạng trực tiếp.</p>
          </div>
          <button className="button button--primary button--wide" onClick={onCreate} disabled={busy}>
            Tạo phòng <ArrowRight size={18} aria-hidden="true" />
          </button>
        </article>

        <div className="entry-divider"><span>hoặc tham gia</span></div>

        <form className="join-form" onSubmit={submit}>
          <div className="field">
            <label htmlFor="room-code">Mã phòng</label>
            <input
              id="room-code"
              className="code-input"
              inputMode="text"
              autoComplete="off"
              placeholder="ABCD"
              value={code}
              onChange={(event) => setCode(normalizeRoomCode(event.target.value))}
              maxLength={4}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="player-name">Tên hiển thị</label>
            <input
              id="player-name"
              autoComplete="nickname"
              placeholder="Ví dụ: Minh Anh"
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={24}
              required
            />
          </div>
          <button className="button button--ink button--wide" disabled={busy || code.length !== 4 || !name.trim()}>
            Vào đấu trường <ArrowRight size={18} aria-hidden="true" />
          </button>
        </form>
      </section>
    </main>
  )
}
