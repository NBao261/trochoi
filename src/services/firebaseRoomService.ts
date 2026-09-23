import { getApp, getApps, initializeApp } from 'firebase/app'
import { getAuth, signInAnonymously } from 'firebase/auth'
import { get, getDatabase, onValue, ref, runTransaction, set } from 'firebase/database'
import { createRoomCode, nextPhase, scoreRoundPlayers } from '../domain/gameLogic'
import { QUESTIONS } from '../domain/questions'
import type { Player, Room, Submission } from '../domain/types'
import type { RoomService } from './roomService'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export function hasFirebaseConfig(): boolean {
  return Object.values(firebaseConfig).every((value) => typeof value === 'string' && value.length > 0)
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

function normalizeRoom(value: Room | null): Room | null {
  if (!value) return null
  return {
    ...value,
    players: value.players ?? {},
    submissions: value.submissions ?? {},
  }
}

export async function createFirebaseRoomService(): Promise<RoomService> {
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
  const auth = getAuth(app)
  const database = getDatabase(app)
  const credential = auth.currentUser ? null : await signInAnonymously(auth)
  const userId = auth.currentUser?.uid ?? credential?.user.uid
  if (!userId) throw new Error('Không thể tạo phiên người chơi ẩn danh.')

  return {
    mode: 'firebase',
    userId,

    async createRoom() {
      for (let attempt = 0; attempt < 10; attempt += 1) {
        const code = createRoomCode()
        const roomRef = ref(database, `rooms/${code}`)
        if ((await get(roomRef)).exists()) continue
        const now = Date.now()
        const room: Room = {
          code,
          hostId: userId,
          createdAt: now,
          game: initialGame(now),
          players: {},
          submissions: {},
        }
        await set(roomRef, room)
        return code
      }
      throw new Error('Chưa thể tạo mã phòng. Hãy thử lại.')
    },

    async joinRoom(code, name) {
      const roomRef = ref(database, `rooms/${code}`)
      const snapshot = await get(roomRef)
      const room = normalizeRoom(snapshot.val() as Room | null)
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
      await set(ref(database, `rooms/${code}/players/${userId}`), { ...player, name })
    },

    watchRoom(code, onRoom, onError) {
      return onValue(
        ref(database, `rooms/${code}`),
        (snapshot) => onRoom(normalizeRoom(snapshot.val() as Room | null)),
        (error) => onError(error),
      )
    },

    async submitInitial(code, questionIndex, answer) {
      const submissionRef = ref(database, `rooms/${code}/submissions/${questionIndex}/${userId}`)
      await runTransaction(submissionRef, (current: Submission | null) => {
        if (current) return
        return { initial: answer, final: null, initialAt: Date.now(), finalAt: null }
      })
    },

    async submitFinal(code, questionIndex, answer) {
      const submissionRef = ref(database, `rooms/${code}/submissions/${questionIndex}/${userId}`)
      await runTransaction(submissionRef, (current: Submission | null) => {
        if (!current) return current
        return { ...current, final: answer, finalAt: Date.now() }
      })
    },

    async advance(code, expectedPhase) {
      const roomRef = ref(database, `rooms/${code}`)
      await runTransaction(roomRef, (raw: Room | null) => {
        const room = normalizeRoom(raw)
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
        return room
      })
    },

    async restart(code) {
      const roomRef = ref(database, `rooms/${code}`)
      await runTransaction(roomRef, (raw: Room | null) => {
        const room = normalizeRoom(raw)
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
        return room
      })
    },
  }
}

