import "./pareja.css";

function EliminarPareja() {

  // Datos de ejemplo
  const pareja = {
    id: 1,
    usuario: "juanperez",
    primerNombre: "Juan",
    segundoNombre: "David",
    primerApellido: "Pérez",
    segundoApellido: "Gómez",
    tipoDocumento: "CC",
    documento: "1023456789",
    cupoAsignado: "$3.000.000"
  };

  const eliminarPareja = () => {

    const confirmar = window.confirm(
      "¿Está seguro de eliminar esta pareja?"
    );

    if (confirmar) {

      // Aquí irá la petición DELETE al backend

      alert("Pareja eliminada correctamente.");

    }

  };

  return (

    <div className="pareja-page">

      <div className="pareja-container">

        <div className="pareja-header">

          <h1>Eliminar Pareja</h1>

          <p>
            Verifique la información antes de eliminar el registro.
          </p>

        </div>

        <div className="pareja-body">

          <div className="warning-box">

            <h3>⚠ Advertencia</h3>

            <p>
              Esta acción eliminará la pareja del sistema.
              Una vez eliminada no podrá recuperarse.
            </p>

          </div>

          <div className="pareja-card">

            <div className="card-header">

              <h2 className="card-title">

                Información de la Pareja

              </h2>

            </div>

            <p className="card-info">
              <strong>ID:</strong> {pareja.id}
            </p>

            <p className="card-info">
              <strong>Usuario:</strong> {pareja.usuario}
            </p>

            <p className="card-info">
              <strong>Primer Nombre:</strong> {pareja.primerNombre}
            </p>

            <p className="card-info">
              <strong>Segundo Nombre:</strong> {pareja.segundoNombre}
            </p>

            <p className="card-info">
              <strong>Primer Apellido:</strong> {pareja.primerApellido}
            </p>

            <p className="card-info">
              <strong>Segundo Apellido:</strong> {pareja.segundoApellido}
            </p>

            <p className="card-info">
              <strong>Tipo Documento:</strong> {pareja.tipoDocumento}
            </p>

            <p className="card-info">
              <strong>Documento:</strong> {pareja.documento}
            </p>

            <p className="card-info">
              <strong>Cupo Asignado:</strong> {pareja.cupoAsignado}
            </p>

          </div>

          <div className="button-group">

            <button
              className="btn btn-secondary"
              onClick={() => window.history.back()}
            >
              Cancelar
            </button>

            <button
              className="btn btn-delete"
              onClick={eliminarPareja}
            >
              Eliminar Pareja
            </button>

          </div>

        </div>

      </div>

    </div>

  );

}

export default EliminarPareja;