export interface ThietBi {
  maThietBi: string;
  tenThietBi: string;
  donViTinh: string;
  ghiChu: string;
}

export interface TrangThaiThietBi {
  id: string;
  maThietBi: string;
  soLuongTonKho: number;
  soLuongDangSuDung: number;
  soLuongHuHong: number;
  soLuongThanhLy: number;
}

export interface PhieuNhapKho {
  maPhieuNhap: string;
  ngayNhap: string;
  maNhanVien: string;
  maNhaCungCap: string;
  maThietBi: string;
  soLuong: number;
  donGiaNhap: number;
  thanhTien: number;
  hanSuDung: string;
  ghiChu: string;
}

export interface PhieuXuatKho {
  maPhieuXuat: string;
  ngayXuat: string;
  maNhanVien: string;
  maThietBi: string;
  soLuong: number;
  donGiaXuat: number;
  thanhTien: number;
  mucDichXuat: string;
  ghiChu: string;
}

export interface PhieuCapPhat {
  maCapPhat: string;
  maThietBi: string;
  soLuong: number;
  maNhanVien: string;
  nguoiNhan: string;
  maKhoa: string;
  ngayCapPhat: string;
  ngayTraDuKien: string;
  ngayTraThucTe: string | null;
  trangThai: "DANG_SU_DUNG" | "DA_TRA" | "QUA_HAN";
}

export interface NhaCungCap {
  maNCC: string;
  tenNCC: string;
  soDienThoai: string;
  email: string;
}

export interface NhanVien {
  maNV: string;
  tenNV: string;
  chucVu: string;
  soDienThoai: string;
  email: string;
}

export interface Khoa {
  maKhoa: string;
  tenKhoa: string;
}
