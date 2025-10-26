import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const MobileSidebar = ({ isOpen, onClose, children }: MobileSidebarProps) => {
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  // Focus management
  useEffect(() => {
    if (isOpen && sidebarRef.current) {
      sidebarRef.current.focus();
    }
  }, [isOpen]);

  return (
    <aside
      ref={sidebarRef}
      className={`sidebar-mobile ${isOpen ? "open" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Navigation sidebar"
      tabIndex={-1}>
      {children}
    </aside>
  );
};

export default MobileSidebar;
