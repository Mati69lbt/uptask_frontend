import { Fragment, useEffect } from "react";
import ReactDOM from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
import AddMemberForm from "./AddMemberForm";

export default function AddMemberModal() {
  const location = useLocation();
  const navigate = useNavigate();

  // Leer si el modal debe mostrarse
  const queryParams = new URLSearchParams(location.search);
  const addMember = queryParams.get("addMember");
  const show = addMember ? true : false;

  const handleClose = () => {
    navigate(location.pathname, { replace: true });
  };

  // 🔹 Centrar la pantalla en el modal cuando se abre
  useEffect(() => {
    if (show) {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 50);
    }
  }, [show]);

  // Si el modal no está activo, no lo renderizamos
  if (!show) return null;

  return ReactDOM.createPortal(
    <Fragment>
      {/* Fondo Oscuro */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={handleClose}
      ></div>

      {/* Contenido del Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div
          className="relative bg-white rounded-lg shadow-lg p-10 w-full max-w-4xl"
          onClick={(e) => e.stopPropagation()} // Evita que el clic dentro del modal lo cierre
        >
          {/* Botón de cierre */}
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl"
          >
            ✖
          </button>

          <h3 className="font-black text-4xl my-5">
            Agregar Integrante al equipo
          </h3>
          <p className="text-xl font-bold">
            Busca el nuevo integrante por email {""}
            <span className="text-fuchsia-600">para agregarlo al proyecto</span>
          </p>

          {/* Formulario */}
          <AddMemberForm />
        </div>
      </div>
    </Fragment>,
    document.body
  );
}
