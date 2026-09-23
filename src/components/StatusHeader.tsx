import { LogOut, Radio, Scale } from 'lucide-react'
import { useOnlineStatus } from '../hooks/useOnlineStatus'
import type { ServiceMode } from '../services/roomService'

interface StatusHeaderProps {
  mode: ServiceMode
  roomCode?: string
  isHost?: boolean
  onExit?: () => void
}

export function StatusHeader({ mode, roomCode, isHost, onExit }: StatusHeaderProps) {
  const online = useOnlineStatus()

  return (
    <header className="topbar">
      <a className="brand" href="/" aria-label="Đa số chưa chắc đúng - trang chủ">
        <span className="brand__mark"><Scale size={19} aria-hidden="true" /></span>
        <span>ĐA SỐ?</span>
      </a>
      <div className="topbar__status">
        {roomCode && <span className="room-pill">Phòng <strong>{roomCode}</strong></span>}
        {isHost && <span className="role-pill">Màn hình host</span>}
        <span className={`connection ${online ? 'connection--online' : 'connection--offline'}`}>
          <Radio size={14} aria-hidden="true" />
          {online ? (mode === 'firebase' ? 'Trực tuyến' : 'Demo cục bộ') : 'Mất mạng'}
        </span>
        {onExit && (
          <button className="icon-button" onClick={onExit} aria-label="Rời phòng" title="Rời phòng">
            <LogOut size={18} aria-hidden="true" />
          </button>
        )}
      </div>
    </header>
  )
}

