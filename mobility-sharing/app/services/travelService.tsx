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

export const getTravelsByOriginAndDestination = async (
  origin: string,
  destination: string
): Promise<TravelModel[]> => {
  try {
    const response = await api.get(`${API_URL}/origin-destination`, {
      params: { origin, destination },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error while fetching trips"
    );
  }
};

const travelService = {
  getUnratedTrips,
  getTravelsByOriginAndDestination,
};

export default travelService;
