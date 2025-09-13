import { Download, Paperclip, Trash } from "lucide-react";
import React, { memo, useRef, useState } from "react";
import type { IFile } from "../types/task.type";
import instance from "@/configs/axios.config";
import type { ResponseSuccessType } from "@/shared/types/response";
import type { IUploadFile } from "@/features/upload/types/upload.type";

interface TaskModelFilesListProps {
  files: IFile[];
  uploadFiles: (files: IFile[]) => void;
}

const TaskModelFilesList = ({
  files,
  uploadFiles,
}: TaskModelFilesListProps) => {
  const [progress, setProgress] = useState<number>(0);
  const fileRef = useRef<HTMLInputElement>(null);
  const handleUploadClick = () => {
    if (!fileRef.current) return;

    fileRef.current.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("singleFile", file);

    try {
      const resp = await instance.post<ResponseSuccessType<IUploadFile>>(
        "/api/v1/upload/single",
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total ?? 1)
            );
            setProgress(percent);
          },
        }
      );

      setProgress(0); // reset sau khi xong
      const newFile: IFile = {
        asset_id: resp.data.data.asset_id,
        resource_type: resp.data.data.resource_type,
        url: resp.data.data.url,
        created_at: resp.data.data.created_at,
      };
      const newFiles = [newFile, ...files];
      uploadFiles(newFiles);
    } catch (error) {
      console.error("Upload error:", error);
      setProgress(0);
    }
  };

  const handleFileRemove = async (url: string) => {
    try {
      const resp = await instance.post<ResponseSuccessType<{ result: string }>>(
        "/api/v1/upload/delete",
        { url }
      );

      if (resp.data.data.result === "ok") {
        const newFiles = files.filter((item) => item.url !== url);
        uploadFiles(newFiles);
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Paperclip size={14} />
          <div className="font-bold">File</div>
        </div>
        <button
          onClick={handleUploadClick}
          className={`px-3 py-1.5 rounded bg-blue-500 text-white`}
        >
          Upload
        </button>
        <input
          ref={fileRef}
          className="hidden"
          type="file"
          onChange={handleFileChange}
        />
      </div>
      {/* list */}
      <ul className="space-y-2">
        {progress > 0 && (
          <li className="flex gap-3 items-center">
            <span className="text-xs text-gray-500">Upload</span>
            <div className="w-full bg-gray-200 rounded h-2">
              <div
                className="bg-green-500 h-2 rounded"
                style={{ width: `${progress}%` }}
              />
            </div>
          </li>
        )}
        {files.map((item) => (
          <li key={item.asset_id} className="flex gap-3 items-center">
            <div className="aspect-video w-20 rounded overflow-hidden border">
              <img src={item.url} alt="file" loading="lazy" className="img" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="font-medium line-clamp-1">{item.asset_id}</div>
              <div className="text-gray-500 text-xs">
                {new Date(item.created_at).toLocaleString()}
              </div>
            </div>
            <a className="block" href={item.url} download={item.url}>
              <Download size={15} className="hover:text-blue-500" />
            </a>
            <button onClick={() => handleFileRemove(item.url)}>
              <Trash className="hover:text-red-500" size={15} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default memo(TaskModelFilesList);
