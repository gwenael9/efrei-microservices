export interface Task {
  id: number;
  title: string;
  description: string;
  user: User;
}


export interface User {
  id: string;
  username: string;
  email: string;
}
