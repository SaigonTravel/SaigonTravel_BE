# Saigon Travel Backend API (Node.js + Express + MongoDB)

Hệ thống Backend API cho dự án website **Saigon Travel** (kết hợp các nghiệp vụ tour du lịch cao cấp của [saigon-travel.com](https://saigon-travel.com/) và phong cách giao diện sự kiện, teambuilding, MICE của [yanteambuilding.vn](https://yanteambuilding.vn/)).

---

## 1. Cấu trúc thư mục

```
SaigonTravel_BE/
├── src/
│   ├── config/
│   │   └── db.js                 # Kết nối MongoDB (Mongoose)
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
│   │   └── errorHandler.js       # Middleware bắt lỗi tập trung
│   ├── app.js                    # Cấu hình Express app & routes
│   └── server.js                 # File khởi động server
├── .env.example
├── .env
├── package.json
└── README.md
```

---

## 2. Danh sách Schema & Mô tả quan hệ

| Model | Bộ sưu tập (Collection) | Mô tả chi tiết |
|---|---|---|
| **Tour** | `tours` | Quản lý tour du lịch: Điểm đến (`destinations`), Lịch trình từng ngày (`itinerary`), Giá người lớn/trẻ em/em bé, Bao gồm/Không bao gồm, Chính sách hoàn huỷ, FAQs, Thư viện ảnh. |
| **Destination** | `destinations` | Điểm đến theo châu lục (Châu Á, Châu Âu, Châu Mỹ, Châu Úc, Châu Phi, Việt Nam), quốc gia, thành phố, điểm nổi bật. |
| **Service** | `services` | Dịch vụ theo phong cách Yan Teambuilding: *Amazing Race, Teambuilding bãi biển, Gala Dinner, Year End Party, Training & Workshop, Hội nghị MICE*. |
| **EventProject** | `event_projects` | Các sự kiện và khách hàng tiêu biểu (giống Yan Teambuilding: *NEC Việt Nam, HOANMY, Laurelton Diamonds, Shiseido, Highlands Coffee, Bosch*...). |
| **Booking** | `bookings` | Quản lý cả 2 luồng: Đặt tour du lịch lẻ/gia đình & Yêu cầu báo giá tour đoàn, Teambuilding, MICE cho doanh nghiệp (tên cty, số lượng người, ngân sách). |
| **Category** | `categories` | Phân loại linh hoạt theo `type` (tour, teambuilding, service, event, article). |
| **Article** | `articles` | Tin tức du lịch & chuyên mục "Kiến thức Teambuilding", cẩm nang tổ chức. |
| **Gallery** | `galleries` | Album ảnh hiển thị dạng Grid / Lightbox phóng to ảnh chất lượng cao. |
| **Testimonial** | `testimonials` | Nhận xét từ du khách và đại diện phòng nhân sự/công ty. |
| **Contact** | `contacts` | Tiếp nhận tin nhắn liên hệ từ form chân trang hoặc trang Liên hệ. |
| **Setting** | `settings` | Quản lý Banner Sliders trang chủ, Hotline, Email, Địa chỉ, Thống kê nổi bật (17+ năm kinh nghiệm, 1000+ chuyến đi). |
| **User** | `users` | Tài khoản Admin, Manager, Sales hỗ trợ khách hàng. |

---

## 3. Hướng dẫn chạy thử dự án

1. **Cài đặt thư viện**:
   ```bash
   npm install
   ```

2. **Cấu hình môi trường**:
   Kiểm tra file `.env` đã có chuỗi kết nối MongoDB:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://127.0.0.1:27017/saigontravel_db
   ```

3. **Chạy server**:
   - Chế độ phát triển (auto reload):
     ```bash
     npm run dev
     ```
   - Chế độ sản xuất:
     ```bash
     npm start
     ```

4. **Kiểm tra API Health**:
   - Truy cập: `http://localhost:5000/api/health`
   - API Welcome: `http://localhost:5000/api`
