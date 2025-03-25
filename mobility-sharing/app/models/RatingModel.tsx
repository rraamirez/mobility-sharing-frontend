import { TravelModel } from "./TravelModel";
import { UserModel } from "./Users";

export interface RatingModel {
    id: number;
    ratingUser: UserModel;
    ratedUser: UserModel;
    travel?: TravelModel;
    rating: number;
    comment?: string;
    createdAt: string;
}
