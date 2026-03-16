import { useState } from "react";
import { useAuth, getRoleName } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { User, Save } from "lucide-react";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  if (!user) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password && password.length < 6) { toast.error("Mật khẩu phải có ít nhất 6 ký tự"); return; }
    if (password && password !== confirmPassword) { toast.error("Mật khẩu xác nhận không khớp"); return; }
    const updates: any = { name, email };
    if (password) updates.password = password;
    updateProfile(updates);
    setPassword("");
    setConfirmPassword("");
    toast.success("Cập nhật thông tin thành công!");
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Trang cá nhân</h1>
        <p className="page-description">Quản lý thông tin tài khoản của bạn</p>
      </div>
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <User className="w-5 h-5 text-primary" />
            Thông tin cá nhân
            <Badge variant="secondary" className="ml-auto">{getRoleName(user.role)}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Họ tên</Label>
              <Input value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Mật khẩu mới (để trống nếu không đổi)</Label>
              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            <div className="space-y-2">
              <Label>Xác nhận mật khẩu mới</Label>
              <Input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" />
            </div>
            <Button type="submit" className="gap-2">
              <Save className="w-4 h-4" /> Lưu thay đổi
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
