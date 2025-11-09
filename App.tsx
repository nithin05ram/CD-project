
import React, { useState, useCallback } from 'react';
import type { CompilerOutput } from './types';
import { SchemaDisplay } from './components/SchemaDisplay';
import { QueryInput } from './components/QueryInput';
import { SqlOutput } from './components/SqlOutput';
import { compileNlToSql } from './services/geminiService';
import { DEFAULT_SCHEMA } from './constants';

const App: React.FC = () => {
    const [naturalQuery, setNaturalQuery] = useState<string>('');
    const [schema, setSchema] = useState<string>(DEFAULT_SCHEMA);
    const [compilerOutput, setCompilerOutput] = useState<CompilerOutput | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleCompile = useCallback(async () => {
        if (!naturalQuery.trim() || !schema.trim()) return;

        setIsLoading(true);
        setError(null);
        
        try {
            const result = await compileNlToSql(naturalQuery, schema);
            setCompilerOutput(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
            setCompilerOutput(null);
        } finally {
            setIsLoading(false);
        }
    }, [naturalQuery, schema]);

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
            <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-100 tracking-tight">
                            <span className="text-cyan-400">NL-to-SQL</span> Compiler
                        </h1>
                    </div>
                </div>
            </header>
            
            <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-8">
                    
                    <div className="flex flex-col">
                        <SchemaDisplay schema={schema} setSchema={setSchema} />
                        <QueryInput 
                            query={naturalQuery}
                            setQuery={setNaturalQuery}
                            onCompile={handleCompile}
                            isLoading={isLoading}
                            schema={schema}
                        />
                         {error && (
                            <div className="mt-4 bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg" role="alert">
                                <strong className="font-bold">Error: </strong>
                                <span className="block sm:inline">{error}</span>
                            </div>
                        )}
                    </div>

                    
                    <div className="mt-8 lg:mt-0">
                        <SqlOutput output={compilerOutput} isLoading={isLoading} />
                    </div>
                </div>
            </main>
            <footer className="text-center py-4 mt-8 border-t border-gray-800">
                <p className="text-sm text-gray-500">Powered by Gemini API</p>
            </footer>
        </div>
    );
};

export default App;