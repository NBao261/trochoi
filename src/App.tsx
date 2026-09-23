import { useEffect, useMemo, useState } from "react";
import { CircleAlert, LoaderCircle } from "lucide-react";
import { GameScreen } from "./components/GameScreen";
import { Landing } from "./components/Landing";
import { Lobby } from "./components/Lobby";
import { StatusHeader } from "./components/StatusHeader";
import { createRoomService } from "./services/createRoomService";
import type { RoomService } from "./services/roomService";
import type { Answer, GamePhase, Room } from "./domain/types";

const ACTIVE_ROOM_KEY = "mln131-active-room";

function updateRoomUrl(code?: string) {
  const url = new URL(window.location.href);
  if (code) url.searchParams.set("room", code);
  else url.searchParams.delete("room");
  window.history.replaceState({}, "", url);
}

export default function App() {
  const [service, setService] = useState<RoomService | null>(null);
  const [roomCode, setRoomCode] = useState(
    () => sessionStorage.getItem(ACTIVE_ROOM_KEY) ?? "",
  );
  const [room, setRoom] = useState<Room | null>(null);
  const [loadingRoom, setLoadingRoom] = useState(Boolean(roomCode));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const invitedCode = useMemo(
    () =>
      new URLSearchParams(window.location.search).get("room")?.toUpperCase() ??
      "",
    [],
  );

  useEffect(() => {
    createRoomService()
      .then(setService)
      .catch((reason: unknown) =>
        setError(
          reason instanceof Error
            ? reason.message
            : "Không thể khởi động game.",
        ),
      );
  }, []);

  useEffect(() => {
    if (!service || !roomCode) return;
    return service.watchRoom(
      roomCode,
      (nextRoom) => {
        setRoom(nextRoom);
        setLoadingRoom(false);
      },
      (reason) => {
        setError(reason.message);
        setLoadingRoom(false);
      },
    );
  }, [roomCode, service]);

  const rememberRoom = (code: string) => {
    sessionStorage.setItem(ACTIVE_ROOM_KEY, code);
    updateRoomUrl(code);
    setLoadingRoom(true);
    setRoomCode(code);
  };

  const runAction = async (action: () => Promise<void>) => {
    setBusy(true);
    setError("");
    try {
      await action();
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Đã có lỗi xảy ra. Hãy thử lại.",
      );
    } finally {
      setBusy(false);
    }
  };

  const createRoom = () =>
    runAction(async () => {
      if (!service) return;
      rememberRoom(await service.createRoom());
    });

  const joinRoom = (code: string, name: string) =>
    runAction(async () => {
      if (!service) return;
      await service.joinRoom(code, name);
      rememberRoom(code);
    });

  const submitInitial = (answer: Answer) =>
    runAction(async () => {
      if (!service || !room) return;
      await service.submitInitial(room.code, room.game.questionIndex, answer);
    });

  const submitFinal = (answer: Answer) =>
    runAction(async () => {
      if (!service || !room) return;
      await service.submitFinal(room.code, room.game.questionIndex, answer);
    });

  const advance = (phase: GamePhase) =>
    runAction(async () => {
      if (!service || !room) return;
      await service.advance(room.code, phase);
    });

  const restart = () =>
    runAction(async () => {
      if (!service || !room) return;
      await service.restart(room.code);
    });

  const exitRoom = () => {
    sessionStorage.removeItem(ACTIVE_ROOM_KEY);
    updateRoomUrl();
    setRoomCode("");
    setRoom(null);
    setLoadingRoom(false);
    setError("");
  };

  if (!service) {
    return <LoadingStage message={error || "Đang chuẩn bị đấu trường…"} />;
  }

  if (!roomCode) {
    return (
      <>
        <StatusHeader mode={service.mode} />
        <Landing
          busy={busy}
          invitedCode={invitedCode}
          mode={service.mode}
          onCreate={createRoom}
          onJoin={joinRoom}
        />
        {error && <ErrorToast message={error} onClose={() => setError("")} />}
      </>
    );
  }

  if (loadingRoom)
    return <LoadingStage message={`Đang kết nối phòng ${roomCode}…`} />;

  if (!room) {
    return (
      <main className="center-stage">
        <CircleAlert size={36} aria-hidden="true" />
        <h1>Phòng không còn tồn tại</h1>
        <button className="button button--primary" onClick={exitRoom}>
          Về trang đầu
        </button>
      </main>
    );
  }

  const isHost = room.hostId === service.userId;
  const player = room.players[service.userId];

  return (
    <>
      <StatusHeader
        mode={service.mode}
        roomCode={room.code}
        isHost={isHost}
        onExit={exitRoom}
      />
      {room.game.phase === "lobby" ? (
        <Lobby
          room={room}
          isHost={isHost}
          player={player}
          busy={busy}
          onStart={() => advance("lobby")}
        />
      ) : (
        <GameScreen
          room={room}
          isHost={isHost}
          player={player}
          userId={service.userId}
          busy={busy}
          onAdvance={advance}
          onInitialAnswer={submitInitial}
          onFinalAnswer={submitFinal}
          onRestart={restart}
        />
      )}
      {error && <ErrorToast message={error} onClose={() => setError("")} />}
    </>
  );
}

function LoadingStage({ message }: { message: string }) {
  return (
    <main className="center-stage" aria-live="polite">
      <LoaderCircle className="spin" aria-hidden="true" />
      <p>{message}</p>
    </main>
  );
}

function ErrorToast({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) {
  return (
    <div className="toast" role="alert">
      <CircleAlert aria-hidden="true" />
      <span>{message}</span>
      <button onClick={onClose} aria-label="Đóng thông báo">
        ×
      </button>
    </div>
  );
}
