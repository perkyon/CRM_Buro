export interface Project {
  id: string;
  projectSeq: number;      // автоинкремент
  projectCode: string;     // `${category} ${seq}`
  category: string;
  managerId: string;
  status: string;
  deadlinePlan?: string;
  deadlineFact?: string;
}

export default Project;
