import { useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { nhaCungCapStore, genId } from "@/lib/store";
import type { NhaCungCap } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function NhaCungCapPage() {
  const [data, setData] = useState(nhaCungCapStore.getAll());
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<NhaCungCap | null>(null);
  const [form, setForm] = useState<Partial<NhaCungCap>>({});

  const reload = () => setData(nhaCungCapStore.getAll());
  const filtered = data.filter((n) => n.tenNCC.toLowerCase().includes(search.toLowerCase()) || n.maNCC.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => { setEditing(null); setForm({ maNCC: genId("NCC", data as any, "maNCC") }); setDialogOpen(true); };
  const openEdit = (item: NhaCungCap) => { setEditing(item); setForm({ ...item }); setDialogOpen(true); };

  const handleSave = () => {
    if (!form.maNCC || !form.tenNCC) { toast.error("Vui lòng nhập đầy đủ thông tin"); return; }
    const item: NhaCungCap = { maNCC: form.maNCC!, tenNCC: form.tenNCC!, soDienThoai: form.soDienThoai || "", email: form.email || "" };
    if (editing) { nhaCungCapStore.update((n) => n.maNCC === editing.maNCC, item); toast.success("Cập nhật NCC thành công"); }
    else { nhaCungCapStore.add(item); toast.success("Thêm NCC thành công"); }
    setDialogOpen(false); reload();
  };

  const handleDelete = () => {
    if (!deleteId) return;
    nhaCungCapStore.remove((n) => n.maNCC === deleteId);
    toast.success("Xóa NCC thành công"); setDeleteId(null); reload();
  };

  return (
    <div>
      <div className="page-header flex items-center justify-between flex-wrap gap-4">
        <div><h1 className="page-title">Nhà cung cấp</h1><p className="page-description">Quản lý thông tin nhà cung cấp</p></div>
        <Button onClick={openAdd}><Plus className="w-4 h-4 mr-2" />Thêm NCC</Button>
      </div>
      <div className="mb-4 relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Tìm kiếm..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>
      <div className="bg-card rounded-xl border overflow-hidden">
        <Table>
          <TableHeader><TableRow><TableHead>Mã</TableHead><TableHead>Tên NCC</TableHead><TableHead>SĐT</TableHead><TableHead>Email</TableHead><TableHead className="w-24">Thao tác</TableHead></TableRow></TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Không tìm thấy</TableCell></TableRow>
            ) : filtered.map((n) => (
              <TableRow key={n.maNCC}>
                <TableCell className="font-mono text-xs">{n.maNCC}</TableCell>
                <TableCell className="font-medium">{n.tenNCC}</TableCell>
                <TableCell>{n.soDienThoai}</TableCell>
                <TableCell>{n.email}</TableCell>
                <TableCell><div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(n)}><Pencil className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => setDeleteId(n.maNCC)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </div></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Chỉnh sửa NCC" : "Thêm NCC mới"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Mã NCC</Label><Input value={form.maNCC || ""} disabled={!!editing} onChange={(e) => setForm({ ...form, maNCC: e.target.value })} /></div>
            <div><Label>Tên NCC *</Label><Input value={form.tenNCC || ""} onChange={(e) => setForm({ ...form, tenNCC: e.target.value })} /></div>
            <div><Label>Số điện thoại</Label><Input value={form.soDienThoai || ""} onChange={(e) => setForm({ ...form, soDienThoai: e.target.value })} /></div>
            <div><Label>Email</Label><Input value={form.email || ""} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setDialogOpen(false)}>Hủy</Button><Button onClick={handleSave}>{editing ? "Cập nhật" : "Thêm"}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Xác nhận xóa</AlertDialogTitle><AlertDialogDescription>Bạn có chắc chắn muốn xóa nhà cung cấp này?</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Hủy</AlertDialogCancel><AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Xóa</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
