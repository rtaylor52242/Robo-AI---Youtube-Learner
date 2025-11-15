import React from 'react';
import { XIcon } from './icons/MenuIcons';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">How to Use This App</h2>
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white" aria-label="Close">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto text-gray-300 space-y-4">
          <section>
            <h3 className="text-lg font-semibold text-brand-light mb-2">1. What is Robo AI - Youtube Learner?</h3>
            <p>This application is your personal AI-powered assistant for learning from YouTube videos. Simply provide a link to a YouTube video, and our AI will automatically generate a list of key insights, provide a complete transcript, and save your analyzed videos in a personal history for easy access.</p>
          </section>
          <section>
            <h3 className="text-lg font-semibold text-brand-light mb-2">2. How to Analyze a Video</h3>
            <ol className="list-decimal list-inside space-y-1">
              <li>Go to YouTube and copy the URL of the video you want to analyze.</li>
              <li>Paste the copied URL into the input field on the home page.</li>
              <li>Click the "Generate Insights" button.</li>
            </ol>
            <p className="mt-2">The application will then process your request and display the video player, AI-generated insights, and a full transcript.</p>
          </section>
          <section>
            <h3 className="text-lg font-semibold text-brand-light mb-2">3. The Video Page Explained</h3>
            <ul className="list-disc list-inside space-y-1">
                <li><strong>Video Player:</strong> Watch the video directly within the app.</li>
                <li><strong>AI Insights:</strong> A quick summary of the most important points from the video.</li>
                <li><strong>Transcript:</strong> The full, time-stamped transcript of the video.</li>
            </ul>
          </section>
          <section>
            <h3 className="text-lg font-semibold text-brand-light mb-2">4. Managing Your History</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Your analyzed videos are automatically saved to your history in the sidebar.</li>
              <li>Click on any video title in the history list to reload it.</li>
              <li>To remove a video, hover over its title and click the trash can icon that appears.</li>
              <li>Use the menu icon (☰) to collapse or expand the sidebar.</li>
            </ul>
          </section>
        </div>
         <div className="p-4 border-t border-gray-700 text-right">
            <button
                onClick={onClose}
                className="bg-brand-primary text-white font-bold py-2 px-6 rounded-lg hover:opacity-90 transition-opacity"
            >
                Got it!
            </button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
