
import { useEffect, useState } from "react";
import ReactDOM from "react-dom";

const ModalPortal = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return ReactDOM.createPortal(children, document.body);
};

export default ModalPortal;
