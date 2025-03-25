import api from "./api";
import { RatingModel } from "../models/RatingModel";

const API_URL = "http://10.0.2.2:8080/rating";

export const getAllRatings = async () => {
  try {
    const response = await api.get(`${API_URL}/`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error while getting ratings");
  }
};

export const getRatingById = async (id: number) => {
  try {
    const response = await api.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error while getting rating");
  }
};

export const createRating = async (rating: RatingModel) => {
  try {
    const response = await api.post(`${API_URL}/`, rating);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error while creating rating");
  }
};

export const updateRating = async (rating: RatingModel) => {
  try {
    const response = await api.put(`${API_URL}/`, rating);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error while updating rating");
  }
};

export const deleteRating = async (id: number) => {
  try {
    const response = await api.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error while deleting rating");
  }
};

export const getRatingsByRatingUser = async (userId: number) => {
  try {
    const response = await api.get(`${API_URL}/rating-user/${userId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error while getting user ratings");
  }
};

export const getRatingsByRatedUser = async (userId: number) => {
  try {
    const response = await api.get(`${API_URL}/rated-user/${userId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error while getting received ratings");
  }
};

export const getRatingsByTravel = async (travelId: number) => {
  try {
    const response = await api.get(`${API_URL}/travel/${travelId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error while getting travel ratings");
  }
};

const ratingService = {
  getAllRatings,
  getRatingById,
  createRating,
  updateRating,
  deleteRating,
  getRatingsByRatingUser,
  getRatingsByRatedUser,
  getRatingsByTravel,
};

export default ratingService;
