# Implementation Plan: Đa số chưa chắc đúng

## Overview

Xây một trò chơi quiz realtime cho môn MLN131, tối ưu cho 12 người và phiên chơi khoảng 10 phút. Người dẫn tạo phòng và chiếu màn hình host; người chơi quét QR hoặc nhập mã phòng, trả lời riêng trên điện thoại, xem tỷ lệ lựa chọn rồi quyết định giữ/đổi đáp án. Kết quả và bảng xếp hạng được đồng bộ tự động.

## Product contract

- Một trận gồm 15 câu (Câu 1–15 từ bộ đề đã cung cấp), mỗi vòng có hai pha: chọn ban đầu và cân nhắc lại.
- Điểm: đúng ngay từ đầu 800; giữ đáp án đúng thêm 200; đổi từ sai sang đúng được 600; câu cuối nhân đôi. Thời gian chỉ phá hòa để giảm bất công giữa Wi-Fi và 5G.
- Host điều khiển nhịp trận; người chơi chỉ thấy dữ liệu cần thiết trên màn hình nhỏ.
- Mục tiêu 12 người, không đăng ký tài khoản, không có server tự vận hành.

## Architecture decisions

- React + TypeScript + Vite: bundle nhỏ, triển khai tĩnh dễ dàng, hỗ trợ UI theo trạng thái rõ ràng.
- Firebase Anonymous Auth + Realtime Database: đồng bộ giữa Wi-Fi/5G mà không cần viết backend riêng.
- Host là nguồn quyết định cho pha chơi và điểm số; client người chơi chỉ gửi lựa chọn.
- Câu hỏi được preload để chuyển cảnh tức thì; chỉ gửi các bản ghi nhỏ qua mạng.
- CSS token thuần, mobile-first; không dùng framework CSS để giảm bundle và kiểm soát responsive.
- Chế độ demo cục bộ được cung cấp để xem và tập dượt giao diện khi chưa cấu hình Firebase.

## Information architecture

1. Landing: chọn “Tạo phòng” hoặc “Tham gia”.
2. Lobby host: mã phòng, QR, danh sách người chơi, nút bắt đầu.
3. Lobby người chơi: xác nhận đã vào phòng và chờ host.
4. Vòng chọn đầu: câu hỏi + 4 đáp án + bộ đếm.
5. Vòng cân nhắc: biểu đồ tỷ lệ + giữ/đổi đáp án.
6. Reveal: đáp án đúng, thay đổi lựa chọn, điểm nhận được.
7. Leaderboard: Top 5 giữa trận, Top 3 khi kết thúc.

## Task list

### Phase 1: Foundation

- Task 1: Tạo scaffold, design tokens, kiểu dữ liệu và bộ câu hỏi.
- Task 2: Viết test trước cho tính điểm, xếp hạng, mã phòng và chuyển pha.
- Task 3: Cài các hàm logic tối thiểu để test qua.

### Checkpoint: Foundation

- Unit tests qua; TypeScript và production build sạch.

### Phase 2: Realtime game

- Task 4: Tạo Firebase adapter và chế độ demo cục bộ.
- Task 5: Hoàn thiện luồng host tạo phòng/điều khiển vòng.
- Task 6: Hoàn thiện luồng người chơi join/trả lời/khôi phục kết nối.

### Checkpoint: Core flow

- Hai tab trình duyệt có thể tạo phòng, join và chơi hết một câu.

### Phase 3: Responsive UI and polish

- Task 7: Hoàn thiện màn hình máy chiếu, biểu đồ, leaderboard và podium.
- Task 8: Hoàn thiện màn hình điện thoại, trạng thái mạng, accessibility và reduced motion.
- Task 9: Viết README, Firebase rules và hướng dẫn deploy.

### Checkpoint: Complete

- Test, lint, typecheck và build đều qua.
- Không có console error/warning trong luồng demo.
- Kiểm tra 320px, 768px, 1024px và 1440px.

## Risks and mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Firebase chưa được cấu hình | Không thể chơi giữa nhiều thiết bị | Hiện màn hình hướng dẫn rõ ràng và có demo mode để tập dượt |
| Host reload giữa trận | Trận có thể gián đoạn | Anonymous auth duy trì trong trình duyệt; trạng thái phòng nằm trên Firebase |
| Người chơi mất mạng | Thiếu câu trả lời | Hiện trạng thái kết nối; cùng tên/thiết bị tự khôi phục phiên |
| Độ trễ Wi-Fi/5G khác nhau | Điểm tốc độ thiếu công bằng | Không dùng tốc độ làm điểm chính; chỉ dùng thời gian phá hòa |
| Người chơi sửa dữ liệu client | Sai bảng điểm | Chỉ host ghi điểm; rules giới hạn player vào vùng submission của chính họ |

## Nội dung đã chốt

- Bộ đề gồm đủ 15 câu từ Câu 1–15; các đoạn lặp hoặc dính lỗi trong nội dung nguồn không được đưa vào game.
- Firebase project và URL deploy sẽ do người dùng cấu hình theo README vì cần tài khoản của người dùng.
