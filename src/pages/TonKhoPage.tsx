import { useState } from "react";
import { Search } from "lucide-react";
import { trangThaiStore, getTenThietBi } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

export default function TonKhoPage() {
  const [search, setSearch] = useState("");
  const data = trangThaiStore.getAll();

  const filtered = data.filter((t) =>
    getTenThietBi(t.maThietBi).toLowerCase().includes(search.toLowerCase()) ||
    t.maThietBi.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Tồn kho</h1>
        <p className="page-description">Theo dõi số lượng thiết bị theo từng trạng thái</p>
      </div>

      <div className="mb-4 relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Tìm kiếm..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="bg-card rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã TB</TableHead>
              <TableHead>Tên thiết bị</TableHead>
              <TableHead className="text-right">Tồn kho</TableHead>
              <TableHead className="text-right">Đang dùng</TableHead>
              <TableHead className="text-right">Hư hỏng</TableHead>
              <TableHead className="text-right">Thanh lý</TableHead>
              <TableHead className="text-right">Tổng</TableHead>
              <TableHead className="w-32">Phân bổ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-8">Không có dữ liệu</TableCell></TableRow>
            ) : filtered.map((t) => {
              const total = t.soLuongTonKho + t.soLuongDangSuDung + t.soLuongHuHong + t.soLuongThanhLy;
              const pct = total > 0 ? (t.soLuongTonKho / total) * 100 : 0;
              return (
                <TableRow key={t.id}>
                  <TableCell className="font-mono text-xs">{t.maThietBi}</TableCell>
                  <TableCell className="font-medium">{getTenThietBi(t.maThietBi)}</TableCell>
                  <TableCell className="text-right font-semibold text-success">{t.soLuongTonKho}</TableCell>
                  <TableCell className="text-right text-info">{t.soLuongDangSuDung}</TableCell>
                  <TableCell className="text-right text-warning">{t.soLuongHuHong}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{t.soLuongThanhLy}</TableCell>
                  <TableCell className="text-right font-bold">{total}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={pct} className="h-2 flex-1" />
                      <span className="text-xs text-muted-foreground w-10 text-right">{Math.round(pct)}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
