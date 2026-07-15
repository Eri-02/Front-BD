import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/login/login";
import Dashboard from "./pages/dashboard/DashboardCliente";
import DashboardSupervisor from "./pages/dashboard/DashboardSupervisor";
import DashboardPareja from "./pages/dashboard/DashboardPareja";

import MostrarPareja from "./pages/pareja/MostrarPareja";
import AgregarPareja from "./pages/pareja/AgregarPareja";
import EditarPareja from "./pages/pareja/EditarPareja";
import EliminarPareja from "./pages/pareja/EliminarPareja";


import VerParejasCliente from "./pages/cliente/VerParejasCliente";

import MostrarRestriccion from "./pages/restriccion/MostrarRestriccion";
import AgregarRestriccion from "./pages/restriccion/AgregarRestriccion";

import MostrarCompra from "./pages/compra/MostrarCompra";

import CompraPareja from "./pages/compra/CompraPareja";
import ProductosCompra from "./pages/producto/ProductoCompra";

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


        <Route path="/supervisor/cliente/:id/parejas" element={<VerParejasCliente />} />

        <Route path="/parejas/:idPareja/restricciones" element={<MostrarRestriccion/>} />
        <Route path="/parejas/:idPareja/restricciones/agregar" element={<AgregarRestriccion />} />
        
        <Route path="/supervisor/compra" element={<MostrarCompra />} />

         {/* Pareja */}
         <Route path="/dashboardPareja" element={<DashboardPareja />} />
         <Route path="/mis-compras" element={<CompraPareja />} />
         <Route path="/productos/pareja" element={<ProductosCompra />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;