import { Fragment, useEffect } from "react";
import ReactDOM from "react-dom";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { TaskFormData } from "@/types/index";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask } from "@/api/TaskAPI";
import { toast } from "react-toastify";
import TaskForm from "./TaskForm";

export default function AddTaskModal() {
  const navigate = useNavigate();

  // Leer si el modal debe mostrarse
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const modalTask = queryParams.get("newTask");

  const show = modalTask ? true : false;

  // Obtener projectId
  const params = useParams();
  const projectId = params.projectId!;

  const initialValues: TaskFormData = {
    name: "",
    description: "",
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: createTask,
    onError: () => {
      toast.error("Error al crear una tarea nueva");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["project", projectId],
      });
      toast.success("Tarea creada con éxito");
      reset();
      navigate(location.pathname, { replace: true });
    },
  });

  const handleCreateTask = (formData: TaskFormData) => {
    const data = { formData, projectId };
    mutate(data);
  };

  const handleClose = () => {
    navigate(location.pathname, { replace: true });
  };

  useEffect(() => {
    if (show) {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        document.body.style.overflow = "hidden"; // Bloquea el desplazamiento
      }, 50);
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
    }
  }, [show]);

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
          className="relative bg-white rounded-lg shadow-lg p-6 w-full max-w-md"
          onClick={(e) => e.stopPropagation()} // Evitar que el clic dentro del modal lo cierre
        >
          {/* Botón de cierre */}
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          >
            ✖
          </button>

          <h3 className="text-2xl font-bold text-gray-800 mb-4">Nueva Tarea</h3>
          <p className="text-gray-600 mb-6">
            Llena el formulario y crea{" "}
            <span className="text-fuchsia-600 font-semibold">una tarea</span>
          </p>
          <form onSubmit={handleSubmit(handleCreateTask)} className="space-y-4">
            <TaskForm register={register} errors={errors} />
            <button
              type="submit"
              className="w-full bg-fuchsia-600 text-white py-2 px-4 rounded-md hover:bg-fuchsia-700 transition"
            >
              Guardar Tarea
            </button>
          </form>
        </div>
      </div>
    </Fragment>,
    document.body
  );
}
