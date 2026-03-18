import { jest } from "@jest/globals";

// Tạo mock trước
const mockQuery = jest.fn();

// Mock module db
jest.unstable_mockModule("../src/config/db.js", () => ({
  db: { query: mockQuery }
}));

// Import service SAU khi mock
const service = await import("../src/services/thietBi.service.js");

describe("ThietBi Service", () => {

  test("1. Lấy danh sách thiết bị", async () => {
    mockQuery.mockResolvedValue([[{ ma_thiet_bi: "TB1" }]]);
    const result = await service.getAll();
    expect(result.length).toBe(1);
  });

  test("2. Lấy thiết bị theo ID", async () => {
    mockQuery.mockResolvedValue([[{ ma_thiet_bi: "TB1" }]]);
    const result = await service.getById("TB1");
    expect(result.ma_thiet_bi).toBe("TB1");
  });

  test("3. Tạo thiết bị mới thành công", async () => {
    mockQuery
      .mockResolvedValueOnce([[]])   // check duplicate → trống
      .mockResolvedValueOnce([{}]);  // insert

    const result = await service.create({
      ma_thiet_bi: "TB2",
      ten_thiet_bi: "Máy test",
      don_vi_tinh: "Cái",
    });
    expect(result.ma_thiet_bi).toBe("TB2");
  });

  test("4. Tạo thiết bị bị trùng", async () => {
    mockQuery.mockResolvedValue([[{ ma_thiet_bi: "TB2" }]]);
    await expect(
      service.create({ ma_thiet_bi: "TB2", ten_thiet_bi: "Trùng", don_vi_tinh: "Cái" })
    ).rejects.toThrow("Duplicate ID");
  });

  test("5. Xoá thiết bị", async () => {
    mockQuery.mockResolvedValue([{}]);
    const result = await service.remove("TB2");
    expect(result).toBe(true);
  });

});
