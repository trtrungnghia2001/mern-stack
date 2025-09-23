export interface ICreateDTO {
  name: string;
  board: string;
}
export interface IColumn {
  _id: string;
  name: string;

  position: number;
  bgColor: number;

  board: string;
  isSave: boolean;

  createdAt: string;
  updatedAt: string;
}
