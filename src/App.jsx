import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/login/login";
import Dashboard from "./pages/dashboard/DashboardCliente";

import MostrarPareja from "./pages/pareja/MostrarPareja";
import AgregarPareja from "./pages/pareja/AgregarPareja";
import EditarPareja from "./pages/pareja/EditarPareja";
import EliminarPareja from "./pages/pareja/EliminarPareja";

function App() {
  return (
    <BrowserRouter>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/parejas" element={<MostrarPareja />} />
        <Route path="/parejas/agregar" element={<AgregarPareja />} />
        <Route path="/parejas/editar/:id" element={<EditarPareja />} />
        <Route path="/parejas/eliminar/:id" element={<EliminarPareja />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;