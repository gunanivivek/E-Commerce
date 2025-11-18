import { useState } from "react";
import { useChatbotStore } from "../../store/useChatbotStore";
import { useProductQA } from "../../hooks/Customer/useChatbotHooks";
import { X, Maximize2 } from "lucide-react";

type ViewState = "normal" | "minimized" | "maximized";

const ChatbotWidget = ({
  productId,
  viewState,
  onMaximize,
  onClose,
}: {
  productId: number;
  viewState: ViewState;
  onMinimize: () => void;
  onMaximize: () => void;
  onClose: () => void;
}) => {
  const { messages, addMessage } = useChatbotStore();
  const { mutateAsync, isPending } = useProductQA();
  const [text, setText] = useState("");

  const sendMessage = async () => {
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: "user" as const,
      text,
    };

    addMessage(userMessage);
    setText("");

    try {
      const res = await mutateAsync({
        productId: productId,
        question: userMessage.text,
      });

      addMessage({
        id: Date.now() + 1,
        sender: "bot",
        text: res.answer,
      });
    } catch {
      addMessage({
        id: Date.now() + 2,
        sender: "bot",
        text: "Sorry, something went wrong!",
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between bg-[var(--color-accent)] text-white px-4 py-3">
        <div className="flex flex-col">
          <span className="font-semibold">Need Help?</span>
          <span className="text-xs text-white/80">
            Ask questions about this product
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onMaximize}
            aria-label="Maximize chat"
            title="Maximize"
            className="p-1 rounded hover:bg-white/10"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            aria-label="Close chat"
            title="Close"
            className="p-1 rounded hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Minimized: render header only */}
      {viewState === "minimized" ? null : (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 bg-[var(--color-background)]">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`my-2 flex ${
                  m.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <span
                  className={`inline-block max-w-[80%] break-words px-3 py-2 rounded-lg text-sm ${
                    m.sender === "user"
                      ? "bg-[var(--color-accent-light)] text-black"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {m.text}
                </span>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t bg-white">
            <div className="flex gap-2">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Ask a question about this product..."
                className="flex-1 border rounded px-3 py-2 focus:outline-none"
              />
              <button
                onClick={sendMessage}
                disabled={isPending}
                className="bg-[var(--color-accent)] text-white px-4 rounded"
              >
                {isPending ? "..." : "Send"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatbotWidget;
