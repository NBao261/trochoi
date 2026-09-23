import type { Answer, GamePhase, Room } from '../domain/types'

export type ServiceMode = 'firebase' | 'demo'

export interface RoomService {
  mode: ServiceMode
  userId: string
  createRoom(): Promise<string>
  joinRoom(code: string, name: string): Promise<void>
  watchRoom(code: string, onRoom: (room: Room | null) => void, onError: (error: Error) => void): () => void
  submitInitial(code: string, questionIndex: number, answer: Answer): Promise<void>
  submitFinal(code: string, questionIndex: number, answer: Answer): Promise<void>
  advance(code: string, expectedPhase: GamePhase): Promise<void>
  restart(code: string): Promise<void>
}

export function normalizeRoomCode(value: string): string {
  return value.toUpperCase().replace(/[^A-Z2-9]/g, '').slice(0, 4)
}

