import { memo } from "react";
import { Paperclip, X } from "lucide-react";
import { tasks } from "../data";
import TaskModelTodoList from "./TaskModelTodoList";
import TaskModelFilesList from "./TaskModelFilesList";
import TiptapEditorComponent from "@/shared/components/form/tiptap-editor-component";
import { useNavigate, useParams } from "react-router-dom";
import TaskModelCommentList from "./TaskModelCommentList";

const TaskModel = () => {
  const { taskId } = useParams();
  const taskData = tasks.find((item) => item._id === taskId);

  const navigate = useNavigate();
  const { boardId } = useParams();

  const closeModal = () => {
    navigate(`/kanban/board/${boardId}`);
  };

  return (
    <div className="fixed inset-0 w-screen h-screen flex items-center justify-center">
      {/* background overlay */}
      <div
        onClick={closeModal}
        className="absolute inset-0 bg-black/50 -z-10"
      ></div>

      {/* modal */}
      <div className="overflow-hidden relative flex flex-col max-w-[1080px] w-full max-h-[calc(100vh-32px)] rounded-lg bg-white shadow">
        <div className="absolute top-3 right-3">
          <button
            onClick={closeModal}
            className="rounded-full overflow-hidden p-1 bg-white/50 hover:bg-white"
          >
            <X size={16} />
          </button>
        </div>

        <div
          className="min-h-40 w-full border-b"
          style={{
            background: `url('https://giaytrekking.com/wp-content/uploads/2024/01/Nhung-dieu-co-ban-ve-nui-Phu-Si.jpg') no-repeat center center / cover`,
          }}
        ></div>
        <div className="flex-1 flex overflow-hidden">
          {/* left */}
          <div className="w-[60%] p-7 border-r space-y-8 overflow-y-auto">
            {/* name */}
            <div className="flex items-center gap-3">
              <input type="checkbox" checked={taskData.complete} />
              <div className="font-bold text-xl">{taskData.name}</div>
            </div>

            {/* description */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Paperclip size={16} />
                <div className="font-bold text-base">Describe</div>
              </div>
              <TiptapEditorComponent content={taskData.description} />
            </div>

            {/* file */}
            <TaskModelFilesList files={taskData.files} />

            {/* todolist */}
            <TaskModelTodoList todos={taskData.todos} />
          </div>

          {/* right */}
          <div className="w-[40%] p-4 overflow-y-auto bg-[#f8f8f8]">
            {/* comment */}
            <TaskModelCommentList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(TaskModel);
