
import React, { useState } from 'react';
import { RobotIcon } from './icons/RobotIcon';
import { YoutubeIcon } from './icons/YoutubeIcon';

interface HomePageProps {
  onGenerate: (url: string) => void;
  isGenerating: boolean;
}

const HomePage: React.FC<HomePageProps> = ({ onGenerate, isGenerating }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onGenerate(url);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="max-w-2xl w-full">
        <div className="mb-8">
            <RobotIcon className="w-24 h-24 mx-auto text-brand-primary animate-pulse" />
            <h1 className="text-4xl sm:text-5xl font-bold text-white mt-4 leading-tight">
              Robo AI -<br />Youtube Learner
            </h1>
            <p className="text-lg text-gray-400 mt-2">
                Paste a YouTube link below to get AI-powered insights and a full transcript.
            </p>
        </div>
        
        <form onSubmit={handleSubmit} className="w-full">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <YoutubeIcon className="w-6 h-6 text-gray-400"/>
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full pl-12 pr-4 py-4 text-lg bg-gray-800 border-2 border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition duration-200"
            />
          </div>
          <button
            type="submit"
            className="w-full mt-4 bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold py-4 px-4 rounded-lg text-lg hover:opacity-90 transition-opacity duration-200 disabled:opacity-50 disabled:cursor-wait"
            disabled={!url.trim() || isGenerating}
          >
            {isGenerating ? 'Generating...' : 'Generate Insights'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default HomePage;