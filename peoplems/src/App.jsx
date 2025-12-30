import { BrowserRouter, Routes, Route } from "react-router";
import { Login } from "./pages/Login";
import { LoginAutenticado } from "./pages/LoginAutenticado";
import OAuthSignInPage from "./authentication/OAuthSignInPage";
import MagecartTest from "./testing/Magecart";
import "./App.css";

// Componente para manejar reportes CSP
const CSPReportHandler = () => {
  useEffect(() => {
    // Escuchar eventos de violación CSP
    document.addEventListener("securitypolicyviolation", (e) => {
      console.log("CSP Violation:", {
        directive: e.violatedDirective,
        blocked: e.blockedURI,
        source: e.sourceFile,
      });
    });
  }, []);

  return <div>CSP Report Handler</div>;
};

function App() {
  //const user = true;

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/*<Route index element={<LoginAutenticado />} />*/}

          <Route path="/login" element={<OAuthSignInPage />} />
          <Route path="/magecart" element={<MagecartTest />} />

          {/*<Route path="/report-csp" element={<CSPReportHandler />} />*/}

          <Route index element={<Login />} />

          {/* ------ Workaround hasta configurar la persistencia del balanceador ----- */}
          {/*<Route path="/autenticado" element={<LoginAutenticado />} />*/}

          {/*<Route path="/app" element={<People />} />*/}
          {/*<Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />*/}
          {/*<Route path="/login/success" element={<Success />} />*/}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
