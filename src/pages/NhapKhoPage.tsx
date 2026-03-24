import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { phieuNhapStore, thietBiStore, nhaCungCapStore, nhanVienStore, getTenThietBi, getTenNCC, getTenNhanVien, genId } from "@/lib/store";
import type { PhieuNhapKho } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { trangThaiStore } from "@/lib/store";

export default function NhapKhoPage() {
  const [data, setData] = useState(phieuNhapStore.getAll());
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<Partial<PhieuNhapKho>>({});

  const reload = () => setData(phieuNhapStore.getAll());
  const thietBiList = thietBiStore.getAll();
  const nccList = nhaCungCapStore.getAll();
  const nvList = nhanVienStore.getAll();

  const filtered = data.filter((p) =>
    p.maPhieuNhap.toLowerCase().includes(search.toLowerCase()) ||
    getTenThietBi(p.maThietBi).toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setForm({
      maPhieuNhap: genId("PN", data as any, "maPhieuNhap"),
      ngayNhap: new Date().toISOString().slice(0, 10),
      soLuong: 0,
      donGiaNhap: 0,
      thanhTien: 0,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
  if (!form.maThietBi || !form.maNhaCungCap || !form.maNhanVien || !form.soLuong || form.soLuong || form.donGiaNhap <= 0) {
    toast.error("Vui lòng nhập đầy đủ thông tin hợp lệ");
    return;
  }

  const thanhTien = (form.soLuong || 0) * (form.donGiaNhap || 0);

  const item: PhieuNhapKho = {
    maPhieuNhap: form.maPhieuNhap!,
    ngayNhap: form.ngayNhap || new Date().toISOString().slice(0, 10),
    maNhanVien: form.maNhanVien!,
    maNhaCungCap: form.maNhaCungCap!,
    maThietBi: form.maThietBi!,
    soLuong: form.soLuong!,
    donGiaNhap: form.donGiaNhap || 0,
    thanhTien,
    hanSuDung: form.hanSuDung || "",
    ghiChu: form.ghiChu || "",
  };

  try {
    // 🔥 CALL API
    await fetch("http://localhost:3000/phieunhap", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ma_phieu_nhap: item.maPhieuNhap,
        ngay_nhap: item.ngayNhap,
        ma_nhan_vien: item.maNhanVien,
        ma_nha_cung_cap: item.maNhaCungCap,
        ma_thiet_bi: item.maThietBi,
        so_luong: item.soLuong,
        don_gia_nhap: item.donGiaNhap,
        thanh_tien: item.thanhTien,
        han_su_dung: item.hanSuDung,
        ghi_chu: item.ghiChu,
      }),
    });

    // 👉 update UI sau khi API OK
    phieuNhapStore.add(item);

    toast.success("Lập phiếu nhập kho thành công");
    setDialogOpen(false);
    reload();
    } catch (err) {
      toast.error("Lỗi khi lưu MySQL");
    }
  };
  return (
    <div>
      <div className="page-header flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="page-title">Nhập kho</h1>
          <p className="page-description">Quản lý phiếu nhập kho vật tư thiết bị</p>
        </div>
        <Button onClick={openAdd}><Plus className="w-4 h-4 mr-2" />Tạo phiếu nhập</Button>
      </div>

      <div className="mb-4 relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Tìm kiếm..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="bg-card rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã phiếu</TableHead>
              <TableHead>Ngày nhập</TableHead>
              <TableHead>Thiết bị</TableHead>
              <TableHead>NCC</TableHead>
              <TableHead className="text-right">SL</TableHead>
              <TableHead className="text-right">Đơn giá</TableHead>
              <TableHead className="text-right">Thành tiền</TableHead>
              <TableHead>Nhân viên</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-8">Không có phiếu nhập</TableCell></TableRow>
            ) : filtered.map((p) => (
              <TableRow key={p.maPhieuNhap}>
                <TableCell className="font-mono text-xs">{p.maPhieuNhap}</TableCell>
                <TableCell>{p.ngayNhap}</TableCell>
                <TableCell className="font-medium">{getTenThietBi(p.maThietBi)}</TableCell>
                <TableCell className="text-sm">{getTenNCC(p.maNhaCungCap)}</TableCell>
                <TableCell className="text-right font-semibold text-primary">{p.soLuong}</TableCell>
                <TableCell className="text-right">{p.donGiaNhap.toLocaleString("vi-VN")}đ</TableCell>
                <TableCell className="text-right font-semibold">{p.thanhTien.toLocaleString("vi-VN")}đ</TableCell>
                <TableCell className="text-sm">{getTenNhanVien(p.maNhanVien)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Tạo phiếu nhập kho</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Mã phiếu</Label><Input value={form.maPhieuNhap || ""} disabled /></div>
              <div><Label>Ngày nhập</Label><Input type="date" value={form.ngayNhap || ""} onChange={(e) => setForm({ ...form, ngayNhap: e.target.value })} /></div>
            </div>
            <div>
              <Label>Thiết bị *</Label>
              <Select value={form.maThietBi} onValueChange={(v) => setForm({ ...form, maThietBi: v })}>
                <SelectTrigger><SelectValue placeholder="Chọn thiết bị" /></SelectTrigger>
                <SelectContent>{thietBiList.map((t) => <SelectItem key={t.maThietBi} value={t.maThietBi}>{t.tenThietBi}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Nhà cung cấp *</Label>
              <Select value={form.maNhaCungCap} onValueChange={(v) => setForm({ ...form, maNhaCungCap: v })}>
                <SelectTrigger><SelectValue placeholder="Chọn NCC" /></SelectTrigger>
                <SelectContent>{nccList.map((n) => <SelectItem key={n.maNCC} value={n.maNCC}>{n.tenNCC}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Nhân viên *</Label>
              <Select value={form.maNhanVien} onValueChange={(v) => setForm({ ...form, maNhanVien: v })}>
                <SelectTrigger><SelectValue placeholder="Chọn NV" /></SelectTrigger>
                <SelectContent>{nvList.map((n) => <SelectItem key={n.maNV} value={n.maNV}>{n.tenNV}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Số lượng *</Label><Input type="number" value={form.soLuong || ""} onChange={(e) => setForm({ ...form, soLuong: +e.target.value })} /></div>
              <div><Label>Đơn giá nhập</Label><Input type="number" value={form.donGiaNhap || ""} onChange={(e) => setForm({ ...form, donGiaNhap: +e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Hạn sử dụng</Label><Input type="date" value={form.hanSuDung || ""} onChange={(e) => setForm({ ...form, hanSuDung: e.target.value })} /></div>
              <div><Label>Ghi chú</Label><Input value={form.ghiChu || ""} onChange={(e) => setForm({ ...form, ghiChu: e.target.value })} /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Hủy</Button>
            <Button onClick={handleSave}>Lưu phiếu nhập</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
