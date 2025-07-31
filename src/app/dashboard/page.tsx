// NEW CODE :

"use client";

import api from "@/lib/axios";
import { useEffect, useState } from "react";
import TaskCard from "@/components/RoadMapComponents/TaskCard";

interface SubTask {
  title: string;
  type: string;
  status: string;
}

interface TaskList {
  _id: string;
  user: string;
  title: string;
  subtasks: SubTask[];
}

export default function DashboardPage() {
  const [user, setUser] = useState<{ name: string; _id: string } | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState<string>("");
  const [taskList, setTaskList] = useState<TaskList[]>([]);

  // Fetch user and then their tasks
  useEffect(() => {
    const fetchUserAndTasks = async () => {
      try {
        const res = await api.get("/auth/me");
        if (!res.data) throw new Error("Unauthorized");
        setUser(res.data);
        getTasks(res.data._id);
      } catch (err) {
        console.error("User not authorized");
      }
    };

    fetchUserAndTasks();
  }, []);

  // Fetch tasks for a given userId
  const getTasks = async (userId: string) => {
    try {
      const res = await api.get(`/task/${userId}`); // Assumes it returns user-specific tasks
      setTaskList(res.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Create task
  const createTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle || !user) return;

    try {
      const res = await api.post("/task", { title: newTaskTitle });
      setNewTaskTitle(""); // Clear input
      setTaskList((prev) => [...prev, res.data])
      // getTasks(user._id); // Refresh task list
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  // Delete Task
  const handleDelete = async (taskId: string) => {
    try {
      await api.delete(`/task/${taskId}`);
      setTaskList((prev) => prev.filter((task) => task._id !== taskId));
    } catch (error) {
      console.log('Task Deletion failed');
    }
    // Then refetch or filter from local state
  };

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          Welcome Back {user?.name} 👋
        </h1>

        {/* Task Creation Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Create a New Task</h2>
          <form className="flex gap-2" onSubmit={createTask}>
            <input
              type="text"
              value={newTaskTitle}
              placeholder="What do you want to learn?"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
              onChange={(e) => setNewTaskTitle(e.target.value)}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700"
            >
              Create Task
            </button>
          </form>
        </section>
        {/* Task List */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Your Tasks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {taskList.length ? (
              taskList.map((task, index) => (
                <TaskCard
                  key = {index}
                  taskId={task._id}
                  taskTitle={task.title}
                  subtasks={task.subtasks.map((sub: any) => sub.title)}
                  onDelete={(id : string) => handleDelete(id)}
                />
              ))
            ) : (
              <p>No tasks to show</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
