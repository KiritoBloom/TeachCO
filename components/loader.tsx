"use client";

import { ClipLoader } from "react-spinners";

export const Loader = () => {
  return (
    <div className={"w-full flex justify-center items-center h-full"}>
      {" "}
      <ClipLoader color="#3498db" size={50} />
    </div>
  );
};
