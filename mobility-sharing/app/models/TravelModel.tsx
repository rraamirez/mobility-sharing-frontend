import { TravelRecurrence } from "./TravelRecurrentModel";
import { UserModel } from "./Users";

export interface TravelModel {
  id: number;
  driver: UserModel;
  origin: string;
  destination: string;
  date: string; // ISO format (e.g., "2023-01-01")
  time: string; // ISO format (e.g., "12:00:00")
  price: number;
  createdAt: string; // ISO format (e.g., "2023-01-01T12:00:00")
  travelRecurrenceModel?: TravelRecurrence;
  latitudeOrigin?: number;
  longitudeOrigin?: number;
  latitudeDestination?: number;
  longitudeDestination?: number;
  status: "ACTIVE" | "COMPLETED" | "CANCELED"; // Enum values from TravelStatus
}
