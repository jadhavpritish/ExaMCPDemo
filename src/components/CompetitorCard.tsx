import { useState } from "react";
import { cn } from "@/lib/utils";
import { createClient } from "@supabase/supabase-js";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type CompetitorCardProps = {
  competitor: {
    title: string;
    url: string;
    summary?: string;
    text?: string;
    id: string;
    favicon?: string;
  };
};

type ContentResult = {
  title: string;
  url: string;
  publishedDate?: string;
  author?: string;
  text?: string;
  summary?: string;
  highlights?: string[];
  subpages?: ContentResult[];
};

export default function CompetitorCard({ competitor }: CompetitorCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedContent, setExpandedContent] = useState<ContentResult | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL || "",
    import.meta.env.VITE_SUPABASE_ANON_KEY || "",
  );

  const handleExpand = async () => {
    if (isExpanded) {
      setIsExpanded(false);
      return;
    }

    setIsExpanded(true);
    setIsLoading(true);
    setError(null);

    try {
      // Call the get_contents edge function
      const { data, error: functionError } = await supabase.functions.invoke(
        "supabase-functions-get_contents",
        {
          body: { urls: [competitor.url] },
        },
      );

      if (functionError) {
        throw new Error(functionError.message);
      }

      if (!data || !data.results || data.results.length === 0) {
        throw new Error("No content found for this URL");
      }

      // Set the expanded content with the first result
      setExpandedContent(data.results[0]);
      
      // Open the modal when content is loaded
      setIsModalOpen(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load detailed content",
      );
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div
        className={cn(
          "p-6 rounded-xl border border-gray-700 bg-gray-800",
          "transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/10",
          "relative overflow-hidden flex flex-col min-h-[280px]"
        )}
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-900/30 to-indigo-900/30 rounded-bl-full"></div>
        
        <div className="flex items-start gap-4 flex-1">
          <div className="flex-shrink-0">
            {competitor.favicon ? (
              <img
                src={competitor.favicon}
                alt=""
                className="w-10 h-10 rounded-lg object-cover border border-gray-700"
              />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-900 to-indigo-800 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
              </div>
            )}
          </div>
          
          <div className="flex-1 flex flex-col">
            <div className="flex-1">
              <h3 className="font-bold text-xl text-blue-100 mb-1">
                {competitor.title}
              </h3>
              <a
                href={competitor.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-400 hover:text-blue-300 hover:underline flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
                <span className="truncate max-w-[200px]">{competitor.url}</span>
              </a>
              
              {competitor.summary && (
                <div className="mt-3 p-3 bg-gray-700/50 rounded-lg border border-gray-700">
                  <p className="text-sm text-blue-200">
                    {competitor.summary}
                  </p>
                </div>
              )}
            </div>
            
            <div className="mt-4 pt-2">
              <button
                onClick={handleExpand}
                className={cn(
                  "text-sm font-medium",
                  "inline-flex items-center justify-center rounded-lg",
                  "transition-all duration-200 focus-visible:outline-none",
                  "focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900",
                  "disabled:pointer-events-none disabled:opacity-50 h-9 px-4",
                  "w-32", // Fixed width for consistency
                  isExpanded && !isModalOpen
                    ? "bg-gray-700 text-blue-300 hover:bg-gray-600" 
                    : "bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:from-blue-700 hover:to-indigo-800",
                  "shadow-sm"
                )}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                    Show More
                  </>
                )}
              </button>
            </div>

            {isExpanded && isLoading && (
              <div className="mt-4 p-4 bg-gray-700/50 rounded-lg border border-gray-700 text-sm flex items-center justify-center">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-solid border-blue-500 border-r-transparent mr-2"></div>
                <span className="text-blue-300">Loading content...</span>
              </div>
            )}

            {error && (
              <div className="mt-4 p-3 bg-red-900/30 border border-red-800 rounded-lg text-sm text-red-300 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                {error}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col bg-gray-900 border-gray-800 text-gray-100">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-blue-100">
              {expandedContent?.title || competitor.title}
            </DialogTitle>
            {expandedContent?.author && expandedContent?.publishedDate && (
              <div className="flex items-center text-xs text-blue-400 font-medium mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                By {expandedContent.author}
                <span className="mx-1">•</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                {expandedContent.publishedDate}
              </div>
            )}
          </DialogHeader>
          
          <div className="overflow-y-auto flex-1 pr-2 custom-scrollbar">
            {/* Summary Section */}
            {expandedContent?.summary && (
              <div className="p-4 border-b border-gray-800">
                <h3 className="text-lg font-semibold text-blue-300 mb-3">Summary</h3>
                <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                  <p className="text-gray-200 leading-relaxed">{expandedContent.summary}</p>
                </div>
              </div>
            )}
            
            {/* Highlights Section */}
            {expandedContent?.highlights && expandedContent.highlights.length > 0 ? (
              <div className="space-y-4 p-4">
                <h3 className="text-lg font-semibold text-blue-300 mb-2">Key Highlights</h3>
                <ul className="space-y-3">
                  {expandedContent.highlights.map((highlight, index) => (
                    <li key={index} className="p-3 bg-gray-800/70 rounded-lg border border-gray-700 flex">
                      <div className="mr-3 mt-0.5 text-blue-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                      </div>
                      <span className="text-gray-200">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : !expandedContent?.summary ? (
              <div className="flex items-center justify-center p-8 text-blue-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                No content available.
              </div>
            ) : null}
          </div>
          
          <div className="mt-4 pt-3 border-t border-gray-800 flex justify-between items-center">
            <a
              href={expandedContent?.url || competitor.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-400 hover:text-blue-300 hover:underline flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
              Visit Source
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}