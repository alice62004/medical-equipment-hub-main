import type {
  ThietBi, TrangThaiThietBi, PhieuNhapKho, PhieuXuatKho,
  PhieuCapPhat, NhaCungCap, NhanVien, Khoa,
} from "./types";

// Helper to read/write localStorage
function load<T>(key: string, fallback: T[]): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}
function save<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data));
}

// ---- SEED DATA ----
const seedThietBi: ThietBi[] = [
  { maThietBi: "TB001", tenThietBi: "Máy đo huyết áp", donViTinh: "Cái", ghiChu: "Omron HEM-7121" },
  { maThietBi: "TB002", tenThietBi: "Máy thở", donViTinh: "Cái", ghiChu: "Philips V60" },
  { maThietBi: "TB003", tenThietBi: "Bơm tiêm điện", donViTinh: "Cái", ghiChu: "Terumo TE-SS800" },
  { maThietBi: "TB004", tenThietBi: "Nhiệt kế điện tử", donViTinh: "Cái", ghiChu: "Microlife MT200" },
  { maThietBi: "TB005", tenThietBi: "Giường bệnh nhân", donViTinh: "Cái", ghiChu: "3 tay quay" },
  { maThietBi: "TB006", tenThietBi: "Ống nghe y khoa", donViTinh: "Cái", ghiChu: "Littmann Classic III" },
  { maThietBi: "TB007", tenThietBi: "Máy siêu âm", donViTinh: "Bộ", ghiChu: "GE Voluson E10" },
  { maThietBi: "TB008", tenThietBi: "Khẩu trang y tế", donViTinh: "Hộp", ghiChu: "50 cái/hộp" },
];

const seedTrangThai: TrangThaiThietBi[] = [
  { id: "TT001", maThietBi: "TB001", soLuongTonKho: 20, soLuongDangSuDung: 15, soLuongHuHong: 2, soLuongThanhLy: 0 },
  { id: "TT002", maThietBi: "TB002", soLuongTonKho: 5, soLuongDangSuDung: 8, soLuongHuHong: 1, soLuongThanhLy: 0 },
  { id: "TT003", maThietBi: "TB003", soLuongTonKho: 30, soLuongDangSuDung: 20, soLuongHuHong: 3, soLuongThanhLy: 1 },
  { id: "TT004", maThietBi: "TB004", soLuongTonKho: 50, soLuongDangSuDung: 30, soLuongHuHong: 0, soLuongThanhLy: 0 },
  { id: "TT005", maThietBi: "TB005", soLuongTonKho: 10, soLuongDangSuDung: 40, soLuongHuHong: 5, soLuongThanhLy: 2 },
  { id: "TT006", maThietBi: "TB006", soLuongTonKho: 100, soLuongDangSuDung: 50, soLuongHuHong: 0, soLuongThanhLy: 0 },
  { id: "TT007", maThietBi: "TB007", soLuongTonKho: 2, soLuongDangSuDung: 3, soLuongHuHong: 0, soLuongThanhLy: 0 },
  { id: "TT008", maThietBi: "TB008", soLuongTonKho: 200, soLuongDangSuDung: 0, soLuongHuHong: 0, soLuongThanhLy: 0 },
];

const seedNCC: NhaCungCap[] = [
  { maNCC: "NCC001", tenNCC: "Công ty TNHH Thiết bị Y tế ABC", soDienThoai: "028-1234-5678", email: "abc@medical.vn" },
  { maNCC: "NCC002", tenNCC: "Công ty CP Dược phẩm XYZ", soDienThoai: "024-9876-5432", email: "xyz@pharma.vn" },
  { maNCC: "NCC003", tenNCC: "Công ty Medtronic Vietnam", soDienThoai: "028-5555-1234", email: "info@medtronic.vn" },
];

const seedNhanVien: NhanVien[] = [
  { maNV: "NV001", tenNV: "Nguyễn Văn An", chucVu: "Nhân viên kho", soDienThoai: "0901234567", email: "an.nv@benhvien.vn" },
  { maNV: "NV002", tenNV: "Trần Thị Bình", chucVu: "Quản lý", soDienThoai: "0907654321", email: "binh.tt@benhvien.vn" },
];

const seedKhoa: Khoa[] = [
  { maKhoa: "K001", tenKhoa: "Khoa Nội" },
  { maKhoa: "K002", tenKhoa: "Khoa Ngoại" },
  { maKhoa: "K003", tenKhoa: "Khoa Cấp cứu" },
  { maKhoa: "K004", tenKhoa: "Khoa Sản" },
  { maKhoa: "K005", tenKhoa: "Khoa Nhi" },
];

const seedPhieuNhap: PhieuNhapKho[] = [
  { maPhieuNhap: "PN001", ngayNhap: "2026-02-15", maNhanVien: "NV001", maNhaCungCap: "NCC001", maThietBi: "TB001", soLuong: 10, donGiaNhap: 2500000, thanhTien: 25000000, hanSuDung: "2029-02-15", ghiChu: "" },
  { maPhieuNhap: "PN002", ngayNhap: "2026-02-20", maNhanVien: "NV001", maNhaCungCap: "NCC002", maThietBi: "TB004", soLuong: 50, donGiaNhap: 150000, thanhTien: 7500000, hanSuDung: "2028-12-31", ghiChu: "" },
  { maPhieuNhap: "PN003", ngayNhap: "2026-03-01", maNhanVien: "NV002", maNhaCungCap: "NCC003", maThietBi: "TB007", soLuong: 1, donGiaNhap: 850000000, thanhTien: 850000000, hanSuDung: "", ghiChu: "Máy siêu âm cao cấp" },
];

const seedPhieuXuat: PhieuXuatKho[] = [
  { maPhieuXuat: "PX001", ngayXuat: "2026-02-18", maNhanVien: "NV001", maThietBi: "TB001", soLuong: 5, donGiaXuat: 2500000, thanhTien: 12500000, mucDichXuat: "Sử dụng", ghiChu: "Xuất cho khoa Nội" },
  { maPhieuXuat: "PX002", ngayXuat: "2026-03-02", maNhanVien: "NV002", maThietBi: "TB008", soLuong: 20, donGiaXuat: 50000, thanhTien: 1000000, mucDichXuat: "Sử dụng", ghiChu: "" },
];

const seedCapPhat: PhieuCapPhat[] = [
  { maCapPhat: "CP001", maThietBi: "TB001", soLuong: 5, maNhanVien: "NV001", nguoiNhan: "BS. Lê Văn C", maKhoa: "K001", ngayCapPhat: "2026-02-18", ngayTraDuKien: "2026-08-18", ngayTraThucTe: null, trangThai: "DANG_SU_DUNG" },
  { maCapPhat: "CP002", maThietBi: "TB003", soLuong: 10, maNhanVien: "NV001", nguoiNhan: "ĐD. Phạm Thị D", maKhoa: "K003", ngayCapPhat: "2026-03-01", ngayTraDuKien: "2026-09-01", ngayTraThucTe: null, trangThai: "DANG_SU_DUNG" },
];

// ---- STORE FUNCTIONS ----
const KEYS = {
  thietBi: "qlvt_thietbi",
  trangThai: "qlvt_trangthai",
  phieuNhap: "qlvt_phieunhap",
  phieuXuat: "qlvt_phieuxuat",
  capPhat: "qlvt_capphat",
  nhaCungCap: "qlvt_nhacungcap",
  nhanVien: "qlvt_nhanvien",
  khoa: "qlvt_khoa",
} as const;

export function initStore() {
  if (!localStorage.getItem(KEYS.thietBi)) save(KEYS.thietBi, seedThietBi);
  if (!localStorage.getItem(KEYS.trangThai)) save(KEYS.trangThai, seedTrangThai);
  if (!localStorage.getItem(KEYS.phieuNhap)) save(KEYS.phieuNhap, seedPhieuNhap);
  if (!localStorage.getItem(KEYS.phieuXuat)) save(KEYS.phieuXuat, seedPhieuXuat);
  if (!localStorage.getItem(KEYS.capPhat)) save(KEYS.capPhat, seedCapPhat);
  if (!localStorage.getItem(KEYS.nhaCungCap)) save(KEYS.nhaCungCap, seedNCC);
  if (!localStorage.getItem(KEYS.nhanVien)) save(KEYS.nhanVien, seedNhanVien);
  if (!localStorage.getItem(KEYS.khoa)) save(KEYS.khoa, seedKhoa);
}

// Generic CRUD
function createCrud<T>(key: string, seed: T[]) {
  return {
    getAll: (): T[] => load<T>(key, seed),
    save: (data: T[]) => save(key, data),
    add: (item: T) => { const all = load<T>(key, seed); all.push(item); save(key, all); },
    update: (predicate: (item: T) => boolean, updated: T) => {
      const all = load<T>(key, seed);
      const idx = all.findIndex(predicate);
      if (idx >= 0) { all[idx] = updated; save(key, all); }
    },
    remove: (predicate: (item: T) => boolean) => {
      const all = load<T>(key, seed).filter(i => !predicate(i));
      save(key, all);
    },
  };
}

export const thietBiStore = createCrud<ThietBi>(KEYS.thietBi, seedThietBi);
export const trangThaiStore = createCrud<TrangThaiThietBi>(KEYS.trangThai, seedTrangThai);
export const phieuNhapStore = createCrud<PhieuNhapKho>(KEYS.phieuNhap, seedPhieuNhap);
export const phieuXuatStore = createCrud<PhieuXuatKho>(KEYS.phieuXuat, seedPhieuXuat);
export const capPhatStore = createCrud<PhieuCapPhat>(KEYS.capPhat, seedCapPhat);
export const nhaCungCapStore = createCrud<NhaCungCap>(KEYS.nhaCungCap, seedNCC);
export const nhanVienStore = createCrud<NhanVien>(KEYS.nhanVien, seedNhanVien);
export const khoaStore = createCrud<Khoa>(KEYS.khoa, seedKhoa);

// Helper: get name by ID
export function getTenThietBi(ma: string) {
  return thietBiStore.getAll().find(t => t.maThietBi === ma)?.tenThietBi ?? ma;
}
export function getTenNCC(ma: string) {
  return nhaCungCapStore.getAll().find(n => n.maNCC === ma)?.tenNCC ?? ma;
}
export function getTenNhanVien(ma: string) {
  return nhanVienStore.getAll().find(n => n.maNV === ma)?.tenNV ?? ma;
}
export function getTenKhoa(ma: string) {
  return khoaStore.getAll().find(k => k.maKhoa === ma)?.tenKhoa ?? ma;
}

// Generate ID
export function genId(prefix: string, list: { [key: string]: string }[], field: string) {
  const nums = list.map(i => parseInt((i[field] || "").replace(prefix, "")) || 0);
  const next = Math.max(0, ...nums) + 1;
  return `${prefix}${String(next).padStart(3, "0")}`;
}
