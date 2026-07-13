import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/login/login";
import Dashboard from "./pages/dashboard/DashboardCliente";
import DashboardSupervisor from "./pages/dashboard/DashboardSupervisor";

import MostrarPareja from "./pages/pareja/MostrarPareja";
import AgregarPareja from "./pages/pareja/AgregarPareja";
import EditarPareja from "./pages/pareja/EditarPareja";
import EliminarPareja from "./pages/pareja/EliminarPareja";

import Productos from "./pages/producto/MostrarProducto";
import AgregarProducto from "./pages/producto/AgregarProducto";
import EditarProducto from "./pages/producto/EditarProducto";
import EliminarProducto from "./pages/producto/EliminarProducto";
import MostrarClientes from "./pages/cliente/MostrarCliente";
import AgregarCliente from "./pages/cliente/AgregarCliente";
import EditarCliente from "./pages/cliente/EditarCliente";
import EliminarCliente from "./pages/cliente/EliminarCliente";
import VerParejasCliente from "./pages/cliente/VerParejasCliente";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* Cliente */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/parejas" element={<MostrarPareja />} />
        <Route path="/parejas/agregar" element={<AgregarPareja />} />
        <Route path="/parejas/editar/:id" element={<EditarPareja />} />
        <Route path="/parejas/eliminar/:id" element={<EliminarPareja />} />

        {/* Supervisor */}
        <Route path="/dashboardSupervisor" element={<DashboardSupervisor />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/productos/agregar" element={<AgregarProducto />} />
        <Route path="/productos/editar/:id" element={<EditarProducto />} />
        <Route path="/productos/eliminar/:id" element={<EliminarProducto />} />
        <Route path="/supervisor/cliente" element={<MostrarClientes />} />
        <Route path="/supervisor/cliente/agregar" element={<AgregarCliente />} />
        <Route path="/supervisor/cliente/editar/:id" element={<EditarCliente />} />
        <Route path="/supervisor/cliente/eliminar/:id" element={<EliminarCliente />} /> 
        <Route path="/supervisor/cliente/:id/parejas" element={<VerParejasCliente />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;