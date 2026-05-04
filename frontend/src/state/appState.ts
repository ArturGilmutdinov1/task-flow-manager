export type UserRole = "requester" | "operator" | "manager";

export type CurrentUser = {
  id: string;
  name: string;
  role: UserRole;
};

export class AppState {
  currentUser: CurrentUser | null = null;
}
