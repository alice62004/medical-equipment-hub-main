export function validateThietBi(data) {
  const { ma_thiet_bi, ten_thiet_bi, don_vi_tinh } = data;

  if (!ma_thiet_bi || ma_thiet_bi.trim() === "") {
    throw new Error("Mã thiết bị không được để trống");
  }

  if (!ten_thiet_bi || ten_thiet_bi.trim() === "") {
    throw new Error("Tên thiết bị không được để trống");
  }

  if (don_vi_tinh && don_vi_tinh.length > 50) {
    throw new Error("Đơn vị tính quá dài");
  }

  return true;
}