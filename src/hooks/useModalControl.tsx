import { useState } from "react";

export default function useModalControl(): {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
} {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return {
    isModalOpen,
    openModal,
    closeModal,
  };
}
