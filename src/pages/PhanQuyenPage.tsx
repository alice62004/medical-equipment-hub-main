import { useState } from "react";
import { useAuth, getRoleName, User } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, Clock, CheckCircle, XCircle, Users } from "lucide-react";
import { toast } from "sonner";

export default function PhanQuyenPage() {
  const { getAllUsers, approveUser, rejectUser, getPendingUsers } = useAuth();
  const [refresh, setRefresh] = useState(0);

  const allUsers = getAllUsers();
  const pendingUsers = getPendingUsers();
  const approvedUsers = allUsers.filter(u => u.approved);

  const handleApprove = (id: string) => {
    approveUser(id);
    toast.success("Đã duyệt tài khoản!");
    setRefresh(r => r + 1);
  };

  const handleReject = (id: string) => {
    rejectUser(id);
    toast.error("Đã từ chối tài khoản!");
    setRefresh(r => r + 1);
  };

  const roleBadgeColor = (role: string) => {
    if (role === "admin") return "destructive";
    if (role === "quanly") return "default";
    return "secondary";
  };

  const UserTable = ({ users, showActions }: { users: User[]; showActions?: boolean }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Họ tên</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Vai trò</TableHead>
          <TableHead>Trạng thái</TableHead>
          {showActions && <TableHead className="text-right">Hành động</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.length === 0 ? (
          <TableRow><TableCell colSpan={showActions ? 6 : 5} className="text-center text-muted-foreground py-8">Không có dữ liệu</TableCell></TableRow>
        ) : users.map(u => (
          <TableRow key={u.id}>
            <TableCell className="font-mono text-xs">{u.id}</TableCell>
            <TableCell className="font-medium">{u.name}</TableCell>
            <TableCell>{u.email}</TableCell>
            <TableCell><Badge variant={roleBadgeColor(u.role) as any}>{getRoleName(u.role)}</Badge></TableCell>
            <TableCell>
              {u.approved ? (
                <Badge variant="outline" className="text-success border-success/30 bg-success/10">Đã duyệt</Badge>
              ) : u.rejected ? (
                <Badge variant="outline" className="text-destructive border-destructive/30 bg-destructive/10">Từ chối</Badge>
              ) : (
                <Badge variant="outline" className="text-warning border-warning/30 bg-warning/10">Chờ duyệt</Badge>
              )}
            </TableCell>
            {showActions && (
              <TableCell className="text-right space-x-2">
                <Button size="sm" variant="outline" className="text-success border-success/30" onClick={() => handleApprove(u.id)}>
                  <CheckCircle className="w-4 h-4 mr-1" /> Duyệt
                </Button>
                <Button size="sm" variant="outline" className="text-destructive border-destructive/30" onClick={() => handleReject(u.id)}>
                  <XCircle className="w-4 h-4 mr-1" /> Từ chối
                </Button>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Phân quyền & Quản lý tài khoản</h1>
        <p className="page-description">Quản lý người dùng và phê duyệt tài khoản mới</p>
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending" className="gap-1.5">
            <Clock className="w-4 h-4" /> Chờ duyệt
            {pendingUsers.length > 0 && (
              <Badge variant="destructive" className="ml-1 h-5 min-w-5 text-[10px]">{pendingUsers.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="all" className="gap-1.5">
            <Users className="w-4 h-4" /> Tất cả tài khoản
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Shield className="w-4 h-4 text-warning" /> Đơn đăng ký chờ duyệt</CardTitle></CardHeader>
            <CardContent><UserTable users={pendingUsers} showActions /></CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all">
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Users className="w-4 h-4 text-primary" /> Danh sách tài khoản</CardTitle></CardHeader>
            <CardContent><UserTable users={allUsers} /></CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
