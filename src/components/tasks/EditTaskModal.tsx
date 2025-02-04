import { Fragment, useEffect } from "react";
import ReactDOM from "react-dom";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Task, TaskFormData } from "@/types/index";
import { useForm } from "react-hook-form";
import TaskForm from "./TaskForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTask } from "@/api/TaskAPI";
import { toast } from "react-toastify";

interface EditTaskModalProps {
  data: Task;
  taskId: string;
}

export default function EditTaskModal({ data, taskId }: EditTaskModalProps) {
  const navigate = useNavigate();
  const params = useParams();
  const projectId = params.projectId!;

  // Leer si el modal debe mostrarse
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const modalTask = queryParams.get("editTask");

  const show = modalTask ? true : false;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    defaultValues: {
      name: data.name,
      description: data.description,
    },
  });

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: updateTask,
    onError: () => {
      toast.error("Error al actualizar la tarea");
    },
    onSuccess: () => {
      toast.success("Tarea actualizada con éxito");
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
      reset();
      navigate(location.pathname, { replace: true });
    },
  });

  const handleEditTask = (formData: TaskFormData) => {
    mutate({ projectId, taskId, formData });
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
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        {/* Contenedor del modal */}
        <div className="relative bg-white rounded-lg shadow-lg p-8 w-full max-w-4xl">
          {/* Botón de cierre */}
          <button
            onClick={() => navigate(location.pathname, { replace: true })}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            ✖
          </button>

          <h3 className="font-black text-4xl my-5 text-center">Editar Tarea</h3>
          <p className="text-xl font-bold text-center">
            Realiza cambios a una tarea en{" "}
            <span className="text-fuchsia-600">este formulario</span>
          </p>

          <form
            className="mt-10 space-y-3"
            onSubmit={handleSubmit(handleEditTask)}
            noValidate
          >
            <TaskForm register={register} errors={errors} />
            <button
              type="submit"
              className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 text-white font-black text-xl cursor-pointer"
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
