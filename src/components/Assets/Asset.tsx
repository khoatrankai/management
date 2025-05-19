/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import ToolAsset from "./ToolAsset/ToolAsset";
import ListAsset from "./ListAsset/ListAsset";
import useCheckRole from "@/utils/CheckRole";
// type Props = {};


export default function Asset() {
  const isAuthorized = useCheckRole(["admin-top", "product", "product-read"]);
  return (
    <div>
      <div className="flex flex-col gap-4 rounded-md p-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-white">
        {isAuthorized && (
          <div className="rounded-md">
            <ToolAsset />
          </div>
        )}

        <div className="rounded-md">
          <ListAsset />
        </div>
      </div>
    </div>
  );
}
