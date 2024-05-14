"use client";

import { ClipLoader } from "react-spinners";

export const Loader = () => {
  return (
    <div className="w-full h-full flex justify-center items-center">
      {" "}
      <ClipLoader color="#3498db" size={50} />
    </div>
  );
};
