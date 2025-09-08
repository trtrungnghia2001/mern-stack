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

  board: string;
  position: number;
  bgColor: number;

  createdAt: string;
  updatedAt: string;
}
