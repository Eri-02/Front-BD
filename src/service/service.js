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
    }

};






export default authService;