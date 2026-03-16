import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Activity, LogIn } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = login(email, password);
    if (!result.success) {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto">
            <Activity className="w-7 h-7 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-display">MedEquip</CardTitle>
          <p className="text-sm text-muted-foreground">Đăng nhập hệ thống quản lý vật tư y tế</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@hospital.vn" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>
            <Button type="submit" className="w-full gap-2">
              <LogIn className="w-4 h-4" /> Đăng nhập
            </Button>
          </form>
          <p className="text-sm text-center text-muted-foreground mt-4">
            Chưa có tài khoản?{" "}
            <Link to="/register" className="text-primary font-medium hover:underline">Đăng ký</Link>
          </p>
          <div className="mt-6 p-3 rounded-lg bg-muted text-xs text-muted-foreground space-y-1">
            <p className="font-semibold">Tài khoản demo:</p>
            <p>Admin: admin@hospital.vn / admin123</p>
            <p>Kho: kho@hospital.vn / kho123</p>
            <p>Quản lý: quanly@hospital.vn / quanly123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
