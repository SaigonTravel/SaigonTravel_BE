# Saigon Travel Backend API (Node.js + Express + MongoDB)

Hệ thống Backend API cho dự án website **Saigon Travel** (kết hợp các nghiệp vụ tour du lịch cao cấp của [saigon-travel.com](https://saigon-travel.com/) và phong cách giao diện sự kiện, teambuilding, MICE của [yanteambuilding.vn](https://yanteambuilding.vn/)).

---

## 1. Cấu trúc thư mục

```
SaigonTravel_BE/
├── src/
│   ├── config/
│   │   └── db.js                     # Kết nối MongoDB (Mongoose)
│   ├── controllers/
│   │   ├── authController.js         # Đăng ký, đăng nhập, lấy thông tin user
│   │   ├── tourController.js         # Danh sách & chi tiết tour
│   │   ├── bookingController.js      # Tiếp nhận & quản lý yêu cầu tư vấn / đặt tour
│   │   ├── settingController.js      # Cấu hình website, Hotline, Banner Sliders
│   │   ├── destinationController.js  # Điểm đến & gom nhóm theo Châu lục (Mega Menu)
│   │   ├── categoryController.js     # Danh mục Tour & Dịch vụ
│   │   ├── eventProjectController.js # Sự kiện tiêu biểu / Portfolio giống YanTB
│   │   ├── serviceController.js      # Dịch vụ Teambuilding, Gala Dinner, MICE
│   │   └── galleryController.js      # Thư viện ảnh / Album phóng to Lightbox
│   ├── models/
│   │   ├── User.js                   # Quản trị viên, nhân viên sales, biên tập viên
│   │   ├── Category.js               # Danh mục
│   │   ├── Destination.js            # Điểm đến
│   │   ├── Tour.js                   # Tour du lịch trọn gói
│   │   ├── Service.js                # Dịch vụ Teambuilding & Sự kiện
│   │   ├── EventProject.js           # Dự án & Sự kiện tiêu biểu (Case studies)
│   │   ├── Booking.js                # Đặt tour & Nhận tư vấn Lead
│   │   ├── Article.js                # Tin tức & Kiến thức Teambuilding
│   │   ├── Gallery.js                # Thư viện album ảnh / video
│   │   ├── Testimonial.js            # Đánh giá của khách hàng / doanh nghiệp
│   │   ├── Contact.js                # Thông tin liên hệ
│   │   ├── Setting.js                # Cấu hình website, Hotline, Slider
│   │   └── index.js                  # Export tất cả models
│   ├── middlewares/
│   │   ├── auth.js                   # Xác thực JWT (protect) & Phân quyền (authorize)
│   │   └── errorHandler.js           # Middleware bắt lỗi tập trung
│   ├── routes/
│   │   ├── authRoutes.js             # /api/auth
│   │   ├── tourRoutes.js             # /api/tours
│   │   ├── bookingRoutes.js          # /api/bookings
│   │   ├── settingRoutes.js          # /api/settings
│   │   ├── destinationRoutes.js      # /api/destinations
│   │   ├── categoryRoutes.js         # /api/categories
│   │   ├── eventProjectRoutes.js     # /api/event-projects
│   │   ├── serviceRoutes.js          # /api/services
│   │   └── galleryRoutes.js          # /api/galleries
│   ├── seeds/
│   │   ├── tourSeeder.js             # Seed 6 tour thực tế và điểm đến
│   │   └── contentSeeder.js          # Seed Dịch vụ, Dự án tiêu biểu, Album ảnh
│   ├── app.js                        # Cấu hình Express app & routes
│   └── server.js                     # File khởi động server
├── .env.example
├── .env
├── package.json
├── test_api.js                       # Script kiểm thử tự động toàn bộ 14 API
└── README.md
```

---

## 2. Danh Sách Endpoints API Cho Frontend

> 📘 **Swagger UI:** chạy server rồi mở `http://localhost:5000/api/docs` (hoặc `/api-docs`; spec JSON: `/api/docs.json`). Spec nằm ở `src/docs/swagger.js` — nhớ cập nhật khi thêm/sửa API.

### 2.1. Authentication (`/api/auth`)
| Method | Endpoint | Quyền | Mô tả |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Đăng ký (`email`, `username`, `password`, `name`, `phone`) |
| `POST` | `/api/auth/login` | Public | Đăng nhập bằng `username` HOẶC `email`, và `password` |
| `GET` | `/api/auth/me` | Private | Thông tin tài khoản hiện tại |

### 2.2. Điểm Đến & Menu Châu Lục (`/api/destinations`)
| Method | Endpoint | Quyền | Mô tả |
|---|---|---|---|
| `GET` | `/api/destinations/grouped` | Public | **Gom nhóm điểm đến theo Châu lục** (Châu Á, Châu Âu, Việt Nam...) để vẽ Mega Menu |
| `GET` | `/api/destinations` | Public | Danh sách điểm đến (lọc theo `region`, `isPopular`, `keyword`) |
| `GET` | `/api/destinations/:identifier` | Public | Chi tiết điểm đến + Danh sách tour thuộc điểm đến đó |

### 2.3. Danh Mục (`/api/categories`)
| Method | Endpoint | Quyền | Mô tả |
|---|---|---|---|
| `GET` | `/api/categories` | Public | Lấy danh mục (lọc theo `type`: `tour`, `service`, `teambuilding`, `article`) |
| `GET` | `/api/categories/:identifier` | Public | Chi tiết danh mục |

### 2.4. Quản Lý & Chi Tiết Tour (`/api/tours`)
| Method | Endpoint | Quyền | Mô tả |
|---|---|---|---|
| `GET` | `/api/tours` | Public | Danh sách tours (lọc theo `destination`, `category`, `keyword`, `minPrice`, `maxPrice`, phân trang) |
| `GET` | `/api/tours/:identifier` | Public | Chi tiết tour (lịch trình từng ngày, đa mức giá, chính sách hoàn hủy, faqs) |
| `POST` | `/api/tours` | Private (Admin, Manager) | Tạo tour mới (tự sinh mã SGT-XXXX và slug) |
| `PUT` | `/api/tours/:id` | Private (Admin, Manager) | Cập nhật đầy đủ thông tin tour |
| `PATCH` | `/api/tours/:id/status` | Private (Admin, Manager) | Cập nhật nhanh trạng thái (`published`/`draft`/`archived`), gắn cờ `isFeatured`, `isHot` |
| `POST` | `/api/tours/:id/duplicate` | Private (Admin, Manager) | Nhân bản một tour có sẵn thành bản sao nháp (Draft) với mã tour mới |
| `DELETE` | `/api/tours/:id` | Private (Admin only) | Xóa tour |

### 2.5. Sự Kiện Tiêu Biểu / Portfolio Khách Hàng (`/api/event-projects`)
| Method | Endpoint | Quyền | Mô tả |
|---|---|---|---|
| `GET` | `/api/event-projects` | Public | Danh sách dự án đã làm cho tập đoàn lớn (*NEC, Bosch, Hoàn Mỹ, Shiseido...*) |
| `GET` | `/api/event-projects/:identifier` | Public | Chi tiết sự kiện kèm thư viện ảnh và video |

### 2.6. Dịch Vụ Teambuilding & Sự Kiện (`/api/services`)
| Method | Endpoint | Quyền | Mô tả |
|---|---|---|---|
| `GET` | `/api/services` | Public | Danh sách dịch vụ (*Teambuilding biển, Amazing Race, Gala Dinner, Hội nghị MICE*) |
| `GET` | `/api/services/:identifier` | Public | Chi tiết dịch vụ kèm địa điểm gợi ý & đối tượng tham gia |

### 2.7. Thư Viện Album Ảnh Lightbox (`/api/galleries`)
| Method | Endpoint | Quyền | Mô tả |
|---|---|---|---|
| `GET` | `/api/galleries` | Public | Danh sách album ảnh thực tế |
| `GET` | `/api/galleries/:identifier` | Public | Chi tiết album kèm danh sách các ảnh phóng to Lightbox (`items`) |

### 2.8. Tiếp Nhận Booking & Yêu Cầu Tư Vấn (`/api/bookings`)
| Method | Endpoint | Quyền | Mô tả |
|---|---|---|---|
| `POST` | `/api/bookings` | Public | **Khách gửi form nhận tư vấn / đặt tour** -> Tự sinh mã `SGT-YYYYMMDD-XXXX` |
| `GET` | `/api/bookings` | Private (Staff) | Danh sách yêu cầu (lọc theo `status`, `type`, `keyword`, phân trang) |
| `GET` | `/api/bookings/:id` | Private (Staff) | Chi tiết yêu cầu và lịch sử chăm sóc |
| `PATCH` | `/api/bookings/:id` | Private (Staff) | Cập nhật trạng thái và thêm ghi chú tư vấn (`note`) |

### 2.9. Cấu Hình Website & Banner Sliders (`/api/settings`)
| Method | Endpoint | Quyền | Mô tả |
|---|---|---|---|
| `GET` | `/api/settings` | Public | Lấy Hotline, Email, Banner Sliders, Thông số 17+ năm kinh nghiệm |
| `PUT` | `/api/settings` | Private (Admin) | Cập nhật cấu hình website |

---

## 3. Lệnh Thao Tác Hệ Thống

```bash
# 1. Chạy server phát triển
npm run dev

# 2. Seed toàn bộ dữ liệu (Tours, Điểm đến, Dịch vụ, Sự kiện tiêu biểu, Album ảnh)
npm run seed:all

# 3. Chạy kiểm thử tự động toàn bộ 14 API
node test_api.js

# 4. Tạo / nâng quyền tài khoản admin (khai báo ADMIN_* trong .env trước)
npm run seed:admin

# 5. Đồng bộ index MongoDB theo schema (chạy sau khi sửa index trong models)
npm run db:sync-indexes
```
