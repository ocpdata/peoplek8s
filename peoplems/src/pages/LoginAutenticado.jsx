import { createContext, useState } from "react";
import DashboardLayoutBasicWA from "../components/DashboardLayoutBasicWA";
import { useLocation } from "react-router";

export const AuthContext = createContext();

export function LoginAutenticado() {
  const [user, setUser] = useState({
    id: 0,
    email: "",
    name: "",
    permisos: [],
  });

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const displayName = params.get("displayName");
  const email = params.get("email");

  return (
    <div>
      <AuthContext value={{ user, setUser }}>
        {/*<h1>
          {displayName} {email}
        </h1>*/}
        <DashboardLayoutBasicWA />
        {/*<DashboardLayoutBasic displayName={displayName} email={email} />*/}
      </AuthContext>
    </div>
  );
}
