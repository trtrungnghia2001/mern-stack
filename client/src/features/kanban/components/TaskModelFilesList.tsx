import { Download, Paperclip, Trash } from "lucide-react";
import React from "react";
import type { IFile } from "../types/task.type";

interface TaskModelFilesListProps {
  files: IFile[];
}

const TaskModelFilesList = ({ files }: TaskModelFilesListProps) => {
  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <Paperclip size={16} />
        <div className="font-bold text-base">File</div>
      </div>
      <ul className="space-y-2">
        {files.map((item) => (
          <li key={item._id} className="flex gap-3 items-center">
            <div className="aspect-video w-20 rounded overflow-hidden border">
              <img src={item.url} alt="file" loading="lazy" className="img" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="font-medium">{item.name}</div>
              <div className="text-gray-500 text-xs">
                {new Date().toLocaleString()}
              </div>
            </div>
            <a className="block" href={item.url} download={item.name}>
              <Download size={15} className="hover:text-blue-500" />
            </a>
            <button>
              <Trash className="hover:text-red-500" size={15} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskModelFilesList;
