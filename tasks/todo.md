# Task checklist

## Task 1: Project foundation

**Acceptance criteria**
- [ ] React + TypeScript chạy bằng Vite.
- [ ] Có 8 câu hỏi Câu 8–15 và kiểu dữ liệu game rõ ràng.
- [ ] Có design tokens mobile-first và khung accessibility cơ bản.

**Verification**
- [ ] `npm run typecheck`
- [ ] `npm run build`

**Dependencies:** None

## Task 2: Tested game rules

**Acceptance criteria**
- [ ] Test mô tả đủ các nhánh 1000/800/600/0 điểm và x2 câu cuối.
- [ ] Test xếp hạng theo điểm rồi thời gian.
- [ ] Test mã phòng và chuyển câu an toàn.

**Verification**
- [ ] Test phải đỏ trước khi có implementation.
- [ ] `npm test -- --run`

**Dependencies:** Task 1

## Task 3: Realtime room adapter

**Acceptance criteria**
- [ ] Host tạo phòng; player join bằng code và tên.
- [ ] State, submissions và leaderboard đồng bộ realtime.
- [ ] Có demo adapter khi thiếu Firebase config.

**Verification**
- [ ] Hai tab hoàn tất ít nhất một vòng trong demo.

**Dependencies:** Task 2

## Task 4: Host experience

**Acceptance criteria**
- [ ] Lobby có QR, code, player count và điều khiển bắt đầu.
- [ ] Host điều khiển đủ initial → reconsider → reveal → next.
- [ ] Projector view đọc tốt ở 1024px và 1440px.

**Verification**
- [ ] Browser screenshot và accessibility snapshot.

**Dependencies:** Task 3

## Task 5: Player experience

**Acceptance criteria**
- [ ] Join nhanh trên 320px; nút đáp án có target tối thiểu 48px.
- [ ] Giữ/đổi đáp án rõ ràng, chống gửi lặp.
- [ ] Hiện trạng thái chờ, mất kết nối và điểm cá nhân.

**Verification**
- [ ] Browser test ở 320px và 768px.

**Dependencies:** Task 3

## Task 6: Leaderboard, finish and delivery

**Acceptance criteria**
- [ ] Top 5 giữa trận và podium Top 3 cuối trận.
- [ ] Firebase rules và `.env.example` không chứa secret.
- [ ] README hướng dẫn chạy, cấu hình, deploy và diễn tập trước giờ học.

**Verification**
- [ ] `npm test -- --run`
- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm run build`
- [ ] Console trình duyệt sạch.

**Dependencies:** Tasks 4–5
