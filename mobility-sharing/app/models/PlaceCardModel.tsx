export interface PlaceCardProps {
  id?: number;
  name?: string;
  description?: string;
  driver?: string;
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
  fetchUserData: () => Promise<void>;
} //introduce status and logitude latitude etc accoording to backend
