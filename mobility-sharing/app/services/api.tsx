import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({
  baseURL: "http://10.0.2.2:8080",
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("access_token");
  console.log("token es", token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

//here you can handle more types of responses

export default api;
