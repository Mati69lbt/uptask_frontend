import api from "@/lib/axios";
import { ProjectFormData } from "../types";

const createProject = async (formData: ProjectFormData) => {
  try {
    const { data } = await api.post("/projects", formData);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export default createProject;
