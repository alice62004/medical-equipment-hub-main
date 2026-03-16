import { useState } from "react";
import { useAuth, UserRole } from "@/lib/auth";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, UserPlus, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function RegisterPage() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("nhanvien_kho");
  const [registered, setRegistered] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { toast.error("Mật khẩu phải có ít nhất 6 ký tự"); return; }
    const result = register(email, password, name, role);
    if (result.success) {
      setRegistered(true);
    } else {
      toast.error(result.message);
    }
  };

  if (registered) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-8 pb-8 space-y-4">
            <CheckCircle className="w-16 h-16 text-success mx-auto" />
            <h2 className="text-xl font-bold font-display">Đăng ký thành công!</h2>
            <p className="text-muted-foreground text-sm">
              Tài khoản của bạn đang chờ quản trị viên phê duyệt. Bạn sẽ có thể đăng nhập sau khi được duyệt.
            </p>
            <Link to="/login">
              <Button variant="outline" className="mt-4">Quay lại đăng nhập</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto">
            <Activity className="w-7 h-7 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-display">Đăng ký tài khoản</CardTitle>
          <p className="text-sm text-muted-foreground">Tạo tài khoản mới trên hệ thống MedEquip</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Họ tên</Label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="Nguyễn Văn A" required />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@hospital.vn" required />
            </div>
            <div className="space-y-2">
              <Label>Mật khẩu</Label>
              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Ít nhất 6 ký tự" required />
            </div>
            <div className="space-y-2">
              <Label>Vai trò</Label>
              <Select value={role} onValueChange={v => setRole(v as UserRole)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Quản trị viên</SelectItem>
                  <SelectItem value="quanly">Quản lý</SelectItem>
                  <SelectItem value="nhanvien_kho">Nhân viên kho</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full gap-2">
              <UserPlus className="w-4 h-4" /> Đăng ký
            </Button>
          </form>
          <p className="text-sm text-center text-muted-foreground mt-4">
            Đã có tài khoản?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">Đăng nhập</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
