interface SubModuleData {
  title: string;
  type: "Learning" | "Practice" | "Project";
  status: string;
}

interface ModuleData {
  title: string;
  status: string;
  progress:number;
  submodules: SubModuleData[];
}

interface LoginData{
    email:String,
    password:String
}

interface SignUpData{
    name: String,
    email: String,
    password: String
}

export type {ModuleData, SubModuleData, LoginData, SignUpData}