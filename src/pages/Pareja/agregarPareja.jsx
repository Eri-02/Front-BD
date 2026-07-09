import { useState } from "react";
import "./pareja.css";

function AgregarPareja() {

  const [pareja, setPareja] = useState({
    usuario: "",
    primerNombre: "",
    segundoNombre: "",
    primerApellido: "",
    segundoApellido: "",
    tipoDocumento: "",
    documento: "",
    cupoAsignado: ""
  });

  const handleChange = (e) => {

    const { name, value } = e.target;

    setPareja({
      ...pareja,
      [name]: value
    });

  };

  const guardarPareja = (e) => {

    e.preventDefault();

    // Aquí irá el POST al backend

    console.log(pareja);

    alert("Pareja registrada correctamente.");

  };

  return (

    <div className="pareja-page">

      <div className="pareja-container">

        <div className="pareja-header">

          <h1>Agregar Pareja</h1>

          <p>
            Complete la información para registrar una nueva pareja.
          </p>

        </div>

        <div className="pareja-body">

          <h2 className="section-title">

            Información de la Pareja

          </h2>

          <form onSubmit={guardarPareja}>

            <div className="form-grid">

              <div className="field">

                <label>Nombre de Usuario</label>

                <input
                  type="text"
                  name="usuario"
                  value={pareja.usuario}
                  onChange={handleChange}
                  placeholder="Ingrese el usuario"
                  required
                />

              </div>

              <div className="field">

                <label>Primer Nombre</label>

                <input
                  type="text"
                  name="primerNombre"
                  value={pareja.primerNombre}
                  onChange={handleChange}
                  placeholder="Ingrese el primer nombre"
                  required
                />

              </div>

              <div className="field">

                <label>Segundo Nombre</label>

                <input
                  type="text"
                  name="segundoNombre"
                  value={pareja.segundoNombre}
                  onChange={handleChange}
                  placeholder="Ingrese el segundo nombre"
                />

              </div>

              <div className="field">

                <label>Primer Apellido</label>

                <input
                  type="text"
                  name="primerApellido"
                  value={pareja.primerApellido}
                  onChange={handleChange}
                  placeholder="Ingrese el primer apellido"
                  required
                />

              </div>

              <div className="field">

                <label>Segundo Apellido</label>

                <input
                  type="text"
                  name="segundoApellido"
                  value={pareja.segundoApellido}
                  onChange={handleChange}
                  placeholder="Ingrese el segundo apellido"
                />

              </div>

              <div className="field">

                <label>Tipo de Documento</label>

                <select
                  name="tipoDocumento"
                  value={pareja.tipoDocumento}
                  onChange={handleChange}
                  required
                >

                  <option value="">Seleccione</option>

                  <option value="CC">
                    Cédula de Ciudadanía
                  </option>

                  <option value="CE">
                    Cédula de Extranjería
                  </option>

                  <option value="TI">
                    Tarjeta de Identidad
                  </option>

                  <option value="Pasaporte">
                    Pasaporte
                  </option>

                </select>

              </div>

              <div className="field">

                <label>Número de Documento</label>

                <input
                  type="number"
                  name="documento"
                  value={pareja.documento}
                  onChange={handleChange}
                  placeholder="Ingrese el documento"
                  required
                />

              </div>

              <div className="field">

                <label>Cupo Asignado</label>

                <input
                  type="number"
                  name="cupoAsignado"
                  value={pareja.cupoAsignado}
                  onChange={handleChange}
                  placeholder="Ingrese el cupo"
                  required
                />

              </div>

            </div>

            <div className="button-group">

              <button
                type="reset"
                className="btn btn-secondary"
              >
                Limpiar
              </button>

              <button
                type="submit"
                className="btn btn-success"
              >
                Guardar Pareja
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>

  );

}

export default AgregarPareja;