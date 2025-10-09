import { Mic, Paperclip, Send, Smile, Square, X } from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { toast } from "sonner";
import { useMessageStore } from "../stores/message.store";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [previewFiles, setPreviewFiles] = useState<string[]>([]);

  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  const handleSend = () => {
    const message = text || transcript;
    if (!message.trim() && !files) return;

    mutate();

    resetTranscript();
    SpeechRecognition.stopListening();
  };

  // listening
  const handleStartListening = () => {
    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
      toast.error(`Trình duyệt không hỗ trợ Speech Recognition.`);
      return;
    }

    SpeechRecognition.startListening({
      continuous: true,
      language: "vi-VN",
    });

    setTimeout(() => {
      SpeechRecognition.stopListening();
    }, 5000);
  };

  // upload file
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleUploadFile = () => {
    fileInputRef.current?.click();
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFiles(files);
    }
  };
  useEffect(() => {
    if (!files || files.length === 0) {
      setPreviewFiles([]);
      return;
    }

    const urls = Array.from(files).map((file) => URL.createObjectURL(file));
    setPreviewFiles(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  //
  const { roomId } = useParams();
  const { sendMessage } = useMessageStore();
  const { isPending, mutate } = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      if (text) formData.append("text", text);
      if (files && files?.length > 0) {
        Array.from(files).forEach((file) => {
          formData.append("files", file);
        });
      }
      return await sendMessage(roomId as string, formData);
    },
    onSuccess: () => {
      setText("");
      setFiles(null);
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <div className="relative">
      {/* preview */}
      {(isPending || previewFiles.length > 0) && (
        <div className="absolute right-0 left-0 bg-gray-100 bottom-full p-2">
          {isPending && <span>Sending...</span>}
          {previewFiles.length > 0 && (
            <ul className="flex flex-wrap gap-2 relative">
              {previewFiles.map((item, idx) => (
                <li key={idx} className="aspect-square w-12">
                  <img src={item} alt="img" loading="lazy" className="img" />
                </li>
              ))}
              <button className="bg-gray-200 rounded-full aspect-square overflow-hidden block">
                <X size={16} />
              </button>
            </ul>
          )}
        </div>
      )}
      {/* input container */}
      <div className="flex items-center gap-3 p-4 border-t border-t-gray-200">
        <button>
          <Smile size={16} />
        </button>

        <input
          type="text"
          value={text || transcript}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a message..."
          className="flex-1 border p-2 rounded-lg outline-none"
        />

        {!listening ? (
          <button onClick={handleStartListening}>
            <Mic size={16} />
          </button>
        ) : (
          <button onClick={SpeechRecognition.stopListening}>
            <Square size={16} className="text-red-500" />
          </button>
        )}

        <button onClick={handleUploadFile}>
          <Paperclip size={16} />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          multiple
        />

        <button onClick={handleSend} className="text-blue-600">
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default memo(MessageInput);
