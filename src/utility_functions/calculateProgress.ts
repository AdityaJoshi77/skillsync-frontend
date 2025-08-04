// overall progress percentage
// module specific progress percentage

import type { ModuleData, SubModuleData } from "@/InterfacesAndTypes/Interfaces";

export const calculateOverallProgress = (moduleData: ModuleData[]) => {
  let totalModules = moduleData.length;
  let totalSubModules = 0;
  let completedSubModules = 0;

  for (let i = 0; i < totalModules; i++)
    totalSubModules += moduleData[i].submodules.length;

  for (let i = 0; i < totalModules; i++) {
    let moduleSize = moduleData[i].submodules.length;
    for (let j = 0; j < moduleSize; j++) {
      if (moduleData[i].submodules[j].status === "Completed"){
        completedSubModules += 1;
      }
    }
  }

  return Math.floor((completedSubModules / totalSubModules) * 100);
};

export const moduleSpecificProgress = (module: ModuleData) => {
  let totalSubModules = module.submodules.length;
  let completedSubModules = 0;
  for (let i = 0; i < totalSubModules; i++)
    if (module.submodules[i].status === "Completed") completedSubModules += 1;

  return Math.floor((completedSubModules / totalSubModules) * 100);
};
