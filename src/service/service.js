import axios from "axios";

// Url base
const API_BASE_URL = "http://localhost:8080";

const authService = {
    //Endpoint para el registro del cliente
    registrarCliente: async (datos) => {
        const payload = {
            primerNombre: datos.primerNombre,
            segundoNombre: datos.segundoNombre,
            primerApellido: datos.primerApellido,
            segundoApellido: datos.segundoApellido,
            nombreUsuario: datos.nombreUsuario,
            contraseniaUsuario: datos.contraseniaUsuario,
            correoElectronico: datos.correoElectronico,
            cupoTotal: parseFloat(datos.cupoTotal) || 0
        };

        const response = await axios.post(`${API_BASE_URL}/Cliente/CrearCliente`, payload);
        return response.data;
    },

    //Endpoint para el registro del spervisor
    registrarSupervisor: async (datos) => {
        const payload = {
            primerNombre: datos.primerNombre,
            segundoNombre: datos.segundoNombre,
            primerApellido: datos.primerApellido,
            segundoApellido: datos.segundoApellido,
            nombreUsuario: datos.nombreUsuario,
            contraseniaUsuario: datos.contraseniaUsuario,
            correoElectronico: datos.correoElectronico,
            idAlmacen: parseInt(datos.idAlmacen) || null
        };

        const response = await axios.post(`${API_BASE_URL}/Supervisor/CrearSupervisor`, payload);
        return response.data;
    },


//Endpoint para traer los almacenes
    obtenerAlmacenes: async () => {
        const response = await axios.get(`${API_BASE_URL}/Almacen/ObtenerAlmacenes`);
        return response.data;
    },
    //Endpoint para autenticar las credenciales del cliente
    autenticarCliente: async (username, password) => {
        const response = await axios.post(`${API_BASE_URL}/Cliente/Autenticar`, {
            username: username,
            password: password
        });
        return response.data;
    },

    // Endpoint para autenticar las credenciales del supervisor
    autenticarSupervisor: async (username, password) => {
        const response = await axios.post(`${API_BASE_URL}/Supervisor/Autenticar`, {
            username: username,
            password: password
        });
        return response.data;
    },
    //Endpoint para autenticar la pareja
    autenticarPareja: async (username, password) => {
        const response = await axios.post(`${API_BASE_URL}/Pareja/Autenticar`, {
            username: username,
            password: password
        });
        return response.data;
    },
    // Endpoint para traer los clientes
    obtenerClientePorId: async (idCliente) => {
        const response = await axios.get(`${API_BASE_URL}/Cliente/ObtenerCliente`, {
            params: { idCliente: idCliente }
        });
        return response.data;
    },
    //endpoint para el cupo de la pareja
    obtenerCupoConsumido: async (idCliente) => {
        const response = await axios.get(`${API_BASE_URL}/Pareja/ObtenerCupoConsumido`, {
            params: { idCliente: idCliente }
        });
        return response.data;
    },
    //Endpoint para crear una pareja por cliente
    crearPareja: async (datos) => {
        const payload = {
            primerNombre: datos.primerNombre,
            segundoNombre: datos.segundoNombre,
            primerApellido: datos.primerApellido,
            segundoApellido: datos.segundoApellido,
            nombreUsuario: datos.nombreUsuario,
            contraseniaUsuario: datos.contraseniaUsuario,
            correoElectronico: datos.correoElectronico,
            cupoAsignado: parseFloat(datos.cupoAsignado) || 0,
            idCliente: parseInt(datos.idCliente)
        };

        const response = await axios.post(`${API_BASE_URL}/Pareja/CrearPareja`, payload);
        return response.data;
    },
    //Endpoint para obtener las parejas del cliente
    obtenerParejasPorCliente: async (idCliente) => {
        const response = await axios.get(`${API_BASE_URL}/Pareja/ObtenerPorCliente`, {
            params: { idCliente: idCliente }
        });
        return response.data;
    },
    //Endpoint para traer las parejas
    obtenerParejaPorId: async (idPareja) => {
        const response = await axios.get(`${API_BASE_URL}/Pareja/ObtenerPareja`, {
            params: { idPareja: idPareja }
        });
        return response.data;
    },
    //Endpoint para obtener los productos
    obtenerProductos: async () => {
        const response = await axios.get(`${API_BASE_URL}/Producto/ObtenerProductos`);
        return response.data;
    },

// Endpoint para registrar la compra
    registrarCompraPrincipal: async (datosCompra) => {
        const response = await axios.post(`${API_BASE_URL}/Compra/CrearCompra`, datosCompra);
        return response.data;
    },

    // Endpoint para registrar cada producto relacionado a la compa
    registrarProductoEnCompra: async (datosDetalle) => {
        const response = await axios.post(`${API_BASE_URL}/CompraProducto/CrearCompraProducto`, datosDetalle);
        return response.data;
    },

    //Enpoint para restringir

    crearRestriccion: async (datos) => {
        const response = await axios.post(`${API_BASE_URL}/Restriccion/CrearRestriccion`, datos);
        return response.data;
    },
    //Endpoint para obtener todasa las restricciones
    obtenerRestriccionesPorPareja: async (idPareja) => {
        const response = await axios.get(`${API_BASE_URL}/Restriccion/ObtenerPorPareja`, {
            params: { idPareja: idPareja }
        });
        return response.data;
    },
    obtenerComprasPorPareja: async (idPareja) => {

        const response = await axios.get(`${API_BASE_URL}/Compra/ObtenerPorPareja`, {
            params: {
                idPareja: idPareja
            }
        });
        return response.data;
    },
    solicitarSobrecupo: async (datos) => {
        const response = await fetch(`${API_BASE_URL}/Sobrecupo/Solicitar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });
        if (!response.ok) throw await response.json();
        return response.json();
    },
    obtenerSobrecuposSupervisor: async (idSupervisor) => {
        const response = await fetch(`${API_BASE_URL}/Sobrecupo/ObtenerPorSupervisor?idSupervisor=${idSupervisor}`);
        if (!response.ok) throw await response.json();
        return response.json();
    },
    //Endpoint para escalar de supervisor a cliente
    escalarSobrecupo: async (idSobrecupo, escalar) => {
        const response = await fetch(`${API_BASE_URL}/Sobrecupo/Escalar?idSobrecupo=${idSobrecupo}&escalar=${escalar}`, {
            method: 'PUT'
        });
        if (!response.ok) throw await response.json();
        return response.json();
    },
    //Endpoint para la respuesta a al autorizacion de sobrecupo
    responderSobrecupo: async (idSobrecupo, aprobado) => {
        const response = await fetch(`${API_BASE_URL}/Sobrecupo/ResponderCliente?idSobrecupo=${idSobrecupo}&aprobado=${aprobado}`, {
            method: 'PUT'
        });
        if (!response.ok) throw await response.json();
        return response.json();
    },
    //Endpoinnt para obtener los asobrecupos
    obtenerSobrecuposPorCliente: async (idCliente) => {
        const response = await fetch(`${API_BASE_URL}/Sobrecupo/ObtenerPorCliente?idCliente=${idCliente}`);
        return await response.json();
    },

};






export default authService;