import { createRoomCode, nextPhase, scoreRoundPlayers } from '../domain/gameLogic'
import { QUESTIONS } from '../domain/questions'
import type { Player, Room } from '../domain/types'
import type { RoomService } from './roomService'

const STORAGE_PREFIX = 'mln131-room-'
const EVENT_NAME = 'mln131-room-change'
const USER_KEY = 'mln131-demo-user'

function roomKey(code: string) {
  return `${STORAGE_PREFIX}${code}`
}

function getUserId(): string {
  const existing = window.sessionStorage.getItem(USER_KEY)
  if (existing) return existing
  const id = crypto.randomUUID()
  window.sessionStorage.setItem(USER_KEY, id)
  return id
}

function readRoom(code: string): Room | null {
  const value = window.localStorage.getItem(roomKey(code))
  return value ? (JSON.parse(value) as Room) : null
}

function writeRoom(room: Room) {
  window.localStorage.setItem(roomKey(room.code), JSON.stringify(room))
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: room.code }))
}

function initialGame(now: number): Room['game'] {
  return {
    phase: 'lobby',
    questionIndex: 0,
    phaseStartedAt: now,
    questionStartedAt: now,
    initialDurationMs: 15_000,
    reconsiderDurationMs: 8_000,
  }
}

export function createDemoRoomService(): RoomService {
  const userId = getUserId()

  return {
    mode: 'demo',
    userId,

    async createRoom() {
      let code = createRoomCode()
      while (readRoom(code)) code = createRoomCode()
      const now = Date.now()
      writeRoom({
        code,
        hostId: userId,
        createdAt: now,
        game: initialGame(now),
        players: {},
        submissions: {},
      })
      return code
    },

    async joinRoom(code, name) {
      const room = readRoom(code)
      if (!room) throw new Error('Không tìm thấy phòng. Hãy kiểm tra lại mã 4 ký tự.')
      const existing = room.players[userId]
      if (room.game.phase !== 'lobby' && !existing) {
        throw new Error('Trận đấu đã bắt đầu. Bạn chưa có lượt trong phòng này.')
      }
      if (!existing && Object.keys(room.players).length >= 20) {
        throw new Error('Phòng đã đủ người chơi.')
      }

      const player: Player = existing ?? {
        id: userId,
        name,
        score: 0,
        answerTimeMs: 0,
        joinedAt: Date.now(),
        lastRoundScore: 0,
      }
      room.players[userId] = { ...player, name }
      writeRoom(room)
    },

    watchRoom(code, onRoom) {
      const emit = () => onRoom(readRoom(code))
      const onStorage = (event: StorageEvent) => {
        if (event.key === roomKey(code)) emit()
      }
      const onCustom = (event: Event) => {
        if ((event as CustomEvent<string>).detail === code) emit()
      }
      window.addEventListener('storage', onStorage)
      window.addEventListener(EVENT_NAME, onCustom)
      emit()
      return () => {
        window.removeEventListener('storage', onStorage)
        window.removeEventListener(EVENT_NAME, onCustom)
      }
    },

    async submitInitial(code, questionIndex, answer) {
      const room = readRoom(code)
      if (!room || room.game.phase !== 'initial' || room.game.questionIndex !== questionIndex) return
      const round = room.submissions[String(questionIndex)] ?? {}
      const existing = round[userId]
      if (existing) return
      round[userId] = { initial: answer, final: null, initialAt: Date.now(), finalAt: null }
      room.submissions[String(questionIndex)] = round
      writeRoom(room)
    },

    async submitFinal(code, questionIndex, answer) {
      const room = readRoom(code)
      if (!room || room.game.phase !== 'reconsider' || room.game.questionIndex !== questionIndex) return
      const submission = room.submissions[String(questionIndex)]?.[userId]
      if (!submission) return
      submission.final = answer
      submission.finalAt = Date.now()
      writeRoom(room)
    },

    async advance(code, expectedPhase) {
      const room = readRoom(code)
      if (!room || room.hostId !== userId || room.game.phase !== expectedPhase) return
      const currentIndex = room.game.questionIndex
      const now = Date.now()

      if (expectedPhase === 'reconsider') {
        const question = QUESTIONS[currentIndex]
        if (question) {
          room.players = scoreRoundPlayers(
            room.players,
            room.submissions[String(currentIndex)] ?? {},
            question.correct,
            room.game.questionStartedAt,
            currentIndex === QUESTIONS.length - 1 ? 2 : 1,
          )
        }
      }

      const next = nextPhase(expectedPhase, currentIndex, QUESTIONS.length)
      room.game = {
        ...room.game,
        ...next,
        phaseStartedAt: now,
        questionStartedAt: next.phase === 'initial' ? now : room.game.questionStartedAt,
      }
      writeRoom(room)
    },

    async restart(code) {
      const room = readRoom(code)
      if (!room || room.hostId !== userId) return
      const now = Date.now()
      room.game = initialGame(now)
      room.submissions = {}
      room.players = Object.fromEntries(
        Object.entries(room.players).map(([id, player]) => [
          id,
          { ...player, score: 0, answerTimeMs: 0, lastRoundScore: 0 },
        ]),
      )
      writeRoom(room)
    },
  }
}

export function getDemoRoomForTests(code: string): Room | null {
  return readRoom(code)
}
