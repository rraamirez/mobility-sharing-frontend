import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import api from "./api";

const API_URL = "http://10.0.2.2:8080/mobility-sharing-user";

export const getMyUser = async () => {
  try {
    const response = await api.get(`${API_URL}/me`);
    console.log("Get user response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Get user error:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || "Error while getting user"
    );
  }
};

export const updateMyUser = async (user: any) => {
  try {
    const response = await api.put(`${API_URL}/`, user);
    console.log("Update user response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Update user error:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || "Error while updating user"
    );
  }
};

export const getWeeklyEnvironmentalStats = async () => {
  try {
    const response = await api.get(`${API_URL}/weekly-environmental-stats`);
    console.log("Weekly environmental stats:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "Get environmental stats error:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message ||
        "Error while fetching environmental stats"
    );
  }
};

const userService = {
  getMyUser,
  updateMyUser,
  getWeeklyEnvironmentalStats,
};

export default userService;
