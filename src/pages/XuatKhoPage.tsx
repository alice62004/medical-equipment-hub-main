import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { phieuXuatStore, thietBiStore, nhanVienStore, trangThaiStore, getTenThietBi, getTenNhanVien, genId } from "@/lib/store";
import type { PhieuXuatKho } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function XuatKhoPage() {
  const [data, setData] = useState(phieuXuatStore.getAll());
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<Partial<PhieuXuatKho>>({});

  const reload = () => setData(phieuXuatStore.getAll());

  const filtered = data.filter((p) =>
    p.maPhieuXuat.toLowerCase().includes(search.toLowerCase()) ||
    getTenThietBi(p.maThietBi).toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setForm({
      maPhieuXuat: genId("PX", data as any, "maPhieuXuat"),
      ngayXuat: new Date().toISOString().slice(0, 10),
      soLuong: 0, donGiaXuat: 0, thanhTien: 0,
      mucDichXuat: "Sử dụng",
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.maThietBi || !form.maNhanVien || !form.soLuong || form.soLuong <= 0) {
      toast.error("Vui lòng nhập đầy đủ thông tin hợp lệ");
      return;
    }
    // Check stock
    const tt = trangThaiStore.getAll().find((t) => t.maThietBi === form.maThietBi);
    if (tt && tt.soLuongTonKho < form.soLuong) {
      toast.error(`Tồn kho không đủ. Hiện có: ${tt.soLuongTonKho}`);
      return;
    }
    const thanhTien = (form.soLuong || 0) * (form.donGiaXuat || 0);
    const item: PhieuXuatKho = {
      maPhieuXuat: form.maPhieuXuat!,
      ngayXuat: form.ngayXuat || new Date().toISOString().slice(0, 10),
      maNhanVien: form.maNhanVien!,
      maThietBi: form.maThietBi!,
      soLuong: form.soLuong!,
      donGiaXuat: form.donGiaXuat || 0,
      thanhTien,
      mucDichXuat: form.mucDichXuat || "",
      ghiChu: form.ghiChu || "",
    };
    phieuXuatStore.add(item);
    if (tt) {
      trangThaiStore.update((t) => t.maThietBi === item.maThietBi, { ...tt, soLuongTonKho: tt.soLuongTonKho - item.soLuong });
    }
    toast.success("Lập phiếu xuất kho thành công");
    setDialogOpen(false);
    reload();
  };

  return (
    <div>
      <div className="page-header flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="page-title">Xuất kho</h1>
          <p className="page-description">Quản lý phiếu xuất kho vật tư thiết bị</p>
        </div>
        <Button onClick={openAdd}><Plus className="w-4 h-4 mr-2" />Tạo phiếu xuất</Button>
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
              <TableHead>Ngày xuất</TableHead>
              <TableHead>Thiết bị</TableHead>
              <TableHead className="text-right">SL</TableHead>
              <TableHead className="text-right">Thành tiền</TableHead>
              <TableHead>Mục đích</TableHead>
              <TableHead>Nhân viên</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">Không có phiếu xuất</TableCell></TableRow>
            ) : filtered.map((p) => (
              <TableRow key={p.maPhieuXuat}>
                <TableCell className="font-mono text-xs">{p.maPhieuXuat}</TableCell>
                <TableCell>{p.ngayXuat}</TableCell>
                <TableCell className="font-medium">{getTenThietBi(p.maThietBi)}</TableCell>
                <TableCell className="text-right font-semibold text-destructive">-{p.soLuong}</TableCell>
                <TableCell className="text-right">{p.thanhTien.toLocaleString("vi-VN")}đ</TableCell>
                <TableCell>{p.mucDichXuat}</TableCell>
                <TableCell className="text-sm">{getTenNhanVien(p.maNhanVien)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Tạo phiếu xuất kho</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Mã phiếu</Label><Input value={form.maPhieuXuat || ""} disabled /></div>
              <div><Label>Ngày xuất</Label><Input type="date" value={form.ngayXuat || ""} onChange={(e) => setForm({ ...form, ngayXuat: e.target.value })} /></div>
            </div>
            <div>
              <Label>Thiết bị *</Label>
              <Select value={form.maThietBi} onValueChange={(v) => setForm({ ...form, maThietBi: v })}>
                <SelectTrigger><SelectValue placeholder="Chọn thiết bị" /></SelectTrigger>
                <SelectContent>{thietBiStore.getAll().map((t) => <SelectItem key={t.maThietBi} value={t.maThietBi}>{t.tenThietBi}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Nhân viên *</Label>
              <Select value={form.maNhanVien} onValueChange={(v) => setForm({ ...form, maNhanVien: v })}>
                <SelectTrigger><SelectValue placeholder="Chọn NV" /></SelectTrigger>
                <SelectContent>{nhanVienStore.getAll().map((n) => <SelectItem key={n.maNV} value={n.maNV}>{n.tenNV}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Số lượng *</Label><Input type="number" value={form.soLuong || ""} onChange={(e) => setForm({ ...form, soLuong: +e.target.value })} /></div>
              <div><Label>Đơn giá xuất</Label><Input type="number" value={form.donGiaXuat || ""} onChange={(e) => setForm({ ...form, donGiaXuat: +e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Mục đích xuất</Label><Input value={form.mucDichXuat || ""} onChange={(e) => setForm({ ...form, mucDichXuat: e.target.value })} /></div>
              <div><Label>Ghi chú</Label><Input value={form.ghiChu || ""} onChange={(e) => setForm({ ...form, ghiChu: e.target.value })} /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Hủy</Button>
            <Button onClick={handleSave}>Lưu phiếu xuất</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
