"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import ModalWindow from "./ModalWindow";
import { addEvent } from "@/db/actions";

const AddButton = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  let modalContainer
  if (typeof document !== 'undefined') {
    modalContainer = document.getElementById("modal");
  }

  return (
    <>
      <button className="button button__submit" onClick={() => setIsModalOpen(true)}>
        Add Event
      </button>
      {isModalOpen && createPortal(<ModalWindow onClose={() => setIsModalOpen(false)} onSave={addEvent}/>, modalContainer)}
    </>
  );
};

export default AddButton;
