import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type UserRole = "admin" | "nhanvien_kho" | "quanly";

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  approved: boolean;
  rejected: boolean;
}

const AUTH_KEY = "qlvt_auth";
const USERS_KEY = "qlvt_users";

const defaultUsers: User[] = [
  { id: "U001", email: "admin@hospital.vn", password: "admin123", name: "Quản trị viên", role: "admin", approved: true, rejected: false },
  { id: "U002", email: "kho@hospital.vn", password: "kho123", name: "Nhân viên kho", role: "nhanvien_kho", approved: true, rejected: false },
  { id: "U003", email: "quanly@hospital.vn", password: "quanly123", name: "Quản lý", role: "quanly", approved: true, rejected: false },
];

function getUsers(): User[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : defaultUsers;
  } catch { return defaultUsers; }
}

function saveUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function initUsers() {
  if (!localStorage.getItem(USERS_KEY)) saveUsers(defaultUsers);
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => { success: boolean; message: string };
  register: (email: string, password: string, name: string, role: UserRole) => { success: boolean; message: string };
  logout: () => void;
  updateProfile: (data: Partial<Pick<User, "name" | "email" | "password">>) => void;
  getAllUsers: () => User[];
  approveUser: (id: string) => void;
  rejectUser: (id: string) => void;
  getPendingUsers: () => User[];
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem(AUTH_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  });

  useEffect(() => {
    if (user) localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    else localStorage.removeItem(AUTH_KEY);
  }, [user]);

  const login = (email: string, password: string) => {
    const users = getUsers();
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) return { success: false, message: "Email hoặc mật khẩu không đúng" };
    if (found.rejected) return { success: false, message: "Tài khoản của bạn không được duyệt. Vui lòng liên hệ quản trị viên." };
    if (!found.approved) return { success: false, message: "Tài khoản đang chờ duyệt. Vui lòng chờ quản trị viên phê duyệt." };
    setUser(found);
    return { success: true, message: "" };
  };

  const register = (email: string, password: string, name: string, role: UserRole) => {
    const users = getUsers();
    if (users.find(u => u.email === email)) return { success: false, message: "Email đã tồn tại" };
    const newUser: User = {
      id: `U${String(users.length + 1).padStart(3, "0")}`,
      email, password, name, role,
      approved: false,
      rejected: false,
    };
    users.push(newUser);
    saveUsers(users);
    return { success: true, message: "Đăng ký thành công! Vui lòng chờ quản trị viên phê duyệt tài khoản." };
  };

  const logout = () => setUser(null);

  const updateProfile = (data: Partial<Pick<User, "name" | "email" | "password">>) => {
    if (!user) return;
    const users = getUsers();
    const idx = users.findIndex(u => u.id === user.id);
    if (idx >= 0) {
      users[idx] = { ...users[idx], ...data };
      saveUsers(users);
      setUser(users[idx]);
    }
  };

  const getAllUsers = () => getUsers();
  const getPendingUsers = () => getUsers().filter(u => !u.approved && !u.rejected);

  const approveUser = (id: string) => {
    const users = getUsers();
    const idx = users.findIndex(u => u.id === id);
    if (idx >= 0) { users[idx].approved = true; users[idx].rejected = false; saveUsers(users); }
  };

  const rejectUser = (id: string) => {
    const users = getUsers();
    const idx = users.findIndex(u => u.id === id);
    if (idx >= 0) { users[idx].rejected = true; users[idx].approved = false; saveUsers(users); }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, getAllUsers, approveUser, rejectUser, getPendingUsers }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function getRoleName(role: UserRole) {
  const map: Record<UserRole, string> = {
    admin: "Quản trị viên",
    nhanvien_kho: "Nhân viên kho",
    quanly: "Quản lý",
  };
  return map[role] ?? role;
}
