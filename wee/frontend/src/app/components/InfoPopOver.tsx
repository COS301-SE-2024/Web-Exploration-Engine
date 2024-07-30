"use client";
import React from "react";
import {Popover, PopoverTrigger, PopoverContent } from "@nextui-org/popover";
import { Button } from "@nextui-org/react";


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const InfoPopOver = ({ heading, content, placement }: { heading: string, content: string, placement: any }) => {
    placement = checkPlacement(placement);
    
    return (
      <Popover placement={placement} showArrow > 
        <PopoverTrigger>
          <Button 
            isIconOnly 
            variant="flat" 
            size="sm" 
            style={{ margin: '10px' }} 
            radius="full" 
            className="font-poppins-semibold text-sm text-jungleGreen-800 dark:text-dark-primaryTextColor"
          >i</Button>
        </PopoverTrigger>
        <PopoverContent >
          <div className="px-1 py-2 max-w-[900px]">
            <div className="text-md font-poppins-semibold">{heading}</div>
            <div className="text-sm font-poppins" dangerouslySetInnerHTML={{ __html: content }} />
          </div>
        </PopoverContent>
      </Popover>
    );
}

export function checkPlacement(placement: string) {
  const acceptedPlacements = [
    "top-start",
    "top",
    "top-end",
    "bottom-start",
    "bottom",
    "bottom-end",
    "right-start",
    "right",
    "right-end",
    "left-start",
    "left",
    "left-end",
  ];

  if (!acceptedPlacements.includes(placement)) {
    return "right-end";
  }

  return placement;
}