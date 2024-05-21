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
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token || !userId) {
          navigate("/login");
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/resources/user-tasks/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [userId, navigate]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <div className="max-w-3xl w-full bg-white shadow-md rounded-md p-8">
        <h1 className="text-3xl font-semibold mb-6">My Tasks</h1>
        <div className="mb-6">
          {tasks.length === 0 ? (
            <p className="text-gray-600 text-lg">
              You don't have any tasks at the moment.
            </p>
          ) : (
            <ul>
              {tasks.map((task) => (
                <li key={task._id} className="mb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-semibold">
                        Title: {task.name}
                      </h2>
                      <p className="text-gray-600">
                        Description: {task.description}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <section className="flex justify-between">
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
          >
            Logout
          </button>
        </section>
      </div>
    </div>
  );
};

export default Tasks;
