// cspell: ignore Uptask, toastify, Matias, tanstack, headlessui, heroicons

import { getProjectById } from "@/api/ProjectAPI";
import EditProjectForm from "@/components/projects/EditProjectForm";
import { useQuery } from "@tanstack/react-query";
import { Navigate, useParams } from "react-router-dom";

const EditProjectView = () => {
  const params = useParams();

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
  if (data) {
    return <EditProjectForm data={data.project} projectId={projectId} />;
  }
};

export default EditProjectView;
