import { createContext, useState } from "react";
import DashboardLayoutBasic from "../components/DashboardLayoutBasic";

export const AuthContext = createContext();

export function Login({ id = 0, email = "", displayName = "", permisos = [] }) {
  const [user, setUser] = useState({
    id,
    email,
    displayName,
    permisos,
  });
  console.log("Loginxxxx", user);
  return (
    <div>
      <AuthContext value={{ user, setUser }}>
        <DashboardLayoutBasic />
      </AuthContext>
    </div>
  );
}
