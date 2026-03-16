import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { AuthProvider, useAuth, initUsers } from "@/lib/auth";
import { initStore } from "@/lib/store";
import Dashboard from "./pages/Dashboard";
import ThietBiPage from "./pages/ThietBiPage";
import NhapKhoPage from "./pages/NhapKhoPage";
import XuatKhoPage from "./pages/XuatKhoPage";
import CapPhatPage from "./pages/CapPhatPage";
import NhaCungCapPage from "./pages/NhaCungCapPage";
import TonKhoPage from "./pages/TonKhoPage";
import KhoaPage from "./pages/KhoaPage";
import ThongKePage from "./pages/ThongKePage";
import PhanQuyenPage from "./pages/PhanQuyenPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFound from "./pages/NotFound";

initStore();
initUsers();

const queryClient = new QueryClient();

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { user } = useAuth();

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/thiet-bi" element={<ThietBiPage />} />
        <Route path="/nhap-kho" element={<NhapKhoPage />} />
        <Route path="/xuat-kho" element={<XuatKhoPage />} />
        <Route path="/cap-phat" element={<CapPhatPage />} />
        <Route path="/nha-cung-cap" element={<NhaCungCapPage />} />
        <Route path="/khoa" element={<KhoaPage />} />
        <Route path="/ton-kho" element={<TonKhoPage />} />
        <Route path="/thong-ke" element={<ProtectedRoute allowedRoles={["admin", "quanly"]}><ThongKePage /></ProtectedRoute>} />
        <Route path="/phan-quyen" element={<ProtectedRoute allowedRoles={["admin"]}><PhanQuyenPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="/register" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppLayout>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
