import { createContext, useState } from "react";
import DashboardLayoutBasic from "../components/DashboardLayoutBasic";

export const AuthContext = createContext();

export function Login() {
  const [user, setUser] = useState({
    id: 0,
    email: "",
    name: "",
    permisos: [],
  });
  return (
    <div>
      <AuthContext value={{ user, setUser }}>
        <DashboardLayoutBasic />
      </AuthContext>
    </div>
  );
}
