import { TravelModel } from "./TravelModel";
import { UserModel } from "./Users";

export interface UserTravelModel {
  id: number;
  user: UserModel;
  travel: TravelModel;
  status: string;
  createdAt: string;
}
