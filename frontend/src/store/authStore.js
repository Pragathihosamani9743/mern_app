import { create } from "zustand";
import axios from "axios";

// For Vercel deployment, API will be on the same domain
const API_URL = import.meta.env.VITE_API_URL || "/api/auth";

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
	user: null,
	isAuthenticated: false,
	error: null,
	isLoading: false,
	isCheckingAuth: true,
	message: null,
	students: [],

	signup: async (email, password, name, role = "student", course = "MERN Bootcamp") => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/signup`, { email, password, name, role, course });
			set({ user: response.data.user, isAuthenticated: true, isLoading: false });
		} catch (error) {
			set({ error: error.response.data.message || "Error signing up", isLoading: false });
			throw error;
		}
	},

	login: async (email, password) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/login`, { email, password });
			set({
				isAuthenticated: true,
				user: response.data.user,
				error: null,
				isLoading: false,
			});
		} catch (error) {
			set({ error: error.response?.data?.message || "Error logging in", isLoading: false });
			throw error;
		}
	},

	logout: async () => {
		set({ isLoading: true, error: null });
		try {
			await axios.post(`${API_URL}/logout`);
			set({ user: null, isAuthenticated: false, error: null, isLoading: false, students: [] });
		} catch (error) {
			set({ error: "Error logging out", isLoading: false });
			throw error;
		}
	},

	checkAuth: async () => {
		set({ isCheckingAuth: true, error: null });
		try {
			const response = await axios.get(`${API_URL}/check-auth`);
			set({ user: response.data.user, isAuthenticated: true, isCheckingAuth: false });
		} catch (error) {
			set({ error: null, isCheckingAuth: false, isAuthenticated: false });
		}
	},

	getAllStudents: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.get(`${API_URL}/students`);
			set({ students: response.data.students, isLoading: false });
		} catch (error) {
			set({ error: error.response?.data?.message || "Error fetching students", isLoading: false });
			throw error;
		}
	},

	updateStudent: async (id, userData) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.put(`${API_URL}/students/${id}`, userData);
			set((state) => ({
				isLoading: false,
				students: state.students.map(s => s._id === id ? response.data.user : s)
			}));
		} catch (error) {
			set({ error: error.response?.data?.message || "Error updating student", isLoading: false });
			throw error;
		}
	},

	deleteStudent: async (id) => {
		set({ isLoading: true, error: null });
		try {
			await axios.delete(`${API_URL}/students/${id}`);
			set({
				isLoading: false,
				students: (students) => students.filter(s => s._id !== id)
			});
		} catch (error) {
			set({ error: error.response?.data?.message || "Error deleting student", isLoading: false });
			throw error;
		}
	},

	changePassword: async (currentPassword, newPassword) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.put(`${API_URL}/change-password`, {
				currentPassword,
				newPassword
			});
			set({ isLoading: false, message: response.data.message });
			return response.data;
		} catch (error) {
			set({ error: error.response?.data?.message || "Error changing password", isLoading: false });
			throw error;
		}
	},
}));
