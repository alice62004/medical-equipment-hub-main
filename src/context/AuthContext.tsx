// context/AuthContext.tsx
// Di chuyển từ src/lib/auth.tsx
export type { UserRole, User } from "../lib/auth";
export { AuthProvider, useAuth, initUsers, getRoleName } from "../lib/auth";
