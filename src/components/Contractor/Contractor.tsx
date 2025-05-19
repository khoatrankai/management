/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import ToolContractor from "./ToolContractor/ToolContractor";
import ListContractor from "./ListContractor/ListContractor";
import useCheckRole from "@/utils/CheckRole";
// type Props = {};


export default function Contractor() {
  const isAuthorized = useCheckRole(["admin-top", "project", "project-read"]);
  return (
    <div>
      <div className="flex flex-col gap-4 rounded-md p-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-white">
        {isAuthorized && (
          <div className="rounded-md">
            <ToolContractor />
          </div>
         )}

        <div className="rounded-md">
          <ListContractor />
        </div>
      </div>
    </div>
  );
}
