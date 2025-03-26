import api from "./api";
import { TravelModel } from "../models/TravelModel";

const API_URL = "http://10.0.2.2:8080/travel";

export const getUnratedTrips = async (userId: number) => {
  try {
    const response = await api.get(`${API_URL}/unratedTravels/${userId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error while getting unrated trips"
    );
  }
};

const travelService = {
  getUnratedTrips,
};

export default travelService;
