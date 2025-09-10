export interface ICreateDTO {
  name: string;
  bgColor: number;
}

export interface IBoard {
  _id: string;
  name: string;
  bgColor: number;
  position: number;

  favorite: boolean;

  createdAt: string;
  updatedAt: string;
}
