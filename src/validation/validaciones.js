
export const validarRequerido = (valor, etiqueta = "Este campo") => {
    if (valor === null || valor === undefined) return `${etiqueta} es obligatorio`;
    if (typeof valor === "string" && valor.trim() === "") return `${etiqueta} es obligatorio`;
    return "";
};

export const validarEmail = (valor) => {
    if (!valor || valor.trim() === "") return "El correo es obligatorio";
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(valor)) return "Ingresa un correo electrónico válido";
    return "";
};

export const validarLongitudMinima = (valor, minimo, etiqueta = "Este campo") => {
    if (!valor || valor.trim().length < minimo) {
        return `${etiqueta} debe tener al menos ${minimo} caracteres`;
    }
    return "";
};

export const validarNumeroPositivo = (valor, etiqueta = "El valor") => {
    if (valor === "" || valor === null || valor === undefined) return `${etiqueta} es obligatorio`;
    const numero = Number(valor);
    if (isNaN(numero)) return `${etiqueta} debe ser un número`;
    if (numero <= 0) return `${etiqueta} debe ser mayor a 0`;
    return "";
};

export const validarNumeroMaximo = (valor, maximo, etiqueta = "El valor") => {
    const numero = Number(valor);
    if (!isNaN(numero) && numero > maximo) {
        return `${etiqueta} no puede superar $${maximo}`;
    }
    return "";
};

export const validarHoraMenor = (horaInicio, horaFin) => {
    if (horaInicio && horaFin && horaInicio >= horaFin) {
        return "La hora de inicio debe ser menor a la hora de fin";
    }
    return "";
};

export const validarSeleccion = (valor, etiqueta = "Debes seleccionar una opción") => {
    if (!valor || valor === "") return etiqueta;
    return "";
};

/**
 * Valida documentos de identidad: solo números y una longitud razonable.
 * Sirve para cédulas, tarjetas de identidad, etc. (no para pasaporte,
 * que suele mezclar letras y números).
 */
export const validarDocumento = (valor, { minimo = 6, maximo = 15, etiqueta = "El documento" } = {}) => {
    if (!valor || String(valor).trim() === "") return `${etiqueta} es obligatorio`;
    const texto = String(valor).trim();
    if (!/^\d+$/.test(texto)) return `${etiqueta} solo debe contener números`;
    if (texto.length < minimo || texto.length > maximo) {
        return `${etiqueta} debe tener entre ${minimo} y ${maximo} dígitos`;
    }
    return "";
};

/**
 * Combina varios validadores para un mismo campo y retorna
 * el primer mensaje de error que encuentre (o "" si todos pasan).
 * Uso: validarVarios(valor, [() => validarRequerido(valor, "Nombre")])
 */
export const validarVarios = (validadores) => {
    for (const validar of validadores) {
        const error = validar();
        if (error) return error;
    }
    return "";
};

/**
 * Devuelve la clase CSS que debe tener un input según su estado,
 * pensada para combinarse con validacion.css (clases "es-invalido" / "es-valido").
 * baseClass es opcional, por si el input ya tiene otra clase que quieras conservar.
 */
export const claseCampo = (error, tocado, baseClass = "") => {
    if (!tocado) return baseClass;
    const estado = error ? "es-invalido" : "es-valido";
    return baseClass ? `${baseClass} ${estado}` : estado;
};

/**
 * Revisa un objeto { campo: mensajeError } y dice si hay algún error real.
 */
export const hayErrores = (erroresObj) => {
    return Object.values(erroresObj).some((mensaje) => Boolean(mensaje));
};