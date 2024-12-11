import { Project, TeamMember } from "../types";

const isManager = (
  managerId: Project["manager"],
  userId: TeamMember["_id"]
) => {
  return managerId === userId
};

export default isManager;
