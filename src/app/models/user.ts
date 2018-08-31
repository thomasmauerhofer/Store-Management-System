export class User {
  id: number;
  username: string;
  password: string;
  role: Role;
}

export enum Role {
  Admin,
  User
}
