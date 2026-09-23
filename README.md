# Đa số chưa chắc đúng · MLN131

Quiz realtime dành cho khoảng 12 người, thiết kế cho phiên chơi 8 câu trong 10 phút. Người chơi trả lời riêng, xem tỷ lệ lựa chọn của cả lớp rồi có 8 giây để giữ hoặc đổi đáp án.

## Luồng chơi

1. Host tạo phòng và chiếu QR/mã phòng.
2. Người chơi nhập tên trên điện thoại.
3. Mỗi câu có 15 giây chọn ban đầu.
4. Cả lớp xem biểu đồ lựa chọn và có 8 giây cân nhắc lại.
5. Host công bố đáp án; điểm và bảng xếp hạng được cập nhật tự động.
6. Câu cuối nhân đôi điểm; kết thúc bằng bục Top 3.

Điểm số: giữ đáp án đúng 1.000; ban đầu đúng nhưng đổi sai 800; đổi từ sai sang đúng 600; còn lại 0. Thời gian chỉ dùng để phá hòa.

## Chạy thử ngay

```bash
npm install
npm run dev
```

Khi chưa có biến môi trường Firebase, ứng dụng tự chạy ở **demo cục bộ**. Mở hai tab trình duyệt để thử host và người chơi. Demo không kết nối được từ điện thoại khác.

## Bật chế độ online cho điện thoại

1. Tạo Firebase project và đăng ký một Web App.
2. Trong **Authentication → Sign-in method**, bật **Anonymous**.
3. Tạo **Realtime Database**; nên chọn vùng Singapore cho lớp học tại Việt Nam.
4. Sao chép `.env.example` thành `.env.local` và điền cấu hình Web App. `databaseURL` phải đúng URL của Realtime Database.
5. Dán nội dung `database.rules.json` vào tab **Rules** của Realtime Database rồi Publish.
6. Khởi động lại `npm run dev`. Nhãn góc trên sẽ đổi từ “Demo cục bộ” thành “Trực tuyến”.

Các biến cần có:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_DATABASE_URL=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_APP_ID=...
```

Firebase Web config không phải khóa quản trị; quyền truy cập được bảo vệ bằng Anonymous Auth và Database Rules. Không đưa service-account key hay private key vào dự án.

Tài liệu chính thức: [Firebase Web setup](https://firebase.google.com/docs/web/setup), [Anonymous Auth](https://firebase.google.com/docs/auth/web/anonymous-auth), [Realtime Database](https://firebase.google.com/docs/database/web/read-and-write).

## Deploy

### Vercel

1. Import thư mục/repository vào Vercel.
2. Framework preset: **Vite**; build command: `npm run build`; output: `dist`.
3. Thêm năm biến `VITE_FIREBASE_*` trong Project Settings → Environment Variables.
4. Deploy và mở URL trên laptop host. QR sẽ tự dùng đúng URL production.

### Firebase Hosting

```bash
npm run build
npx firebase-tools login
npx firebase-tools use --add
npx firebase-tools deploy --only hosting,database
```

## Kiểm tra trước giờ học

- Mở URL deploy bằng laptop, tạo phòng và thử join bằng điện thoại dùng 5G.
- Thử thêm một điện thoại dùng Wi-Fi để xác nhận cả hai mạng đều nhận trạng thái.
- Bật chế độ toàn màn hình trên laptop (`F11`).
- Đảm bảo trình duyệt laptop không tự sleep và giữ tab host mở trong suốt trận.
- Nếu Firebase gặp sự cố, dùng demo trên laptop để trình chiếu hoặc chuyển sang phương án giơ bảng A/B/C/D.

## Lệnh kiểm tra

```bash
npm test -- --run
npm run lint
npm run typecheck
npm run build
```

## Cấu trúc chính

- `src/domain`: câu hỏi, kiểu dữ liệu, luật tính điểm và xếp hạng.
- `src/services`: adapter Firebase và demo localStorage.
- `src/components`: giao diện host, player, biểu đồ và leaderboard.
- `database.rules.json`: phân quyền host/player cho Realtime Database.
- `tasks/plan.md`: kế hoạch và quyết định kiến trúc.
