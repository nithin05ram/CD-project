
export interface CompilerOutput {
  lexicalAnalysis: {
    tokens: string[];
  };
  syntaxAnalysis: {
    tree: string;
  };
  semanticAnalysis: {
    analysis: string;
  };
  generatedSql: string;
  optimizedSql: string;
  explanation: string;
}
