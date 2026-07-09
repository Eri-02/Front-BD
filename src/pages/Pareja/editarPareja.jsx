import { useState } from "react";
import "./pareja.css";

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

  const handleChange = (e) => {

    const { name, value } = e.target;

    setPareja({
      ...pareja,
      [name]: value
    });

  };

  const actualizarPareja = (e) => {

    e.preventDefault();

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

          <form onSubmit={actualizarPareja}>

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

                <label>Nombre de Usuario</label>

                <input
                  type="text"
                  name="usuario"
                  value={pareja.usuario}
                  onChange={handleChange}
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
                />

              </div>

              <div className="field">

                <label>Primer Apellido</label>

                <input
                  type="text"
                  name="primerApellido"
                  value={pareja.primerApellido}
                  onChange={handleChange}
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
                  <option value="CC">Cédula de Ciudadanía</option>
                  <option value="CE">Cédula de Extranjería</option>
                  <option value="TI">Tarjeta de Identidad</option>
                  <option value="Pasaporte">Pasaporte</option>
                </select>

              </div>

              <div className="field">

                <label>Número de Documento</label>

                <input
                  type="number"
                  name="documento"
                  value={pareja.documento}
                  onChange={handleChange}
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
                  required
                />

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