import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Task } from "../types/task";
import Swal from "sweetalert2";

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

  const handleTaskCompletion = async (taskId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      await axios.patch(
        `http://localhost:5000/resources/${taskId}/complete`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTasks(
        tasks.map((task) =>
          task._id === taskId ? { ...task, completed: true } : task
        )
      );
      Swal.fire({
        icon: "success",
        title: "Task Completed!",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error("Error completing task:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error completing task!",
      });
    }
  };

  const handleTaskUncompletion = async (taskId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      await axios.patch(
        `http://localhost:5000/resources/${taskId}/uncomplete`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, completed: false } : task
        )
      );
      Swal.fire({
        icon: "success",
        title: "Task Marked as Uncompleted!",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error("Error marking task as uncompleted:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error marking task as uncompleted!",
      });
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navigateComplete = () => {
    navigate("/completed-tasks");
  };

  const navigateUnfulfilled = () => {
    navigate("/unfulfilled-tasks");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 via-purple-500 to-pink-600 flex flex-col justify-center items-center">
      <div className="max-w-3xl w-full bg-white shadow-lg rounded-lg p-8 animate__animated animate__fadeIn">
        <section className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">My Tasks</h1>
          <div className="flex space-x-4">
            <h1
              className="text-xl font-semibold text-blue-600 cursor-pointer hover:text-blue-800"
              onClick={navigateComplete}
            >
              Completed Tasks
            </h1>
            <h1
              className="text-xl font-semibold text-pink-600 cursor-pointer hover:text-pink-800"
              onClick={navigateUnfulfilled}
            >
              Unfulfilled Tasks
            </h1>
          </div>
        </section>

        <div className="mb-6">
          {tasks.length === 0 ? (
            <p className="text-gray-600 text-lg">
              You don't have any tasks at the moment.
            </p>
          ) : (
            <ul>
              {tasks.map((task) => (
                <li
                  key={task._id}
                  className="mb-4 p-4 bg-gray-100 rounded-lg shadow-md"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">
                        {task.name}
                      </h2>
                      <p className="text-gray-600">{task.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!task.completed && (
                        <button
                          onClick={() => handleTaskCompletion(task._id)}
                          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 transition duration-300"
                        >
                          Mark as Completed
                        </button>
                      )}
                      {task.completed && (
                        <div className="flex items-center space-x-2">
                          <p className="text-green-500 font-semibold">
                            Completed
                          </p>
                          <button
                            onClick={() => handleTaskUncompletion(task._id)}
                            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 transition duration-300"
                          >
                            Mark as Uncompleted
                          </button>
                        </div>
                      )}
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
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 transition duration-300"
          >
            Logout
          </button>
        </section>
      </div>
    </div>
  );
};

export default Tasks;
