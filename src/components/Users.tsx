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
      console.log(userId);
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
    <div className="min-h-screen bg-gray-300  flex flex-col justify-center items-center">
      <div className="max-w-3xl w-full bg-white shadow-md rounded-md p-8">
        <h1 className="text-3xl font-semibold mb-6">Users</h1>
        <ul>
          {users.map((user) => (
            <li
              key={user._id}
              className="mb-4 flex justify-between items-center"
            >
              <div>
                <h2 className="text-xl font-semibold">{user.username}</h2>
                <p className="text-gray-600">Role: {user.role}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => deleteUser(user._id)}
                  className="text-red-500 hover:text-red-600"
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
                  className="text-blue-500 hover:text-blue-600"
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
                  className="text-blue-500 hover:text-blue-600"
                >
                  Change Username
                </button>
              </div>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between">
          <button
            onClick={seeTasks}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            See Tasks
          </button>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Users;
