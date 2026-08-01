import * as React from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/utils/cn";

export interface ToastProps {
  id?: string;
  title: string;
  description?: string;
  type?: "success" | "danger" | "info";
  onClose?: () => void;
}

export function Toast({ title, description, type = "info", onClose }: ToastProps) {
  return (
    <div
      className={cn(
        "flex w-full max-w-md items-start space-x-3 rounded-xl border border-[#1F2937] bg-[#111827] p-4 shadow-2xl transition-all duration-300 animate-in slide-in-from-top-5",
        type === "success" && "border-l-4 border-l-[#10B981]",
        type === "danger" && "border-l-4 border-l-[#EF4444]",
        type === "info" && "border-l-4 border-l-[#6366F1]"
      )}
    >
      <div className="mt-0.5">
        {type === "success" && <CheckCircle2 className="h-5 w-5 text-[#10B981]" />}
        {type === "danger" && <AlertCircle className="h-5 w-5 text-[#EF4444]" />}
        {type === "info" && <Info className="h-5 w-5 text-[#6366F1]" />}
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-semibold text-[#F8FAFC]">{title}</h4>
        {description && (
          <p className="mt-1 text-xs text-[#94A3B8]">{description}</p>
        )}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
