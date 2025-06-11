import { X } from "lucide-react";
import { useEffect } from "react";
import styled from "styled-components";

interface ToastProps {
  message: string;
  type?: "error" | "success" | "info";
  onClose: () => void;
  duration?: number;
}

const Toast = ({
  message,
  type = "error",
  onClose,
  duration = 3000,
}: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <SToastContainer type={type}>
      <SToastMessage>{message}</SToastMessage>
      <SCloseButton onClick={onClose}>
        <X size={18} />
      </SCloseButton>
    </SToastContainer>
  );
};

const SToastContainer = styled.div<{ type: "error" | "success" | "info" }>`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: ${(props) =>
    props.type === "error"
      ? "#fdecea"
      : props.type === "success"
      ? "#edf7ed"
      : "#e3f2fd"};
  color: ${(props) =>
    props.type === "error"
      ? "#d32f2f"
      : props.type === "success"
      ? "#2e7d32"
      : "#0277bd"};
  border-left: 4px solid ${(props) =>
    props.type === "error"
      ? "#d32f2f"
      : props.type === "success"
      ? "#2e7d32"
      : "#0277bd"};
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  min-width: 250px;
  max-width: 450px
  z-index: 1000;
  animation: fadeIn 0.3s ease-in-out;

  @keyframes fadeIn {
  from {
    opacity: 0;
    transform: translate(-50%, -20px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);}
  }`;

const SToastMessage = styled.span`
  flex: 1;
  margin-right: 10px;
  font-size: 16px;
`;

const SCloseButton = styled.button`
  background: none;
  border: none;
  color: inherit;
  cursor: pointer:
`;

export default Toast;
