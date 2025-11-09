
import React from 'react';

interface QueryInputProps {
  query: string;
  setQuery: (query: string) => void;
  onCompile: () => void;
  isLoading: boolean;
  schema: string;
}

const exampleQueries = [
    "Show me the first name and last name of all employees in the 'IT' department.",
    "List all employees who were hired after '2022-01-01'.",
    "Find the average salary for each job title.",
    "Get the names of departments that have more than 5 employees."
];

export const QueryInput: React.FC<QueryInputProps> = ({ query, setQuery, onCompile, isLoading, schema }) => {
    
    const handleExampleClick = (example: string) => {
        setQuery(example);
    };

    return (
        <div className="mb-6">
            <label htmlFor="nl-query" className="block text-sm font-medium text-gray-300 mb-2">
                Enter your query in Controlled English:
            </label>
            <textarea
                id="nl-query"
                rows={4}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200 placeholder-gray-500"
                placeholder="e.g., 'Find all employees in the Sales department with a salary greater than 60000'"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={isLoading}
            />
            <div className="mt-2 flex flex-wrap gap-2 items-center">
                <span className="text-sm text-gray-400 self-center">Try an example:</span>
                {exampleQueries.map((ex, idx) => (
                    <button 
                        key={idx}
                        onClick={() => handleExampleClick(ex)}
                        disabled={isLoading}
                        className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-full px-3 py-1 transition duration-200 disabled:opacity-50"
                    >
                        {`Ex ${idx + 1}`}
                    </button>
                ))}
            </div>

            <button
                onClick={onCompile}
                disabled={isLoading || !query.trim() || !schema.trim()}
                className="mt-4 w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition duration-300"
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Compiling...
                    </>
                ) : (
                    'Compile to SQL'
                )}
            </button>
        </div>
    );
};