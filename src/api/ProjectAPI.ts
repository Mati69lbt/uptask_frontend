import api from "@/lib/axios";
import {
  dashboardProjectSchema,
  editProjectSchema,
  Project,
  ProjectFormData,
  projectSchema,
} from "../types";

export const createProject = async (formData: ProjectFormData) => {
  try {
    const { data } = await api.post("/projects", formData);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export async function getProjects() {
  try {
    const { data } = await api("/projects");
    const response = dashboardProjectSchema.safeParse(data.projects);
    if (response.success) {
      return response.data;
    }
  } catch (error) {
    console.log(error);
  }
}
export async function getProjectById(id: Project["_id"]) {
  try {
    const { data } = await api(`/projects/${id}`);
    const response = editProjectSchema.safeParse(data.project);

    if (response.success) {
      return response.data;
    }
  } catch (error) {
    console.log(error);
  }
}

export async function getFullProject(id: Project["_id"]) {
  try {
    const { data } = await api(`/projects/${id}`);
    console.log(data);

    const response = projectSchema.safeParse(data.project);
    console.log(response);

    if (response.success) {
      return response.data;
    }
  } catch (error) {
    console.log(error);
  }
}

type ProjectAPIType = {
  formData: ProjectFormData;
  projectId: Project["_id"];
};

export async function updateProject({ formData, projectId }: ProjectAPIType) {
  try {
    const { data } = await api.put<string>(`/projects/${projectId}`, formData);
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteProject(id: Project["_id"]) {
  try {
    const { data } = await api.delete<string>(`/projects/${id}`);
    return data;
  } catch (error) {
    console.log(error);
  }
}
