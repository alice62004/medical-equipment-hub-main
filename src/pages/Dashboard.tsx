import { useState } from "react";
import { motion } from "framer-motion";
import { Package, ArrowDownToLine, ArrowUpFromLine, AlertTriangle, TrendingUp, Activity, BarChart3 } from "lucide-react";
import { thietBiStore, trangThaiStore, phieuNhapStore, phieuXuatStore, capPhatStore, getTenThietBi } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function Dashboard() {
  const thietBi = thietBiStore.getAll();
  const trangThai = trangThaiStore.getAll();
  const phieuNhap = phieuNhapStore.getAll();
  const phieuXuat = phieuXuatStore.getAll();
  const capPhat = capPhatStore.getAll();

  const totalTonKho = trangThai.reduce((s, t) => s + t.soLuongTonKho, 0);
  const totalDangDung = trangThai.reduce((s, t) => s + t.soLuongDangSuDung, 0);
  const totalHuHong = trangThai.reduce((s, t) => s + t.soLuongHuHong, 0);
  const tongNhap = phieuNhap.reduce((s, p) => s + p.thanhTien, 0);

  const stats = [
    { label: "Loại thiết bị", value: thietBi.length, icon: Package, color: "text-primary" },
    { label: "Tổng tồn kho", value: totalTonKho, icon: BarChart3, color: "text-success" },
    { label: "Đang sử dụng", value: totalDangDung, icon: Activity, color: "text-info" },
    { label: "Hư hỏng", value: totalHuHong, icon: AlertTriangle, color: "text-warning" },
    { label: "Phiếu nhập", value: phieuNhap.length, icon: ArrowDownToLine, color: "text-primary" },
    { label: "Phiếu xuất", value: phieuXuat.length, icon: ArrowUpFromLine, color: "text-destructive" },
  ];

  // Recent activity
  const recentNhap = [...phieuNhap].sort((a, b) => b.ngayNhap.localeCompare(a.ngayNhap)).slice(0, 5);
  const lowStock = trangThai.filter(t => t.soLuongTonKho <= 5);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Tổng quan</h1>
        <p className="page-description">Theo dõi tình hình vật tư thiết bị y tế</p>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {stats.map((s) => (
          <motion.div key={s.label} variants={item}>
            <div className="stat-card text-center">
              <s.icon className={`w-6 h-6 mx-auto mb-2 ${s.color}`} />
              <p className="text-2xl font-bold font-display">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        <motion.div variants={item} initial="hidden" animate="show">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <ArrowDownToLine className="w-4 h-4 text-primary" />
                Nhập kho gần đây
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentNhap.length === 0 ? (
                <p className="text-sm text-muted-foreground">Chưa có phiếu nhập</p>
              ) : (
                <div className="space-y-3">
                  {recentNhap.map((p) => (
                    <div key={p.maPhieuNhap} className="flex items-center justify-between text-sm border-b pb-2 last:border-0">
                      <div>
                        <p className="font-medium">{getTenThietBi(p.maThietBi)}</p>
                        <p className="text-xs text-muted-foreground">{p.maPhieuNhap} • {p.ngayNhap}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-primary">+{p.soLuong}</p>
                        <p className="text-xs text-muted-foreground">{p.thanhTien.toLocaleString("vi-VN")}đ</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item} initial="hidden" animate="show" transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-warning" />
                Cảnh báo tồn kho thấp
              </CardTitle>
            </CardHeader>
            <CardContent>
              {lowStock.length === 0 ? (
                <p className="text-sm text-muted-foreground">Tất cả thiết bị đều đủ tồn kho</p>
              ) : (
                <div className="space-y-3">
                  {lowStock.map((t) => (
                    <div key={t.id} className="flex items-center justify-between text-sm border-b pb-2 last:border-0">
                      <p className="font-medium">{getTenThietBi(t.maThietBi)}</p>
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-destructive/10 text-destructive">
                        Còn {t.soLuongTonKho}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
