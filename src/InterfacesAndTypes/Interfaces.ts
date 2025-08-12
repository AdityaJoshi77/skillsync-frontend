export interface NoteData {
  _id: string;
  contentId: string;
  title: string;
  content: string;
  userId: string;
}

export interface youtubeLinkData{
  id: string;
  title: string;
  link: string;
  userId: string;
}

export interface ArticleData{
  _id: string;
  contentId: string;
  title: string;
  link: string;
  summary: string;
  userId: string;
}

export interface ContentData{
  _id: string;
  youtubeLinks: youtubeLinkData[];
  articles:ArticleData[];
  notes: NoteData[];
  userId: string;
}

export interface SubModuleData {
  _id:string;
  skillId: string;
  moduleId: string;
  skillName: string;
  moduleName: string;
  title: string;
  type: "Learning" | "Practice" | "Project";
  content: ContentData | null;
  contentId: string;
  status: string;
}

export interface ModuleData {
  _id:string;
  skillId: string;
  title: string;
  skillName: string;
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


