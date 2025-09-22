import TiptapEditorComponent from "@/shared/components/form/tiptap-editor-component";
import { Button } from "@/shared/components/ui/button";
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
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <NotebookPen size={14} />
        <div className="font-bold">Describe</div>
      </div>
      <TiptapEditorComponent
        content={description}
        setContent={(value) => setDescription(value)}
      />
      {description !== value && (
        <Button
          size={"sm"}
          onClick={() => updateValue(description)}
          disabled={description === value}
        >
          Save
        </Button>
      )}
    </div>
  );
};

export default memo(TaskModelDescription);
