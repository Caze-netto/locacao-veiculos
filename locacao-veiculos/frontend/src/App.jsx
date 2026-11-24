import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import RotaPrivada from './components/RotaPrivada.jsx';
import Login from './pages/Login.jsx';
import Registro from './pages/Registro.jsx';
import Veiculos from './pages/Veiculos.jsx';
import Locacoes from './pages/Locacoes.jsx';

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route
            path="/veiculos"
            element={
              <RotaPrivada>
                <Veiculos />
              </RotaPrivada>
            }
          />
          <Route
            path="/locacoes"
            element={
              <RotaPrivada>
                <Locacoes />
              </RotaPrivada>
            }
          />
          <Route path="*" element={<Navigate to="/veiculos" replace />} />
        </Routes>
      </main>
    </>
  );
}
