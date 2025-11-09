import React, { useMemo, useState } from 'react';
import type { CompilerOutput } from '../types';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { CheckIcon } from './icons/CheckIcon';

// This tells TypeScript that hljs is available on the global scope, loaded from the CDN
declare const hljs: any;

interface SqlOutputProps {
  output: CompilerOutput | null;
  isLoading: boolean;
}

const OutputCard: React.FC<{ title: string; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, children }) => {
    return (
        <div className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden">
            <div className="p-4 bg-gray-900/30 border-b border-gray-700">
                <h3 className="text-md font-semibold text-cyan-400">{title}</h3>
            </div>
            <div className="p-4 text-gray-300">
                {children}
            </div>
        </div>
    );
};

const CodeBlock: React.FC<{ code: string; language: string }> = ({ code, language }) => {
    const [isCopied, setIsCopied] = useState(false);
    
    const highlightedCode = useMemo(() => {
        // Check if hljs is loaded and the language is supported to prevent errors
        if (typeof hljs !== 'undefined' && hljs.getLanguage(language)) {
            return hljs.highlight(code, { language, ignoreIllegals: true }).value;
        }
        // Fallback for when hljs is not available or language is not supported
        return code.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }, [code, language]);

    const handleCopy = () => {
        if (!code) return;
        navigator.clipboard.writeText(code).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2500); // Reset after 2.5 seconds
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    };

    return (
        <div className="relative group">
            <pre className="bg-gray-900/70 p-4 rounded-md text-sm overflow-x-auto">
                <code 
                    className={`language-${language}`}
                    dangerouslySetInnerHTML={{ __html: highlightedCode }}
                />
            </pre>
            <button 
                onClick={handleCopy}
                className="absolute top-2 right-2 p-1.5 bg-gray-700/60 rounded-md text-gray-400 hover:text-white hover:bg-gray-600/80 transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100"
                aria-label="Copy code"
            >
                {isCopied ? <CheckIcon className="w-5 h-5 text-green-400" /> : <ClipboardIcon className="w-5 h-5" />}
            </button>
        </div>
    );
};

export const SqlOutput: React.FC<SqlOutputProps> = ({ output, isLoading }) => {
    if (isLoading && !output) {
        return (
            <div className="space-y-6 animate-pulse">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-gray-800/50 rounded-lg border border-gray-700">
                        <div className="p-4 bg-gray-900/30 border-b border-gray-700">
                           <div className="h-5 bg-gray-700 rounded w-1/3"></div>
                        </div>
                        <div className="p-4">
                           <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
                           <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!output) {
        return (
            <div className="text-center p-8 bg-gray-800/50 rounded-lg border border-gray-700">
                <p className="text-gray-400">The compilation results will appear here.</p>
            </div>
        );
    }
    
    return (
        <div className="space-y-6">
            <OutputCard title="1. Lexical Analysis (Tokens)">
                <div className="flex flex-wrap gap-2">
                    {output.lexicalAnalysis.tokens.map((token, index) => (
                        <span key={index} className="bg-gray-700 text-gray-200 text-xs font-mono px-2.5 py-1 rounded-full">
                            {token}
                        </span>
                    ))}
                </div>
            </OutputCard>
            
            <OutputCard title="2. Syntax Analysis (Abstract Tree)">
                <CodeBlock code={output.syntaxAnalysis.tree} language="plaintext" />
            </OutputCard>

            <OutputCard title="3. Semantic Analysis">
                <p className="text-sm leading-relaxed">{output.semanticAnalysis.analysis}</p>
            </OutputCard>
            
            <OutputCard title="4. Intermediate Code Generation (SQL)">
                <CodeBlock code={output.generatedSql} language="sql" />
            </OutputCard>

            <OutputCard title="5. Code Optimization (Optimized SQL)">
                 <CodeBlock code={output.optimizedSql} language="sql" />
            </OutputCard>

             <OutputCard title="6. Explanation">
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{output.explanation}</p>
            </OutputCard>
        </div>
    );
};