export interface ICreateDTO {
  name: string;
  column: string;
}
export interface IUpdateDTO {
  name: string;
}
export interface ITask {
  _id: string;
  name: string;

  column: string;
  position: number;
  complete: boolean;

  description: string;
  files: IFile[];
  todos: ITodo[];

  createdAt: string;
  updatedAt: string;
}

export interface ITodo {
  _id: string;
  name: string;
  complete: boolean;
}
export interface IFile {
  _id: string;
  name: string;
  url: string;
}
