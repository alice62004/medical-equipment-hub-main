import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { khoaStore, genId } from "@/lib/store";
import type { Khoa } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function KhoaPage() {
  const [data, setData] = useState<Khoa[]>(khoaStore.getAll());
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Khoa | null>(null);
  const [form, setForm] = useState<Partial<Khoa>>({});

  const reload = () => setData(khoaStore.getAll());

  useEffect(() => {
    reload();
  }, []);

  const filtered = data.filter(
    (k) =>
      k.maKhoa.toLowerCase().includes(search.toLowerCase()) ||
      k.tenKhoa.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditing(null);
    setForm({ maKhoa: genId("K", data as any[], "maKhoa") });
    setDialogOpen(true);
  };

  const openEdit = (item: Khoa) => {
    setEditing(item);
    setForm({ ...item });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.maKhoa || !form.tenKhoa) {
      toast.error("Vui lòng nhập đầy đủ thông tin bắt buộc");
      return;
    }
    if (!editing && data.some((k) => k.maKhoa === form.maKhoa)) {
      toast.error("Mã khoa đã tồn tại");
      return;
    }
    const item: Khoa = {
      maKhoa: form.maKhoa!,
      tenKhoa: form.tenKhoa!,
    };
    if (editing) {
      khoaStore.update((k) => k.maKhoa === editing.maKhoa, item);
      toast.success("Cập nhật khoa thành công");
    } else {
      khoaStore.add(item);
      toast.success("Thêm khoa thành công");
    }
    setDialogOpen(false);
    reload();
  };

  const handleDelete = () => {
    if (!deleteId) return;
    khoaStore.remove((k) => k.maKhoa === deleteId);
    toast.success("Xóa khoa thành công");
    setDeleteId(null);
    reload();
  };

  return (
    <div>
      <div className="page-header flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="page-title">Quản lý khoa</h1>
          <p className="page-description">Danh mục khoa phòng bệnh viện</p>
        </div>
        <Button onClick={openAdd}><Plus className="w-4 h-4 mr-2" />Thêm khoa</Button>
      </div>

      <div className="mb-4 relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Tìm kiếm theo mã hoặc tên khoa..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="bg-card rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã</TableHead>
              <TableHead>Tên khoa</TableHead>
              <TableHead className="w-24">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground py-8">Không tìm thấy khoa</TableCell></TableRow>
            ) : filtered.map((k) => (
              <TableRow key={k.maKhoa}>
                <TableCell className="font-mono text-xs">{k.maKhoa}</TableCell>
                <TableCell className="font-medium">{k.tenKhoa}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(k)}><Pencil className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteId(k.maKhoa)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
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
            <DialogTitle>{editing ? "Chỉnh sửa khoa" : "Thêm khoa mới"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Mã khoa *</Label>
              <Input value={form.maKhoa || ""} onChange={(e) => setForm({ ...form, maKhoa: e.target.value })} disabled={!!editing} />
            </div>
            <div>
              <Label>Tên khoa *</Label>
              <Input value={form.tenKhoa || ""} onChange={(e) => setForm({ ...form, tenKhoa: e.target.value })} />
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
            <AlertDialogDescription>Bạn có chắc chắn muốn xóa khoa này? Thao tác này không thể hoàn tác.</AlertDialogDescription>
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
