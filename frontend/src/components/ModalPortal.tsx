import { createPortal } from "react-dom";
import type { ReactNode } from "react";

interface ModalPortalProps {
  children: ReactNode;
}

const ModalPortal = ({ children }: ModalPortalProps) => {
  const modalRoot = document.getElementById("register-modal");

  if (!modalRoot) return null;

  return createPortal(children, modalRoot);
};

export default ModalPortal;
