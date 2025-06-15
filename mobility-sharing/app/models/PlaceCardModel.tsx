import { EcoRankModel } from "./Users";

export interface PlaceCardProps {
  id?: number;
  name?: string;
  description?: string;
  driver?: string;
  driverRating?: number;
  driverEcoRankName?: string;
  environmentalAction?: string;
  date?: string;
  time?: string;
  price?: number;
  latitudeOrigin?: number;
  longitudeOrigin?: number;
  latitudeDestination?: number;
  longitudeDestination?: number;
  enrolled?: boolean;
  status?: "ACTIVE" | "COMPLETED" | "CANCELED"; // Enum values from TravelStatus
  userId?: number;
  userTravelStatus?: "pending" | "confirmed" | "canceled"; // Enum values from UserTravelStatus
  fetchUserData: () => Promise<void>;
} //introduce status and logitude latitude etc accoording to backend
