# Saigon Travel Backend API (Node.js + Express + MongoDB)

Hệ thống Backend API cho dự án website **Saigon Travel** (kết hợp các nghiệp vụ tour du lịch cao cấp của [saigon-travel.com](https://saigon-travel.com/) và phong cách giao diện sự kiện, teambuilding, MICE của [yanteambuilding.vn](https://yanteambuilding.vn/)).

---

## 1. Cấu trúc thư mục

```
SaigonTravel_BE/
├── src/
│   ├── config/
│   │   └── db.js                 # Kết nối MongoDB (Mongoose)
│   ├── controllers/
│   │   ├── authController.js     # Đăng ký, đăng nhập, lấy thông tin user
│   │   ├── tourController.js     # Danh sách & chi tiết tour
│   │   ├── bookingController.js  # Tiếp nhận & quản lý yêu cầu tư vấn / đặt tour
│   │   └── settingController.js  # Cấu hình website, Hotline, Banner Sliders
│   ├── models/
│   │   ├── User.js               # Quản trị viên, nhân viên sales, biên tập viên
│   │   ├── Category.js           # Danh mục (Tour, Teambuilding, Dịch vụ, Bài viết)
│   │   ├── Destination.js        # Điểm đến (Châu Á, Châu Âu, Việt Nam...)
│   │   ├── Tour.js               # Tour du lịch trọn gói, lịch trình, bảng giá
│   │   ├── Service.js            # Dịch vụ Teambuilding, Gala Dinner, MICE, Hội thảo
│   │   ├── EventProject.js       # Dự án & Sự kiện tiêu biểu (Case study phong cách YanTB)
│   │   ├── Booking.js            # Đặt tour & Yêu cầu báo giá đoàn/Teambuilding
│   │   ├── Article.js            # Tin tức & Kiến thức Teambuilding
│   │   ├── Gallery.js            # Thư viện album ảnh sự kiện / tour
│   │   ├── Testimonial.js        # Ý kiến đánh giá của khách hàng / doanh nghiệp
│   │   ├── Contact.js            # Thông tin liên hệ từ khách hàng
│   │   ├── Setting.js            # Cấu hình website, Hotline, Slider banner
│   │   └── index.js              # Export tất cả models
│   ├── middlewares/
│   │   ├── auth.js               # Xác thực JWT (protect) & Phân quyền (authorize)
│   │   └── errorHandler.js       # Middleware bắt lỗi tập trung
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth
│   │   ├── tourRoutes.js         # /api/tours
│   │   ├── bookingRoutes.js      # /api/bookings
│   │   └── settingRoutes.js      # /api/settings
│   ├── seeds/
│   │   └── tourSeeder.js         # Script seed 6 tour thực tế và điểm đến
│   ├── app.js                    # Cấu hình Express app & routes
│   └── server.js                 # File khởi động server
├── .env.example
├── .env
├── package.json
├── test_api.js                   # Script kiểm thử tự động toàn bộ API
└── README.md
```

---

## 2. Danh Sách Endpoints API Đã Triển Khai

### 2.1. Authentication (`/api/auth`)
| Method | Endpoint | Quyền | Mô tả |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Đăng ký tài khoản (`email`, `username`, `password`, `name`, `phone`) |
| `POST` | `/api/auth/login` | Public | Đăng nhập bằng `username` HOẶC `email`, và `password` |
| `GET` | `/api/auth/me` | Private | Lấy thông tin user hiện tại (kèm header `Authorization: Bearer <TOKEN>`) |

### 2.2. Tours (`/api/tours`)
| Method | Endpoint | Quyền | Mô tả |
|---|---|---|---|
| `GET` | `/api/tours` | Public | Lấy danh sách tours (hỗ trợ lọc theo `destination`, `category`, `keyword`, `minPrice`, `maxPrice`, phân trang) |
| `GET` | `/api/tours/:identifier` | Public | Lấy chi tiết tour theo `slug` (ví dụ `chau-au-phap-thuy-si-y-vatican-monaco`) hoặc `_id` |

### 2.3. Tiếp Nhận Booking & Yêu Cầu Tư Vấn (`/api/bookings`)
| Method | Endpoint | Quyền | Mô tả |
|---|---|---|---|
| `POST` | `/api/bookings` | Public | Khách hàng gửi form nhận tư vấn / đặt tour (Họ tên, SĐT, Email, Tên cty, Ngày đi, Số lượng người) -> Tự động sinh mã `SGT-YYYYMMDD-XXXX` |
| `GET` | `/api/bookings` | Private (Staff) | Lấy danh sách yêu cầu của khách (lọc theo `status`, `type`, `keyword`, phân trang) |
| `GET` | `/api/bookings/:id` | Private (Staff) | Chi tiết yêu cầu khách hàng kèm lịch sử ghi chú tư vấn |
| `PATCH` | `/api/bookings/:id` | Private (Staff) | Cập nhật trạng thái (`contacted`, `processing`, `confirmed`...) và thêm ghi chú tư vấn |
| `DELETE` | `/api/bookings/:id` | Private (Admin) | Xóa yêu cầu booking |

### 2.4. Cấu Hình Website & Sliders (`/api/settings`)
| Method | Endpoint | Quyền | Mô tả |
|---|---|---|---|
| `GET` | `/api/settings` | Public | Lấy cấu hình website cho Frontend render: Hotline, Email, Địa chỉ, Hero Banner Sliders, Thống kê 17+ năm kinh nghiệm |
| `PUT` | `/api/settings` | Private (Admin) | Cập nhật thông tin website |

---

## 3. Hướng Dẫn Sử Dụng & Test API

1. **Chạy server phát triển**:
   ```bash
   npm run dev
   ```

2. **Chạy lại seeder dữ liệu Tours**:
   ```bash
   npm run seed:tours
   ```

3. **Chạy kiểm thử toàn bộ API tự động**:
   ```bash
   node test_api.js
   ```
