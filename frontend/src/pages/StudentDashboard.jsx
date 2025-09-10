import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { formatDate } from "../utils/date";
import { useState } from "react";
import { User, Mail, BookOpen, Calendar, Edit, Save, X, LogOut, Settings, Lock } from "lucide-react";
import toast from "react-hot-toast";

const StudentDashboard = () => {
    const { user, logout, updateStudent, changePassword } = useAuthStore();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        course: user?.course || "",
    });
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const handleLogout = () => {
        logout();
        toast.success("Logged out successfully");
    };

    const handleEdit = () => {
        setIsEditing(true);
        setFormData({
            name: user.name,
            email: user.email,
            course: user.course,
        });
    };

    const handleCancel = () => {
        setIsEditing(false);
        setFormData({
            name: user.name,
            email: user.email,
            course: user.course,
        });
    };

    const handleSave = async () => {
        try {
            await updateStudent(user._id, formData);
            setIsEditing(false);
            toast.success("Profile updated successfully");
        } catch (error) {
            toast.error("Failed to update profile");
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
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

    if (user?.role !== "student") {
        return <div className="text-white text-center">Access Denied. Students only.</div>;
    }

    return (
        <div className="min-h-screen w-full p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto"
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-600 text-transparent bg-clip-text">
                            Student Dashboard
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

                {/* Profile Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl p-8 border border-gray-700 mb-8"
                >
                    <div className="flex justify-between items-start mb-6">
                        <h2 className="text-2xl font-semibold text-white">My Profile</h2>
                        {!isEditing ? (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleEdit}
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white font-medium"
                            >
                                <Edit size={16} />
                                Edit Profile
                            </motion.button>
                        ) : (
                            <div className="flex gap-2">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleSave}
                                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white font-medium"
                                >
                                    <Save size={16} />
                                    Save
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleCancel}
                                    className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg text-white font-medium"
                                >
                                    <X size={16} />
                                    Cancel
                                </motion.button>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-gray-300 text-sm font-medium">
                                <User size={16} />
                                Full Name
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                            ) : (
                                <p className="text-white text-lg">{user.name}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-gray-300 text-sm font-medium">
                                <Mail size={16} />
                                Email Address
                            </label>
                            {isEditing ? (
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                            ) : (
                                <p className="text-white text-lg">{user.email}</p>
                            )}
                        </div>

                        {/* Course */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-gray-300 text-sm font-medium">
                                <BookOpen size={16} />
                                Course
                            </label>
                            {isEditing ? (
                                <select
                                    name="course"
                                    value={formData.course}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                >
                                    <option value="MERN Bootcamp">MERN Bootcamp</option>
                                    <option value="React Fundamentals">React Fundamentals</option>
                                    <option value="Node.js Backend">Node.js Backend</option>
                                    <option value="Full Stack Development">Full Stack Development</option>
                                </select>
                            ) : (
                                <span className="inline-block px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full">
                                    {user.course}
                                </span>
                            )}
                        </div>

                        {/* Enrollment Date */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-gray-300 text-sm font-medium">
                                <Calendar size={16} />
                                Enrollment Date
                            </label>
                            <p className="text-white text-lg">{formatDate(user.enrollmentDate)}</p>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl p-6 border border-gray-700"
                    >
                        <div className="text-center">
                            <div className="text-3xl font-bold text-green-400 mb-2">
                                {Math.floor((new Date() - new Date(user.enrollmentDate)) / (1000 * 60 * 60 * 24))}
                            </div>
                            <p className="text-gray-300 text-sm">Days Enrolled</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl p-6 border border-gray-700"
                    >
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-400 mb-2">Active</div>
                            <p className="text-gray-300 text-sm">Status</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl p-6 border border-gray-700"
                    >
                        <div className="text-center">
                            <div className="text-3xl font-bold text-purple-400 mb-2">Student</div>
                            <p className="text-gray-300 text-sm">Role</p>
                        </div>
                    </motion.div>
                </div>

                {/* Course Content Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl border border-gray-700 overflow-hidden mt-8"
                >
                    <div className="p-6 border-b border-gray-700">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-white">Course Content</h2>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <BookOpen size={16} />
                                <span>{user?.course}</span>
                            </div>
                        </div>
                    </div>

                    {/* Content Not Available Message */}
                    <div className="p-12 text-center">
                        <div className="max-w-md mx-auto">
                            <div className="mb-6">
                                <div className="w-16 h-16 bg-gray-700 bg-opacity-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <BookOpen size={32} className="text-gray-400" />
                                </div>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-300 mb-3">
                                Course Content Coming Soon!
                            </h3>
                            <p className="text-gray-400 text-sm leading-relaxed mb-6">
                                We're working hard to prepare amazing course materials for you.
                                Course content for <span className="text-green-400 font-medium">{user?.course}</span> will be uploaded soon.
                            </p>
                        </div>
                    </div>
                </motion.div>

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

export default StudentDashboard;
