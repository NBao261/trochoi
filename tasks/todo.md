# Task checklist

## Task 1: Project foundation

**Acceptance criteria**
- [x] React + TypeScript chạy bằng Vite.
- [x] Có 8 câu hỏi Câu 8–15 và kiểu dữ liệu game rõ ràng.
- [x] Có design tokens mobile-first và khung accessibility cơ bản.

**Verification**
- [x] `npm run typecheck`
- [x] `npm run build`

**Dependencies:** None

## Task 2: Tested game rules

**Acceptance criteria**
- [x] Test mô tả đủ các nhánh 1000/800/600/0 điểm và x2 câu cuối.
- [x] Test xếp hạng theo điểm rồi thời gian.
- [x] Test mã phòng và chuyển câu an toàn.

**Verification**
- [x] Test phải đỏ trước khi có implementation.
- [x] `npm test -- --run`

**Dependencies:** Task 1

## Task 3: Realtime room adapter

**Acceptance criteria**
- [x] Host tạo phòng; player join bằng code và tên.
- [x] State, submissions và leaderboard đồng bộ realtime.
- [x] Có demo adapter khi thiếu Firebase config.

**Verification**
- [x] Hai tab hoàn tất ít nhất một vòng trong demo.

**Dependencies:** Task 2

## Task 4: Host experience

**Acceptance criteria**
- [x] Lobby có QR, code, player count và điều khiển bắt đầu.
- [x] Host điều khiển đủ initial → reconsider → reveal → next.
- [x] Projector view đọc tốt ở 1024px và 1440px.

**Verification**
- [x] Browser screenshot và accessibility snapshot.

**Dependencies:** Task 3

## Task 5: Player experience

**Acceptance criteria**
- [x] Join nhanh trên 320px; nút đáp án có target tối thiểu 48px.
- [x] Giữ/đổi đáp án rõ ràng, chống gửi lặp.
- [x] Hiện trạng thái chờ, mất kết nối và điểm cá nhân.

**Verification**
- [x] Browser test ở 320px và 768px.

**Dependencies:** Task 3

## Task 6: Leaderboard, finish and delivery

**Acceptance criteria**
- [x] Top 5 giữa trận và podium Top 3 cuối trận.
- [x] Firebase rules và `.env.example` không chứa secret.
- [x] README hướng dẫn chạy, cấu hình, deploy và diễn tập trước giờ học.

**Verification**
- [x] `npm test -- --run`
- [x] `npm run lint`
- [x] `npm run typecheck`
- [x] `npm run build`
- [x] Console trình duyệt sạch.

**Dependencies:** Tasks 4–5
