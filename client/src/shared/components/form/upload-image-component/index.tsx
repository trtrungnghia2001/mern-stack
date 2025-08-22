import {
  memo,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FC,
  type HTMLAttributes,
} from "react";
import { Button } from "../../ui/button";
import { Upload, X } from "lucide-react";
import clsx from "clsx";
import { toast } from "sonner";

type PreviewType = "avatar" | "thumbnail" | "image";

interface IPreviewFile {
  type: "image" | "video";
  url: string;
  width?: number;
  height?: number;
}

interface UploadImageListComponentProps extends HTMLAttributes<HTMLElement> {
  data?: IPreviewFile[];
  onChangeFile?: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  previewType?: PreviewType;
  max?: number;
  mediaWidth?: number;
  mediaHeight?: number;
}

const UploadImageComponent: FC<UploadImageListComponentProps> = ({
  data,
  onChangeFile,
  accept,
  multiple = false,
  disabled = false,
  previewType = "thumbnail",
  max,
  mediaWidth,
  mediaHeight,
  className,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<FileList | null>(null);
  const [previewFiles, setPreviewFiles] = useState<IPreviewFile[]>([]);

  // set preview images when files change
  useEffect(() => {
    if (!files || files.length === 0) return;
    const filesArray = Array.from(files);

    const newPreviewFiles: IPreviewFile[] = filesArray.map((file) => ({
      type: file.type.startsWith("video") ? "video" : "image",
      url: URL.createObjectURL(file),
    }));
    setPreviewFiles(newPreviewFiles);

    return () => {
      newPreviewFiles.forEach((media) => URL.revokeObjectURL(media.url));
    };
  }, [files]);

  // set preview images when data change
  useEffect(() => {
    if (data && !files) {
      setPreviewFiles(data);
    }
  }, [data, files]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files;
    if (!newFiles) return;
    if (max && newFiles.length > max) {
      toast.error(`You can only upload up to ${max} files.`);
      return;
    }

    setFiles(newFiles);
    onChangeFile?.(Array.from(newFiles));
  };
  const handleRemoveImage = (index: number) => {
    const updated = previewFiles.filter((_, i) => i !== index);
    setPreviewFiles(updated);
  };

  return (
    <div className={clsx(["space-y-4", className])}>
      {/* preview */}
      {previewFiles.length > 0 && (
        <ul className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {previewFiles.map((media, idx) => (
            <li
              key={idx}
              style={{
                width: mediaWidth || media.width || 160,
                height: mediaHeight || media.height || "auto",
              }}
              className={clsx([
                "relative rounded overflow-hidden group border-2",
                previewType === "avatar" && "aspect-square !rounded-full",
                previewType === "thumbnail" && "aspect-video ",
                previewType === "image" && "aspect-[9/14] ",
              ])}
            >
              <button
                type="button"
                onClick={() => handleRemoveImage(idx)}
                className="absolute z-10 top-1 right-1 rounded-full overflow-hidden p-0.5 bg-gray-200 hidden group-hover:block"
              >
                <X size={16} />
              </button>
              {media.type === "video" && <video src={media.url} controls />}
              {media.type === "image" && (
                <img
                  src={media.url}
                  alt={`preview-${idx}`}
                  loading="lazy"
                  className="img"
                />
              )}
            </li>
          ))}
        </ul>
      )}
      {/* input */}
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        hidden
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <Button
        disabled={disabled}
        type="button"
        size={"sm"}
        onClick={handleClick}
      >
        <Upload />
        Upload
      </Button>
    </div>
  );
};

export default memo(UploadImageComponent);
