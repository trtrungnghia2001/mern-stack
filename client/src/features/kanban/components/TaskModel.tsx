import { memo } from "react";
import { Paperclip } from "lucide-react";
import { tasks } from "../data";
import TaskModelTodoList from "./TaskModelTodoList";
import TaskModelFilesList from "./TaskModelFilesList";
import TiptapEditorComponent from "@/shared/components/form/tiptap-editor-component";

const TaskModel = () => {
  const taskData = tasks[0];
  return (
    <div className="fixed inset-0 top-0 left-0 right-0 bottom-0">
      <div className="-z-10 absolute inset-0 top-0 left-0 right-0 bottom-0 bg-black/50"></div>
      <div className="py-10 px-6 flex items-center justify-center">
        <div className="max-w-[1080px] w-full rounded-lg bg-white shadow">
          <div className="flex items-start">
            {/* left */}
            <div className="w-[60%] p-7 border-r space-y-6">
              {/* name */}
              <div className="flex items-center gap-3">
                <input type="checkbox" checked />
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
            </div>
            {/* right */}
            <div className="w-[40%] p-4">
              {/* todolist */}
              <TaskModelTodoList todos={taskData.todos} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(TaskModel);
