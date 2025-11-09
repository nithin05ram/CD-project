
import { GoogleGenAI, Type } from '@google/genai';
import type { CompilerOutput } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        lexicalAnalysis: {
            type: Type.OBJECT,
            properties: {
                tokens: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Keywords, identifiers, and operators identified in the query.",
                },
            },
        },
        syntaxAnalysis: {
            type: Type.OBJECT,
            properties: {
                tree: {
                    type: Type.STRING,
                    description: "A high-level, human-readable description of the parsed query structure, like an abstract syntax tree.",
                },
            },
        },
        semanticAnalysis: {
            type: Type.OBJECT,
            properties: {
                analysis: {
                    type: Type.STRING,
                    description: "Analysis of the query's meaning, checking for semantic correctness against the schema (e.g., valid table/column names).",
                },
            },
        },
        generatedSql: {
            type: Type.STRING,
            description: "The initial, unoptimized SQL query generated from the analysis.",
        },
        optimizedSql: {
            type: Type.STRING,
            description: "An optimized version of the SQL query for better readability and potential performance.",
        },
        explanation: {
            type: Type.STRING,
            description: "A step-by-step natural language explanation of the final optimized SQL query.",
        },
    },
    required: [
        'lexicalAnalysis', 'syntaxAnalysis', 'semanticAnalysis', 
        'generatedSql', 'optimizedSql', 'explanation'
    ],
};

export const compileNlToSql = async (naturalLanguageQuery: string, dbSchema: string): Promise<CompilerOutput> => {
    const systemInstruction = `
    You are an expert compiler that translates natural language queries into SQL, strictly following compiler design principles.
    Your mission is to analyze a natural language query against a given database schema and generate a detailed JSON object representing the compilation stages.

    The JSON output must conform to the provided JSON schema and contain the following fields:
    1.  **lexicalAnalysis**: An object with a 'tokens' array, identifying the main keywords, entities, and values from the query.
    2.  **syntaxAnalysis**: An object with a 'tree' string, describing the query's grammatical structure in a human-readable abstract syntax tree format.
    3.  **semanticAnalysis**: An object with an 'analysis' string, verifying that the entities and relationships in the query are valid according to the provided database schema. Note any ambiguities or assumptions made.
    4.  **generatedSql**: A string containing a standard, correct SQL query that directly translates the user's request.
    5.  **optimizedSql**: A string containing an optimized version of the generated SQL for clarity and performance. This should use standard JOIN syntax, proper aliasing, and clear formatting.
    6.  **explanation**: A string with a clear, step-by-step natural language explanation of what the final optimized SQL query does.

    **Crucial Rule**: The generated SQL must be syntactically correct and exclusively use the tables and columns exactly as they are defined in the provided schema. Do not invent tables or columns.
    `;

    const userPrompt = `
    DATABASE SCHEMA:
    \`\`\`sql
    ${dbSchema}
    \`\`\`

    NATURAL LANGUAGE QUERY:
    "${naturalLanguageQuery}"
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: userPrompt,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: 'application/json',
                responseSchema: responseSchema,
                temperature: 0.2,
            },
        });
        
        const jsonText = response.text.trim();
        // Clean potential markdown wrappers from the response string
        const cleanedJsonText = jsonText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        const data = JSON.parse(cleanedJsonText);

        if (typeof data.generatedSql !== 'string' || typeof data.optimizedSql !== 'string') {
            throw new Error("Invalid response structure from API.");
        }
        
        return data as CompilerOutput;
    } catch (error) {
        console.error("Error calling or parsing Gemini API response:", error);
        if (error instanceof SyntaxError) {
             throw new Error("Failed to parse the AI's response. The format was unexpected.");
        }
        throw new Error("Failed to compile the query. The AI model could not process the request.");
    }
};
