export interface ICreateDTO {
  name: string;
  board: string;
}
export interface IUpdateDTO {
  name: string;
}
export interface IBoard {
  _id: string;
  name: string;

  favorite: boolean;

  createdAt: string;
  updatedAt: string;
}
