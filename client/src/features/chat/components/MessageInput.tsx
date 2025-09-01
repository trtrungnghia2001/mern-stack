import { Mic, Paperclip, Send, SmilePlus } from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import clsx from "clsx";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useMutation } from "@tanstack/react-query";
import { useMessageStore } from "../stores/message.store";
import { toast } from "sonner";
import { useParams } from "react-router-dom";

const size = 16;

const MessageInput = () => {
  const { id } = useParams();
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const [message, setMessage] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);
  const inputFileRef = useRef<HTMLInputElement | null>(null);

  const handleMicClick = () => {
    if (!browserSupportsSpeechRecognition) {
      return confirm("Browser doesn't support speech recognition.");
    }

    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript(); // reset trước mỗi lần ghi mới
      SpeechRecognition.startListening({ continuous: true, language: "vi-VN" }); // bạn có thể đổi ngôn ngữ ở đây
    }
  };

  // 👉 Khi người dùng ngừng nói
  useEffect(() => {
    if (!listening && transcript) {
      setMessage((prev) => (prev ? prev + " " + transcript : transcript));
      resetTranscript(); // Xóa transcript sau khi gán vào message
    }
  }, [listening]);

  const { sendMess } = useMessageStore();
  const submitResult = useMutation({
    mutationFn: async () => {
      if (!files && !message) return;
      const formData = new FormData();

      formData.append("message", message);
      formData.append("roomId", id as string);

      if (files && files?.length > 0) {
        Array.from(files).forEach((file) => formData.append("files", file));
      }

      return await sendMess(formData);
    },
    onSuccess: () => {
      setMessage("");
      setFiles(null);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return (
    <div className="relative top-0">
      {showEmoji && (
        <div className={`absolute bottom-full right-4`}>
          <EmojiPicker
            onEmojiClick={(e) => {
              setMessage((prev) => prev + e.emoji);
            }}
          />
        </div>
      )}

      {listening && (
        <div className="absolute bottom-full right-4 text-xs text-gray-500">
          🎤 Đang ghi...
        </div>
      )}

      {/*  */}
      <div className="flex items-center gap-4 border rounded-lg pr-4 overflow-hidden">
        <input
          className="outline-none border-none resize-none w-full p-4"
          placeholder="Enter message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></input>
        <button onClick={() => setShowEmoji(!showEmoji)}>
          <SmilePlus size={size} />
        </button>
        <button onClick={() => inputFileRef.current?.click()}>
          <Paperclip size={size} />
          <input
            type="file"
            className="hidden"
            ref={inputFileRef}
            multiple
            onChange={(e) => setFiles(e.target.files)}
          />
        </button>
        <button
          onClick={handleMicClick}
          className={clsx([listening && `text-blue-500`])}
        >
          <Mic size={size} />
        </button>
        <button onClick={() => submitResult.mutate()}>
          <Send size={size} />
        </button>
      </div>
    </div>
  );
};

export default memo(MessageInput);
