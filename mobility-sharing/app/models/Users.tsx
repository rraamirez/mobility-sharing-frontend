export interface RoleModel {
  id: number;
  name: string;
}

export interface UserModel {
  id: number;
  name: string;
  email: string;
  password: string;
  username: string;
  rupeeWallet: number;
  createdAt: string;
  role: RoleModel;
  rating: number;
  ecoRank: EcoRankModel;
}

export interface EcoRankModel {
  id: number;
  name: string;
}
