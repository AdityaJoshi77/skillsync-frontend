import { NoteData } from "@/InterfacesAndTypes/Interfaces";
import { NoteView } from "../NoteView";
import ModalPortal from "@/ModalPortals/ModalPortal";

interface NoteViewModalProps {
  note: NoteData;
  onClose: () => void;
}

const NoteViewModal = ({ note, onClose }: NoteViewModalProps) => {
    const noteSectionStyling = 'flex flex-col gap-2 h-9/10 w-3/5 overflow-y-auto p-6 bg-gray-800 rounded-lg customs-scrollbar'
  return (
    <ModalPortal>
      <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center ">
        <NoteView note={note} onClose={onClose} noteSectionStyling = {noteSectionStyling}/>
      </div>
    </ModalPortal>
  );
};

export default NoteViewModal;
