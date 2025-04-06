export interface PlaceCardProps {
  id?: number;
  name?: string;
  description?: string;
  driver?: string;
  date?: string;
  time?: string;
  price?: number;
  latitude?: number;
  longitude?: number;
  enrolled?: boolean;
  status?: "ACTIVE" | "COMPLETED" | "CANCELED"; // Enum values from TravelStatus
  fetchUserData: () => Promise<void>;
} //introduce status and logitude latitude etc accoording to backend
