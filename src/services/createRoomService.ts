import { createDemoRoomService } from './demoRoomService'
import type { RoomService } from './roomService'

export async function createRoomService(): Promise<RoomService> {
  const configured = [
    import.meta.env.VITE_FIREBASE_API_KEY,
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    import.meta.env.VITE_FIREBASE_DATABASE_URL,
    import.meta.env.VITE_FIREBASE_PROJECT_ID,
    import.meta.env.VITE_FIREBASE_APP_ID,
  ].every((value) => typeof value === 'string' && value.length > 0)

  if (!configured) return createDemoRoomService()
  const { createFirebaseRoomService } = await import('./firebaseRoomService')
  return createFirebaseRoomService()
}
