
interface Submodule {
  title: string;
  type: "Learning" | "Practice" | "Project";
  status: string;
}

interface RoadmapData {
  title: string;
  status: string;
  submodules: Submodule[];
}


const roadmap: RoadmapData[] = [
  {
    title: "Setting up your environment",
    status: "Pending",
    submodules: [
      { title: "Install Node.js and npm", type: "Learning", status: "Pending" },
      { title: "Set up a code editor (e.g., VS Code)", type: "Learning", status: "Pending" },
      { title: "Initialize a React project using Vite or CRA", type: "Practice", status: "Pending" },
      { title: "Explore folder structure", type: "Learning", status: "Pending" }
    ]
  },
  {
    title: "JSX and Components",
    status: "Pending",
    submodules: [
      { title: "Understand JSX syntax", type: "Learning", status: "Pending" },
      { title: "Create functional components", type: "Practice", status: "Pending" },
      { title: "Use React fragments", type: "Learning", status: "Pending" },
      { title: "Nest components", type: "Practice", status: "Pending" },
      { title: "Build a basic reusable Button component", type: "Project", status: "Pending" }
    ]
  },
  {
    title: "Props and State",
    status: "Pending",
    submodules: [
      { title: "Pass props between components", type: "Learning", status: "Pending" },
      { title: "Use useState hook", type: "Learning", status: "Pending" },
      { title: "Build a counter app", type: "Practice", status: "Pending" },
      { title: "Create a dynamic Todo list with props/state", type: "Project", status: "Pending" }
    ]
  },
  {
    title: "Events and Forms",
    status: "Pending",
    submodules: [
      { title: "Handle button clicks", type: "Learning", status: "Pending" },
      { title: "Manage input fields with state", type: "Practice", status: "Pending" },
      { title: "Build a signup form", type: "Project", status: "Pending" },
      { title: "Validate form inputs", type: "Learning", status: "Pending" }
    ]
  },
  {
    title: "Advanced Concepts",
    status: "Pending",
    submodules: [
      { title: "Use useEffect for side effects", type: "Learning", status: "Pending" },
      { title: "Lift state up across components", type: "Practice", status: "Pending" },
      { title: "Manage conditional rendering", type: "Learning", status: "Pending" },
      { title: "Build a weather dashboard using an API", type: "Project", status: "Pending" }
    ]
  }
];
