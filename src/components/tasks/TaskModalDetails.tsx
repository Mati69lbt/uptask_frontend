// cspell: ignore headlessui
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
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
  const taskId = queryParams.get("viewTask")!;

  const show = taskId ? true : false;

  const { data, isError } = useQuery({
    queryKey: ["task", taskId],
    queryFn: () => getTaskById({ projectId, taskId }),
    enabled: !!taskId,
    retry: false,
  });

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: updateStatus,
    onError: () => {
      toast.error("Error updating task status");
    },
    onSuccess: () => {
      toast.success("Task status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["editProject", projectId] });
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value as TaskStatus;

    const data = { projectId, taskId, status };
    mutate(data);
  };

  if (isError) {
    toast.error("Error fetching task", { toastId: "error" });
    return <Navigate to={`/projects/${projectId}`} />;
  }

  const task = data;

  if (task)
    return (
      <>
        <Transition appear show={show} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-10"
            onClose={() => {
              navigate(location.pathname, { replace: true });
            }}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/60" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-16">
                    <p className="text-sm text-slate-400">
                      Agregada el: {formatDate(task.createdAt) || ""}
                    </p>
                    <p className="text-sm text-slate-400">
                      Última actualización: {formatDate(task.updatedAt)}
                    </p>
                    <Dialog.Title
                      as="h3"
                      className="font-black text-4xl text-slate-600 my-5"
                    >
                      {task.name}
                    </Dialog.Title>
                    <p className="text-lg text-slate-500 mb-2">
                      Descripción: {task.description}
                    </p>
                    {task.completedBy.length ? (
                      <>
                        <p className="text-2xl text-slate-500 mb-2">
                          Historial de Cambios
                        </p>
                        <ul className="list-decimal pl-6">
                          {task.completedBy.map((actividades) => (
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
                          defaultValue={task.status}
                          onChange={handleChange}
                        >
                          {Object.entries(statusTranslations).map(
                            ([key, values]) => (
                              <option key={key} value={key}>
                                {values}
                              </option>
                            )
                          )}
                        </select>
                      </label>
                    </div>
                    <NotesPanel notes={data.notes} />
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </>
    );
}
