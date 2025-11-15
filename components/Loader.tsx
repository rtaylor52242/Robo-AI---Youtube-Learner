
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-gray-800 p-8 rounded-lg border border-gray-700 text-center">
        <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <h3 className="text-xl font-semibold text-white">Generating Insights...</h3>
        <p className="text-gray-400 mt-1">This might take a few moments.</p>
    </div>
  );
};

export default Loader;
