import { Fragment, useEffect } from "react";
import ReactDOM from "react-dom";
import {
  useLocation,
  useNavigate,
  useParams,
  Navigate,
} from "react-router-dom";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { getTaskById, updateStatus } from "@/api/TaskAPI";
import { formatDate } from "@/utils/utils";
import { statusTranslations } from "@/locales/es";
import { TaskStatus } from "@/types/index";
import NotesPanel from "../notes/NotesPanel";

export default function TaskModalDetails() {
  const params = useParams();
  const projectId = params.projectId!;
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const taskId = queryParams.get("viewTask");

  const show = taskId ? true : false;

  const { data, isError } = useQuery({
    queryKey: ["task", taskId],
    queryFn: () =>
      taskId
        ? getTaskById({ projectId, taskId })
        : Promise.reject("No taskId provided"),
    enabled: !!taskId,
    retry: false,
  });

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: updateStatus,
    onError: () => {
      toast.error("Error al actualizar el estado de la tarea");
    },
    onSuccess: () => {
      toast.success("Estado de la tarea actualizado con éxito");
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!taskId) return;
    const status = e.target.value as TaskStatus;
    const data = { projectId, taskId, status };
    mutate(data);
  };

  const handleClose = () => {
    navigate(location.pathname, { replace: true });
  };

  useEffect(() => {
    if (show) {
      setTimeout(() => {
        const modalElement = document.getElementById("task-modal");
        if (modalElement) {
          modalElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        document.body.style.overflow = "hidden"; // Bloquea el desplazamiento
      }, 50);
    }
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.body.style.overflow = "auto"; // Restaura el scroll al cerrar el modal
      document.removeEventListener("keydown", handleEsc);
    };
  }, [show]);

  if (isError) {
    toast.error("Error al obtener la tarea", { toastId: "error" });
    return <Navigate to={`/projects/${projectId}`} />;
  }

  if (!show || !data) return null;

  return ReactDOM.createPortal(
    <Fragment>
      {/* Fondo Oscuro */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={handleClose} // Cierra el modal al hacer clic en el fondo
      >
        {/* Contenedor del Modal */}
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            id="task-modal"
            className="relative bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()} // Evita que se cierre al hacer clic dentro del modal
          >
            {/* Botón de Cierre */}
            <button
              onClick={handleClose}
              className="fixed top-0 right-4 bg-transparent p-2 !text-fuchsia-500 !hover:text-red-600 transition-colors duration-200 ease-in-out text-2xl self-end mb-4 z-50"
            >
              ✖
            </button>

            {/* Contenido con Scroll */}
            <div className="p-6 overflow-y-auto flex-grow">
              <p className="text-sm text-slate-400">
                Agregada el: {formatDate(data.createdAt) || ""}
              </p>
              <p className="text-sm text-slate-400">
                Última actualización: {formatDate(data.updatedAt)}
              </p>
              <h3 className="font-black text-4xl text-slate-600 my-5">
                {data.name}
              </h3>
              <p className="text-lg text-slate-500 mb-2">
                Descripción: {data.description}
              </p>

              {data.completedBy.length ? (
                <>
                  <p className="text-2xl text-slate-500 mb-2">
                    Historial de Cambios
                  </p>
                  <ul className="list-decimal pl-6">
                    {data.completedBy.map((actividades) => (
                      <li
                        key={actividades._id}
                        className="flex justify-between items-center mb-2 p-2 border border-gray-300 rounded"
                      >
                        <strong className="text-gray-700">
                          {statusTranslations[actividades.status]}
                        </strong>
                        <span className="text-gray-500">
                          {actividades.user.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}

              <div className="my-5 space-y-3">
                <label className="font-bold">
                  Estado Actual:
                  <select
                    className="w-full p-3 bg-white border border-gray-300"
                    defaultValue={data.status}
                    onChange={handleChange}
                  >
                    {Object.entries(statusTranslations).map(([key, values]) => (
                      <option key={key} value={key}>
                        {values}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {/* Panel de notas */}
              <NotesPanel notes={data.notes} />
            </div>
          </div>
        </div>
      </div>
    </Fragment>,
    document.body
  );
}
