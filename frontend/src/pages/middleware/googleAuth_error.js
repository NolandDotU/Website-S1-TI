import React from "react";
import { AlertCircle, XCircle, Lock, Home, LogIn } from "lucide-react";

// Google Auth Error Page
export const GoogleAuthError = () => {
  const handleRetry = () => {
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Authentication Failed
          </h1>

          <p className="text-gray-600 mb-6">
            We couldn't complete your Google sign-in. This might be because you
            cancelled the login or there was a connection issue.
          </p>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="text-sm font-medium text-red-900 mb-1">
                  Common Issues:
                </p>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• Login was cancelled</li>
                  <li>• Pop-up was blocked by browser</li>
                  <li>• Network connection error</li>
                  <li>• Invalid Google account</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleRetry}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
              <LogIn className="w-5 h-5" />
              Try Again
            </button>

            <button
              onClick={() => (window.location.href = "/")}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
              <Home className="w-5 h-5" />
              Back to Home
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Need help?{" "}
          <a
            href="/support"
            className="text-red-600 hover:text-red-700 font-medium">
            Contact Support
          </a>
        </p>
      </div>
    </div>
  );
};
