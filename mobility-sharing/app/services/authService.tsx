import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import api from "./api";

const API_URL = "http://10.0.2.2:8080/auth";

export const login = async (username: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      username,
      password,
    });

    if (response.data?.access_token && response.data?.refresh_token) {
      await AsyncStorage.setItem("access_token", response.data.access_token);
      await AsyncStorage.setItem("refresh_token", response.data.refresh_token);
      return response.data.access_token;
    }

    throw new Error("Invalid response from server");
  } catch (error: any) {
    console.error("Login error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Error while logging in");
  }
};

export const logout = async () => {
  try {
    const response = await api.post(`${API_URL}/logout`);
    await AsyncStorage.removeItem("access_token");
    await AsyncStorage.removeItem("refresh_token");
  } catch (error: any) {
    if (error.response) {
      console.error("Logout error:", error.response.data || error.message);
    } else {
      console.error("Logout error:", error.message);
    }
  }
};

export const register = async (
  name: string,
  email: string,
  username: string,
  password: string
) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      name,
      email,
      username,
      password,
      roleId: 1,
    });

    if (response.status === 200) {
      return { success: true };
    }

    throw new Error("Invalid response from server");
  } catch (error: any) {
    console.error("Register error:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || "Error while registering",
    };
  }
};

export const getToken = async () => {
  return await AsyncStorage.getItem("access_token");
};

const authService = {
  login,
  logout,
  register,
  getToken,
};

export default authService;
