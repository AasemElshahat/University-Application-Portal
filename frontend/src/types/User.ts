export interface User {
  userID: string;
  firstName?: string;
  lastName?: string;
  isAdministrator?: boolean;
}

export interface CreateUpdateUserData {
  userID: string;
  firstName: string;
  lastName: string;
  password: string;
  isAdministrator: boolean;
}
