import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { formatDate } from "../utils/date";
import { useEffect, useState } from "react";
import { Users, UserPlus, Edit, Trash2, LogOut, X, Save, Filter, BookOpen, Lock, Settings } from "lucide-react";
import toast from "react-hot-toast";

const AdminDashboard = () => {
    const { user, logout, getAllStudents, deleteStudent, updateStudent, changePassword, students, isLoading } = useAuthStore();
    const [editingStudent, setEditingStudent] = useState(null);
    const [editForm, setEditForm] = useState({
        name: "",
        email: "",
        course: ""
    });
    const [sortBy, setSortBy] = useState("all"); // "all", "MERN Bootcamp", "React Fundamentals", etc.
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    useEffect(() => {
        getAllStudents();
    }, [getAllStudents]);

    useEffect(() => {
        if (editingStudent) {
            setEditForm({
                name: editingStudent.name,
                email: editingStudent.email,
                course: editingStudent.course
            });
        }
    }, [editingStudent]);

    const handleLogout = () => {
        logout();
        toast.success("Logged out successfully");
    };

    const handleDeleteStudent = async (studentId) => {
        if (window.confirm("Are you sure you want to delete this student?")) {
            try {
                await deleteStudent(studentId);
                toast.success("Student deleted successfully");
                getAllStudents(); // Refresh the list
            } catch (error) {
                toast.error("Failed to delete student");
            }
        }
    };

    const handleUpdateStudent = async (e) => {
        e.preventDefault();
        try {
            await updateStudent(editingStudent._id, editForm);
            toast.success("Student updated successfully");
            setEditingStudent(null);
            getAllStudents(); // Refresh the list
        } catch (error) {
            toast.error("Failed to update student");
        }
    };

    const handleCancelEdit = () => {
        setEditingStudent(null);
        setEditForm({ name: "", email: "", course: "" });
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error("New passwords don't match");
            return;
        }

        if (passwordForm.newPassword.length < 6) {
            toast.error("New password must be at least 6 characters");
            return;
        }

        try {
            await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
            toast.success("Password changed successfully");
            setShowChangePassword(false);
            setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to change password");
        }
    };

    const handleCancelPasswordChange = () => {
        setShowChangePassword(false);
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    };

    // Filter students based on selected course
    const filteredStudents = sortBy === "all"
        ? students
        : students.filter(student => student.course === sortBy);

    // Get unique courses for filter dropdown
    const availableCourses = ["all", ...new Set(students.map(student => student.course))];

    if (user?.role !== "admin") {
        return <div className="text-white text-center">Access Denied. Admin only.</div>;
    }

    return (
        <div className="min-h-screen w-full p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-6xl mx-auto"
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-600 text-transparent bg-clip-text">
                            Admin Dashboard
                        </h1>
                        <p className="text-gray-300 mt-2">Welcome back, {user.name}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowChangePassword(true)}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white font-medium"
                        >
                            <Settings size={18} />
                            Change Password
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleLogout}
                            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white font-medium"
                        >
                            <LogOut size={18} />
                            Logout
                        </motion.button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl p-6 border border-gray-700"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-500 bg-opacity-20 rounded-lg">
                                <Users className="text-green-400" size={24} />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Total Students</p>
                                <p className="text-2xl font-bold text-white">{students.length}</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl p-6 border border-gray-700"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-500 bg-opacity-20 rounded-lg">
                                <UserPlus className="text-blue-400" size={24} />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">New This Month</p>
                                <p className="text-2xl font-bold text-white">
                                    {students.filter(s => new Date(s.enrollmentDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl p-6 border border-gray-700"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-500 bg-opacity-20 rounded-lg">
                                <BookOpen className="text-purple-400" size={24} />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Active Courses</p>
                                <p className="text-2xl font-bold text-white">
                                    {new Set(students.map(s => s.course)).size}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Students Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl border border-gray-700 overflow-hidden"
                >
                    <div className="p-6 border-b border-gray-700">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-white">All Students</h2>
                            <div className="flex items-center gap-2">
                                <Filter className="text-gray-400" size={16} />
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg px-3 py-1 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                >
                                    <option value="all">All Courses</option>
                                    <option value="MERN Bootcamp">MERN Bootcamp</option>
                                    <option value="React Fundamentals">React Fundamentals</option>
                                    <option value="Node.js Backend">Node.js Backend</option>
                                    <option value="Full Stack Development">Full Stack Development</option>
                                </select>
                            </div>
                        </div>
                        {sortBy !== "all" && (
                            <div className="mt-2">
                                <span className="text-sm text-gray-400">
                                    Showing {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''} in "{sortBy}"
                                </span>
                            </div>
                        )}
                    </div>

                    {isLoading ? (
                        <div className="p-8 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
                            <p className="text-gray-400 mt-2">Loading students...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-700 bg-opacity-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Course</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Enrolled</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700">
                                    {filteredStudents.map((student) => (
                                        <tr key={student._id} className="hover:bg-gray-700 hover:bg-opacity-30">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-white">{student.name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-300">{student.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                                    {student.course}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-300">
                                                    {formatDate(student.enrollmentDate)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => setEditingStudent(student)}
                                                        className="text-blue-400 hover:text-blue-300 p-1"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteStudent(student._id)}
                                                        className="text-red-400 hover:text-red-300 p-1"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {filteredStudents.length === 0 && !isLoading && (
                        <div className="p-8 text-center">
                            <p className="text-gray-400">
                                {sortBy === "all"
                                    ? "No students found."
                                    : `No students found in "${sortBy}" course.`
                                }
                            </p>
                            {sortBy !== "all" && (
                                <button
                                    onClick={() => setSortBy("all")}
                                    className="mt-2 text-green-400 hover:text-green-300 text-sm"
                                >
                                    Show all students
                                </button>
                            )}
                        </div>
                    )}
                </motion.div>

                {/* Edit Student Modal */}
                {editingStudent && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-gray-800 bg-opacity-90 backdrop-filter backdrop-blur-lg rounded-xl p-6 w-full max-w-md mx-4 border border-gray-700"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold text-white">Edit Student</h3>
                                <button
                                    onClick={handleCancelEdit}
                                    className="text-gray-400 hover:text-white"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleUpdateStudent} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        value={editForm.name}
                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={editForm.email}
                                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Course
                                    </label>
                                    <select
                                        value={editForm.course}
                                        onChange={(e) => setEditForm({ ...editForm, course: e.target.value })}
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        required
                                    >
                                        <option value="MERN Bootcamp">MERN Bootcamp</option>
                                        <option value="React Fundamentals">React Fundamentals</option>
                                        <option value="Node.js Backend">Node.js Backend</option>
                                        <option value="Full Stack Development">Full Stack Development</option>
                                    </select>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Save size={16} />
                                        Save Changes
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCancelEdit}
                                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}

                {/* Change Password Modal */}
                {showChangePassword && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-gray-800 bg-opacity-90 backdrop-filter backdrop-blur-lg rounded-xl p-6 w-full max-w-md mx-4 border border-gray-700"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold text-white">Change Password</h3>
                                <button
                                    onClick={handleCancelPasswordChange}
                                    className="text-gray-400 hover:text-white"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleChangePassword} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Current Password
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordForm.currentPassword}
                                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordForm.newPassword}
                                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                        minLength={6}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordForm.confirmPassword}
                                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                        minLength={6}
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Lock size={16} />
                                        Change Password
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCancelPasswordChange}
                                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default AdminDashboard;
