import React from "react";

interface AlertsTableProps {
  variant: "Warning" | "Exam" | "HeadsUp";
}

const AlertsTable = ({ variant }: AlertsTableProps) => {
  // Determine background and border colors based on the variant
  let bgColorClass = "";
  let borderColorClass = "";
  let iconColorClass = "";
  let iconTextColorClass = "";

  if (variant === "Warning") {
    bgColorClass = "bg-red-800";
    borderColorClass = "border-red-200";
    iconColorClass = "text-red-500";
    iconTextColorClass = "text-gray-700 dark:text-gray-400";
  } else if (variant === "Exam") {
    bgColorClass = "bg-yellow-100";
    borderColorClass = "border-yellow-200";
    iconColorClass = "text-yellow-500";
    iconTextColorClass = "dark:text-yellow-400";
  } else if (variant === "HeadsUp") {
    bgColorClass = "bg-gray-100";
    borderColorClass = "border-gray-200";
    iconColorClass = "text-gray-500";
    iconTextColorClass = "dark:text-gray-400";
  }

  return (
    <div className="p-5 mt-10 border-2 rounded-md">
      <h1 className="font-semibold text-2xl mb-5">Class Alerts</h1>

      {variant === "HeadsUp" && (
        <div
          className={`space-y-4 ${bgColorClass} ${borderColorClass} rounded-md p-4 dark:bg-gray-800 dark:border-gray-700`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`bg-gray-200 rounded-md flex items-center justify-center aspect-square w-12 ${iconColorClass} dark:bg-gray-700`}
            >
              <CalendarIcon className="w-6 h-6" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="text-lg font-semibold">Attendance Reminder</div>
              <div className="text-gray-500 dark:text-gray-400">
                Don't forget to sign in for your classes today. Attendance is
                mandatory.
              </div>
              <a
                href="#"
                className={`${iconColorClass} ${iconTextColorClass} hover:underline`}
              >
                Go To CLASS
              </a>
            </div>
            <button
              className={`${iconColorClass} hover:text-gray-900 dark:hover:text-gray-50`}
            >
              <span className="sr-only">Close</span>
              <XIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {(variant === "Warning" || variant === "Exam") && (
        <div
          className={`space-y-4 ${bgColorClass} ${borderColorClass} rounded-md p-4 dark:border-yellow-800`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`bg-yellow-200 rounded-md flex items-center justify-center aspect-square w-12 ${iconColorClass} ${iconTextColorClass} dark:bg-yellow-800`}
            >
              {variant === "Warning" ? (
                <CircleAlertIcon className={`w-6 h-6 ${iconColorClass}`} />
              ) : (
                <CircleAlertIcon className="w-6 h-6" />
              )}
            </div>
            <div className="flex-1 space-y-2">
              <div className="text-lg font-semibold">
                {variant === "Warning" ? "Urgent Notice" : "Upcoming Exam"}
              </div>
              <div className="text-gray-500 dark:text-gray-400">
                {variant === "Warning"
                  ? "There is an important announcement that requires your immediate attention."
                  : "The midterm exam for this course is scheduled for next Friday. Please make sure you are prepared."}
              </div>
              <a
                href="#"
                className={`${iconColorClass} ${iconTextColorClass} hover:underline`}
              >
                Go To CLASS
              </a>
            </div>
            <button
              className={`${iconColorClass} hover:text-yellow-900 dark:hover:text-yellow-50`}
            >
              <span className="sr-only">Close</span>
              <XIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertsTable;

function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}

function CircleAlertIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" x2="12" y1="8" y2="12" />
      <line x1="12" x2="12.01" y1="16" y2="16" />
    </svg>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
