"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle, X } from "lucide-react";

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ 
  message, 
  isVisible, 
  onClose, 
  duration = 3000 
}) => {
  const [isShowing, setIsShowing] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsShowing(true);
      const timer = setTimeout(() => {
        setIsShowing(false);
        setTimeout(onClose, 300); // Wait for fade out animation
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div
        className={`bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 transition-all duration-300 ${
          isShowing ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
        }`}
      >
        <CheckCircle size={20} />
        <span className="font-medium">{message}</span>
        <button
          onClick={() => {
            setIsShowing(false);
            setTimeout(onClose, 300);
          }}
          className="ml-2 hover:bg-green-600 rounded-full p-1"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default Toast; 