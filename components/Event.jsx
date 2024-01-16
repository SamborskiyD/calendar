'use client'

import { useState } from "react";
import { createPortal } from "react-dom";
import ModalWindow from "./ModalWindow";
import { updateEvent } from "@/db/actions";

const Event = ({event}) => {
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  let modalContainer
  if (typeof document !== 'undefined') {
    modalContainer = document.getElementById("modal");
  }

  const customStyle = { top: event.start + "px", height: event.duration * 2 + "px" };

  return (
    <>
    <div
      onClick={() => setIsModalOpen(true)}
      style={customStyle}
      className="relative left-14 bg-blue border-l-2 p-2 max-w-[200px] w-full border-darkBlue cursor-pointer"
    >
      {event.title}
    </div>
    {isModalOpen && createPortal(<ModalWindow event={event} onClose={() => setIsModalOpen(false)} onSave={updateEvent}/>, modalContainer)}
    </>

  );
};

export default Event;
