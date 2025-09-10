export interface ICreateDTO {
  name: string;
  board: string;
}
export interface IUpdateDTO {
  name: string;
}
export interface IColumn {
  _id: string;
  name: string;

  position: number;
  bgColor: number;

  board: string;

  createdAt: string;
  updatedAt: string;
}
