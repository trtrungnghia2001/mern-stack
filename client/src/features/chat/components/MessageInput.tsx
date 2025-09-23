import { Mic, Paperclip, Send, Smile, Square } from "lucide-react";
import { memo, useRef, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const MessageInput = () => {
  const [text, setText] = useState("");
  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  const handleSend = () => {
    const message = text || transcript;
    if (!message.trim()) return;

    console.log("Send message:", message);
    setText("");
    resetTranscript();
    SpeechRecognition.stopListening();
  };

  // listening
  const handleStartListening = () => {
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
      console.log("Selected file:", files[0]);
    }
  };

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return <p>Trình duyệt không hỗ trợ Speech Recognition.</p>;
  }

  return (
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
      />

      <button onClick={handleSend} className="text-blue-600">
        <Send size={18} />
      </button>
    </div>
  );
};

export default memo(MessageInput);
