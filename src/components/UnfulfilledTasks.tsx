import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Task } from "../types/task";

const UnfulfilledTasks = () => {
  const navigate = useNavigate();
  const [unfulfilledTasks, setUnfulfilledTasks] = useState<Task[]>([]);

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
        setUnfulfilledTasks(
          response.data.filter((task: Task) => !task.completed)
        );
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [userId, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 flex flex-col justify-center items-center">
      <div className="max-w-3xl w-full bg-white shadow-lg rounded-lg p-8 animate__animated animate__fadeIn">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Unfulfilled Tasks
        </h1>
        <ul>
          {unfulfilledTasks.map((task) => (
            <li key={task._id} className="mb-4">
              <div className="bg-gray-100 p-4 rounded-md shadow-sm">
                <p className="text-lg font-semibold text-gray-800">
                  {task.name}
                </p>
                <p className="text-gray-600">{task.description}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="flex justify-between mt-8">
          <Link
            to="/completed-tasks"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-300"
          >
            Go to Completed Tasks
          </Link>
          <button
            onClick={() => navigate("/tasks")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600 transition duration-300"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnfulfilledTasks;
