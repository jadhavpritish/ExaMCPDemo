import { cn } from "@/lib/utils";
import CompetitorCard from "./CompetitorCard";

type CompetitorResult = {
  title: string;
  url: string;
  summary?: string;
  text?: string;
  id: string;
  favicon?: string;
};

type ResultsSectionProps = {
  results: CompetitorResult[];
  isLoading: boolean;
};

export default function ResultsSection({
  results,
  isLoading,
}: ResultsSectionProps) {
  if (isLoading) {
    return (
      <div className="text-center py-16">
        <div className="relative h-20 w-20 mx-auto">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 opacity-20 animate-ping"></div>
          <div className="relative flex items-center justify-center h-full">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
          </div>
        </div>
        <p className="mt-6 text-lg text-blue-300 font-medium">
          Searching for competitors...
        </p>
      </div>
    );
  }

  if (results.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      <div className="absolute -top-10 -left-10 w-20 h-20 bg-blue-900 rounded-full opacity-20 blur-xl"></div>
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-900 rounded-full opacity-30 blur-xl"></div>
      
      <div className="relative">
        <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-blue-400 to-indigo-300 text-transparent bg-clip-text">
          Similar Companies
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {results.map((competitor) => (
            <CompetitorCard key={competitor.id} competitor={competitor} />
          ))}
        </div>
      </div>
    </div>
  );
}