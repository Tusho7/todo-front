import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Task {
  _id: string;
  name: string;
  description: string;
  assignee: Assignee;
}

interface Assignee {
  username: string;
}

const Tasks = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/tasks", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const deleteTask = async (taskId: string) => {
    // Specify taskId type as string
    try {
      await axios.delete(`http://localhost:5000/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setTasks(tasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const editTaskTitle = async (taskId: string, newTitle: string) => {
    // Specify taskId and newTitle types as string
    try {
      await axios.patch(
        `http://localhost:5000/tasks/${taskId}`,
        { name: newTitle },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setTasks(
        tasks.map((task) =>
          task._id === taskId ? { ...task, name: newTitle } : task
        )
      );
    } catch (error) {
      console.error("Error editing task title:", error);
    }
  };

  const editTaskDescription = async (
    taskId: string,
    newDescription: string
  ) => {
    // Specify taskId and newDescription types as string
    try {
      await axios.patch(
        `http://localhost:5000/tasks/${taskId}`,
        { description: newDescription },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setTasks(
        tasks.map((task) =>
          task._id === taskId ? { ...task, description: newDescription } : task
        )
      );
    } catch (error) {
      console.error("Error editing task description:", error);
    }
  };

  const handleDashboard = () => {
    navigate("/dashboard");
  };
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <div className="max-w-3xl w-full bg-white shadow-md rounded-md p-8">
        <h1 className="text-3xl font-semibold mb-6">Tasks</h1>
        <div className="mb-6">
          <ul>
            {tasks.map((task) => (
              <li key={task._id} className="mb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold">{task.name}</h2>
                    <p className="text-gray-600">{task.description}</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => deleteTask(task._id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => {
                        const newTitle = prompt("Enter new title:", task.name);
                        if (newTitle) editTaskTitle(task._id, newTitle);
                      }}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      Edit Title
                    </button>
                    <button
                      onClick={() => {
                        const newDescription = prompt(
                          "Enter new description:",
                          task.description
                        );
                        if (newDescription)
                          editTaskDescription(task._id, newDescription);
                      }}
                      className="text-green-500 hover:text-green-600"
                    >
                      Edit Description
                    </button>
                  </div>
                  <h1 className="text-2xl">User : {task.assignee.username}</h1>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <section className="flex justify-between">
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
          >
            Logout
          </button>
          <button
            onClick={handleDashboard}
            className="bg-blue-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
          >
            Dashboard
          </button>
        </section>
      </div>
    </div>
  );
};

export default Tasks;
