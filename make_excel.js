const ExcelJS = require('exceljs');
const path = require('path');

async function main() {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'Saigon Travel Dev Team';

  // Sheet 1: Huong Dan
  const ws1 = wb.addWorksheet('1. Hướng Dẫn');
  ws1.columns = [
    { header: 'Hạng Mục', key: 'col1', width: 25 },
    { header: 'Nội Dung Hướng Dẫn', key: 'col2', width: 85 }
  ];
  ws1.addRow(['Mục đích file', 'Phiếu thu thập dữ liệu Tour du lịch và dịch vụ từ ban quản lý/staff Saigon Travel để chuẩn bị dữ liệu hiển thị trên Website mới.']);
  ws1.addRow(['Cấu trúc các Sheet', 'Sheet 2: Thông tin tổng quan & bảng giá các tour.\nSheet 3: Lịch trình chi tiết từng ngày của từng tour.\nSheet 4: Dịch vụ bao gồm, không bao gồm, chính sách visa và hoàn hủy.\nSheet 5: Thiết lập các trường thông tin Form "Nhận tư vấn / Giữ chỗ" trên web.']);
  ws1.addRow(['Cách điền dữ liệu', 'Staff có thể điền tiếp vào các hàng dưới các dòng ví dụ mẫu.']);
  ws1.addRow(['Mã Tour (Tour Code)', 'Dùng để liên kết giữa Sheet "Thông Tin Chung" và các Sheet "Lịch Trình", "Điều Khoản". Ví dụ: SGT-EU01, SGT-KR02...']);
  ws1.addRow(['Hình ảnh & Media', 'Staff có thể dán link Google Drive hoặc OneDrive chứa ảnh/video chất lượng cao tương ứng của từng tour.']);
  ws1.addRow(['Đơn vị tiền tệ', 'Mặc định là Việt Nam Đồng (VNĐ). Vui lòng điền số nguyên không cần ký tự đ.']);

  // Sheet 2: Thong Tin Chung & Gia
  const ws2 = wb.addWorksheet('2. Danh Sách & Bảng Giá Tour');
  ws2.columns = [
    { header: 'Mã Tour (*)', key: 'code', width: 16 },
    { header: 'Tên Tour Hiển Thị (*)', key: 'title', width: 45 },
    { header: 'Thời Lượng (*)', key: 'duration', width: 16 },
    { header: 'Thị Trường / Phân Loại (*)', key: 'category', width: 22 },
    { header: 'Điểm Đến (Quốc gia, Thành phố)', key: 'destinations', width: 35 },
    { header: 'Điểm Khởi Hành', key: 'departure', width: 20 },
    { header: 'Lịch Khởi Hành (Định kỳ / Ngày cụ thể)', key: 'schedule', width: 30 },
    { header: 'Giá Người Lớn (VNĐ) (*)', key: 'priceAdult', width: 24 },
    { header: 'Giá Trẻ Em (VNĐ)', key: 'priceChild', width: 18 },
    { header: 'Giá Em Bé (VNĐ)', key: 'priceInfant', width: 18 },
    { header: 'Phụ Thu Phòng Đơn (VNĐ)', key: 'singleSupp', width: 24 },
    { header: 'Giá Gốc / Khuyến Mãi (VNĐ)', key: 'origPrice', width: 25 },
    { header: 'Số Khách (Min - Max)', key: 'groupSize', width: 20 },
    { header: 'Đặc Điểm Nổi Bật (Highlights)', key: 'highlights', width: 50 },
    { header: 'Link Folder Ảnh / Drive', key: 'images', width: 35 }
  ];

  ws2.addRow({
    code: 'SGT-EU01 (MẪU)',
    title: 'CHÂU ÂU: PHÁP – THỤY SĨ – Ý – VATICAN – MONACO',
    duration: '10 Ngày 9 Đêm',
    category: 'Tour Châu Âu',
    destinations: 'Pháp (Paris), Thụy Sĩ (Lucerne), Ý (Rome, Venice)',
    departure: 'TP. Hồ Chí Minh',
    schedule: 'Thứ 5 hàng tuần',
    priceAdult: 89900000,
    priceChild: 76900000,
    priceInfant: 29900000,
    singleSupp: 18000000,
    origPrice: 95000000,
    groupSize: '15 - 25 khách',
    highlights: '- Bay hãng 5 sao quốc tế\n- Du thuyền sông Seine ngắm Paris\n- Cáp treo đỉnh Titlis tuyết trắng',
    images: 'https://drive.google.com/...'
  });

  ws2.addRow({
    code: 'SGT-KR02 (MẪU)',
    title: 'HÀN QUỐC: SEOUL – ĐẢO JEJU – EVERLAND – NAMI',
    duration: '5 Ngày 4 Đêm',
    category: 'Tour Châu Á',
    destinations: 'Hàn Quốc (Seoul, Nami, Everland, Jeju)',
    departure: 'TP. Hồ Chí Minh',
    schedule: 'Thứ 4 & Thứ 7 hàng tuần',
    priceAdult: 18990000,
    priceChild: 16200000,
    priceInfant: 6000000,
    singleSupp: 4500000,
    origPrice: 21900000,
    groupSize: '15 - 30 khách',
    highlights: '- Đảo Nami mùa lá vàng/đỏ\n- Mặc Hanbok tại Cung điện Gyeongbokgung\n- BBQ nướng Hàn Quốc',
    images: 'https://drive.google.com/...'
  });

  for (let i = 1; i <= 5; i++) {
    ws2.addRow({ code: `SGT-0${i}`, title: '', duration: '', category: '', destinations: '', departure: '', schedule: '', priceAdult: '', priceChild: '', priceInfant: '', singleSupp: '', origPrice: '', groupSize: '', highlights: '', images: '' });
  }

  // Sheet 3: Lich Trinh Chi Tiet
  const ws3 = wb.addWorksheet('3. Lịch Trình Chi Tiết');
  ws3.columns = [
    { header: 'Mã Tour (*)', key: 'code', width: 16 },
    { header: 'Ngày Thứ (*)', key: 'day', width: 14 },
    { header: 'Tiêu Đề Ngày (*)', key: 'title', width: 40 },
    { header: 'Nội Dung Chi Tiết Hoạt Động Tham Quan (*)', key: 'content', width: 75 },
    { header: 'Bữa Ăn (Sáng / Trưa / Tối)', key: 'meals', width: 28 },
    { header: 'Khách Sạn / Nơi Lưu Trú', key: 'hotel', width: 35 }
  ];
  ws3.addRow({
    code: 'SGT-EU01 (MẪU)',
    day: 'Ngày 1',
    title: 'TP. HỒ CHÍ MINH – PARIS (PHÁP)',
    content: 'Tập trung tại sân bay Tân Sơn Nhất, làm thủ tục bay đi Paris. Nghỉ đêm trên máy bay.',
    meals: 'Ăn tối trên máy bay',
    hotel: 'Khách sạn 4 sao Paris'
  });
  ws3.addRow({
    code: 'SGT-EU01 (MẪU)',
    day: 'Ngày 2',
    title: 'PARIS – KHẢI HOÀN MÔN – DU THUYỀN SEINE',
    content: 'Tham quan tháp Eiffel, chụp hình tại Khải Hoàn Môn, đại lộ Champs-Élysées. Chiều trải nghiệm du thuyền sông Seine thơ mộng.',
    meals: 'Sáng, Trưa, Tối (Bò beefsteak Pháp)',
    hotel: 'Khách sạn 4 sao Novotel Paris hoặc tương đương'
  });

  for (let i = 1; i <= 5; i++) {
    ws3.addRow({ code: '', day: `Ngày ${i}`, title: '', content: '', meals: '', hotel: '' });
  }

  // Sheet 4: Bao Gom & Dieu Khoan
  const ws4 = wb.addWorksheet('4. Dịch Vụ & Điều Khoản');
  ws4.columns = [
    { header: 'Mã Tour (*)', key: 'code', width: 16 },
    { header: 'Dịch Vụ Đã Bao Gồm (*)', key: 'inclusions', width: 50 },
    { header: 'Dịch Vụ Chưa Bao Gồm (*)', key: 'exclusions', width: 45 },
    { header: 'Quy Định Đặt Cọc & Thanh Toán', key: 'deposit', width: 35 },
    { header: 'Quy Định Hủy Tour & Mức Phạt', key: 'cancellation', width: 45 },
    { header: 'Thủ Tục Hồ Sơ Visa', key: 'visa', width: 45 },
    { header: 'Lưu Ý Sức Khỏe & Giấy Tờ', key: 'notes', width: 40 }
  ];
  ws4.addRow({
    code: 'SGT-EU01 (MẪU)',
    inclusions: '- Vé máy bay khứ hồi (30kg ký gửi)\n- Khách sạn 4 sao\n- Xe đưa đón máy lạnh suốt tuyến\n- Bảo hiểm 1 tỷ đồng',
    exclusions: '- Phí visa Schengen\n- Tip HDV (8 EUR/ngày/khách)\n- Chi phí cá nhân',
    deposit: 'Đặt cọc 50% khi đăng ký. Thanh toán 50% còn lại trước ngày đi 15 ngày.',
    cancellation: 'Hủy sau khi cọc: mất cọc. Hủy trước 20 ngày phạt 70%. Hủy trong vòng 14 ngày phạt 100%.',
    visa: 'Hộ chiếu còn hạn trên 6 tháng. Cung cấp hồ sơ trước 30 ngày.',
    notes: 'Người trên 70 tuổi cần người nhà đi cùng.'
  });

  // Sheet 5: Form Lead
  const ws5 = wb.addWorksheet('5. Form Nhận Tư Vấn Lead');
  ws5.columns = [
    { header: 'STT', key: 'stt', width: 8 },
    { header: 'Trường Thông Tin Cần Khách Điền Trên Web', key: 'field', width: 45 },
    { header: 'Loại Trường (Bắt buộc / Tùy chọn)', key: 'type', width: 30 },
    { header: 'Ghi Chú Cho Staff Saigon Travel', key: 'note', width: 45 }
  ];
  ws5.addRow({ stt: 1, field: 'Họ và tên khách hàng (*)', type: 'Bắt buộc', note: 'Xưng hô và liên hệ' });
  ws5.addRow({ stt: 2, field: 'Số điện thoại / Zalo (*)', type: 'Bắt buộc', note: 'Kênh gọi điện & tư vấn chính' });
  ws5.addRow({ stt: 3, field: 'Địa chỉ Email (*)', type: 'Bắt buộc', note: 'Gửi lịch trình PDF và bảng giá' });
  ws5.addRow({ stt: 4, field: 'Tên công ty / Doanh nghiệp', type: 'Tùy chọn (Bắt buộc với MICE/Đoàn)', note: 'Phân loại khách đoàn/doanh nghiệp' });
  ws5.addRow({ stt: 5, field: 'Số lượng khách (Người lớn / Trẻ em / Em bé)', type: 'Tùy chọn', note: 'Ước lượng cơ cấu đoàn' });
  ws5.addRow({ stt: 6, field: 'Ngày dự kiến khởi hành', type: 'Tùy chọn', note: 'Kiểm tra tình trạng chỗ trống' });
  ws5.addRow({ stt: 7, field: 'Yêu cầu đặc biệt (Ăn chay, phòng đơn, Teambuilding riêng...)', type: 'Tùy chọn', note: 'Ghi chú nhu cầu riêng của khách' });
  ws5.addRow({ stt: 8, field: 'Email nhận thông báo khi có khách gửi form', type: 'Cấu hình hệ thống', note: 'Mặc định: mice@saigon-travel.com' });

  // Sheet 6: Thong Tin Cong Ty (Company Profile)
  const ws6 = wb.addWorksheet('6. Thông Tin Công Ty');
  ws6.columns = [
    { header: 'STT', key: 'stt', width: 8 },
    { header: 'HẠNG MỤC THÔNG TIN (*)', key: 'field', width: 35 },
    { header: 'VÍ DỤ MẪU GỢI Ý', key: 'sample', width: 45 },
    { header: 'THÔNG TIN THỰC TẾ TỪ SAIGON TRAVEL (*)', key: 'actual', width: 60 },
    { header: 'VỊ TRÍ HIỂN THỊ TRÊN WEBSITE', key: 'placement', width: 32 }
  ];

  const companyFields = [
    [1, 'Tên công ty đầy đủ (theo ĐKKD)', 'Công ty TNHH Dịch vụ Du lịch Sài Gòn (Saigon Travel)', 'Công ty TNHH Du Lịch Dịch Vụ Sài Gòn Travel', 'Chân trang (Footer), Hợp đồng'],
    [2, 'Tên thương hiệu viết tắt', 'Saigon Travel', 'Saigon Travel', 'Header, Logo, Menu'],
    [3, 'Khẩu hiệu / Slogan', 'Sounds Great!', 'Sounds Great!', 'Header, Banner trang chủ'],
    [4, 'Hotline tư vấn 24/7 (*)', '(+84)8 9898 8687 / 0989 888 687', '', 'Thanh Topbar, Nút gọi nhanh'],
    [5, 'Số điện thoại bàn / Tổng đài', '(028) 3838 xxxx', '', 'Chân trang, Trang liên hệ'],
    [6, 'Số điện thoại phòng MICE / Khách đoàn', '0938 590 567', '', 'Trang Teambuilding & MICE'],
    [7, 'Email chính tiếp nhận thông tin (*)', 'mice@saigon-travel.com', '', 'Chân trang, Form liên hệ'],
    [8, 'Email chăm sóc khách hàng / CSKH', 'info@saigon-travel.com', '', 'Trang liên hệ, Chân trang'],
    [9, 'Địa chỉ trụ sở chính (*)', '123 Nguyễn Đình Chiểu, P. 6, Q. 3, TP. Hồ Chí Minh', '', 'Chân trang, Trang liên hệ, Bản đồ'],
    [10, 'Địa chỉ chi nhánh / VPĐD (nếu có)', 'Hà Nội / Đà Nẵng / Cần Thơ...', '', 'Trang liên hệ'],
    [11, 'Giờ làm việc văn phòng (*)', 'Thứ 2 - Thứ 6: 08:30 - 17:30 | Thứ 7: 08:30 - 12:00', '', 'Topbar, Trang liên hệ'],
    [12, 'Mã số thuế doanh nghiệp (MST)', '0312xxxxxx', '', 'Chân trang (Footer)'],
    [13, 'Số Giấy phép Lữ hành Quốc tế', 'GP-LHQT số: 79-xxxx/20xx/TCDL-GP LHQT', '', 'Chân trang (Tạo uy tín cho web)'],
    [14, 'Link Fanpage Facebook', 'https://www.facebook.com/SaigonTravel/', '', 'Icon mạng xã hội Header & Footer'],
    [15, 'Số Zalo OA / Zalo tư vấn nhanh', '0989898687', '', 'Nút chat Zalo nổi góc màn hình'],
    [16, 'Link Kênh Youtube (nếu có)', 'https://youtube.com/@saigontravel', '', 'Icon mạng xã hội'],
    [17, 'Link Kênh TikTok (nếu có)', 'https://tiktok.com/@saigontravel', '', 'Icon mạng xã hội'],
    [18, 'Link Kênh Instagram (nếu có)', 'https://instagram.com/saigontravel', '', 'Icon mạng xã hội'],
    [19, 'Số năm kinh nghiệm nổi bật', 'Hơn 17 năm kinh nghiệm (từ năm 2007)', '', 'Khối thống kê Trang chủ (Số to)'],
    [20, 'Số chương trình / tour đã tổ chức', '1.000+ Chuyến đi thành công', '', 'Khối thống kê Trang chủ (Số to)'],
    [21, 'Số lượt khách hàng đã phục vụ', '50.000+ Khách hàng hài lòng', '', 'Khối thống kê Trang chủ (Số to)'],
    [22, 'Tài khoản ngân hàng công ty', 'Ngân hàng VCB - STK: 007100xxxx - CTY TNHH SAIGON TRAVEL', '', 'Trang Hướng dẫn thanh toán'],
    [23, 'Link Drive chứa Logo gốc & Ảnh công ty', 'Google Drive link (File PNG nền trong suốt, file vector AI)', '', 'Header logo, Favicon, Banner']
  ];

  companyFields.forEach(cf => {
    const r = ws6.addRow(cf);
    r.height = 26;
    r.eachCell((cell, colNum) => {
      cell.font = { name: 'Arial', size: 10, italic: colNum === 3 };
      cell.alignment = { vertical: 'middle', wrapText: true };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFCBD5E1' } },
        left: { style: 'thin', color: { argb: 'FFCBD5E1' } },
        bottom: { style: 'thin', color: { argb: 'FFCBD5E1' } },
        right: { style: 'thin', color: { argb: 'FFCBD5E1' } },
      };
      if (colNum === 4) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFBEB' } }; // Light yellow highlight for actual input
      }
    });
  });

  // Format headers
  [ws1, ws2, ws3, ws4, ws5, ws6].forEach(ws => {
    ws.getRow(1).height = 28;
    ws.getRow(1).eachCell(cell => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF1E3A8A' }
      };
      cell.font = { name: 'Arial', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });
  });

  const destPath = path.resolve('D:/personal_prj/SaiGonTravel/Mau_Khao_Sat_Data_Tour_SaigonTravel.xlsx');
  const fullPath = path.resolve('D:/personal_prj/SaiGonTravel/Mau_Khao_Sat_Data_SaigonTravel_Full.xlsx');
  try {
    await wb.xlsx.writeFile(destPath);
    console.log('SUCCESS_CREATED_AT:', destPath);
  } catch (err) {
    if (err.code === 'EBUSY') {
      console.log(`Notice: File ${destPath} is currently opened in Excel. Writing to ${fullPath}...`);
      await wb.xlsx.writeFile(fullPath);
      console.log('SUCCESS_CREATED_AT:', fullPath);
    } else {
      throw err;
    }
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
