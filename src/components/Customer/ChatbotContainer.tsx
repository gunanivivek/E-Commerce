import ChatbotWidget from "./ChatbotWidget";
import { useChatbotStore } from "../../store/useChatbotStore";
import { MessageCircle } from "lucide-react";
import { useParams } from "react-router-dom";
import { useState } from "react";

type ViewState = "normal" | "minimized" | "maximized";

const ChatbotContainer = () => {
  const { isOpen, toggleChat } = useChatbotStore();
  const { productId } = useParams<{ productId?: string }>();
  const idNum = productId ? Number(productId) : NaN;

  const [viewState, setViewState] = useState<ViewState>("normal");

  const handleMinimize = () => setViewState((s) => (s === "minimized" ? "normal" : "normal"));
  const handleMaximize = () => setViewState((s) => (s === "maximized" ? "normal" : "maximized"));
  const handleClose = () => {
    setViewState("normal");
    toggleChat();
  };

  const containerSizeClass =
    viewState === "minimized"
      ? "w-56 h-12"
      : viewState === "maximized"
      ? "w-[95vw] md:w-160 h-[95vh]"
      : "w-80 h-96";

  return (
    <>
      {!isOpen && (
        <button
          className="fixed bottom-6 right-6 bg-[var(--color-accent)] text-white p-4 rounded-full shadow-md hover:bg-[var(--color-accent-dark)] cursor-pointer z-50"
          onClick={toggleChat}
          aria-label="Open chatbot"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 bg-white shadow-xl w-100 h-120 rounded-lg z-50 border border-primary-50 transition-all duration-200 overflow-hidden ${containerSizeClass}`}
        >
          <ChatbotWidget
            productId={Number.isFinite(idNum) ? idNum : NaN}
            viewState={viewState}
            onMinimize={handleMinimize}
            onMaximize={handleMaximize}
            onClose={handleClose}
          />
        </div>
      )}
    </>
  );
};

export default ChatbotContainer;
