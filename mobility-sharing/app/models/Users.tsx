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
}
