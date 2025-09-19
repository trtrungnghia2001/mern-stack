import mongoose from "mongoose";

export const getBoardListAddFavorite = async (boardModel, userId, filter) => {
  const pipeline = Array.isArray(filter) ? filter : [filter];
  return await boardModel.aggregate([
    ...pipeline,
    {
      $lookup: {
        from: "kanbanfavoriteboards",
        let: { boardId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$board", "$$boardId"] },
                  { $eq: ["$user", new mongoose.Types.ObjectId(userId)] },
                ],
              },
            },
          },
        ],
        as: "favoriteInfo",
      },
    },
    {
      $addFields: {
        favorite: { $gt: [{ $size: "$favoriteInfo" }, 0] },
      },
    },
    {
      $project: {
        favoriteInfo: 0,
      },
    },
  ]);
};
