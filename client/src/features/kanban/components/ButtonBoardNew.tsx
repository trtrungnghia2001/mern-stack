import { memo } from "react";
import BoardModel from "./BoardModel";
import ButtonDropdownMenu from "./ButtonDropdownMenu";

const ButtonBoardNew = () => {
  return (
    <ButtonDropdownMenu
      button={
        <button className="w-full h-full font-medium aspect-video bg-gray-100 hover:bg-gray-200 cursor-pointer shadow rounded-lg">
          Create new table
        </button>
      }
    >
      {(setOpen) => <BoardModel setOpen={setOpen} />}
    </ButtonDropdownMenu>
  );
};

export default memo(ButtonBoardNew);
