import { useState } from "react";
import { cn } from "@/lib/utils";
import { createClient } from "@supabase/supabase-js";
import ResultsSection from "./ResultsSection";

type CompetitorResult = {
  title: string;
  url: string;
  summary?: string;
  text?: string;
  id: string;
  favicon?: string;
};

export default function LandingPage() {
  const [companyUrl, setCompanyUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<CompetitorResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL || "",
    import.meta.env.VITE_SUPABASE_ANON_KEY || ""
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic URL validation
    if (!companyUrl) {
      setError("Please enter a company URL");
      return;
    }

    try {
      setIsLoading(true);
      
      // Call the find_similar edge function
      const { data, error: functionError } = await supabase.functions.invoke(
        "supabase-functions-find_similar",
        {
          body: { url: companyUrl },
        }
      );

      if (functionError) {
        throw new Error(functionError.message);
      }

      if (!data || !data.results) {
        throw new Error("No results returned from the API");
      }

      // Map the results to our CompetitorResult type
      const competitorResults: CompetitorResult[] = data.results.map((result: any) => ({
        title: result.title || "Unknown Company",
        url: result.url,
        summary: result.summary,
        text: result.text,
        id: result.id || crypto.randomUUID(),
        favicon: result.favicon
      }));

      setResults(competitorResults);
    } catch (err) {
      setError("An error occurred while fetching data");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-800 opacity-75 blur"></div>
              <div className="relative bg-gray-800 rounded-full p-5">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
                  <circle cx="18" cy="18" r="3"></circle>
                  <circle cx="6" cy="6" r="3"></circle>
                  <path d="M13 6h3a2 2 0 0 1 2 2v7"></path>
                  <path d="M6 9v12"></path>
                </svg>
              </div>
            </div>
          </div>
          <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-300 text-transparent bg-clip-text mb-4">
            Find Your Top Competitors
          </h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            Enter your website to discover similar companies in your space and gain valuable insights.
          </p>
        </div>

        {/* URL Input Area */}
        <div className="max-w-md mx-auto mb-16">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col space-y-2">
              <label htmlFor="companyUrl" className="text-sm font-medium text-blue-300">
                Company URL
              </label>
              <div className="relative">
                <input
                  id="companyUrl"
                  type="url"
                  placeholder="https://example.com"
                  className={cn(
                    "flex h-12 w-full rounded-xl border-2 border-gray-700 bg-gray-800 px-4 py-3",
                    "text-sm text-gray-100 placeholder:text-gray-500 focus:border-blue-600",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                    "focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 disabled:cursor-not-allowed disabled:opacity-50",
                    "transition-all duration-200"
                  )}
                  value={companyUrl}
                  onChange={(e) => setCompanyUrl(e.target.value)}
                  disabled={isLoading}
                />
                {companyUrl && (
                  <button
                    type="button"
                    onClick={() => setCompanyUrl("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                )}
              </div>
            </div>
            {error && (
              <div className="bg-red-900/30 text-red-300 px-3 py-2 rounded-lg text-sm flex items-center border border-red-800">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                {error}
              </div>
            )}
            <button
              type="submit"
              className={cn(
                "inline-flex items-center justify-center rounded-xl text-sm font-medium",
                "transition-all duration-200 focus-visible:outline-none focus-visible:ring-2",
                "focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900",
                "disabled:pointer-events-none disabled:opacity-50 h-12 px-6 py-3",
                "bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:from-blue-700 hover:to-indigo-800 w-full",
                "shadow-lg shadow-blue-900/30 hover:shadow-blue-900/40"
              )}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Searching...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  Find Competitors
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Section */}
        <div className="w-full">
          <ResultsSection results={results} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}