import { useState } from "react";
import "./pareja.css";
import "../../validation/validacion.css";
import {
    validarRequerido,
    validarLongitudMinima,
    validarNumeroPositivo,
    validarSeleccion,
    validarDocumento,
    claseCampo,
    hayErrores,
} from "../../validation/validaciones.js";

function EditarPareja() {

  // Datos de ejemplo
  const [pareja, setPareja] = useState({
    id: 1,
    usuario: "juanperez",
    primerNombre: "Juan",
    segundoNombre: "David",
    primerApellido: "Pérez",
    segundoApellido: "Gómez",
    tipoDocumento: "CC",
    documento: "1023456789",
    cupoAsignado: "3000000"
  });

  const [errores, setErrores] = useState({});
  const [tocados, setTocados] = useState({});

  // ---------- Validación ----------
  const validarCampo = (name, value, parejaActual = pareja) => {
    switch (name) {
      case "usuario":
        return validarLongitudMinima(value, 4, "El usuario");
      case "primerNombre":
        return validarRequerido(value, "El primer nombre");
      case "primerApellido":
        return validarRequerido(value, "El primer apellido");
      case "tipoDocumento":
        return validarSeleccion(value, "Selecciona un tipo de documento");
      case "documento":
        // Excepción: el Pasaporte puede incluir letras, así que no se valida "solo números"
        if (parejaActual.tipoDocumento === "Pasaporte") {
          return validarLongitudMinima(value, 5, "El número de documento");
        }
        return validarDocumento(value, { minimo: 6, maximo: 15, etiqueta: "El número de documento" });
      case "cupoAsignado":
        return validarNumeroPositivo(value, "El cupo asignado");
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const actualizado = { ...pareja, [name]: value };
    setPareja(actualizado);

    if (tocados[name]) {
      const nuevosErrores = { ...errores, [name]: validarCampo(name, value, actualizado) };
      // Si cambia el tipo de documento, revalida el número de documento con la nueva excepción
      if (name === "tipoDocumento" && tocados.documento) {
        nuevosErrores.documento = validarCampo("documento", actualizado.documento, actualizado);
      }
      setErrores(nuevosErrores);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTocados((prev) => ({ ...prev, [name]: true }));
    setErrores((prev) => ({ ...prev, [name]: validarCampo(name, value) }));
  };

  const actualizarPareja = (e) => {

    e.preventDefault();

    const camposAValidar = [
      "usuario",
      "primerNombre",
      "primerApellido",
      "tipoDocumento",
      "documento",
      "cupoAsignado",
    ];

    const nuevosErrores = {};
    const nuevosTocados = {};
    camposAValidar.forEach((campo) => {
      nuevosErrores[campo] = validarCampo(campo, pareja[campo]);
      nuevosTocados[campo] = true;
    });

    setErrores(nuevosErrores);
    setTocados((prev) => ({ ...prev, ...nuevosTocados }));

    if (hayErrores(nuevosErrores)) {
      return;
    }

    // Aquí irá el PUT o PATCH al backend

    console.log("Pareja actualizada:", pareja);

    alert("Los datos de la pareja fueron actualizados.");

  };

  return (

    <div className="pareja-page">

      <div className="pareja-container">

        <div className="pareja-header">

          <h1>Editar Pareja</h1>

          <p>
            Modifique la información de la pareja registrada.
          </p>

        </div>

        <div className="pareja-body">

          <h2 className="section-title">

            Actualizar Información

          </h2>

          <form onSubmit={actualizarPareja} noValidate>

            <div className="form-grid">

              <div className="field">

                <label>ID</label>

                <input
                  type="text"
                  value={pareja.id}
                  disabled
                />

              </div>

              <div className="field">

                <label className="etiqueta-requerida">Nombre de Usuario</label>

                <input
                  type="text"
                  name="usuario"
                  className={claseCampo(errores.usuario, tocados.usuario)}
                  value={pareja.usuario}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {tocados.usuario && errores.usuario && (
                  <span className="mensaje-error-campo">{errores.usuario}</span>
                )}

              </div>

              <div className="field">

                <label className="etiqueta-requerida">Primer Nombre</label>

                <input
                  type="text"
                  name="primerNombre"
                  className={claseCampo(errores.primerNombre, tocados.primerNombre)}
                  value={pareja.primerNombre}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {tocados.primerNombre && errores.primerNombre && (
                  <span className="mensaje-error-campo">{errores.primerNombre}</span>
                )}

              </div>

              <div className="field">

                <label>Segundo Nombre</label>

                <input
                  type="text"
                  name="segundoNombre"
                  value={pareja.segundoNombre}
                  onChange={handleChange}
                />

              </div>

              <div className="field">

                <label className="etiqueta-requerida">Primer Apellido</label>

                <input
                  type="text"
                  name="primerApellido"
                  className={claseCampo(errores.primerApellido, tocados.primerApellido)}
                  value={pareja.primerApellido}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {tocados.primerApellido && errores.primerApellido && (
                  <span className="mensaje-error-campo">{errores.primerApellido}</span>
                )}

              </div>

              <div className="field">

                <label>Segundo Apellido</label>

                <input
                  type="text"
                  name="segundoApellido"
                  value={pareja.segundoApellido}
                  onChange={handleChange}
                />

              </div>

              <div className="field">

                <label className="etiqueta-requerida">Tipo de Documento</label>

                <select
                  name="tipoDocumento"
                  className={claseCampo(errores.tipoDocumento, tocados.tipoDocumento)}
                  value={pareja.tipoDocumento}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option value="CC">Cédula de Ciudadanía</option>
                  <option value="CE">Cédula de Extranjería</option>
                  <option value="TI">Tarjeta de Identidad</option>
                  <option value="Pasaporte">Pasaporte</option>
                </select>
                {tocados.tipoDocumento && errores.tipoDocumento && (
                  <span className="mensaje-error-campo">{errores.tipoDocumento}</span>
                )}

              </div>

              <div className="field">

                <label className="etiqueta-requerida">Número de Documento</label>

                <input
                  type={pareja.tipoDocumento === "Pasaporte" ? "text" : "number"}
                  name="documento"
                  className={claseCampo(errores.documento, tocados.documento)}
                  value={pareja.documento}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {tocados.documento && errores.documento && (
                  <span className="mensaje-error-campo">{errores.documento}</span>
                )}
                {pareja.tipoDocumento === "Pasaporte" && !errores.documento && (
                  <span className="texto-ayuda-campo">El pasaporte puede incluir letras y números</span>
                )}

              </div>

              <div className="field">

                <label className="etiqueta-requerida">Cupo Asignado</label>

                <input
                  type="number"
                  name="cupoAsignado"
                  className={claseCampo(errores.cupoAsignado, tocados.cupoAsignado)}
                  value={pareja.cupoAsignado}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {tocados.cupoAsignado && errores.cupoAsignado && (
                  <span className="mensaje-error-campo">{errores.cupoAsignado}</span>
                )}

              </div>

            </div>

            <div className="button-group">

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => window.history.back()}
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="btn btn-edit"
              >
                Guardar Cambios
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>

  );

}

export default EditarPareja;