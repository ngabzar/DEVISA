// ─────────────────────────────────────────────────────────────────────────────
// Content Translation Map
// Translates Indonesian content (kanji meanings, vocab meanings, grammar)
// to other supported languages.
// ID is always the master/fallback. Keys must match exactly what's in data files.
// ─────────────────────────────────────────────────────────────────────────────

export type ContentLang = 'ID' | 'EN' | 'VI' | 'MY' | 'TH' | 'PH';

// ── Kanji & Vocab SHORT MEANINGS ──────────────────────────────────────────────
export const MEANING_MAP: Record<string, Partial<Record<ContentLang, string>>> = {
  // Numbers
  'Satu': { EN: 'One', VI: 'Một', MY: 'Satu', TH: 'หนึ่ง', PH: 'Isa' },
  'Dua': { EN: 'Two', VI: 'Hai', MY: 'Dua', TH: 'สอง', PH: 'Dalawa' },
  'Tiga': { EN: 'Three', VI: 'Ba', MY: 'Tiga', TH: 'สาม', PH: 'Tatlo' },
  'Empat': { EN: 'Four', VI: 'Bốn', MY: 'Empat', TH: 'สี่', PH: 'Apat' },
  'Lima': { EN: 'Five', VI: 'Năm', MY: 'Lima', TH: 'ห้า', PH: 'Lima' },
  'Enam': { EN: 'Six', VI: 'Sáu', MY: 'Enam', TH: 'หก', PH: 'Anim' },
  'Tujuh': { EN: 'Seven', VI: 'Bảy', MY: 'Tujuh', TH: 'เจ็ด', PH: 'Pito' },
  'Delapan': { EN: 'Eight', VI: 'Tám', MY: 'Lapan', TH: 'แปด', PH: 'Walo' },
  'Sembilan': { EN: 'Nine', VI: 'Chín', MY: 'Sembilan', TH: 'เก้า', PH: 'Siyam' },
  'Sepuluh': { EN: 'Ten', VI: 'Mười', MY: 'Sepuluh', TH: 'สิบ', PH: 'Sampu' },
  'Ratus': { EN: 'Hundred', VI: 'Trăm', MY: 'Ratus', TH: 'ร้อย', PH: 'Daan' },
  'Ribu': { EN: 'Thousand', VI: 'Nghìn', MY: 'Ribu', TH: 'พัน', PH: 'Libo' },
  'Puluh Ribu': { EN: 'Ten Thousand', VI: 'Vạn', MY: 'Puluh Ribu', TH: 'หมื่น', PH: 'Sampung Libo' },
  'Setengah': { EN: 'Half', VI: 'Một nửa', MY: 'Separuh', TH: 'ครึ่ง', PH: 'Kalahati' },

  // Nature & Environment
  'Air': { EN: 'Water', VI: 'Nước', MY: 'Air', TH: 'น้ำ', PH: 'Tubig' },
  'Api': { EN: 'Fire', VI: 'Lửa', MY: 'Api', TH: 'ไฟ', PH: 'Apoy' },
  'Tanah': { EN: 'Earth / Soil', VI: 'Đất', MY: 'Tanah', TH: 'ดิน', PH: 'Lupa' },
  'Pohon': { EN: 'Tree', VI: 'Cây', MY: 'Pokok', TH: 'ต้นไม้', PH: 'Puno' },
  'Gunung': { EN: 'Mountain', VI: 'Núi', MY: 'Gunung', TH: 'ภูเขา', PH: 'Bundok' },
  'Sungai': { EN: 'River', VI: 'Sông', MY: 'Sungai', TH: 'แม่น้ำ', PH: 'Ilog' },
  'Sawah': { EN: 'Rice Field', VI: 'Ruộng lúa', MY: 'Sawah', TH: 'นาข้าว', PH: 'Palayan' },
  'Emas / Uang': { EN: 'Gold / Money', VI: 'Vàng / Tiền', MY: 'Emas / Wang', TH: 'ทอง / เงิน', PH: 'Ginto / Pera' },
  'Hujan': { EN: 'Rain', VI: 'Mưa', MY: 'Hujan', TH: 'ฝน', PH: 'Ulan' },
  'Langit / Kosong': { EN: 'Sky / Empty', VI: 'Bầu trời / Trống', MY: 'Langit / Kosong', TH: 'ท้องฟ้า / ว่าง', PH: 'Langit / Walang Laman' },
  'Surga / Langit': { EN: 'Heaven / Sky', VI: 'Thiên đường / Bầu trời', MY: 'Syurga / Langit', TH: 'สวรรค์ / ท้องฟ้า', PH: 'Langit' },
  'Laut': { EN: 'Sea / Ocean', VI: 'Biển', MY: 'Laut', TH: 'ทะเล', PH: 'Dagat' },
  'Angin': { EN: 'Wind', VI: 'Gió', MY: 'Angin', TH: 'ลม', PH: 'Hangin' },
  'Salju': { EN: 'Snow', VI: 'Tuyết', MY: 'Salji', TH: 'หิมะ', PH: 'Nyebe' },
  'Kolam': { EN: 'Pond', VI: 'Ao', MY: 'Kolam', TH: 'สระน้ำ', PH: 'Lawa' },
  'Cerah': { EN: 'Sunny / Clear', VI: 'Trời nắng', MY: 'Cerah', TH: 'ท้องฟ้าใส', PH: 'Maliwanag' },
  'Hutan Kecil': { EN: 'Grove / Small Forest', VI: 'Rừng nhỏ', MY: 'Hutan Kecil', TH: 'ดงไม้', PH: 'Likas na Kagubatan' },
  'Hutan Lebat': { EN: 'Forest', VI: 'Rừng rậm', MY: 'Hutan Tebal', TH: 'ป่า', PH: 'Kagubatan' },

  // Directions
  'Timur': { EN: 'East', VI: 'Đông', MY: 'Timur', TH: 'ตะวันออก', PH: 'Silangan' },
  'Barat': { EN: 'West', VI: 'Tây', MY: 'Barat', TH: 'ตะวันตก', PH: 'Kanluran' },
  'Selatan': { EN: 'South', VI: 'Nam', MY: 'Selatan', TH: 'ใต้', PH: 'Timog' },
  'Utara': { EN: 'North', VI: 'Bắc', MY: 'Utara', TH: 'เหนือ', PH: 'Hilaga' },
  'Atas': { EN: 'Up / Above', VI: 'Trên', MY: 'Atas', TH: 'บน / ข้างบน', PH: 'Taas' },
  'Bawah': { EN: 'Down / Below', VI: 'Dưới', MY: 'Bawah', TH: 'ล่าง / ข้างล่าง', PH: 'Baba' },
  'Kiri': { EN: 'Left', VI: 'Trái', MY: 'Kiri', TH: 'ซ้าย', PH: 'Kaliwa' },
  'Kanan': { EN: 'Right', VI: 'Phải', MY: 'Kanan', TH: 'ขวา', PH: 'Kanan' },
  'Dalam / Tengah': { EN: 'Inside / Middle', VI: 'Trong / Giữa', MY: 'Dalam / Tengah', TH: 'ใน / กลาง', PH: 'Loob / Gitna' },
  'Luar': { EN: 'Outside', VI: 'Ngoài', MY: 'Luar', TH: 'ข้างนอก', PH: 'Labas' },
  'Depan / Sebelum': { EN: 'Front / Before', VI: 'Trước', MY: 'Depan / Sebelum', TH: 'หน้า / ก่อน', PH: 'Harapan / Bago' },
  'Belakang / Setelah': { EN: 'Back / After', VI: 'Sau', MY: 'Belakang / Selepas', TH: 'ด้านหลัง / หลังจาก', PH: 'Likod / Pagkatapos' },
  'Antara / Interval': { EN: 'Between / Interval', VI: 'Giữa / Khoảng cách', MY: 'Antara / Selang', TH: 'ระหว่าง', PH: 'Sa Pagitan' },

  // Time
  'Matahari / Hari': { EN: 'Sun / Day', VI: 'Mặt trời / Ngày', MY: 'Matahari / Hari', TH: 'ดวงอาทิตย์ / วัน', PH: 'Araw' },
  'Bulan': { EN: 'Moon / Month', VI: 'Mặt trăng / Tháng', MY: 'Bulan', TH: 'ดวงจันทร์ / เดือน', PH: 'Buwan' },
  'Tahun': { EN: 'Year', VI: 'Năm', MY: 'Tahun', TH: 'ปี', PH: 'Taon' },
  'Sekarang': { EN: 'Now', VI: 'Bây giờ', MY: 'Sekarang', TH: 'ตอนนี้', PH: 'Ngayon' },
  'Pagi': { EN: 'Morning', VI: 'Buổi sáng', MY: 'Pagi', TH: 'เช้า', PH: 'Umaga' },
  'Siang': { EN: 'Noon / Daytime', VI: 'Buổi trưa', MY: 'Tengahari', TH: 'เที่ยง', PH: 'Tanghali' },
  'Sore': { EN: 'Evening / Dusk', VI: 'Buổi chiều', MY: 'Petang', TH: 'เย็น', PH: 'Hapon' },
  'Malam': { EN: 'Night', VI: 'Buổi tối', MY: 'Malam', TH: 'คืน', PH: 'Gabi' },
  'Hari (Mingguan)': { EN: 'Day of Week', VI: 'Ngày trong tuần', MY: 'Hari (Mingguan)', TH: 'วัน (รายสัปดาห์)', PH: 'Araw ng Linggo' },
  'Minggu': { EN: 'Week', VI: 'Tuần', MY: 'Minggu', TH: 'สัปดาห์', PH: 'Linggo' },

  // Family
  'Ayah': { EN: 'Father', VI: 'Cha / Bố', MY: 'Ayah', TH: 'พ่อ', PH: 'Ama' },
  'Ibu': { EN: 'Mother', VI: 'Mẹ', MY: 'Ibu', TH: 'แม่', PH: 'Ina' },
  'Teman': { EN: 'Friend', VI: 'Bạn', MY: 'Kawan', TH: 'เพื่อน', PH: 'Kaibigan' },
  'Orang': { EN: 'Person', VI: 'Người', MY: 'Orang', TH: 'คน', PH: 'Tao' },
  'Anak': { EN: 'Child', VI: 'Trẻ em / Con', MY: 'Anak', TH: 'เด็ก', PH: 'Bata' },
  'Wanita': { EN: 'Woman', VI: 'Phụ nữ', MY: 'Wanita', TH: 'ผู้หญิง', PH: 'Babae' },
  'Pria': { EN: 'Man', VI: 'Đàn ông', MY: 'Lelaki', TH: 'ผู้ชาย', PH: 'Lalaki' },
  'Kakak Laki-laki': { EN: 'Older Brother', VI: 'Anh trai', MY: 'Abang', TH: 'พี่ชาย', PH: 'Kuya' },
  'Adik Laki-laki': { EN: 'Younger Brother', VI: 'Em trai', MY: 'Adik Lelaki', TH: 'น้องชาย', PH: 'Kapatid na Lalaki' },
  'Kakak Perempuan': { EN: 'Older Sister', VI: 'Chị gái', MY: 'Kakak Perempuan', TH: 'พี่สาว', PH: 'Ate' },
  'Adik Perempuan': { EN: 'Younger Sister', VI: 'Em gái', MY: 'Adik Perempuan', TH: 'น้องสาว', PH: 'Kapatid na Babae' },
  'Saya': { EN: 'I / Me', VI: 'Tôi', MY: 'Saya', TH: 'ฉัน', PH: 'Ako' },
  'Orang Tua / Akrab': { EN: 'Parent / Familiar', VI: 'Cha mẹ / Thân thiết', MY: 'Orang Tua / Akrab', TH: 'พ่อแม่ / สนิท', PH: 'Magulang / Malapit' },
  'Keluarga / Suku': { EN: 'Family / Clan', VI: 'Gia đình / Tộc', MY: 'Keluarga / Kaum', TH: 'ครอบครัว / เผ่า', PH: 'Pamilya / Tribo' },
  'Kedua': { EN: 'Both', VI: 'Cả hai', MY: 'Kedua-dua', TH: 'ทั้งสอง', PH: 'Parehong' },
  'Orang (Profesional)': { EN: 'Professional / Person', VI: 'Người chuyên nghiệp', MY: 'Orang Profesional', TH: 'ผู้เชี่ยวชาญ', PH: 'Propesyonal' },

  // Body
  'Mata': { EN: 'Eye', VI: 'Mắt', MY: 'Mata', TH: 'ตา', PH: 'Mata' },
  'Telinga': { EN: 'Ear', VI: 'Tai', MY: 'Telinga', TH: 'หู', PH: 'Tainga' },
  'Mulut': { EN: 'Mouth', VI: 'Miệng', MY: 'Mulut', TH: 'ปาก', PH: 'Bibig' },
  'Tangan': { EN: 'Hand', VI: 'Tay', MY: 'Tangan', TH: 'มือ', PH: 'Kamay' },
  'Kaki': { EN: 'Foot / Leg', VI: 'Chân', MY: 'Kaki', TH: 'เท้า', PH: 'Paa' },
  'Kekuatan': { EN: 'Strength / Power', VI: 'Sức mạnh', MY: 'Kekuatan', TH: 'ความแข็งแรง', PH: 'Lakas' },

  // Verbs
  'Pergi': { EN: 'Go', VI: 'Đi', MY: 'Pergi', TH: 'ไป', PH: 'Pumunta' },
  'Pergi / Melakukan': { EN: 'Go / Do', VI: 'Đi / Làm', MY: 'Pergi / Lakukan', TH: 'ไป / ทำ', PH: 'Pumunta / Gawin' },
  'Datang': { EN: 'Come', VI: 'Đến', MY: 'Datang', TH: 'มา', PH: 'Pumunta' },
  'Pulang': { EN: 'Return Home', VI: 'Về nhà', MY: 'Balik', TH: 'กลับบ้าน', PH: 'Umuwi' },
  'Pulang / Kembali': { EN: 'Return / Go Back', VI: 'Về / Quay lại', MY: 'Pulang / Kembali', TH: 'กลับ', PH: 'Bumalik' },
  'Makan': { EN: 'Eat', VI: 'Ăn', MY: 'Makan', TH: 'กิน', PH: 'Kumain' },
  'Makan / Makanan': { EN: 'Eat / Food', VI: 'Ăn / Thức ăn', MY: 'Makan / Makanan', TH: 'กิน / อาหาร', PH: 'Kumain / Pagkain' },
  'Minum': { EN: 'Drink', VI: 'Uống', MY: 'Minum', TH: 'ดื่ม', PH: 'Uminom' },
  'Melihat': { EN: 'See / Look', VI: 'Nhìn / Xem', MY: 'Melihat', TH: 'มอง / ดู', PH: 'Tumingin' },
  'Mendengar': { EN: 'Hear / Listen', VI: 'Nghe', MY: 'Mendengar', TH: 'ฟัง', PH: 'Makinig' },
  'Mendengar / Bertanya': { EN: 'Hear / Ask', VI: 'Nghe / Hỏi', MY: 'Dengar / Bertanya', TH: 'ฟัง / ถาม', PH: 'Makinig / Magtanong' },
  'Membaca': { EN: 'Read', VI: 'Đọc', MY: 'Membaca', TH: 'อ่าน', PH: 'Magbasa' },
  'Menulis': { EN: 'Write', VI: 'Viết', MY: 'Menulis', TH: 'เขียน', PH: 'Sumulat' },
  'Berbicara': { EN: 'Speak / Talk', VI: 'Nói chuyện', MY: 'Bercakap', TH: 'พูด', PH: 'Magsalita' },
  'Berbicara / Cerita': { EN: 'Speak / Story', VI: 'Nói / Chuyện kể', MY: 'Bercakap / Cerita', TH: 'พูด / เรื่อง', PH: 'Magsalita / Kwento' },
  'Belajar': { EN: 'Learn / Study', VI: 'Học', MY: 'Belajar', TH: 'เรียน', PH: 'Matuto' },
  'Belajar / Berlatih': { EN: 'Learn / Practice', VI: 'Học / Luyện tập', MY: 'Belajar / Berlatih', TH: 'เรียน / ฝึก', PH: 'Matuto / Magsanay' },
  'Membeli': { EN: 'Buy', VI: 'Mua', MY: 'Membeli', TH: 'ซื้อ', PH: 'Bumili' },
  'Menjual': { EN: 'Sell', VI: 'Bán', MY: 'Menjual', TH: 'ขาย', PH: 'Magbenta' },
  'Masuk': { EN: 'Enter', VI: 'Vào', MY: 'Masuk', TH: 'เข้า', PH: 'Pumasok' },
  'Keluar': { EN: 'Exit / Leave', VI: 'Ra / Xuất', MY: 'Keluar', TH: 'ออก', PH: 'Lumabas' },
  'Bertemu': { EN: 'Meet', VI: 'Gặp', MY: 'Bertemu', TH: 'พบ', PH: 'Magtagpo' },
  'Berkata': { EN: 'Say / Speak', VI: 'Nói', MY: 'Berkata', TH: 'พูด / บอก', PH: 'Magsabi' },
  'Berdiri': { EN: 'Stand Up', VI: 'Đứng dậy', MY: 'Berdiri', TH: 'ยืน', PH: 'Tumayo' },
  'Istirahat': { EN: 'Rest / Holiday', VI: 'Nghỉ ngơi', MY: 'Berehat', TH: 'พัก', PH: 'Magpahinga' },
  'Naik (Kendaraan)': { EN: 'Ride / Board', VI: 'Lên (xe)', MY: 'Naik (Kenderaan)', TH: 'ขึ้น (ยานพาหนะ)', PH: 'Sumakay' },
  'Mulai': { EN: 'Begin / Start', VI: 'Bắt đầu', MY: 'Mulai', TH: 'เริ่ม', PH: 'Magsimula' },
  'Selesai': { EN: 'Finish / End', VI: 'Kết thúc', MY: 'Selesai', TH: 'เสร็จ', PH: 'Tapusin' },
  'Tidur': { EN: 'Sleep', VI: 'Ngủ', MY: 'Tidur', TH: 'นอนหลับ', PH: 'Matulog' },
  'Bangun': { EN: 'Wake Up', VI: 'Thức dậy', MY: 'Bangun', TH: 'ตื่นนอน', PH: 'Gumising' },
  'Bekerja': { EN: 'Work', VI: 'Làm việc', MY: 'Bekerja', TH: 'ทำงาน', PH: 'Magtrabaho' },
  'Tinggal': { EN: 'Live / Reside', VI: 'Sống / Cư trú', MY: 'Tinggal', TH: 'อยู่', PH: 'Tumira' },
  'Menunggu': { EN: 'Wait', VI: 'Chờ đợi', MY: 'Menunggu', TH: 'รอ', PH: 'Maghintay' },
  'Mengajar': { EN: 'Teach', VI: 'Dạy', MY: 'Mengajar', TH: 'สอน', PH: 'Magturo' },
  'Mengajar / Agama': { EN: 'Teach / Religion', VI: 'Dạy / Tôn giáo', MY: 'Ajar / Agama', TH: 'สอน / ศาสนา', PH: 'Magturo / Relihiyon' },
  'Tahu': { EN: 'Know', VI: 'Biết', MY: 'Tahu', TH: 'รู้', PH: 'Malaman' },
  'Berpikir': { EN: 'Think', VI: 'Nghĩ', MY: 'Berfikir', TH: 'คิด', PH: 'Mag-isip' },
  'Memikirkan': { EN: 'Consider / Think About', VI: 'Suy nghĩ', MY: 'Memikirkan', TH: 'พิจารณา', PH: 'Pag-isipan' },
  'Menggunakan': { EN: 'Use', VI: 'Sử dụng', MY: 'Menggunakan', TH: 'ใช้', PH: 'Gumamit' },
  'Membuat': { EN: 'Make / Create', VI: 'Làm / Tạo ra', MY: 'Membuat', TH: 'ทำ / สร้าง', PH: 'Gumawa' },
  'Memotong': { EN: 'Cut', VI: 'Cắt', MY: 'Memotong', TH: 'ตัด', PH: 'Pumutol' },
  'Mencuci': { EN: 'Wash', VI: 'Rửa', MY: 'Mencuci', TH: 'ล้าง', PH: 'Maghugas' },
  'Membuka': { EN: 'Open', VI: 'Mở', MY: 'Membuka', TH: 'เปิด', PH: 'Magbukas' },
  'Menutup': { EN: 'Close / Shut', VI: 'Đóng', MY: 'Menutup', TH: 'ปิด', PH: 'Magsara' },
  'Memakai / Tiba': { EN: 'Wear / Arrive', VI: 'Mặc / Đến nơi', MY: 'Memakai / Tiba', TH: 'สวมใส่ / มาถึง', PH: 'Mag-suot / Dumating' },
  'Melepas': { EN: 'Take Off / Remove', VI: 'Cởi ra', MY: 'Melepas', TH: 'ถอด', PH: 'Maghubad' },
  'Mengirim': { EN: 'Send', VI: 'Gửi', MY: 'Menghantar', TH: 'ส่ง', PH: 'Magpadala' },
  'Meminjam': { EN: 'Borrow', VI: 'Mượn', MY: 'Meminjam', TH: 'ยืม', PH: 'Manghiram' },
  'Meminjamkan': { EN: 'Lend', VI: 'Cho mượn', MY: 'Meminjamkan', TH: 'ให้ยืม', PH: 'Magpahiram' },
  'Mengembalikan': { EN: 'Return / Give Back', VI: 'Trả lại', MY: 'Mengembalikan', TH: 'คืน', PH: 'Ibalik' },
  'Menyanyi': { EN: 'Sing', VI: 'Hát', MY: 'Menyanyi', TH: 'ร้องเพลง', PH: 'Kumanta' },
  'Menyalin / Foto': { EN: 'Copy / Photo', VI: 'Sao chép / Ảnh', MY: 'Salin / Foto', TH: 'คัดลอก / ภาพถ่าย', PH: 'Kopyahin / Litrato' },
  'Berjalan': { EN: 'Walk', VI: 'Đi bộ', MY: 'Berjalan', TH: 'เดิน', PH: 'Maglakad' },
  'Berlari': { EN: 'Run', VI: 'Chạy', MY: 'Berlari', TH: 'วิ่ง', PH: 'Tumakbo' },
  'Bergerak': { EN: 'Move', VI: 'Di chuyển', MY: 'Bergerak', TH: 'เคลื่อนไหว', PH: 'Gumalaw' },
  'Berhenti': { EN: 'Stop', VI: 'Dừng lại', MY: 'Berhenti', TH: 'หยุด', PH: 'Huminto' },
  'Maju': { EN: 'Advance / Progress', VI: 'Tiến lên', MY: 'Maju', TH: 'ก้าวหน้า', PH: 'Sumulong' },
  'Melewati / Komute': { EN: 'Pass / Commute', VI: 'Qua / Đi lại', MY: 'Lalu / Komuter', TH: 'ผ่าน / เดินทาง', PH: 'Dumaan / Commute' },
  'Membawa / Hubungan': { EN: 'Bring / Relation', VI: 'Mang / Quan hệ', MY: 'Bawa / Hubungan', TH: 'พา / ความสัมพันธ์', PH: 'Magdala / Ugnayan' },
  'Memegang / Memiliki': { EN: 'Hold / Have', VI: 'Cầm / Có', MY: 'Pegang / Miliki', TH: 'ถือ / มี', PH: 'Hawakan / Mayroon' },
  'Memegang': { EN: 'Hold', VI: 'Cầm', MY: 'Pegang', TH: 'ถือ', PH: 'Hawakan' },
  'Menarik': { EN: 'Pull', VI: 'Kéo', MY: 'Tarik', TH: 'ดึง', PH: 'Humila' },
  'Mengambil': { EN: 'Take', VI: 'Lấy', MY: 'Ambil', TH: 'เอา', PH: 'Kumuha' },
  'Mencoba': { EN: 'Try / Test', VI: 'Thử', MY: 'Cuba', TH: 'ลอง', PH: 'Subukan' },
  'Berkumpul': { EN: 'Gather / Collect', VI: 'Tập hợp', MY: 'Berkumpul', TH: 'รวบรวม', PH: 'Magtipon' },
  'Berputar / Jatuh': { EN: 'Turn / Fall', VI: 'Xoay / Ngã', MY: 'Pusing / Jatuh', TH: 'หมุน / หกล้ม', PH: 'Umikot / Mahulog' },
  'Menggantikan / Era': { EN: 'Replace / Era', VI: 'Thay thế / Thời đại', MY: 'Ganti / Era', TH: 'แทนที่ / ยุค', PH: 'Palitan / Panahon' },
  'Mengangkut / Nasib': { EN: 'Transport / Fate', VI: 'Vận chuyển / Số phận', MY: 'Angkut / Nasib', TH: 'ขนส่ง / โชคชะตา', PH: 'Mag-angkat / Kapalaran' },

  // Adjectives / State
  'Besar': { EN: 'Big / Large', VI: 'Lớn', MY: 'Besar', TH: 'ใหญ่', PH: 'Malaki' },
  'Kecil': { EN: 'Small / Little', VI: 'Nhỏ', MY: 'Kecil', TH: 'เล็ก', PH: 'Maliit' },
  'Tinggi / Mahal': { EN: 'Tall / Expensive', VI: 'Cao / Đắt', MY: 'Tinggi / Mahal', TH: 'สูง / แพง', PH: 'Mataas / Mahal' },
  'Murah / Tenang': { EN: 'Cheap / Peaceful', VI: 'Rẻ / Bình yên', MY: 'Murah / Tenang', TH: 'ถูก / สงบ', PH: 'Mura / Tahimik' },
  'Baru': { EN: 'New', VI: 'Mới', MY: 'Baru', TH: 'ใหม่', PH: 'Bago' },
  'Lama / Tua': { EN: 'Old / Used', VI: 'Cũ / Già', MY: 'Lama / Tua', TH: 'เก่า', PH: 'Luma / Matanda' },
  'Panjang / Ketua': { EN: 'Long / Chief', VI: 'Dài / Trưởng', MY: 'Panjang / Ketua', TH: 'ยาว / หัวหน้า', PH: 'Mahabang / Pinuno' },
  'Pendek': { EN: 'Short', VI: 'Ngắn', MY: 'Pendek', TH: 'สั้น', PH: 'Maikli' },
  'Banyak': { EN: 'Many / Much', VI: 'Nhiều', MY: 'Banyak', TH: 'มาก', PH: 'Marami' },
  'Sedikit': { EN: 'Few / Little', VI: 'Ít', MY: 'Sedikit', TH: 'น้อย', PH: 'Kaunti' },
  'Baik': { EN: 'Good', VI: 'Tốt', MY: 'Baik', TH: 'ดี', PH: 'Mabuti' },
  'Buruk': { EN: 'Bad', VI: 'Xấu / Tệ', MY: 'Buruk', TH: 'แย่', PH: 'Masama' },
  'Cepat / Dini': { EN: 'Fast / Early', VI: 'Nhanh / Sớm', MY: 'Cepat / Awal', TH: 'เร็ว / เช้า', PH: 'Mabilis / Maaga' },
  'Lambat / Telat': { EN: 'Slow / Late', VI: 'Chậm / Muộn', MY: 'Lambat / Lewat', TH: 'ช้า / สาย', PH: 'Mabagal / Huli' },
  'Dekat': { EN: 'Near / Close', VI: 'Gần', MY: 'Dekat', TH: 'ใกล้', PH: 'Malapit' },
  'Jauh': { EN: 'Far', VI: 'Xa', MY: 'Jauh', TH: 'ไกล', PH: 'Malayo' },
  'Ringan': { EN: 'Light (Weight)', VI: 'Nhẹ', MY: 'Ringan', TH: 'เบา', PH: 'Magaan' },
  'Berat': { EN: 'Heavy', VI: 'Nặng', MY: 'Berat', TH: 'หนัก', PH: 'Mabigat' },
  'Panas (Cuaca)': { EN: 'Hot (Weather)', VI: 'Nóng (Thời tiết)', MY: 'Panas (Cuaca)', TH: 'ร้อน (อากาศ)', PH: 'Mainit (Panahon)' },
  'Dingin (Cuaca)': { EN: 'Cold (Weather)', VI: 'Lạnh (Thời tiết)', MY: 'Sejuk (Cuaca)', TH: 'หนาว (อากาศ)', PH: 'Malamig (Panahon)' },
  'Luas': { EN: 'Wide / Spacious', VI: 'Rộng', MY: 'Luas', TH: 'กว้าง', PH: 'Maluwag' },
  'Rendah': { EN: 'Low / Short', VI: 'Thấp', MY: 'Rendah', TH: 'ต่ำ', PH: 'Mababa' },
  'Gelap': { EN: 'Dark', VI: 'Tối', MY: 'Gelap', TH: 'มืด', PH: 'Madilim' },
  'Terang': { EN: 'Bright / Clear', VI: 'Sáng', MY: 'Terang', TH: 'สว่าง', PH: 'Maliwanag' },
  'Gemuk / Tebal': { EN: 'Fat / Thick', VI: 'Béo / Dày', MY: 'Gemuk / Tebal', TH: 'อ้วน / หนา', PH: 'Mataba / Makapal' },
  'Tipis / Halus': { EN: 'Thin / Fine', VI: 'Mỏng / Mịn', MY: 'Nipis / Halus', TH: 'บาง / ละเอียด', PH: 'Manipis / Pino' },
  'Kuat': { EN: 'Strong', VI: 'Mạnh', MY: 'Kuat', TH: 'แข็งแรง', PH: 'Malakas' },
  'Buru-buru': { EN: 'Rush / Hurry', VI: 'Vội vàng', MY: 'Tergesa-gesa', TH: 'รีบ', PH: 'Magmadali' },

  // Colors
  'Putih': { EN: 'White', VI: 'Trắng', MY: 'Putih', TH: 'ขาว', PH: 'Puti' },
  'Hitam': { EN: 'Black', VI: 'Đen', MY: 'Hitam', TH: 'ดำ', PH: 'Itim' },
  'Merah': { EN: 'Red', VI: 'Đỏ', MY: 'Merah', TH: 'แดง', PH: 'Pula' },
  'Biru': { EN: 'Blue', VI: 'Xanh dương', MY: 'Biru', TH: 'น้ำเงิน', PH: 'Asul' },
  'Warna': { EN: 'Color', VI: 'Màu sắc', MY: 'Warna', TH: 'สี', PH: 'Kulay' },

  // Places & Buildings
  'Rumah': { EN: 'House / Home', VI: 'Nhà', MY: 'Rumah', TH: 'บ้าน', PH: 'Bahay' },
  'Sekolah': { EN: 'School', VI: 'Trường học', MY: 'Sekolah', TH: 'โรงเรียน', PH: 'Paaralan' },
  'Stasiun': { EN: 'Station', VI: 'Ga tàu', MY: 'Stesen', TH: 'สถานี', PH: 'Istasyon' },
  'Jalan': { EN: 'Road / Way', VI: 'Đường', MY: 'Jalan', TH: 'ถนน', PH: 'Daan' },
  'Negara': { EN: 'Country', VI: 'Quốc gia', MY: 'Negara', TH: 'ประเทศ', PH: 'Bansa' },
  'Taman': { EN: 'Garden / Park', VI: 'Công viên', MY: 'Taman', TH: 'สวน', PH: 'Hardin' },
  'Toko': { EN: 'Shop / Store', VI: 'Cửa hàng', MY: 'Kedai', TH: 'ร้านค้า', PH: 'Tindahan' },
  'Atap / Toko': { EN: 'Roof / Store', VI: 'Mái / Cửa hàng', MY: 'Bumbung / Kedai', TH: 'หลังคา / ร้าน', PH: 'Bubong / Tindahan' },
  'Aula': { EN: 'Hall / Dining Hall', VI: 'Hội trường', MY: 'Dewan', TH: 'หอประชุม', PH: 'Bulwagan' },
  'Ruangan': { EN: 'Room', VI: 'Phòng', MY: 'Bilik', TH: 'ห้อง', PH: 'Silid' },
  'Gedung': { EN: 'Building / Hall', VI: 'Tòa nhà', MY: 'Bangunan', TH: 'ตึก', PH: 'Gusali' },
  'Gambar / Peta': { EN: 'Picture / Map', VI: 'Hình / Bản đồ', MY: 'Gambar / Peta', TH: 'รูปภาพ / แผนที่', PH: 'Larawan / Mapa' },
  'Bangunan': { EN: 'Building', VI: 'Công trình', MY: 'Bangunan', TH: 'อาคาร', PH: 'Gusali' },
  'Konstruksi': { EN: 'Construction', VI: 'Xây dựng', MY: 'Pembinaan', TH: 'การก่อสร้าง', PH: 'Konstruksyon' },
  'Tempat': { EN: 'Place / Location', VI: 'Nơi chốn', MY: 'Tempat', TH: 'สถานที่', PH: 'Lugar' },
  'Ibukota': { EN: 'Capital City', VI: 'Thủ đô', MY: 'Ibukota', TH: 'เมืองหลวง', PH: 'Kabisera' },
  'Metropolis': { EN: 'Metropolis / Big City', VI: 'Đô thị', MY: 'Bandar Besar', TH: 'มหานคร', PH: 'Lungsod' },
  'Prefektur': { EN: 'Prefecture', VI: 'Tỉnh', MY: 'Wilayah', TH: 'จังหวัด', PH: 'Lalawigan' },
  'Kota / Pasar': { EN: 'City / Market', VI: 'Thành phố / Chợ', MY: 'Bandar / Pasar', TH: 'เมือง / ตลาด', PH: 'Lungsod / Palengke' },
  'Kota Kecil': { EN: 'Town', VI: 'Thị trấn', MY: 'Pekan', TH: 'เมืองเล็ก', PH: 'Bayan' },
  'Desa': { EN: 'Village', VI: 'Làng', MY: 'Kampung', TH: 'หมู่บ้าน', PH: 'Nayon' },
  'Distrik': { EN: 'District', VI: 'Quận', MY: 'Daerah', TH: 'เขต', PH: 'Distrito' },
  'Institusi': { EN: 'Institution', VI: 'Cơ sở', MY: 'Institusi', TH: 'สถาบัน', PH: 'Institusyon' },
  'Panggung / Unit Mesin': { EN: 'Stage / Platform', VI: 'Sân khấu', MY: 'Pentas / Unit Mesin', TH: 'เวที', PH: 'Entablado' },

  // Education & Language
  'Nama': { EN: 'Name', VI: 'Tên', MY: 'Nama', TH: 'ชื่อ', PH: 'Pangalan' },
  'Bahasa': { EN: 'Language', VI: 'Ngôn ngữ', MY: 'Bahasa', TH: 'ภาษา', PH: 'Wika' },
  'Huruf': { EN: 'Letter / Character', VI: 'Chữ cái', MY: 'Huruf', TH: 'ตัวอักษร', PH: 'Titik / Letra' },
  'Kalimat / Sastra': { EN: 'Sentence / Literature', VI: 'Câu / Văn học', MY: 'Ayat / Sastera', TH: 'ประโยค / วรรณกรรม', PH: 'Pangungusap / Panitikan' },
  'Hidup / Lahir': { EN: 'Life / Born', VI: 'Sống / Sinh ra', MY: 'Hidup / Lahir', TH: 'ชีวิต / เกิด', PH: 'Buhay / Ipinanganak' },
  'Sebelumnya / Ujung': { EN: 'Before / Tip', VI: 'Trước / Đầu', MY: 'Sebelum / Hujung', TH: 'ก่อน / ปลาย', PH: 'Bago / Dulo' },
  'Semangat / Udara': { EN: 'Spirit / Air', VI: 'Tinh thần / Không khí', MY: 'Semangat / Udara', TH: 'จิตใจ / อากาศ', PH: 'Espiritu / Hangin' },
  'Usaha': { EN: 'Study / Effort', VI: 'Nỗ lực / Học', MY: 'Usaha / Belajar', TH: 'ความพยายาม', PH: 'Pagsisikap' },
  'China': { EN: 'China / Chinese', VI: 'Trung Quốc / Hán', MY: 'China / Cina', TH: 'จีน', PH: 'Tsina / Chinese' },
  'Inggris / Cemerlang': { EN: 'English / Brilliant', VI: 'Tiếng Anh / Xuất sắc', MY: 'Inggeris / Cemerlang', TH: 'อังกฤษ / ยอดเยี่ยม', PH: 'Ingles / Mahusay' },
  'Mengasah / Riset': { EN: 'Research / Polish', VI: 'Nghiên cứu', MY: 'Penyelidikan', TH: 'วิจัย', PH: 'Pananaliksik' },

  // Food & Drink
  'Buku / Asal': { EN: 'Book / Origin', VI: 'Sách / Nguồn gốc', MY: 'Buku / Asal', TH: 'หนังสือ / ต้นกำเนิด', PH: 'Libro / Pinagmulan' },
  'Nasi / Makanan': { EN: 'Rice / Food', VI: 'Cơm / Đồ ăn', MY: 'Nasi / Makanan', TH: 'ข้าว / อาหาร', PH: 'Kanin / Pagkain' },
  'Daging': { EN: 'Meat', VI: 'Thịt', MY: 'Daging', TH: 'เนื้อ', PH: 'Karne' },
  'Ikan': { EN: 'Fish', VI: 'Cá', MY: 'Ikan', TH: 'ปลา', PH: 'Isda' },
  'Ladang / Liar': { EN: 'Field / Wild', VI: 'Đồng / Hoang dã', MY: 'Ladang / Liar', TH: 'ทุ่ง / ป่า', PH: 'Bukid / Ligaw' },
  'Sayur': { EN: 'Vegetable', VI: 'Rau củ', MY: 'Sayur', TH: 'ผัก', PH: 'Gulay' },
  'Teh': { EN: 'Tea', VI: 'Trà', MY: 'Teh', TH: 'ชา', PH: 'Tsaa' },
  'Alkohol': { EN: 'Alcohol', VI: 'Rượu', MY: 'Alkohol', TH: 'แอลกอฮอล์', PH: 'Alkohol' },
  'Sapi': { EN: 'Cow / Beef', VI: 'Bò', MY: 'Lembu', TH: 'วัว', PH: 'Baka' },
  'Burung': { EN: 'Bird', VI: 'Chim', MY: 'Burung', TH: 'นก', PH: 'Ibon' },
  'Anjing': { EN: 'Dog', VI: 'Chó', MY: 'Anjing', TH: 'หมา', PH: 'Aso' },
  'Bahan / Biaya': { EN: 'Material / Cost', VI: 'Vật liệu / Chi phí', MY: 'Bahan / Kos', TH: 'วัสดุ / ค่าใช้จ่าย', PH: 'Materyales / Gastos' },
  'Rasa': { EN: 'Taste / Flavor', VI: 'Hương vị', MY: 'Rasa', TH: 'รสชาติ', PH: 'Lasa' },

  // Work & Society
  'Mobil': { EN: 'Car', VI: 'Xe hơi', MY: 'Kereta', TH: 'รถยนต์', PH: 'Kotse' },
  'Listrik': { EN: 'Electricity', VI: 'Điện', MY: 'Elektrik', TH: 'ไฟฟ้า', PH: 'Kuryente' },
  'Perusahaan / Kuil': { EN: 'Company / Shrine', VI: 'Công ty / Đền thờ', MY: 'Syarikat / Kuil', TH: 'บริษัท / ศาลเจ้า', PH: 'Kumpanya / Templo' },
  'Anggota': { EN: 'Member', VI: 'Thành viên', MY: 'Anggota', TH: 'สมาชิก', PH: 'Miyembro' },
  'Melayani': { EN: 'Serve / Work', VI: 'Phục vụ', MY: 'Melayani', TH: 'รับใช้', PH: 'Maglingkod' },
  'Hal / Masalah': { EN: 'Matter / Thing', VI: 'Vấn đề / Việc', MY: 'Hal / Masalah', TH: 'เรื่อง / ปัญหา', PH: 'Bagay / Problema' },
  'Bisnis / Karma': { EN: 'Business / Karma', VI: 'Kinh doanh / Nghiệp', MY: 'Perniagaan', TH: 'ธุรกิจ', PH: 'Negosyo' },
  'Produksi / Melahirkan': { EN: 'Production / Birth', VI: 'Sản xuất / Sinh', MY: 'Pengeluaran / Melahirkan', TH: 'การผลิต / คลอด', PH: 'Produksyon / Manganak' },
  'Medis': { EN: 'Medical', VI: 'Y tế', MY: 'Perubatan', TH: 'การแพทย์', PH: 'Medikal' },
  'Perak': { EN: 'Silver', VI: 'Bạc', MY: 'Perak', TH: 'เงิน', PH: 'Pilak' },
  'Publik': { EN: 'Public', VI: 'Công cộng', MY: 'Awam', TH: 'สาธารณะ', PH: 'Pampubliko' },
  'Rakyat': { EN: 'People / Citizen', VI: 'Nhân dân', MY: 'Rakyat', TH: 'ประชาชน', PH: 'Mamamayan' },
  'Pakaian': { EN: 'Clothes', VI: 'Quần áo', MY: 'Pakaian', TH: 'เสื้อผ้า', PH: 'Damit' },
  'Barat (Western)': { EN: 'Western Style', VI: 'Phong cách Tây', MY: 'Gaya Barat', TH: 'สไตล์ตะวันตก', PH: 'Kanluraning Estilo' },
  'Jepang / Damai': { EN: 'Japan / Harmony', VI: 'Nhật Bản / Hòa bình', MY: 'Jepun / Harmoni', TH: 'ญี่ปุ่น / สันติภาพ', PH: 'Hapon / Kapayapaan' },
  'Perjalanan': { EN: 'Journey / Travel', VI: 'Hành trình', MY: 'Perjalanan', TH: 'การเดินทาง', PH: 'Paglalakbay' },
  'Sakit': { EN: 'Sick / Disease', VI: 'Ốm / Bệnh', MY: 'Sakit', TH: 'ป่วย / โรค', PH: 'Maysakit' },

  // Abstract / Other
  'Apa': { EN: 'What', VI: 'Cái gì', MY: 'Apa', TH: 'อะไร', PH: 'Ano' },
  'Tidak': { EN: 'No / Not', VI: 'Không', MY: 'Tidak', TH: 'ไม่', PH: 'Hindi' },
  'Ada / Memiliki': { EN: 'Have / Exist', VI: 'Có', MY: 'Ada / Miliki', TH: 'มี', PH: 'Mayroon' },
  'Tidak Ada': { EN: 'Nothing / None', VI: 'Không có', MY: 'Tiada', TH: 'ไม่มี', PH: 'Wala' },
  'Alasan / Logika': { EN: 'Reason / Logic', VI: 'Lý do / Lô-gic', MY: 'Alasan / Logik', TH: 'เหตุผล / ตรรกะ', PH: 'Dahilan / Lohika' },
  'Pikiran / Makna': { EN: 'Thought / Meaning', VI: 'Suy nghĩ / Ý nghĩa', MY: 'Fikiran / Makna', TH: 'ความคิด / ความหมาย', PH: 'Kaisipan / Kahulugan' },
  'Tuan / Utama': { EN: 'Master / Main', VI: 'Chủ / Chính', MY: 'Tuan / Utama', TH: 'นาย / หลัก', PH: 'Panginoon / Pangunahin' },
  'Cara / Arah': { EN: 'Way / Direction', VI: 'Cách / Hướng', MY: 'Cara / Arah', TH: 'วิธี / ทิศทาง', PH: 'Paraan / Direksyon' },
  'Hukum / Metode': { EN: 'Law / Method', VI: 'Pháp luật / Phương pháp', MY: 'Undang-undang / Kaedah', TH: 'กฎหมาย / วิธีการ', PH: 'Batas / Pamamaraan' },
  'Kebenaran': { EN: 'Truth / Reality', VI: 'Sự thật', MY: 'Kebenaran', TH: 'ความจริง', PH: 'Katotohanan' },
  'Pertanyaan': { EN: 'Question / Problem', VI: 'Câu hỏi', MY: 'Soalan / Masalah', TH: 'คำถาม', PH: 'Katanungan' },
  'Topik / Judul': { EN: 'Topic / Title', VI: 'Chủ đề / Tiêu đề', MY: 'Topik / Tajuk', TH: 'หัวข้อ', PH: 'Paksa / Titulo' },
  'Kualitas': { EN: 'Quality', VI: 'Chất lượng', MY: 'Kualiti', TH: 'คุณภาพ', PH: 'Kalidad' },
  'Jawaban': { EN: 'Answer', VI: 'Câu trả lời', MY: 'Jawapan', TH: 'คำตอบ', PH: 'Sagot' },
  'Ujian / Efek': { EN: 'Experience / Effect', VI: 'Kinh nghiệm / Hiệu quả', MY: 'Pengalaman / Kesan', TH: 'ประสบการณ์ / ผล', PH: 'Karanasan / Epekto' },
  'Urusan / Pakai': { EN: 'Use / Business', VI: 'Dùng / Công việc', MY: 'Urusan / Guna', TH: 'ใช้ / กิจ', PH: 'Gamitin / Negosyo' },
  'Oleh / Daripada': { EN: 'By / Since / From', VI: 'Bởi / Từ', MY: 'Oleh / Sejak', TH: 'โดย / ตั้งแต่', PH: 'Sa / Mula sa' },
  'Derajat / Kali': { EN: 'Degree / Time(s)', VI: 'Độ / Lần', MY: 'Darjah / Kali', TH: 'องศา / ครั้ง', PH: 'Antas / Beses' },
  'Berpisah': { EN: 'Separate / Different', VI: 'Tách biệt / Khác', MY: 'Berasingan', TH: 'แยก', PH: 'Hiwalay' },
  'Spesial': { EN: 'Special', VI: 'Đặc biệt', MY: 'Istimewa', TH: 'พิเศษ', PH: 'Espesyal' },
  'Menuang / Catatan': { EN: 'Pour / Note', VI: 'Rót / Ghi chú', MY: 'Tuang / Catatan', TH: 'เท / บันทึก', PH: 'Ibuhos / Tala' },
  'Rencana / Ukur': { EN: 'Plan / Measure', VI: 'Kế hoạch / Đo lường', MY: 'Rancangan / Ukur', TH: 'แผน / วัด', PH: 'Plano / Sukat' },
  'Berangkat / Terbit': { EN: 'Depart / Publish', VI: 'Khởi hành / Xuất bản', MY: 'Bertolak / Terbit', TH: 'ออกเดินทาง / ตีพิมพ์', PH: 'Umalis / Mailathala' },
  'Praktis / Surat': { EN: 'Convenient / Letter', VI: 'Tiện lợi / Thư', MY: 'Praktikal / Surat', TH: 'สะดวก / จดหมาย', PH: 'Maginhawa / Liham' },
  'Keuntungan': { EN: 'Profit / Benefit', VI: 'Lợi nhuận', MY: 'Keuntungan', TH: 'กำไร / ประโยชน์', PH: 'Kita / Benepisyo' },
  'Kertas': { EN: 'Paper', VI: 'Giấy', MY: 'Kertas', TH: 'กระดาษ', PH: 'Papel' },
  'Cahaya': { EN: 'Light / Radiance', VI: 'Ánh sáng', MY: 'Cahaya', TH: 'แสง', PH: 'Liwanag' },
  'Suara': { EN: 'Sound / Voice', VI: 'Âm thanh / Giọng', MY: 'Bunyi / Suara', TH: 'เสียง', PH: 'Tunog / Boses' },
  'Musik / Menyenangkan': { EN: 'Music / Fun', VI: 'Âm nhạc / Vui', MY: 'Muzik / Seronok', TH: 'ดนตรี / สนุก', PH: 'Musika / Masaya' },
  'Gambar / Goresan': { EN: 'Picture / Drawing', VI: 'Tranh / Nét vẽ', MY: 'Gambar / Lukisan', TH: 'ภาพ / ลายเส้น', PH: 'Larawan / Guhit' },
  'Lagu': { EN: 'Song', VI: 'Bài hát', MY: 'Lagu', TH: 'เพลง', PH: 'Kanta' },
  'Yen / Lingkaran': { EN: 'Yen / Circle', VI: 'Yên / Vòng tròn', MY: 'Yen / Bulatan', TH: 'เยน / วงกลม', PH: 'Yen / Bilog' },
  'Dunia': { EN: 'World', VI: 'Thế giới', MY: 'Dunia', TH: 'โลก', PH: 'Mundo' },
  'Dunia / Generasi': { EN: 'World / Generation', VI: 'Thế giới / Thế hệ', MY: 'Dunia / Generasi', TH: 'โลก / ยุค', PH: 'Mundo / Henerasyon' },

  // Seasons
  'Musim Semi': { EN: 'Spring', VI: 'Mùa xuân', MY: 'Musim Bunga', TH: 'ฤดูใบไม้ผลิ', PH: 'Tagsibol' },
  'Musim Panas': { EN: 'Summer', VI: 'Mùa hè', MY: 'Musim Panas', TH: 'ฤดูร้อน', PH: 'Tag-init' },
  'Musim Gugur': { EN: 'Autumn / Fall', VI: 'Mùa thu', MY: 'Musim Luruh', TH: 'ฤดูใบไม้ร่วง', PH: 'Taglagas' },
  'Musim Dingin': { EN: 'Winter', VI: 'Mùa đông', MY: 'Musim Sejuk', TH: 'ฤดูหนาว', PH: 'Taglamig' },
};

// ── Grammar Explanations ───────────────────────────────────────────────────────
export const GRAMMAR_MAP: Record<string, Partial<Record<ContentLang, string>>> = {
  // N5 Grammar
  'Pola kalimat paling dasar dalam bahasa Jepang. Partikel "Wa" (ditulis Ha) menandakan topik kalimat,':
    { EN: 'The most basic sentence pattern in Japanese. The particle "Wa" (written Ha) marks the topic of the sentence.' },
  'Menjadi (Perubahan keadaan secara alami).':
    { EN: 'Become (Natural change of state).' },
  'Memutuskan/Memilih (biasanya saat memesan).':
    { EN: 'Decide/Choose (usually when ordering).' },
  'Diputuskan (oleh pihak lain/aturan) untuk...':
    { EN: 'It has been decided (by others/rules) to...' },
  'Memutuskan (oleh diri sendiri) untuk...':
    { EN: 'Decide (by oneself) to...' },
  'Berusaha untuk (Mencoba membiasakan).':
    { EN: 'Try to (Attempt to make it a habit).' },
};

// ── Particle Usage Labels ──────────────────────────────────────────────────────
export const PARTICLE_MAP: Record<string, Partial<Record<ContentLang, string>>> = {
  'Penanda Topik': { EN: 'Topic Marker', VI: 'Đánh dấu chủ đề', MY: 'Penanda Topik', TH: 'ตัวบ่งชี้หัวข้อ', PH: 'Pang-markang Paksa' },
  'Perbandingan / Kontras': { EN: 'Comparison / Contrast', VI: 'So sánh / Tương phản', MY: 'Perbandingan / Kontras', TH: 'เปรียบเทียบ / ตัดกัน', PH: 'Paghahambing / Pagbabago' },
  'Penanda Subjek': { EN: 'Subject Marker', VI: 'Đánh dấu chủ ngữ', MY: 'Penanda Subjek', TH: 'ตัวบ่งชี้ประธาน', PH: 'Pang-markang Paksa' },
  'Objek Keinginan / Kemampuan': { EN: 'Object of Desire / Ability', VI: 'Đối tượng mong muốn / Khả năng', MY: 'Objek Keinginan / Kemampuan', TH: 'กรรมแห่งความปรารถนา / ความสามารถ', PH: 'Layunin ng Pagnanasa / Kakayahan' },
  'Penanda Objek': { EN: 'Object Marker', VI: 'Đánh dấu tân ngữ', MY: 'Penanda Objek', TH: 'ตัวบ่งชี้กรรม', PH: 'Pang-markang Bagay' },
  'Tempat Aktivitas': { EN: 'Location of Activity', VI: 'Nơi hoạt động', MY: 'Tempat Aktiviti', TH: 'สถานที่กิจกรรม', PH: 'Lugar ng Gawain' },
  'Penanda Arah': { EN: 'Direction Marker', VI: 'Đánh dấu hướng', MY: 'Penanda Arah', TH: 'ตัวบ่งชี้ทิศทาง', PH: 'Pang-markang Direksyon' },
  'Penanda Waktu': { EN: 'Time Marker', VI: 'Đánh dấu thời gian', MY: 'Penanda Masa', TH: 'ตัวบ่งชี้เวลา', PH: 'Pang-markang Panahon' },
  'Kalimat Tanya': { EN: 'Question Marker', VI: 'Câu hỏi', MY: 'Ayat Tanya', TH: 'ประโยคคำถาม', PH: 'Pang-tanong' },
  'Posesif / Modifikasi': { EN: 'Possessive / Modifier', VI: 'Sở hữu / Bổ nghĩa', MY: 'Pemilikan / Pengubah', TH: 'แสดงความเป็นเจ้าของ', PH: 'Pagmamay-ari / Modifier' },
  'Penanda Sumber': { EN: 'Source Marker (from)', VI: 'Đánh dấu nguồn gốc', MY: 'Penanda Sumber', TH: 'ตัวบ่งชี้แหล่งที่มา', PH: 'Pang-markang Pinagmulan' },
  'Penanda Bersama': { EN: 'Together / With', VI: 'Cùng / Với', MY: 'Bersama / Dengan', TH: 'ด้วยกัน / กับ', PH: 'Kasama / Kasama' },
  'Juga / Pun': { EN: 'Also / Too', VI: 'Cũng', MY: 'Juga / Pun', TH: 'ด้วย / ก็', PH: 'Din / Rin' },
  'Batas Waktu / Jangkauan': { EN: 'Until / Up to', VI: 'Cho đến / Tới', MY: 'Sehingga / Jangkauan', TH: 'จนกว่า / ถึง', PH: 'Hanggang / Saklaw' },
  'Pilihan / Atau': { EN: 'Choice / Or', VI: 'Lựa chọn / Hoặc', MY: 'Pilihan / Atau', TH: 'ทางเลือก / หรือ', PH: 'Pagpipilian / O' },
};

// ── Vocab Example Sentence Meanings ──────────────────────────────────────────
// These are sentence-level meanings that need translation.
// We don't map sentences - instead we translate the structural meanings above
// and rely on the data having the correct meaning already stored per language.


// ── N5 & N4 Grammar Explanations (Full) ──────────────────────────────────────
export const GRAMMAR_FULL_MAP: Record<string, Partial<Record<ContentLang, string>>> = {
  // ─── N5 ───────────────────────────────────────────────────────────────────
  'Menjadi (Perubahan keadaan secara alami).':
    { EN: 'To become (Natural change of state).' },
  'Memutuskan/Memilih (biasanya saat memesan).':
    { EN: 'Decide / Choose (usually when ordering).' },
  'Diputuskan (oleh pihak lain/aturan) untuk...':
    { EN: 'It has been decided (by others/rules) to...' },
  'Memutuskan (oleh diri sendiri) untuk...':
    { EN: 'Decide (by oneself) to...' },
  'Berusaha untuk (Mencoba membiasakan).':
    { EN: 'Try to (Attempting to form a habit).' },
  'Pola kalimat paling dasar dalam bahasa Jepang. Partikel "Wa" (ditulis Ha) menandakan topik kalimat, dan "Desu" adalah kopula sopan.':
    { EN: 'The most basic sentence pattern in Japanese. "Wa" (written Ha) marks the topic, and "Desu" is the polite copula.' },
  'Bentuk sopan untuk kata kerja positif non-lampau. Digunakan untuk menyatakan kebiasaan atau hal yang akan dilakukan.':
    { EN: 'Polite form for positive non-past verbs. Used for habits or future actions.' },
  'Bentuk negatif sopan untuk kata kerja. Digunakan untuk menyatakan "tidak melakukan" sesuatu.':
    { EN: 'Polite negative form of verbs. Used to express "not doing" something.' },
  'Bentuk lampau sopan untuk kata kerja. Digunakan untuk menyatakan kegiatan yang "sudah" dilakukan.':
    { EN: 'Polite past form of verbs. Used for actions already completed.' },
  'Partikel yang berarti "juga" atau "pun". Menggantikan partikel "wa" atau "ga" jika predikatnya sama dengan kalimat sebelumnya.':
    { EN: 'Particle meaning "also" or "too". Replaces "wa" or "ga" when the predicate is the same as the previous sentence.' },
  'Partikel penanda objek penderita. Menunjukkan benda yang dikenai tindakan oleh kata kerja.':
    { EN: 'Object marker particle. Indicates the noun receiving the verb\'s action.' },
  'Menandai tempat terjadinya suatu aktivitas atau aksi.':
    { EN: 'Marks the location where an activity or action takes place.' },
  'Menandai tujuan pergerakan. "He" (dibaca e) lebih menekankan arah, "Ni" menekankan titik tujuan.':
    { EN: 'Marks direction of movement. "He" emphasizes direction; "Ni" emphasizes the destination point.' },
  'Partikel penanda kalimat tanya.':
    { EN: 'Question marker particle.' },
  'Kata tunjuk benda. Kore (ini), Sore (itu dekat lawan bicara), Are (itu jauh dari keduanya).':
    { EN: 'Demonstrative pronouns. Kore (this), Sore (that near listener), Are (that far from both).' },
  'Kata tunjuk spesifik yang harus diikuti kata benda.':
    { EN: 'Demonstrative adjectives that must be followed by a noun.' },
  'Kata tunjuk tempat. Sini, Situ, Sana.':
    { EN: 'Place demonstratives. Here, There (near listener), Over there.' },
  'Menandai waktu spesifik kejadian (jam, tanggal, hari).':
    { EN: 'Marks specific time of an event (clock time, dates, days of the week).' },
  'Kata tanya "Kapan". Tidak menggunakan partikel "ni".':
    { EN: 'Question word for "When". Does not use the particle "ni".' },
  'Kata tanya "Siapa". Donata lebih sopan.':
    { EN: 'Question word for "Who". Donata is more polite.' },
  'Menyatakan keberadaan benda mati atau tumbuhan (Ada).':
    { EN: 'Expresses existence of inanimate objects or plants.' },
  'Menyatakan keberadaan makhluk hidup (manusia/hewan).':
    { EN: 'Expresses existence of living things (people/animals).' },
  'Menjelaskan apa yang ada di suatu tempat.':
    { EN: 'Describes what exists at a certain place.' },
  'Menjelaskan dimana letak suatu benda/orang.':
    { EN: 'Describes where an object/person is located.' },
  'Menyebutkan beberapa benda sebagai contoh (dan lain-lain).':
    { EN: 'Lists several things as examples (and so on, etc.).' },
  'Kalimat positif dengan kata sifat akhiran -i.':
    { EN: 'Positive sentence with i-adjectives.' },
  'Bentuk negatif kata sifat-i.':
    { EN: 'Negative form of i-adjectives.' },
  'Bentuk lampau kata sifat-i.':
    { EN: 'Past form of i-adjectives.' },
  'Kalimat positif dengan kata sifat-na.':
    { EN: 'Positive sentence with na-adjectives.' },
  'Bentuk negatif kata sifat-na.':
    { EN: 'Negative form of na-adjectives.' },
  'Menerangkan kata benda. Na-adj harus pakai "na".':
    { EN: 'Modifying nouns. Na-adjectives must use "na" before the noun.' },
  'Meminta tolong atau mempersilakan dengan sopan.':
    { EN: 'Politely asking someone to do something or giving permission.' },
  'Menyatakan aksi yang sedang berlangsung (Continuous).':
    { EN: 'Expresses an ongoing action (Continuous/Progressive).' },
  'Menyatakan keadaan/status yang berlanjut (misal: menikah, tinggal, punya).':
    { EN: 'Expresses a continuing state or status (e.g. married, living somewhere, owning).' },
  'Meminta izin melakukan sesuatu.':
    { EN: 'Asking permission to do something.' },
  'Larangan melakukan sesuatu (Tidak boleh).':
    { EN: 'Prohibition — not allowed to do something.' },
  'Menggunakan bentuk Te untuk menyambung kalimat (dan/lalu).':
    { EN: 'Uses the Te-form to connect sentences sequentially (and/then).' },
  'Menyatakan keinginan diri sendiri (Ingin...).':
    { EN: 'Expresses one\'s own desire (Want to...).' },
  'Menyatakan ketidakinginan (Tidak ingin...).':
    { EN: 'Expresses one\'s desire NOT to do something (Don\'t want to...).' },
  'Pergi/Datang untuk tujuan melakukan sesuatu.':
    { EN: 'Going/Coming somewhere with the purpose of doing something.' },
  'Ajakan melakukan sesuatu bersama (Ayo...).':
    { EN: 'Inviting someone to do something together (Let\'s...).' },
  'Menawarkan bantuan atau mengajak dengan sopan.':
    { EN: 'Politely offering help or an invitation.' },
  'Menyatakan kesukaan atau kebencian. Gunakan partikel GA.':
    { EN: 'Expresses likes or dislikes. Use particle GA.' },
  'Menyatakan kemahiran. Gunakan partikel GA.':
    { EN: 'Expresses proficiency at something. Use particle GA.' },
  'Perbandingan. Daripada A, B lebih ...':
    { EN: 'Comparison. B is more ... than A.' },
  'Superlatif (Paling ... di antara ...).':
    { EN: 'Superlative (The most ... among ...).' },

  // ─── N4 ───────────────────────────────────────────────────────────────────
  'Menyatakan kemampuan melakukan sesuatu (Bisa/Dapat). Mengubah kata kerja menjadi bentuk potensial.':
    { EN: 'Expresses ability to do something (Can/Be able to). Turns a verb into its potential form.' },
  'Perubahan kata kerja menjadi bentuk "Bisa". Partikel "o" pada kalimat asli biasanya berubah menjadi "ga".':
    { EN: 'Conjugating verbs into the "Can" form. The particle "o" usually changes to "ga".' },
  'Menyatakan sesuatu terlihat atau terdengar secara alami (spontan), bukan karena usaha.':
    { EN: 'Expresses that something can be seen or heard naturally (spontaneously), not by effort.' },
  'Bentuk keinginan/ajakan kasual (Ayo/Mari).':
    { EN: 'Casual volitional form for invitations (Let\'s / Shall we).' },
  'Menyatakan pendapat atau perkiraan (Saya pikir...).':
    { EN: 'Expresses opinion or estimation (I think...).' },
  'Menyatakan niat yang sudah dipikirkan sejak lama (Berniat untuk...).':
    { EN: 'Expresses an intention thought out over time (I\'m planning/intending to...).' },
  'Menyatakan rencana/niat yang kuat.':
    { EN: 'Expresses a firm plan or intention.' },
  'Menyatakan jadwal atau rencana pasti.':
    { EN: 'Expresses a fixed schedule or confirmed plan.' },
  'Memberikan sesuatu kepada orang lain.':
    { EN: 'Giving something to someone else.' },
  'Menerima sesuatu dari orang lain.':
    { EN: 'Receiving something from someone else.' },
  'Orang lain memberi kepada SAYA (atau keluarga saya).':
    { EN: 'Someone else gives to ME (or my family/in-group).' },
  'Melakukan sesuatu untuk orang lain (kebaikan).':
    { EN: 'Doing something for someone else (as a favor).' },
  'Menerima kebaikan/aksi dari orang lain (Minta tolong dilakukan).':
    { EN: 'Receiving a favor/action from someone else (having someone do something).' },
  'Orang lain melakukan sesuatu untuk SAYA.':
    { EN: 'Someone else does something for ME.' },
  'Pengandaian umum "Kalau/Jika". Juga berarti "setelah".':
    { EN: 'General conditional "If/When". Can also mean "after".' },
  'Walaupun / Meskipun.':
    { EN: 'Even if / Even though / Although.' },
  'Jika A terjadi, maka B PASTI terjadi (konsekuensi alamiah/mesin).':
    { EN: 'If A happens, B will ALWAYS happen (natural consequence or automatic result).' },
  'Pengandaian bersyarat "Asalkan/Jika".':
    { EN: 'Conditional form "As long as / If (condition is met)".' },
  'Pengandaian kontekstual (Kalau topik itu...).':
    { EN: 'Contextual conditional (If we\'re talking about that topic...).' },
  'Harus melakukan sesuatu (Wajib).':
    { EN: 'Must do something (Obligation/Necessity).' },
  'Bentuk kasual dari "Harus".':
    { EN: 'Casual form of "Must/Have to".' },
  'Tidak harus / Tidak perlu melakukan.':
    { EN: 'Don\'t have to / No need to do something.' },
  'Saran positif (Sebaiknya...).':
    { EN: 'Positive advice (You should... / It\'s better to...).' },
  'Saran negatif (Sebaiknya jangan...).':
    { EN: 'Negative advice (You shouldn\'t... / It\'s better not to...).' },
  'Kelihatannya... (Berdasarkan penglihatan).':
    { EN: 'Looks like... / Seems like... (Based on visual observation).' },
  'Katanya/Kabarnya... (Mendengar dari orang lain).':
    { EN: 'I heard that... / Reportedly... (Information from someone else).' },
  'Sepertinya... (Berdasarkan penilaian subjektif/indera).':
    { EN: 'It seems like... (Based on subjective judgment or senses).' },
  'Sepertinya/Katanya (Berdasarkan info objektif) atau "Khas/Sesuai sifat".':
    { EN: 'Seems like / Apparently (based on objective evidence), or "-like / typical of".' },
  'Mungkin (Probabilitas rendah).':
    { EN: 'Maybe / Perhaps (low probability).' },
  'Kata kerja yang butuh objek (Seseorang melakukan sesuatu).':
    { EN: 'Transitive verb — requires an object (Someone does something to something).' },
  'Kata kerja yang fokus pada keadaan subjek (Sesuatu terjadi).':
    { EN: 'Intransitive verb — focuses on the subject\'s state (Something happens on its own).' },
  'Menyatakan hasil dari aksi yang dilakukan seseorang (sengaja).':
    { EN: 'Expresses the result of a deliberate action done by someone.' },
  'Menyatakan keadaan hasil perubahan (otomatis).':
    { EN: 'Expresses the resulting state after a change (automatic/natural).' },
  '1. Selesai tuntas. 2. Penyesalan (tidak sengaja).':
    { EN: '1. Completely finished. 2. Regret or accidental action.' },
};

// ── Particle Usage & Explanation Map ─────────────────────────────────────────
export const PARTICLE_EXPLANATION_MAP: Record<string, Partial<Record<ContentLang, string>>> = {
  'Partikel "Wa" (ditulis Ha) digunakan untuk menandai topik pembicaraan. Apa yang disebutkan sebelum "wa" adalah apa yang sedang kita bahas.':
    { EN: 'The "Wa" particle (written Ha) marks the topic of conversation. What comes before "wa" is what we\'re talking about.' },
  'Digunakan untuk menunjukkan kontras atau perbandingan antara dua hal. Biasanya digunakan dalam kalimat negatif.':
    { EN: 'Used to show contrast or comparison between two things. Often used in negative sentences.' },
  'Menandai subjek gramatikal yang melakukan aksi, atau benda yang dideskripsikan keadaannya. Sering digunakan dengan kata kerja intransitif.':
    { EN: 'Marks the grammatical subject performing the action, or the noun being described. Often used with intransitive verbs.' },
  'Khusus digunakan sebelum kata sifat "suki/kirai" (suka/benci), "jouzu/heta" (pandai/bodoh), dan kata kerja bentuk potensial (bisa) atau "hoshii" (ingin).':
    { EN: 'Specifically used before adjectives like "suki/kirai" (like/dislike), "jouzu/heta" (good/bad at), potential verbs (can), or "hoshii" (want).' },
};
