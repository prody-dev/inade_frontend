import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import Login from "./components/Loginjs/Login";
import Home from "./App";
import Empresa from "./components/ServicioCliente/Empresasjs/Empresa";
import Cliente from "./components/ServicioCliente/Clientejs/Cliente";
import Servicio from "./components/ServicioCliente/Serviciosjs/Servicio";
import Cotizar from "./components/ServicioCliente/Cotizacionesjs/Cotizar";
import GenerarOrden from "./components/ServicioCliente/OrdenTabajojs/OrdenTrabajo";
import Usuario from "./components/ServicioCliente/Userjs/Usuario";
import ConfiguracionOrganizacion from "./components/ServicioCliente/Configuracion/ConfiguracionOrganizacion";
import Factura from "./components/ServicioCliente/Facturacionjs/Factura";
import Layout from "./components/Layoutsjs/Layout";
//import CrearCotizacion from "./components/ServicioCliente/Cotizacionesjs/CrearCotizacion";
import DetallesCotizacion from "./components/ServicioCliente/Cotizacionesjs/DetallesCotiza";
import DetallesOrden from "./components/ServicioCliente/OrdenTabajojs/DetallesOrdenTrabajo";
import Proyectos from "./components/ServicioCliente/OrdenTabajojs/ProyectosOrdenTrabajando";
import DetalleOrdenTrabajo from "./components/ServicioCliente/OrdenTabajojs/DetallesOrdenTrabajo";
import DetallesFactura from "./components/ServicioCliente/Facturacionjs/DetallesFactura";
import CotizacionEstadistica from "./components/ServicioCliente/Estadisticas/CotizacionEstadisticas";
import GenerarOrdenTrabajo from "./components/ServicioCliente/OrdenTabajojs/GenerarOrdenTrabajo";
import EditarCliente from "./components/ServicioCliente/Clientejs/EditarCliente";
import EditarServicio from "./components/ServicioCliente/Serviciosjs/EditarServicio";
import EditarUsuario from "./components/ServicioCliente/Userjs/EditarUsuario";
import CrearFactura from "./components/ServicioCliente/Facturacionjs/CrearFactura";
import CargarCSD from "./components/ServicioCliente/CargaCertificadosDijitales/CargarCSD";
import HomeAdmin from "./components/ServicioCliente/VentanasAdmin/AdminHome";
import RegistroUsuarios from "./components/ServicioCliente/RegistroUsuario/RegistroUsuarios";
import ProtectedRoute from "./components/ServicioCliente/ProtectedRoute"; // Importa el componente de Ruta Protegida
import PreCotizacion from "./components/ServicioCliente/preCotizacion/PreCotizacion";
import CrearPreCotizacion from "./components/ServicioCliente/preCotizacion/CrearpreCotizacion";
import PreCotizacionDetalles from "./components/ServicioCliente/preCotizacion/preCotizacionDetalles";
import EditarCotizacion from "./components/ServicioCliente/Cotizacionesjs/EditarCotizacion";
import Pagos from "./components/ServicioCliente/Pagosjs/Pagos";
import CrearPagos from "./components/ServicioCliente/Pagosjs/CrearPagos";
import EditarOrdenTrabajo from "./components/ServicioCliente/OrdenTabajojs/EditarOrdenTrabajo";
import EditarPreCotizacion from "./components/ServicioCliente/preCotizacion/EditarPreCotizacion";
import VerificarExpiracionLocalStorage from "./components/DataLocalStorage/LocalStorage";
import NoAutorizado from "./components/FetchProtected/NoAutorizado";
import RegistroCotizacion from "./components/ServicioCliente/Cotizacionesjs/RegistroCotizaciones/RegistroCotizacion";

// Hook para cambiar el título de la pestaña
const usePageTitle = () => {
  const location = useLocation();

  useEffect(() => {
    const { pathname } = location;
    let pageTitle = "Simplaxi"; // Título por defecto

    switch (pathname) {
      case "/home":
        pageTitle = "Inicio | Simplaxi";
        break;
      case "/empresa":
        pageTitle = "Empresas | Simplaxi";
        break;
      case "/cliente":
        pageTitle = "Clientes | Simplaxi";
        break;
      case "/servicio":
        pageTitle = "Servicios | Simplaxi";
        break;
      case "/cotizar":
        pageTitle = "Cotizar | Simplaxi";
        break;
      case "/usuario":
        pageTitle = "Usuarios | Simplaxi";
        break;
      case "/configuracionorganizacion":
        pageTitle = "Configuración | Simplaxi";
        break;
      // Agrega más rutas según sea necesario
      default:
        pageTitle = "Simplaxi";
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
      <VerificarExpiracionLocalStorage/>
      <Routes>
        {/* Ruta para el login sin el Layout */}
        <Route path="/" element={<Login />} />
        <Route path="/RegistroUsuarios" element={<RegistroUsuarios />} />
        <Route path="*" element={<NoAutorizado />} />
        <Route path="/no-autorizado" element={<NoAutorizado />} />
        {/* Rutas envueltas con Layout */}
        <Route path="/" element={
            <PageWrapper>
              <Layout />
            </PageWrapper>
          }
        >
          <Route path="/Homeadmin" element={<ProtectedRoute allowedRoles={['Administrador']}><HomeAdmin /></ProtectedRoute>} />
          <Route path="/RegistroCotizacion/:clienteIds" element={<ProtectedRoute allowedRoles={['UsuarioOrganizacion', 'Administradororganizacion']}><RegistroCotizacion /></ProtectedRoute>} />
          <Route path="/home" element={<ProtectedRoute allowedRoles={['UsuarioOrganizacion', 'Administradororganizacion']}><Home /></ProtectedRoute>} />
          <Route path="/empresa" element={<ProtectedRoute allowedRoles={['UsuarioOrganizacion', 'Administradororganizacion']}><Empresa /></ProtectedRoute>} />
          <Route path="/cliente" element={<ProtectedRoute allowedRoles={['UsuarioOrganizacion', 'Administradororganizacion']}><Cliente /></ProtectedRoute>} />
          <Route path="/servicio" element={<ProtectedRoute allowedRoles={['UsuarioOrganizacion', 'Administradororganizacion']}><Servicio /></ProtectedRoute>} />
          <Route path="/cotizar" element={<ProtectedRoute allowedRoles={['UsuarioOrganizacion', 'Administradororganizacion']}><Cotizar /></ProtectedRoute>} />
          <Route path="/generar_orden" element={<ProtectedRoute allowedRoles={['UsuarioOrganizacion', 'Administradororganizacion']}><GenerarOrden /></ProtectedRoute>} />
          <Route path="/usuario" element={<ProtectedRoute allowedRoles={['Administradororganizacion']}><Usuario /></ProtectedRoute>} />
          <Route path="/configuracionorganizacion" element={<ProtectedRoute allowedRoles={['UsuarioOrganizacion', 'Administradororganizacion']}><ConfiguracionOrganizacion /></ProtectedRoute>} />
          <Route path="/factura" element={<ProtectedRoute allowedRoles={['UsuarioOrganizacion', 'Administradororganizacion']}><Factura /></ProtectedRoute>} />
          <Route path="/detalles_cotizaciones/:ids" element={<ProtectedRoute allowedRoles={['UsuarioOrganizacion', 'Administradororganizacion']}><DetallesCotizacion /></ProtectedRoute>} />
          <Route path="/detalles_orden" element={<ProtectedRoute allowedRoles={['UsuarioOrganizacion', 'Administradororganizacion']}><DetallesOrden /></ProtectedRoute>} />
          <Route path="/DetalleOrdenTrabajo/:orderIds" element={<ProtectedRoute allowedRoles={['UsuarioOrganizacion', 'Administradororganizacion']}><DetalleOrdenTrabajo /></ProtectedRoute>} />
          <Route path="/detallesfactura/:ids" element={<ProtectedRoute allowedRoles={['UsuarioOrganizacion', 'Administradororganizacion']}><DetallesFactura /></ProtectedRoute>} />
          <Route path="/proyectos" element={<ProtectedRoute allowedRoles={['UsuarioOrganizacion', 'Administradororganizacion']}><Proyectos /></ProtectedRoute>} />
          <Route path="/CotizacionEstadisticas" element={<ProtectedRoute allowedRoles={['UsuarioOrganizacion', 'Administradororganizacion']}><CotizacionEstadistica /></ProtectedRoute>} />
          <Route path="/GenerarOrdenTrabajo/:ids" element={<ProtectedRoute allowedRoles={['UsuarioOrganizacion', 'Administradororganizacion']}><GenerarOrdenTrabajo /></ProtectedRoute>} />
          <Route path="/editarOrdenTrabajo/:ids" element={<ProtectedRoute allowedRoles={['UsuarioOrganizacion', 'Administradororganizacion']}><EditarOrdenTrabajo/></ProtectedRoute>} />
          <Route path="/EditarCliente/:clienteIds" element={<ProtectedRoute allowedRoles={['UsuarioOrganizacion', 'Administradororganizacion']}><EditarCliente /></ProtectedRoute>} />
          <Route path="/EditarServicio" element={<ProtectedRoute allowedRoles={['UsuarioOrganizacion', 'Administradororganizacion']}><EditarServicio /></ProtectedRoute>} />
          <Route path="/EditarUsuario/:id" element={<ProtectedRoute allowedRoles={['UsuarioOrganizacion', 'Administradororganizacion']}><EditarUsuario /></ProtectedRoute>} />
          <Route path="/EditarCotizacion/:ids" element={<ProtectedRoute allowedRoles={['UsuarioOrganizacion', 'Administradororganizacion']}><EditarCotizacion/></ProtectedRoute>} />
          <Route path="/EditarPreCotizacion/:ids" element={<ProtectedRoute allowedRoles={['UsuarioOrganizacion', 'Administradororganizacion']}><EditarPreCotizacion/></ProtectedRoute>} /> 
          <Route path="/CrearFactura/:ids" element={<ProtectedRoute allowedRoles={['UsuarioOrganizacion', 'Administradororganizacion']}><CrearFactura /></ProtectedRoute>} />
          <Route path="/CargaCSD" element={<ProtectedRoute allowedRoles={['UsuarioOrganizacion', 'Administradororganizacion']}><CargarCSD /></ProtectedRoute>} />
          <Route path="/CrearPreCotizacion" element={<ProtectedRoute allowedRoles={['UsuarioOrganizacion', 'Administradororganizacion']}><CrearPreCotizacion /></ProtectedRoute>} />
          <Route path="/PreCotizacion" element={<ProtectedRoute allowedRoles={['UsuarioOrganizacion', 'Administradororganizacion']}><PreCotizacion/></ProtectedRoute>} />
          <Route path="/PreCotizacionDetalles/:ids" element={<ProtectedRoute allowedRoles={['UsuarioOrganizacion', 'Administradororganizacion']}><PreCotizacionDetalles/></ProtectedRoute>} />
          <Route path="/Pagos" element={<ProtectedRoute allowedRoles={['UsuarioOrganizacion', 'Administradororganizacion']}><Pagos/></ProtectedRoute>} />
          <Route path="/CrearPagos" element={<ProtectedRoute allowedRoles={['UsuarioOrganizacion', 'Administradororganizacion']}><CrearPagos/></ProtectedRoute>} />
          <Route path="/CrearPagos/:ids" element={<ProtectedRoute allowedRoles={['UsuarioOrganizacion', 'Administradororganizacion']}><CrearPagos/></ProtectedRoute>} />
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