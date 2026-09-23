# Đa số chưa chắc đúng · MLN131

Quiz realtime cho lớp học, tối ưu khoảng 12 người. Mỗi người chơi dùng điện thoại để trả lời, xem lựa chọn của cả lớp, cân nhắc giữ hoặc đổi đáp án, sau đó xem bảng xếp hạng trực tiếp.

**Production:** <https://trochoi-one.vercel.app>

## Kiến trúc triển khai

```text
GitHub (nhánh main)
        │ tự động build khi có commit mới
        ▼
Vercel ───────────────► Giao diện React/Vite + đường link để quét QR
        │
        └─────────────► Firebase Authentication (đăng nhập ẩn danh)
                         + Realtime Database (đồng bộ phòng chơi)
                         + Database Security Rules (phân quyền)
```

- **Vercel** chỉ phục vụ giao diện tĩnh; không cần backend riêng.
- **Firebase** chỉ dùng cho đăng nhập ẩn danh và dữ liệu realtime.
- **GitHub** là nguồn mã chính. Sau lần cấu hình đầu, mỗi lần push lên `main`, Vercel tự deploy lại.
- Không cần deploy Firebase Hosting khi đã dùng Vercel.

## Luồng chơi

1. Host tạo phòng và chiếu QR/mã phòng.
2. Người chơi nhập tên trên điện thoại.
3. Mỗi câu có 15 giây chọn ban đầu.
4. Cả lớp xem biểu đồ lựa chọn và có 8 giây cân nhắc lại.
5. Host công bố đáp án; điểm và bảng xếp hạng được cập nhật tự động.
6. Câu cuối nhân đôi điểm; kết thúc bằng bục Top 3.

Điểm số: giữ đáp án đúng 1.000; ban đầu đúng nhưng đổi sai 800; đổi từ sai sang đúng 600; còn lại 0. Thời gian chỉ dùng để phá hòa.

## 1. Chuẩn bị

Cần có:

- Tài khoản [GitHub](https://github.com/).
- Tài khoản [Firebase](https://console.firebase.google.com/).
- Tài khoản [Vercel](https://vercel.com/) đăng nhập bằng GitHub.
- Node.js **20.19 trở lên** hoặc **22.12 trở lên** vì dự án dùng Vite 8.
- Git.

Kiểm tra môi trường:

```bash
node --version
npm --version
git --version
```

## 2. Chạy thử cục bộ

```bash
git clone https://github.com/NBao261/trochoi.git
cd trochoi
npm install
npm run dev
```

Mở URL Vite in ra, thường là `http://localhost:5173`.

Khi chưa cấu hình Firebase, ứng dụng chạy ở **Demo cục bộ**. Có thể mở hai tab trên cùng máy để thử host và player, nhưng điện thoại khác sẽ không tham gia được.

## 3. Tạo và cấu hình Firebase

### 3.1. Tạo project riêng

1. Mở [Firebase Console](https://console.firebase.google.com/).
2. Chọn **Create a project**.
3. Đặt tên, ví dụ `Tro choi MLN131`.
4. Project ID nên dùng `trochoi-mln131-nbao261`; nếu tên này đã tồn tại toàn cầu, thêm một dãy số ngắn phía sau.
5. Google Analytics không bắt buộc cho trò chơi này, có thể tắt để thiết lập nhanh hơn.

Không dùng chung project Firebase đang chứa dữ liệu của ứng dụng khác.

### 3.2. Đăng ký Web App

1. Tại **Project Overview**, chọn biểu tượng **Web `</>`**.
2. App nickname: `trochoi-web`.
3. Không cần bật Firebase Hosting vì frontend sẽ chạy trên Vercel.
4. Chọn **Register app**.
5. Giữ trang chứa đối tượng `firebaseConfig`; các giá trị này sẽ dùng ở bước 3.5.

Có thể tìm lại cấu hình tại **Project settings → General → Your apps → SDK setup and configuration → Config**.

### 3.3. Bật đăng nhập ẩn danh

1. Mở **Build → Authentication**.
2. Chọn **Get started**.
3. Vào tab **Sign-in method**.
4. Chọn **Anonymous**, bật **Enable**, rồi **Save**.

Nếu bỏ qua bước này, người chơi sẽ gặp lỗi `auth/operation-not-allowed` và không thể tạo/join phòng.

### 3.4. Tạo Realtime Database tại Singapore

1. Mở **Build → Realtime Database**.
2. Chọn **Create Database**.
3. Chọn vùng **Singapore (`asia-southeast1`)** để giảm độ trễ cho người chơi ở Việt Nam.
4. Chọn **Start in locked mode**. Không dùng test mode cho bản public.

Lưu ý: Firebase không cho đổi vùng của database sau khi đã tạo. URL thường có dạng:

```text
https://YOUR_DATABASE_NAME.asia-southeast1.firebasedatabase.app
```

### 3.5. Tạo `.env.local`

Sao chép file mẫu:

```powershell
Copy-Item .env.example .env.local
```

Trên macOS/Linux:

```bash
cp .env.example .env.local
```

Điền đúng năm giá trị từ `firebaseConfig`:

```env
VITE_FIREBASE_API_KEY=gia_tri_apiKey
VITE_FIREBASE_AUTH_DOMAIN=gia_tri_authDomain
VITE_FIREBASE_DATABASE_URL=gia_tri_databaseURL
VITE_FIREBASE_PROJECT_ID=gia_tri_projectId
VITE_FIREBASE_APP_ID=gia_tri_appId
```

Ánh xạ tên:

| Firebase config | Biến của dự án |
|---|---|
| `apiKey` | `VITE_FIREBASE_API_KEY` |
| `authDomain` | `VITE_FIREBASE_AUTH_DOMAIN` |
| `databaseURL` | `VITE_FIREBASE_DATABASE_URL` |
| `projectId` | `VITE_FIREBASE_PROJECT_ID` |
| `appId` | `VITE_FIREBASE_APP_ID` |

`databaseURL` phải lấy từ trang Realtime Database, không tự đoán URL.

### 3.6. Deploy Database Rules

Rules trong [database.rules.json](database.rules.json) bắt buộc người dùng đã đăng nhập ẩn danh, chỉ cho player sửa dữ liệu của chính họ và chỉ cho host điều khiển trận đấu.

Đăng nhập Firebase CLI:

```bash
npx firebase-tools login
```

Triển khai riêng rules, thay `YOUR_PROJECT_ID` bằng Project ID thực tế:

```bash
npx firebase-tools deploy --only database --project YOUR_PROJECT_ID
```

Luôn giữ `--only database --project ...` để không vô tình deploy Hosting hoặc ghi rules vào nhầm Firebase project. Khi deploy bằng CLI, file local sẽ ghi đè rules đang có trên Firebase Console.

### 3.7. Xác nhận Firebase hoạt động

Khởi động lại ứng dụng sau khi tạo `.env.local`:

```bash
npm run dev
```

Kiểm tra:

- Nhãn trạng thái phải là **Trực tuyến**, không còn là **Demo cục bộ**.
- Tạo được phòng có mã bốn ký tự.
- Mở URL LAN hoặc bản deploy bằng điện thoại và join được.
- Trong Realtime Database xuất hiện node `rooms`.

## 4. Đẩy mã nguồn lên GitHub

Repository chính: <https://github.com/NBao261/trochoi>

Nếu thư mục local chưa có remote:

```bash
git remote add origin https://github.com/NBao261/trochoi.git
git remote -v
git push -u origin main
```

Các file `.env`, `.env.local`, `dist`, `node_modules` đã nằm trong `.gitignore` và không được push.

Quy trình cho những lần cập nhật sau:

```bash
git add .
git commit -m "feat: mô tả thay đổi"
git push origin main
```

## 5. Deploy frontend lên Vercel

Cách khuyến nghị là kết nối repository GitHub để Vercel tự tạo deployment mới sau mỗi lần push.

### 5.1. Import repository

1. Mở [Vercel Dashboard](https://vercel.com/new).
2. Đăng nhập bằng GitHub và cấp quyền truy cập repository nếu được hỏi.
3. Chọn **Add New → Project**.
4. Import repository **`NBao261/trochoi`**.
5. Kiểm tra cấu hình:

| Mục | Giá trị |
|---|---|
| Framework Preset | `Vite` |
| Root Directory | `./` |
| Install Command | `npm install` hoặc để mặc định |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Production Branch | `main` |

Không cần thêm `vercel.json` cho ứng dụng hiện tại vì đây là Vite SPA không dùng router theo path.

### 5.2. Thêm biến môi trường

Trước khi bấm **Deploy**, mở phần **Environment Variables** và thêm đủ:

```text
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_DATABASE_URL
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_APP_ID
```

Dán giá trị giống `.env.local`. Chọn ít nhất **Production**; nên chọn cả **Preview** để các deployment thử cũng dùng Firebase.

Vite nhúng các biến `VITE_*` tại thời điểm build. Vì vậy, sau khi thêm hoặc sửa biến trên Vercel, phải vào **Deployments → Redeploy** hoặc push một commit mới; deployment cũ không tự nhận giá trị mới.

### 5.3. Deploy và lấy URL

1. Chọn **Deploy**.
2. Chờ Vercel chạy `npm install` và `npm run build`.
3. Khi trạng thái là **Ready**, mở URL production: <https://trochoi-one.vercel.app>.
4. Vào **Project Settings → Domains** nếu muốn đổi sang tên miền `.vercel.app` dễ nhớ hơn.

QR trong game lấy URL hiện tại của trang, vì vậy sau khi chạy trên Vercel, QR tự trỏ đúng tới bản production.

## 6. Kiểm tra production trước giờ học

Thực hiện bằng ít nhất một laptop và hai điện thoại:

1. Mở URL Vercel trên laptop, xác nhận nhãn **Trực tuyến**.
2. Tạo phòng mới và để nguyên tab host.
3. Điện thoại 1 dùng Wi-Fi quét QR và join.
4. Điện thoại 2 tắt Wi-Fi, dùng 4G/5G quét QR và join.
5. Chạy thử ít nhất hai câu, bao gồm bước đổi đáp án.
6. Kiểm tra điểm và bảng xếp hạng cập nhật trên cả ba thiết bị.
7. Reload điện thoại và xác nhận thiết bị kết nối lại được.
8. Bật toàn màn hình trên laptop (`F11`) và tắt chế độ sleep trong thời gian thuyết trình.

Nếu điện thoại khác mạng không join được, hãy chắc chắn mọi người đang mở URL Vercel, không phải `localhost` hoặc địa chỉ IP local.

## 7. Cập nhật và rollback

### Cập nhật

```bash
npm test -- --run
npm run lint
npm run typecheck
npm run build
git push origin main
```

Vercel tự deploy commit mới trên `main`. Các branch hoặc Pull Request khác sẽ tạo Preview Deployment riêng.

### Rollback frontend

Trong Vercel, mở **Deployments**, chọn bản hoạt động gần nhất rồi chọn **Promote to Production** hoặc rollback theo giao diện của Vercel.

### Rollback mã nguồn

Ưu tiên tạo commit đảo ngược thay vì sửa lịch sử chung:

```bash
git revert COMMIT_SHA
git push origin main
```

Database Rules không có cơ chế rollback release giống Vercel. Trước khi sửa rules, luôn commit phiên bản đang chạy; nếu rules mới lỗi, khôi phục file từ Git rồi deploy lại bằng `--only database --project YOUR_PROJECT_ID`.

## 8. Xử lý lỗi thường gặp

### Vẫn hiện “Demo cục bộ” trên Vercel

- Kiểm tra đủ năm biến `VITE_FIREBASE_*` và không có khoảng trắng thừa.
- Kiểm tra biến được bật cho môi trường **Production**.
- Redeploy sau khi thêm biến; bản build cũ không nhận biến mới.

### Lỗi `auth/operation-not-allowed`

Bật provider **Anonymous** tại Firebase Authentication → Sign-in method.

### Lỗi `PERMISSION_DENIED`

- Xác nhận Anonymous Auth đã bật.
- Deploy lại `database.rules.json` vào đúng Project ID.
- Kiểm tra `VITE_FIREBASE_DATABASE_URL` thuộc cùng project với `VITE_FIREBASE_PROJECT_ID`.

### Tạo phòng được nhưng điện thoại không thấy phòng

- Không dùng chế độ Demo cục bộ.
- Không chia sẻ URL `localhost`.
- Kiểm tra host và player cùng mở một domain Vercel.
- Kiểm tra tab **Data** của Realtime Database có node `rooms` hay không.

### Vercel build lỗi

Chạy lại đúng quy trình trên máy local:

```bash
npm install
npm run build
```

Đảm bảo Vercel dùng phiên bản Node đáp ứng yêu cầu của Vite 8.

## 9. Lệnh phát triển

| Lệnh | Tác dụng |
|---|---|
| `npm run dev` | Chạy development server |
| `npm test -- --run` | Chạy test một lần |
| `npm run lint` | Kiểm tra ESLint |
| `npm run typecheck` | Kiểm tra TypeScript |
| `npm run build` | Build production vào `dist` |
| `npm run preview` | Xem thử bản build production |

## 10. Lưu ý bảo mật

- Firebase Web API key dùng để nhận diện project, không phải khóa quản trị. Quyền dữ liệu vẫn phải được bảo vệ bằng Authentication và Database Rules.
- Không commit `.env.local`, service-account JSON, private key, access token hoặc refresh token.
- Không để Realtime Database ở test mode.
- Không sửa rules trực tiếp trên Console rồi quên cập nhật `database.rules.json`; lần deploy CLI tiếp theo sẽ ghi đè rules trên Console.
- Xóa các phòng cũ trong node `rooms` sau buổi học nếu không còn cần dữ liệu.

## 11. Cấu trúc chính

- `src/domain`: câu hỏi, kiểu dữ liệu, luật tính điểm và xếp hạng.
- `src/services`: adapter Firebase và demo localStorage.
- `src/components`: giao diện host, player, biểu đồ và leaderboard.
- `database.rules.json`: phân quyền host/player cho Realtime Database.
- `firebase.json`: ánh xạ rules và cấu hình Firebase Hosting dự phòng.
- `tasks/plan.md`: kế hoạch và quyết định kiến trúc.

## Tài liệu chính thức

- [Vite: Getting Started và yêu cầu Node.js](https://vite.dev/guide/)
- [GitHub: Push repository local lên GitHub](https://docs.github.com/en/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github)
- [Firebase Web setup](https://firebase.google.com/docs/web/setup)
- [Firebase Anonymous Authentication](https://firebase.google.com/docs/auth/web/anonymous-auth)
- [Firebase Realtime Database locations](https://firebase.google.com/docs/database/locations)
- [Firebase Realtime Database Security Rules](https://firebase.google.com/docs/database/security)
- [Firebase CLI và partial deploy](https://firebase.google.com/docs/cli)
- [Firebase security checklist](https://firebase.google.com/support/guides/security-checklist)
- [Vercel: Deploy Git repositories](https://vercel.com/docs/git)
- [Vercel: Vite](https://vercel.com/docs/frameworks/frontend/vite)
- [Vercel: Environment Variables](https://vercel.com/docs/environment-variables)
