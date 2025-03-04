import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import Login from "./components/Loginjs/Login";
import Home from "./App";
import Empresa from "./components/Empresasjs/Empresa";
import Cliente from "./components/Clientejs/Cliente";
import Servicio from "./components/Serviciosjs/Servicio";
import Cotizar from "./components/Cotizacionesjs/Cotizar";
import GenerarOrden from "./components/OrdenTabajojs/OrdenTrabajo";
import Usuario from "./components/Userjs/Usuario";
import ConfiguracionOrganizacion from "./components/Configuracion/ConfiguracionOrganizacion";
import Factura from "./components/Facturacionjs/Factura";
import Layout from "./components/Layout";
import CrearCotizacion from "./components/Cotizacionesjs/CrearCotizacion";
import DetallesCotizacion from "./components/Cotizacionesjs/DetallesCotiza";
import DetallesOrden from "./components/OrdenTabajojs/DetallesOrdenTrabajo";
import Proyectos from "./components/OrdenTabajojs/ProyectosOrdenTrabajando";
import DetalleOrdenTrabajo from "./components/OrdenTabajojs/DetallesOrdenTrabajo";
import DetallesFactura from "./components/Facturacionjs/DetallesFactura";
import CotizacionEstadistica from "./components/Estadisticas/CotizacionEstadisticas";
import GenerarOrdenTrabajo from "./components/OrdenTabajojs/GenerarOrdenTrabajo";
import EditarCliente from "./components/Clientejs/EditarCliente";
import EditarServicio from "./components/Serviciosjs/EditarServicio";
import EditarUsuario from "./components/Userjs/EditarUsuario";
import CrearFactura from "./components/Facturacionjs/CrearFactura";
import CargarCSD from "./components/CargaCertificadosDijitales/CargarCSD";
import HomeAdmin from "./components/VentanasAdmin/AdminHome";
import RegistroUsuarios from "./components/RegistroUsuario/RegistroUsuarios";
import ProtectedRoute from "./components/ProtectedRoute"; // Importa el componente de Ruta Protegida
import PreCotizacion from "./components/preCotizacion/PreCotizacion";
import CrearPreCotizacion from "./components/preCotizacion/CrearpreCotizacion";
import PreCotizacionDetalles from "./components/preCotizacion/preCotizacionDetalles";
import EditarCotizacion from "./components/Cotizacionesjs/EditarCotizacion";
import Pagos from "./components/Pagosjs/Pagos";
import CrearPagos from "./components/Pagosjs/CrearPagos";

// Hook para cambiar el título de la pestaña
const usePageTitle = () => {
  const location = useLocation();

  useEffect(() => {
    const { pathname } = location;
    let pageTitle = "INADE"; // Título por defecto

    switch (pathname) {
      case "/home":
        pageTitle = "Inicio | INADE";
        break;
      case "/empresa":
        pageTitle = "Empresas | INADE";
        break;
      case "/cliente":
        pageTitle = "Clientes | INADE";
        break;
      case "/servicio":
        pageTitle = "Servicios | INADE";
        break;
      case "/cotizar":
        pageTitle = "Cotizar | INADE";
        break;
      case "/usuario":
        pageTitle = "Usuarios | INADE";
        break;
      case "/configuracionorganizacion":
        pageTitle = "Configuración | INADE";
        break;
      // Agrega más rutas según sea necesario
      default:
        pageTitle = "INADE";
    }

    document.title = pageTitle; // Cambia el título
  }, [location]);
};

// Componente con lógica para cambiar el título
const PageWrapper = ({ children }) => {
  usePageTitle(); // Llama al hook para actualizar el título dinámicamente
  return children;
};

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Ruta para el login sin el Layout */}
        <Route path="/" element={<Login />} />
        <Route path="/RegistroUsuarios" element={<RegistroUsuarios />} />
        
        {/* Rutas envueltas con Layout */}
        <Route path="/" element={
            <PageWrapper>
              <Layout />
            </PageWrapper>
          }
        >
          <Route path="/Homeadmin" element={<ProtectedRoute allowedRoles={['Administrador']}><HomeAdmin /></ProtectedRoute>} />
          <Route path="/home" element={<ProtectedRoute allowedRoles={['UsuarioOrganizacion', 'Administradororganizacion']}><Home /></ProtectedRoute>} />
          <Route path="/empresa" element={<ProtectedRoute allowedRoles={['UsuarioOrganizacion', 'Administradororganizacion']}><Empresa /></ProtectedRoute>} />
          <Route path="/cliente" element={<ProtectedRoute allowedRoles={['UsuarioOrganizacion', 'Administradororganizacion']}><Cliente /></ProtectedRoute>} />
          <Route path="/servicio" element={<ProtectedRoute allowedRoles={['UsuarioOrganizacion', 'Administradororganizacion']}><Servicio /></ProtectedRoute>} />
          <Route path="/cotizar" element={<ProtectedRoute allowedRoles={['UsuarioOrganizacion', 'Administradororganizacion']}><Cotizar /></ProtectedRoute>} />
          <Route path="/generar_orden" element={<ProtectedRoute allowedRoles={['UsuarioOrganizacion', 'Administradororganizacion']}><GenerarOrden /></ProtectedRoute>} />
          <Route path="/usuario" element={<ProtectedRoute allowedRoles={['Administradororganizacion']}><Usuario /></ProtectedRoute>} />
          <Route path="/configuracionorganizacion" element={<ProtectedRoute allowedRoles={['UsuarioOrganizacion', 'Administradororganizacion']}><ConfiguracionOrganizacion /></ProtectedRoute>} />
          <Route path="/factura" element={<ProtectedRoute allowedRoles={['UsuarioOrganizacion', 'Administradororganizacion']}><Factura /></ProtectedRoute>} />
          <Route path="/crear_cotizacion/:clienteId" element={<ProtectedRoute allowedRoles={['UsuarioOrganizacion', 'Administradororganizacion']}><CrearCotizacion /></ProtectedRoute>} />
          <Route path="/detalles_cotizaciones/:id" element={<ProtectedRoute allowedRoles={['UsuarioOrganizacion', 'Administradororganizacion']}><DetallesCotizacion /></ProtectedRoute>} />
          <Route path="/detalles_orden" element={<ProtectedRoute allowedRoles={['UsuarioOrganizacion', 'Administradororganizacion']}><DetallesOrden /></ProtectedRoute>} />
          <Route path="/proyectos" element={<ProtectedRoute allowedRoles={['UsuarioOrganizacion', 'Administradororganizacion']}><Proyectos /></ProtectedRoute>} />
          <Route path="/DetalleOrdenTrabajo/:orderId" element={<ProtectedRoute allowedRoles={['UsuarioOrganizacion', 'Administradororganizacion']}><DetalleOrdenTrabajo /></ProtectedRoute>} />
          <Route path="/detallesfactura/:id" element={<ProtectedRoute allowedRoles={['UsuarioOrganizacion', 'Administradororganizacion']}><DetallesFactura /></ProtectedRoute>} />
          <Route path="/CotizacionEstadisticas" element={<ProtectedRoute allowedRoles={['UsuarioOrganizacion', 'Administradororganizacion']}><CotizacionEstadistica /></ProtectedRoute>} />
          <Route path="/GenerarOrdenTrabajo/:id" element={<ProtectedRoute allowedRoles={['UsuarioOrganizacion', 'Administradororganizacion']}><GenerarOrdenTrabajo /></ProtectedRoute>} />
          <Route path="/EditarCliente/:clienteId" element={<ProtectedRoute allowedRoles={['UsuarioOrganizacion', 'Administradororganizacion']}><EditarCliente /></ProtectedRoute>} />
          <Route path="/EditarServicio" element={<ProtectedRoute allowedRoles={['UsuarioOrganizacion', 'Administradororganizacion']}><EditarServicio /></ProtectedRoute>} />
          <Route path="/EditarUsuario/:id" element={<ProtectedRoute allowedRoles={['UsuarioOrganizacion', 'Administradororganizacion']}><EditarUsuario /></ProtectedRoute>} />
          <Route path="/CrearFactura/:id" element={<ProtectedRoute allowedRoles={['UsuarioOrganizacion', 'Administradororganizacion']}><CrearFactura /></ProtectedRoute>} />
          <Route path="/CargaCSD" element={<ProtectedRoute allowedRoles={['UsuarioOrganizacion', 'Administradororganizacion']}><CargarCSD /></ProtectedRoute>} />
          <Route path="/CrearPreCotizacion" element={<ProtectedRoute allowedRoles={['UsuarioOrganizacion', 'Administradororganizacion']}><CrearPreCotizacion /></ProtectedRoute>} />
          <Route path="/PreCotizacion" element={<ProtectedRoute allowedRoles={['UsuarioOrganizacion', 'Administradororganizacion']}><PreCotizacion/></ProtectedRoute>} />
          <Route path="/PreCotizacionDetalles/:id" element={<ProtectedRoute allowedRoles={['UsuarioOrganizacion', 'Administradororganizacion']}><PreCotizacionDetalles/></ProtectedRoute>} />
          <Route path="/EditarCotizacion/:id" element={<ProtectedRoute allowedRoles={['UsuarioOrganizacion', 'Administradororganizacion']}><EditarCotizacion/></ProtectedRoute>} />
          <Route path="/Pagos" element={<ProtectedRoute allowedRoles={['UsuarioOrganizacion', 'Administradororganizacion']}><Pagos/></ProtectedRoute>} />
          <Route path="/CrearPagos" element={<ProtectedRoute allowedRoles={['UsuarioOrganizacion', 'Administradororganizacion']}><CrearPagos/></ProtectedRoute>} />
          <Route path="/CrearPagos/:id" element={<ProtectedRoute allowedRoles={['UsuarioOrganizacion', 'Administradororganizacion']}><CrearPagos/></ProtectedRoute>} />
        </Route>
      </Routes>
    </Router>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
);

reportWebVitals();