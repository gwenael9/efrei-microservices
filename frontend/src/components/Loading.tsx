import { Loader2 } from "lucide-react";
import React from "react";

export default function Loading() {
    return (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-opacity-50 bg-gray-500 z-50">
          <div className="p-5 bg-white rounded flex gap-2">
            <Loader2 className="animate-spin" />
          </div>
        </div>
      );
}