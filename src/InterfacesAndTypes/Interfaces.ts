export interface NoteData {
  _id: string;
  title: string;
  content: string;
}

export interface ArticleData{
  _id: string;
  title: string;
  link: string;
  summary: string;
}

export interface ContentData{
  _id: string;
  youtubeLinks: string[];
  articles:ArticleData[];
  notes: NoteData[];
}

export interface SubModuleData {
  _id:string;
  title: string;
  type: "Learning" | "Practice" | "Project";
  content: ContentData | null;
  status: string;
}

export interface ModuleData {
  _id:string;
  title: string;
  status: string;
  progress: number;
  submodules: SubModuleData[];
}
export interface SkillData {
  _id: string;
  userId: string;
  title: string;
  modules: ModuleData[];
  totalSubmodules: number;
  completedSubModules: number;
  progress: number;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface SignUpData {
  name: string;
  email: string;
  password: string;
}

export interface SkillMetaData {
  title: string;
  skillId: string;
  progress: number;
}

export interface UserData {
  _id: string;
  name: string;
  email?: string;
  skillMetaData?: SkillMetaData[];
}


