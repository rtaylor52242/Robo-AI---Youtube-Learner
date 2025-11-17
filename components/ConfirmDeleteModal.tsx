import React from 'react';
import { AlertIcon } from './icons/AlertIcon';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  videoTitle: string;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ isOpen, onClose, onConfirm, videoTitle }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md flex flex-col border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 text-center">
            <AlertIcon className="w-16 h-16 mx-auto text-red-500"/>
            <h2 className="text-2xl font-bold text-white mt-4">Are you sure?</h2>
            <p className="text-gray-400 mt-2">
                You are about to delete the video:
                <br/>
                <strong className="text-gray-200">{videoTitle}</strong>
                <br/>
                This action cannot be undone.
            </p>
        </div>
         <div className="p-4 bg-gray-900/50 rounded-b-lg flex justify-end gap-4">
            <button
                onClick={onClose}
                className="bg-gray-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-500 transition-colors"
            >
                Cancel
            </button>
            <button
                onClick={onConfirm}
                className="bg-red-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-500 transition-colors"
            >
                Delete
            </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
