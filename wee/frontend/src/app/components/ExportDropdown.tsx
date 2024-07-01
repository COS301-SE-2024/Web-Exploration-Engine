'use client'
import React from "react";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, cn} from "@nextui-org/react";
import { FiShare, FiDownload, FiSave } from "react-icons/fi";


export const ExportDropdown = () => {
  const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0";

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button 
          variant="flat" 
          startContent={<FiShare className={iconClasses}/>}
        >
          Export
        </Button>
      </DropdownTrigger>
      <DropdownMenu variant="flat" aria-label="Dropdown menu with icons">
        <DropdownItem
          key="save"
          startContent={<FiSave className={iconClasses}/>}
          description="Save the report on our website"
        >
          Save
        </DropdownItem>
        <DropdownItem
          key="download"
          startContent={<FiDownload className={iconClasses}/>}
          description="Download the report to your device"
        >
          Download
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
