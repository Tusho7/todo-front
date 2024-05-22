import axios from "axios";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { User } from "../types/user";
import { useNavigate } from "react-router-dom";

const Users = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUsers(response.data);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error fetching users. Please try again later.",
        });
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const deleteUser = async (userId: string) => {
    try {
      await axios.delete(`http://localhost:5000/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUsers(users.filter((user) => user._id !== userId));
      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "User has been deleted.",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error deleting user. Please try again later.",
      });
      console.error("Error deleting user:", error);
    }
  };

  const changeUserRole = async (userId: string, newRole: string) => {
    try {
      await axios.patch(
        `http://localhost:5000/user/${userId}/role`,
        { role: newRole },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, role: newRole } : user
        )
      );
      Swal.fire({
        icon: "success",
        title: "Updated",
        text: "User role has been updated.",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error updating user role. Please try again later.",
      });
      console.error("Error updating user role:", error);
    }
  };

  const changeUsername = async (userId: string, newUsername: string) => {
    try {
      await axios.patch(
        `http://localhost:5000/user/${userId}/username`,
        { username: newUsername },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, username: newUsername } : user
        )
      );
      Swal.fire({
        icon: "success",
        title: "Updated",
        text: "Username has been updated.",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error updating username. Please try again later.",
      });
      console.error("Error updating username:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const seeTasks = () => {
    navigate("/all-tasks");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 flex flex-col justify-center items-center">
      <div className="max-w-4xl w-full bg-white shadow-xl rounded-lg p-8 animate__animated animate__fadeIn">
        <h1 className="text-4xl font-bold text-center mb-6">User Management</h1>
        <ul>
          {users.map((user) => (
            <li
              key={user._id}
              className="mb-4 flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow hover:bg-gray-200 transition duration-300 ease-in-out transform hover:scale-105"
            >
              <div>
                <h2 className="text-xl font-semibold">{user.username}</h2>
                <p className="text-gray-600">Role: {user.role}</p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => deleteUser(user._id)}
                  className="text-red-500 hover:text-red-600 transition duration-300 ease-in-out transform hover:scale-110 active:scale-95"
                >
                  Delete
                </button>
                <button
                  onClick={() => {
                    Swal.fire({
                      title: "Change Role",
                      input: "select",
                      inputOptions: {
                        admin: "Admin",
                        user: "User",
                      },
                      inputPlaceholder: "Select a role",
                      showCancelButton: true,
                    }).then((result) => {
                      if (result.value) {
                        changeUserRole(user._id, result.value);
                      }
                    });
                  }}
                  className="text-blue-500 hover:text-blue-600 transition duration-300 ease-in-out transform hover:scale-110 active:scale-95"
                >
                  Change Role
                </button>
                <button
                  onClick={() => {
                    Swal.fire({
                      title: "Change Username",
                      input: "text",
                      inputPlaceholder: "Enter new username",
                      showCancelButton: true,
                    }).then((result) => {
                      if (result.value) {
                        changeUsername(user._id, result.value);
                      }
                    });
                  }}
                  className="text-blue-500 hover:text-blue-600 transition duration-300 ease-in-out transform hover:scale-110 active:scale-95"
                >
                  Change Username
                </button>
              </div>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={seeTasks}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-700 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-105 active:scale-95"
          >
            See Tasks
          </button>
          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-red-700 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-105 active:scale-95"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Users;
