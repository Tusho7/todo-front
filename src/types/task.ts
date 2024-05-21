export interface Task {
  _id: string;
  name: string;
  description: string;
  assignee: Assignee;
  completed: boolean;
}

export interface Assignee {
  username: string;
  _id: string;
}
