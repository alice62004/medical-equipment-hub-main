import { useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { thietBiStore, trangThaiStore, genId } from "@/lib/store";
import type { ThietBi, TrangThaiThietBi } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function ThietBiPage() {
  const [data, setData] = useState(thietBiStore.getAll());
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<ThietBi | null>(null);
  const [form, setForm] = useState<Partial<ThietBi>>({});

  const reload = () => setData(thietBiStore.getAll());

  const filtered = data.filter(
    (t) =>
      t.maThietBi.toLowerCase().includes(search.toLowerCase()) ||
      t.tenThietBi.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditing(null);
    setForm({ maThietBi: genId("TB", data as any, "maThietBi"), donViTinh: "Cái" });
    setDialogOpen(true);
  };

  const openEdit = (item: ThietBi) => {
    setEditing(item);
    setForm({ ...item });
    setDialogOpen(true);
  };

  const handleSave = async () => {
  if (!form.maThietBi || !form.tenThietBi) {
    toast.error("Vui lòng nhập đầy đủ thông tin bắt buộc");
    return;
  }

  if (!editing && data.some((t) => t.maThietBi === form.maThietBi)) {
    toast.error("Mã thiết bị đã tồn tại");
    return;
  }

  const item: ThietBi = {
    maThietBi: form.maThietBi!,
    tenThietBi: form.tenThietBi!,
    donViTinh: form.donViTinh || "Cái",
    ghiChu: form.ghiChu || "",
  };

  try {
    if (editing) {
      // 🟡 UPDATE STORE
      thietBiStore.update((t) => t.maThietBi === editing.maThietBi, item);

      // 🔥 UPDATE MYSQL
      await fetch(`http://localhost:3000/thietbi/${editing.maThietBi}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ten_thiet_bi: item.tenThietBi,
          don_vi_tinh: item.donViTinh,
          ghi_chu: item.ghiChu,
        }),
      });

      toast.success("Cập nhật thiết bị thành công");
    } else {
      // 🟡 ADD STORE
      thietBiStore.add(item);

      // 🔥 ADD MYSQL
      await fetch("http://localhost:3000/thietbi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ma_thiet_bi: item.maThietBi,
          ten_thiet_bi: item.tenThietBi,
          don_vi_tinh: item.donViTinh,
          ghi_chu: item.ghiChu,
        }),
      });

      // 🔥 ADD TRẠNG THÁI MYSQL
      await fetch("http://localhost:3000/trangthai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ma_thiet_bi: item.maThietBi,
        }),
      });

      // 🟡 STORE STATUS (giữ nguyên)
      const tt: TrangThaiThietBi = {
        id: `TT${Date.now()}`,
        maThietBi: item.maThietBi,
        soLuongTonKho: 0,
        soLuongDangSuDung: 0,
        soLuongHuHong: 0,
        soLuongThanhLy: 0,
      };
      trangThaiStore.add(tt);

      toast.success("Thêm thiết bị thành công");
    }

    setDialogOpen(false);
    reload();
  } catch (err) {
    toast.error("Lỗi khi sync MySQL");
  }
};

  const handleDelete = async () => {
  if (!deleteId) return;

  try {
    // 🟡 XÓA STORE
    thietBiStore.remove((t) => t.maThietBi === deleteId);
    trangThaiStore.remove((t) => t.maThietBi === deleteId);

    // 🔥 XÓA MYSQL
    await fetch(`http://localhost:3000/thietbi/${deleteId}`, {
      method: "DELETE",
    });

    toast.success("Xóa thiết bị thành công");
    setDeleteId(null);
    reload();
  } catch (err) {
    toast.error("Lỗi khi xóa MySQL");
  }
};

  return (
    <div>
      <div className="page-header flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="page-title">Quản lý thiết bị</h1>
          <p className="page-description">Danh mục thiết bị y tế</p>
        </div>
        <Button onClick={openAdd}><Plus className="w-4 h-4 mr-2" />Thêm thiết bị</Button>
      </div>

      <div className="mb-4 relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Tìm kiếm theo mã hoặc tên..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="bg-card rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã</TableHead>
              <TableHead>Tên thiết bị</TableHead>
              <TableHead>Đơn vị tính</TableHead>
              <TableHead>Ghi chú</TableHead>
              <TableHead className="w-24">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Không tìm thấy thiết bị</TableCell></TableRow>
            ) : filtered.map((t) => (
              <TableRow key={t.maThietBi}>
                <TableCell className="font-mono text-xs">{t.maThietBi}</TableCell>
                <TableCell className="font-medium">{t.tenThietBi}</TableCell>
                <TableCell>{t.donViTinh}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{t.ghiChu}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(t)}><Pencil className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteId(t.maThietBi)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Chỉnh sửa thiết bị" : "Thêm thiết bị mới"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Mã thiết bị *</Label>
              <Input value={form.maThietBi || ""} onChange={(e) => setForm({ ...form, maThietBi: e.target.value })} disabled={!!editing} />
            </div>
            <div>
              <Label>Tên thiết bị *</Label>
              <Input value={form.tenThietBi || ""} onChange={(e) => setForm({ ...form, tenThietBi: e.target.value })} />
            </div>
            <div>
              <Label>Đơn vị tính</Label>
              <Input value={form.donViTinh || ""} onChange={(e) => setForm({ ...form, donViTinh: e.target.value })} />
            </div>
            <div>
              <Label>Ghi chú</Label>
              <Input value={form.ghiChu || ""} onChange={(e) => setForm({ ...form, ghiChu: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Hủy</Button>
            <Button onClick={handleSave}>{editing ? "Cập nhật" : "Thêm"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>Bạn có chắc chắn muốn xóa thiết bị này? Thao tác này không thể hoàn tác.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Xóa</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
