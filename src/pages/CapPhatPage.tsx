import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { capPhatStore, thietBiStore, nhanVienStore, khoaStore, trangThaiStore, getTenThietBi, getTenNhanVien, getTenKhoa, genId } from "@/lib/store";
import type { PhieuCapPhat } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const trangThaiMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" }> = {
  DANG_SU_DUNG: { label: "Đang sử dụng", variant: "default" },
  DA_TRA: { label: "Đã trả", variant: "secondary" },
  QUA_HAN: { label: "Quá hạn", variant: "destructive" },
};

export default function CapPhatPage() {
  const [data, setData] = useState(capPhatStore.getAll());
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<Partial<PhieuCapPhat>>({});

  const reload = () => setData(capPhatStore.getAll());

  const filtered = data.filter((p) =>
    p.maCapPhat.toLowerCase().includes(search.toLowerCase()) ||
    getTenThietBi(p.maThietBi).toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setForm({
      maCapPhat: genId("CP", data as any, "maCapPhat"),
      ngayCapPhat: new Date().toISOString().slice(0, 10),
      soLuong: 0,
      trangThai: "DANG_SU_DUNG",
    });
    setDialogOpen(true);
  };

  const handleSave = async() => {
    if (!form.maThietBi || !form.maNhanVien || !form.maKhoa || !form.nguoiNhan || !form.soLuong || form.soLuong <= 0) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    const tt = trangThaiStore.getAll().find((t) => t.maThietBi === form.maThietBi);
    if (tt && tt.soLuongTonKho < form.soLuong) {
      toast.error(`Tồn kho không đủ. Hiện có: ${tt.soLuongTonKho}`);
      return;
    }
    const item: PhieuCapPhat = {
      maCapPhat: form.maCapPhat!,
      maThietBi: form.maThietBi!,
      soLuong: form.soLuong!,
      maNhanVien: form.maNhanVien!,
      nguoiNhan: form.nguoiNhan!,
      maKhoa: form.maKhoa!,
      ngayCapPhat: form.ngayCapPhat || new Date().toISOString().slice(0, 10),
      ngayTraDuKien: form.ngayTraDuKien || "",
      ngayTraThucTe: null,
      trangThai: "DANG_SU_DUNG",
    };
    try {
    // CALL API
      await fetch("http://localhost:3000/capphat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ma_cap_phat: item.maCapPhat,
          ma_thiet_bi: item.maThietBi,
          so_luong: item.soLuong,
          ma_nhan_vien: item.maNhanVien,
          nguoi_nhan: item.nguoiNhan,
          ma_khoa: item.maKhoa,
          ngay_cap_phat: item.ngayCapPhat,
          ngay_tra_du_kien: item.ngayTraDuKien,
          ngay_tra_thuc_te: null,
          trang_thai: item.trangThai,
        }),
      });

      // 👉 update UI sau khi API OK
      capPhatStore.add(item);

      if (tt) {
        trangThaiStore.update((t) => t.maThietBi === item.maThietBi, {
          ...tt,
          soLuongTonKho: tt.soLuongTonKho - item.soLuong,
          soLuongDangSuDung: tt.soLuongDangSuDung + item.soLuong,
        });
      }

      toast.success("Cấp phát thiết bị thành công");
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
          <h1 className="page-title">Cấp phát thiết bị</h1>
          <p className="page-description">Quản lý cấp phát thiết bị cho các khoa</p>
        </div>
        <Button onClick={openAdd}><Plus className="w-4 h-4 mr-2" />Tạo phiếu cấp phát</Button>
      </div>

      <div className="mb-4 relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Tìm kiếm..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="bg-card rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã</TableHead>
              <TableHead>Thiết bị</TableHead>
              <TableHead className="text-right">SL</TableHead>
              <TableHead>Khoa</TableHead>
              <TableHead>Người nhận</TableHead>
              <TableHead>Ngày cấp</TableHead>
              <TableHead>Trạng thái</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">Không có phiếu cấp phát</TableCell></TableRow>
            ) : filtered.map((p) => (
              <TableRow key={p.maCapPhat}>
                <TableCell className="font-mono text-xs">{p.maCapPhat}</TableCell>
                <TableCell className="font-medium">{getTenThietBi(p.maThietBi)}</TableCell>
                <TableCell className="text-right">{p.soLuong}</TableCell>
                <TableCell>{getTenKhoa(p.maKhoa)}</TableCell>
                <TableCell>{p.nguoiNhan}</TableCell>
                <TableCell>{p.ngayCapPhat}</TableCell>
                <TableCell>
                  <Badge variant={trangThaiMap[p.trangThai]?.variant || "default"}>
                    {trangThaiMap[p.trangThai]?.label || p.trangThai}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Tạo phiếu cấp phát</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Mã phiếu</Label><Input value={form.maCapPhat || ""} disabled /></div>
              <div><Label>Ngày cấp phát</Label><Input type="date" value={form.ngayCapPhat || ""} onChange={(e) => setForm({ ...form, ngayCapPhat: e.target.value })} /></div>
            </div>
            <div>
              <Label>Thiết bị *</Label>
              <Select value={form.maThietBi} onValueChange={(v) => setForm({ ...form, maThietBi: v })}>
                <SelectTrigger><SelectValue placeholder="Chọn thiết bị" /></SelectTrigger>
                <SelectContent>{thietBiStore.getAll().map((t) => <SelectItem key={t.maThietBi} value={t.maThietBi}>{t.tenThietBi}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Khoa *</Label>
                <Select value={form.maKhoa} onValueChange={(v) => setForm({ ...form, maKhoa: v })}>
                  <SelectTrigger><SelectValue placeholder="Chọn khoa" /></SelectTrigger>
                  <SelectContent>{khoaStore.getAll().map((k) => <SelectItem key={k.maKhoa} value={k.maKhoa}>{k.tenKhoa}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Người nhận *</Label><Input value={form.nguoiNhan || ""} onChange={(e) => setForm({ ...form, nguoiNhan: e.target.value })} /></div>
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
              <div><Label>Ngày trả dự kiến</Label><Input type="date" value={form.ngayTraDuKien || ""} onChange={(e) => setForm({ ...form, ngayTraDuKien: e.target.value })} /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Hủy</Button>
            <Button onClick={handleSave}>Cấp phát</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
