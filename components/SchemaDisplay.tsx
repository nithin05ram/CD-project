
import React, { useState } from 'react';
import { DatabaseIcon } from './icons/DatabaseIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { ChevronUpIcon } from './icons/ChevronUpIcon';

interface SchemaDisplayProps {
  schema: string;
  setSchema: (schema: string) => void;
}

export const SchemaDisplay: React.FC<SchemaDisplayProps> = ({ schema, setSchema }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-gray-800/50 rounded-lg border border-gray-700 mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 text-left"
      >
        <div className="flex items-center gap-3">
          <DatabaseIcon className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-semibold text-gray-200">Database Schema <span className="text-sm font-normal text-gray-400">(Editable)</span></h2>
        </div>
        {isOpen ? <ChevronUpIcon className="w-6 h-6 text-gray-400" /> : <ChevronDownIcon className="w-6 h-6 text-gray-400" />}
      </button>
      {isOpen && (
        <div className="p-4 border-t border-gray-700">
          <textarea
            className="w-full bg-gray-900/70 p-4 rounded-md text-sm text-gray-300 font-mono overflow-auto focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200"
            rows={15}
            value={schema}
            onChange={(e) => setSchema(e.target.value)}
            placeholder="-- Enter your CREATE TABLE statements here..."
            aria-label="Database Schema Input"
          />
        </div>
      )}
    </div>
  );
};