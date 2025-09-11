import TiptapEditorComponent from "@/shared/components/form/tiptap-editor-component";
import clsx from "clsx";
import { NotebookPen } from "lucide-react";
import { memo, useState } from "react";

interface TaskModelDescriptionProps {
  value: string;
  updateValue: (value: string) => void;
}

const TaskModelDescription = ({
  value,
  updateValue,
}: TaskModelDescriptionProps) => {
  const [description, setDescription] = useState(value);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <NotebookPen size={16} />
          <div className="font-bold text-base">Describe</div>
        </div>
        <button
          onClick={() => updateValue(description)}
          className={clsx([
            `px-3 py-1.5 rounded bg-blue-500 text-white`,
            `disabled:cursor-not-allowed disabled:opacity-50`,
          ])}
          disabled={description === value}
        >
          Save
        </button>
      </div>
      <TiptapEditorComponent
        content={description}
        setContent={(value) => setDescription(value)}
      />
    </div>
  );
};

export default memo(TaskModelDescription);
