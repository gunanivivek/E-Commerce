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
      ? "w-[85vw] md:w-160 h-[75vh]"
      : "md:w-120 h-96 w-[85vw]" ;

  return (
    <>
      {!isOpen && (
        <button
          className="fixed bottom-6 right-6 bg-[var(--color-accent)] text-white p-4 rounded-full shadow-md hover:bg-[var(--color-accent-dark)] cursor-pointer z-50"
          onClick={toggleChat}
          aria-label="Open chatbot"
          title="24/7 Customer Support"
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
