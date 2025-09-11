export interface ICreateDTO {
  name: string;
  column: string;
  board: string;
}
export interface ITask {
  _id: string;
  name: string;
  position: number;
  bgUrl: string;

  column: string;
  board: string;
  complete: boolean;

  description: string;
  files: IFile[];
  todos: ITodo[];

  createdAt: string;
  updatedAt: string;
}
//
export interface ITodo {
  _id: string;
  name: string;
  complete: boolean;
}
export interface ITodoCreate {
  name: string;
  complete: boolean;
}

export interface IFile {
  asset_id: string;
  url: string;
  created_at: string;
  resource_type: string;
}
