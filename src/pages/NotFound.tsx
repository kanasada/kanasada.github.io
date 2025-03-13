
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-baseball-cream font-ms-sans">
      <div className="win95-window p-0 max-w-md w-full">
        <div className="win95-titlebar">
          <div>Error</div>
          <div className="flex gap-1">
            <button className="win95-button w-5 h-5 flex items-center justify-center p-0">X</button>
          </div>
        </div>
        <div className="p-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-red-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl font-bold">!</div>
          </div>
          <h1 className="text-xl font-bold mb-4">404 - File Not Found</h1>
          <p className="text-sm mb-4">
            The file or directory you are looking for might have been moved, deleted, or never existed.
          </p>
          <div className="flex justify-center">
            <a href="/" className="win95-button text-sm">
              Return to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
