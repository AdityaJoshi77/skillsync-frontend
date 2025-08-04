interface SubModuleData {
  title: string;
  type: "Learning" | "Practice" | "Project";
  status: string;
}

interface ModuleData {
  title: string;
  status: string;
  submodules: SubModuleData[];
}

export type {ModuleData, SubModuleData}