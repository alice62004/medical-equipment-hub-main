import { useState } from "react";
import * as XLSX from "xlsx";
import { thietBiStore, trangThaiStore, phieuNhapStore, phieuXuatStore, capPhatStore, nhaCungCapStore, getTenThietBi, getTenNCC, getTenNhanVien, getTenKhoa } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, BarChart3, Package, ArrowDownToLine, ArrowUpFromLine, Share2, Truck } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

function exportToExcel(data: any[], sheetName: string, fileName: string) {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, `${fileName}.xlsx`);
  toast.success(`Đã xuất file ${fileName}.xlsx`);
}

export default function ThongKePage() {
  const thietBi = thietBiStore.getAll();
  const trangThai = trangThaiStore.getAll();
  const phieuNhap = phieuNhapStore.getAll();
  const phieuXuat = phieuXuatStore.getAll();
  const capPhat = capPhatStore.getAll();
  const nhaCungCap = nhaCungCapStore.getAll();

  const totalNhap = phieuNhap.reduce((s, p) => s + p.thanhTien, 0);
  const totalXuat = phieuXuat.reduce((s, p) => s + p.thanhTien, 0);
  const totalTonKho = trangThai.reduce((s, t) => s + t.soLuongTonKho, 0);

  const exportThietBi = () => exportToExcel(thietBi.map(t => ({
    "Mã TB": t.maThietBi, "Tên thiết bị": t.tenThietBi, "Đơn vị tính": t.donViTinh, "Ghi chú": t.ghiChu,
  })), "ThietBi", "BaoCao_ThietBi");

  const exportTonKho = () => exportToExcel(trangThai.map(t => ({
    "Mã TB": t.maThietBi, "Tên thiết bị": getTenThietBi(t.maThietBi),
    "Tồn kho": t.soLuongTonKho, "Đang dùng": t.soLuongDangSuDung,
    "Hư hỏng": t.soLuongHuHong, "Thanh lý": t.soLuongThanhLy,
  })), "TonKho", "BaoCao_TonKho");

  const exportNhapKho = () => exportToExcel(phieuNhap.map(p => ({
    "Mã phiếu": p.maPhieuNhap, "Ngày nhập": p.ngayNhap, "Nhân viên": getTenNhanVien(p.maNhanVien),
    "NCC": getTenNCC(p.maNhaCungCap), "Thiết bị": getTenThietBi(p.maThietBi),
    "Số lượng": p.soLuong, "Đơn giá": p.donGiaNhap, "Thành tiền": p.thanhTien,
  })), "NhapKho", "BaoCao_NhapKho");

  const exportXuatKho = () => exportToExcel(phieuXuat.map(p => ({
    "Mã phiếu": p.maPhieuXuat, "Ngày xuất": p.ngayXuat, "Nhân viên": getTenNhanVien(p.maNhanVien),
    "Thiết bị": getTenThietBi(p.maThietBi), "Số lượng": p.soLuong,
    "Đơn giá": p.donGiaXuat, "Thành tiền": p.thanhTien, "Mục đích": p.mucDichXuat,
  })), "XuatKho", "BaoCao_XuatKho");

  const exportCapPhat = () => exportToExcel(capPhat.map(p => ({
    "Mã cấp phát": p.maCapPhat, "Thiết bị": getTenThietBi(p.maThietBi), "Số lượng": p.soLuong,
    "Người nhận": p.nguoiNhan, "Khoa": getTenKhoa(p.maKhoa),
    "Ngày cấp": p.ngayCapPhat, "Trạng thái": p.trangThai,
  })), "CapPhat", "BaoCao_CapPhat");

  const exportNCC = () => exportToExcel(nhaCungCap.map(n => ({
    "Mã NCC": n.maNCC, "Tên NCC": n.tenNCC, "SĐT": n.soDienThoai, "Email": n.email,
  })), "NhaCungCap", "BaoCao_NhaCungCap");

  const exportAll = () => {
    const wb = XLSX.utils.book_new();
    const sheets: [any[], string][] = [
      [thietBi.map(t => ({ "Mã TB": t.maThietBi, "Tên": t.tenThietBi, "ĐVT": t.donViTinh })), "ThietBi"],
      [trangThai.map(t => ({ "Mã TB": t.maThietBi, "Tên": getTenThietBi(t.maThietBi), "Tồn kho": t.soLuongTonKho, "Đang dùng": t.soLuongDangSuDung, "Hư hỏng": t.soLuongHuHong })), "TonKho"],
      [phieuNhap.map(p => ({ "Mã": p.maPhieuNhap, "Ngày": p.ngayNhap, "TB": getTenThietBi(p.maThietBi), "SL": p.soLuong, "Tiền": p.thanhTien })), "NhapKho"],
      [phieuXuat.map(p => ({ "Mã": p.maPhieuXuat, "Ngày": p.ngayXuat, "TB": getTenThietBi(p.maThietBi), "SL": p.soLuong, "Tiền": p.thanhTien })), "XuatKho"],
      [capPhat.map(p => ({ "Mã": p.maCapPhat, "TB": getTenThietBi(p.maThietBi), "SL": p.soLuong, "Người nhận": p.nguoiNhan, "Khoa": getTenKhoa(p.maKhoa) })), "CapPhat"],
    ];
    sheets.forEach(([data, name]) => {
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data), name);
    });
    XLSX.writeFile(wb, "BaoCao_TongHop.xlsx");
    toast.success("Đã xuất báo cáo tổng hợp!");
  };

  return (
    <div>
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">Thống kê & Báo cáo</h1>
          <p className="page-description">Xem thống kê và xuất báo cáo Excel</p>
        </div>
        <Button onClick={exportAll} className="gap-2">
          <Download className="w-4 h-4" /> Xuất tất cả
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="stat-card text-center">
          <p className="text-xs text-muted-foreground">Tổng giá trị nhập</p>
          <p className="text-xl font-bold text-primary mt-1">{totalNhap.toLocaleString("vi-VN")}đ</p>
        </div>
        <div className="stat-card text-center">
          <p className="text-xs text-muted-foreground">Tổng giá trị xuất</p>
          <p className="text-xl font-bold text-destructive mt-1">{totalXuat.toLocaleString("vi-VN")}đ</p>
        </div>
        <div className="stat-card text-center">
          <p className="text-xs text-muted-foreground">Tổng tồn kho</p>
          <p className="text-xl font-bold text-success mt-1">{totalTonKho}</p>
        </div>
      </div>

      <Tabs defaultValue="tonkho">
        <TabsList className="flex-wrap">
          <TabsTrigger value="tonkho" className="gap-1"><BarChart3 className="w-3.5 h-3.5" /> Tồn kho</TabsTrigger>
          <TabsTrigger value="thietbi" className="gap-1"><Package className="w-3.5 h-3.5" /> Thiết bị</TabsTrigger>
          <TabsTrigger value="nhapkho" className="gap-1"><ArrowDownToLine className="w-3.5 h-3.5" /> Nhập kho</TabsTrigger>
          <TabsTrigger value="xuatkho" className="gap-1"><ArrowUpFromLine className="w-3.5 h-3.5" /> Xuất kho</TabsTrigger>
          <TabsTrigger value="capphat" className="gap-1"><Share2 className="w-3.5 h-3.5" /> Cấp phát</TabsTrigger>
          <TabsTrigger value="ncc" className="gap-1"><Truck className="w-3.5 h-3.5" /> NCC</TabsTrigger>
        </TabsList>

        <TabsContent value="tonkho">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Báo cáo tồn kho</CardTitle>
              <Button size="sm" variant="outline" onClick={exportTonKho} className="gap-1"><Download className="w-3.5 h-3.5" /> Excel</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã TB</TableHead><TableHead>Tên thiết bị</TableHead>
                    <TableHead className="text-right">Tồn kho</TableHead><TableHead className="text-right">Đang dùng</TableHead>
                    <TableHead className="text-right">Hư hỏng</TableHead><TableHead className="text-right">Thanh lý</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trangThai.map(t => (
                    <TableRow key={t.id}>
                      <TableCell className="font-mono text-xs">{t.maThietBi}</TableCell>
                      <TableCell>{getTenThietBi(t.maThietBi)}</TableCell>
                      <TableCell className="text-right font-semibold">{t.soLuongTonKho}</TableCell>
                      <TableCell className="text-right">{t.soLuongDangSuDung}</TableCell>
                      <TableCell className="text-right text-warning">{t.soLuongHuHong}</TableCell>
                      <TableCell className="text-right text-destructive">{t.soLuongThanhLy}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="thietbi">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Danh sách thiết bị</CardTitle>
              <Button size="sm" variant="outline" onClick={exportThietBi} className="gap-1"><Download className="w-3.5 h-3.5" /> Excel</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow><TableHead>Mã</TableHead><TableHead>Tên</TableHead><TableHead>ĐVT</TableHead><TableHead>Ghi chú</TableHead></TableRow></TableHeader>
                <TableBody>{thietBi.map(t => (<TableRow key={t.maThietBi}><TableCell className="font-mono text-xs">{t.maThietBi}</TableCell><TableCell>{t.tenThietBi}</TableCell><TableCell>{t.donViTinh}</TableCell><TableCell className="text-muted-foreground">{t.ghiChu}</TableCell></TableRow>))}</TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nhapkho">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Phiếu nhập kho</CardTitle>
              <Button size="sm" variant="outline" onClick={exportNhapKho} className="gap-1"><Download className="w-3.5 h-3.5" /> Excel</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow><TableHead>Mã</TableHead><TableHead>Ngày</TableHead><TableHead>Thiết bị</TableHead><TableHead>NCC</TableHead><TableHead className="text-right">SL</TableHead><TableHead className="text-right">Thành tiền</TableHead></TableRow></TableHeader>
                <TableBody>{phieuNhap.map(p => (<TableRow key={p.maPhieuNhap}><TableCell className="font-mono text-xs">{p.maPhieuNhap}</TableCell><TableCell>{p.ngayNhap}</TableCell><TableCell>{getTenThietBi(p.maThietBi)}</TableCell><TableCell>{getTenNCC(p.maNhaCungCap)}</TableCell><TableCell className="text-right">{p.soLuong}</TableCell><TableCell className="text-right font-semibold">{p.thanhTien.toLocaleString("vi-VN")}đ</TableCell></TableRow>))}</TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="xuatkho">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Phiếu xuất kho</CardTitle>
              <Button size="sm" variant="outline" onClick={exportXuatKho} className="gap-1"><Download className="w-3.5 h-3.5" /> Excel</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow><TableHead>Mã</TableHead><TableHead>Ngày</TableHead><TableHead>Thiết bị</TableHead><TableHead className="text-right">SL</TableHead><TableHead className="text-right">Thành tiền</TableHead><TableHead>Mục đích</TableHead></TableRow></TableHeader>
                <TableBody>{phieuXuat.map(p => (<TableRow key={p.maPhieuXuat}><TableCell className="font-mono text-xs">{p.maPhieuXuat}</TableCell><TableCell>{p.ngayXuat}</TableCell><TableCell>{getTenThietBi(p.maThietBi)}</TableCell><TableCell className="text-right">{p.soLuong}</TableCell><TableCell className="text-right font-semibold">{p.thanhTien.toLocaleString("vi-VN")}đ</TableCell><TableCell>{p.mucDichXuat}</TableCell></TableRow>))}</TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="capphat">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Phiếu cấp phát</CardTitle>
              <Button size="sm" variant="outline" onClick={exportCapPhat} className="gap-1"><Download className="w-3.5 h-3.5" /> Excel</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow><TableHead>Mã</TableHead><TableHead>Thiết bị</TableHead><TableHead>Người nhận</TableHead><TableHead>Khoa</TableHead><TableHead className="text-right">SL</TableHead><TableHead>Trạng thái</TableHead></TableRow></TableHeader>
                <TableBody>{capPhat.map(p => (<TableRow key={p.maCapPhat}><TableCell className="font-mono text-xs">{p.maCapPhat}</TableCell><TableCell>{getTenThietBi(p.maThietBi)}</TableCell><TableCell>{p.nguoiNhan}</TableCell><TableCell>{getTenKhoa(p.maKhoa)}</TableCell><TableCell className="text-right">{p.soLuong}</TableCell><TableCell><Badge variant="outline">{p.trangThai}</Badge></TableCell></TableRow>))}</TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ncc">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Nhà cung cấp</CardTitle>
              <Button size="sm" variant="outline" onClick={exportNCC} className="gap-1"><Download className="w-3.5 h-3.5" /> Excel</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow><TableHead>Mã</TableHead><TableHead>Tên NCC</TableHead><TableHead>SĐT</TableHead><TableHead>Email</TableHead></TableRow></TableHeader>
                <TableBody>{nhaCungCap.map(n => (<TableRow key={n.maNCC}><TableCell className="font-mono text-xs">{n.maNCC}</TableCell><TableCell>{n.tenNCC}</TableCell><TableCell>{n.soDienThoai}</TableCell><TableCell>{n.email}</TableCell></TableRow>))}</TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

