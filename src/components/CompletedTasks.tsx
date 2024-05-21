import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Task } from "../types/task";

const CompletedTasks = () => {
  const navigate = useNavigate();
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
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
        setCompletedTasks(response.data.filter((task: Task) => task.completed));
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [userId, navigate]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <div className="max-w-3xl w-full bg-white shadow-md rounded-md p-8">
        <h1 className="text-3xl font-semibold mb-6">Completed Tasks</h1>
        <ul>
          {completedTasks.map((task) => (
            <li key={task._id} className="mb-4">
              <div className="bg-gray-200 p-4 rounded-md">
                <p className="text-lg font-semibold">{task.name}</p>
                <p className="text-gray-600">{task.description}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="flex justify-between mt-8">
          <Link
            to="/unfulfilled-tasks"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            Go to Unfulfilled Tasks
          </Link>
          <button
            onClick={() => navigate("/tasks")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompletedTasks;
