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
      status: "PENDING",
    };

    const response = await api.post(`${API_URL}/`, userTravelModel);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error while booking travel"
    );
  }
};

const travelService = {
  bookTravel,
};

export default travelService;
