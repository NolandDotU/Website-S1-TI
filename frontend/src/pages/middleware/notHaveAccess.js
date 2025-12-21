import React from "react";
import { AlertCircle, XCircle, Lock, Home, LogIn } from "lucide-react";

export const NoAccessPage = () => {
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mx-auto w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-6">
            <Lock className="w-10 h-10 text-orange-600" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Access Denied
          </h1>

          <p className="text-gray-600 mb-6">
            You don't have permission to access this resource. This page is
            restricted to authorized users only.
          </p>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="text-sm font-medium text-orange-900 mb-1">
                  Possible Reasons:
                </p>
                <ul className="text-sm text-orange-700 space-y-1">
                  <li>• Insufficient permissions</li>
                  <li>• Admin access required</li>
                  <li>• Account not verified</li>
                  <li>• Session expired</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleGoBack}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200">
              Go Back
            </button>

            <button
              onClick={() => (window.location.href = "/")}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
              <Home className="w-5 h-5" />
              Back to Home
            </button>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
          <p className="text-sm text-blue-900 text-center">
            <span className="font-medium">Need access?</span>
            <br />
            Contact your administrator or{" "}
            <a
              href="/request-access"
              className="text-blue-600 hover:text-blue-700 font-medium underline">
              request access here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
