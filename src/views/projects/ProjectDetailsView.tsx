// cspell: ignore Uptask, toastify, Matias, tanstack, headlessui, heroicons
import { getProjectById } from "@/api/ProjectAPI";
import AddTaskModal from "@/components/tasks/AddTaskModal";
import EditTaskData from "@/components/tasks/EditTaskData";
import TaskList from "@/components/tasks/TaskList";
import TaskModalDetails from "@/components/tasks/TaskModalDetails";
import { useQuery } from "@tanstack/react-query";
import { Navigate, useNavigate, useParams } from "react-router-dom";

const ProjectDetailsView = () => {
  const params = useParams();

  const navigate = useNavigate();

  const projectId = params.projectId!;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["editProject", projectId],
    queryFn: () => getProjectById(projectId),
    retry: false,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <Navigate to="/404" />;
  }

  if (data)
    return (
      <>
        <h1 className="text-5xl font-black">{data.project.projectName}</h1>
        <p className="text-2xl font-light">{data.project.description}</p>
        <nav className="my-5 flex gap-3">
          <button
            type="button"
            className="bg-purple-400 hover:bg-purple-500 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
            onClick={() => navigate(location.pathname + "?newTask=true")}
          >
            Agregar Tarea
          </button>
        </nav>
        <TaskList tasks={data.project.tasks} />
        <AddTaskModal />
        <EditTaskData />
        <TaskModalDetails />
      </>
    );
};
export default ProjectDetailsView;
