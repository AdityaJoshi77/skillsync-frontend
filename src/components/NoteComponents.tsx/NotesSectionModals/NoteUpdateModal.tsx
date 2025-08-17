// NoteUpdateModal.tsx
import { NoteForm } from "../NoteForm";
import ModalPortal from "@/ModalPortals/ModalPortal";

interface NoteUpdateModalProps {
  noteFormData: { title: string; content: string };
  setNoteFormData: React.Dispatch<
    React.SetStateAction<{ title: string; content: string }>
  >;
  handleSaveNote: () => void;
  handleCancel: () => void;
  isEditing: boolean;
}

const NoteUpdateModal = ({
  noteFormData,
  setNoteFormData,
  handleSaveNote,
  handleCancel,
  isEditing,
}: NoteUpdateModalProps) => {
  const formWrapperStyling =
    "flex flex-col gap-2 h-9/10 w-3/5 p-6 bg-gray-900 rounded-lg customs-scrollbar";

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
        <NoteForm
          noteFormData={noteFormData}
          setNoteFormData={setNoteFormData}
          handleSaveNote={handleSaveNote}
          handleCancel={handleCancel}
          isEditing={isEditing}
          formWrapperStyling={formWrapperStyling}
        />
      </div>
    </ModalPortal>
  );
};

export default NoteUpdateModal;
