import { useNavigate } from "react-router-dom";
import "./pareja.css";

function MostrarPareja() {
    const navigate = useNavigate();; 
  // Datos de ejemplo
  const parejas = [
    {
      id: 1,
      usuario: "juanperez",
      primerNombre: "Juan",
      segundoNombre: "David",
      primerApellido: "Pérez",
      segundoApellido: "Gómez",
      tipoDocumento: "CC",
      documento: "1023456789",
      cupoAsignado: "$3.000.000"
    },
    {
      id: 2,
      usuario: "marias",
      primerNombre: "María",
      segundoNombre: "Alejandra",
      primerApellido: "Suárez",
      segundoApellido: "López",
      tipoDocumento: "CC",
      documento: "1056789123",
      cupoAsignado: "$5.000.000"
    },
    {
      id: 3,
      usuario: "carlosm",
      primerNombre: "Carlos",
      segundoNombre: "Andrés",
      primerApellido: "Morales",
      segundoApellido: "Ruiz",
      tipoDocumento: "CE",
      documento: "89012345",
      cupoAsignado: "$2.500.000"
    }
  ];

  return (
    <div className="pareja-page">

      <div className="pareja-container">

        <div className="pareja-header">
          <h1>Gestión de Parejas</h1>
          <p>Consulta todas las parejas registradas en el sistema.</p>
        </div>

        <div className="pareja-body">

         

          <div className="search-box">
            <input
                type="text"
                placeholder="Buscar por nombre, usuario o documento..."
            />

            <button
                className="btn btn-success"
                onClick={() => navigate("/parejas/agregar")}
            >
                Agregar Pareja
            </button>
            </div>

          <table className="pareja-table">

            <thead>

              <tr>

                <th>ID</th>
                <th>Usuario</th>
                <th>Primer Nombre</th>
                <th>Segundo Nombre</th>
                <th>Primer Apellido</th>
                <th>Segundo Apellido</th>
                <th>Tipo Documento</th>
                <th>Documento</th>
                <th>Cupo Asignado</th>
                <th>Acciones</th>

              </tr>

            </thead>

            <tbody>

              {parejas.map((pareja) => (

                <tr key={pareja.id}>

                  <td>{pareja.id}</td>
                  <td>{pareja.usuario}</td>
                  <td>{pareja.primerNombre}</td>
                  <td>{pareja.segundoNombre}</td>
                  <td>{pareja.primerApellido}</td>
                  <td>{pareja.segundoApellido}</td>
                  <td>{pareja.tipoDocumento}</td>
                  <td>{pareja.documento}</td>
                  <td>{pareja.cupoAsignado}</td>
                  <td>
                    <div
                      style={{
                        display: "flex",
                        gap: "10px"
                      }}
                    >

                      <button
                            className="btn btn-edit"
                            onClick={() => navigate(`/parejas/editar/${pareja.id}`)}
                            >
                            Editar
                            </button>

                      <button
                        className="btn btn-delete"
                        onClick={() => navigate(`/parejas/eliminar/${pareja.id}`)}
                        >
                        Eliminar
                        </button>
                    </div>
                  </td>
                </tr>
              ))}

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default MostrarPareja;