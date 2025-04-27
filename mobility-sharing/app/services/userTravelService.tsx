import api from "./api";
import { TravelModel } from "../models/TravelModel";
import { UserTravelModel } from "../models/UserTravelModel";

const API_URL = "http://10.0.2.2:8080/user-travel";

export const bookTravel = async (travelId: number, userId: number) => {
  try {
    const userTravelModel: any = {
      id: 0,
      user: { id: userId },
      travel: { id: travelId },
      status: "pending",
    };

    const response = await api.post(`${API_URL}/`, userTravelModel);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error while booking travel"
    );
  }
};

export const cancelUserTravel = async (travelId: number, userId: number) => {
  try {
    const response = await api.put(`${API_URL}/reject/${travelId}/${userId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error while cancelling travel"
    );
  }
};

export const acceptUserTravel = async (travelId: number, userId: number) => {
  try {
    const response = await api.put(`${API_URL}/accept/${travelId}/${userId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error while accepting travel"
    );
  }
};

export const getUserTravelByUserIdAndTravelId = async (
  userId: number,
  travelId: number
) => {
  try {
    const response = await api.get<UserTravelModel>(
      `${API_URL}/${userId}/${travelId}`
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error while fetching user travel"
    );
  }
};

const travelService = {
  bookTravel,
  cancelUserTravel,
  acceptUserTravel,
  getUserTravelByUserIdAndTravelId,
};

export default travelService;
