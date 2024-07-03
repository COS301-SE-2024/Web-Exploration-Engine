'use client'
import React from "react";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, Tooltip} from "@nextui-org/react";
import { FiShare, FiDownload, FiSave } from "react-icons/fi";
import { useUserContext } from "../context/UserContext";
import { saveReport } from "../services/SaveReportService";


export const ExportDropdown = () => {
  const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0";
  const { user } = useUserContext();

  const handleSave = () => {
    saveReport();
  }

  const handleDownload = () => {
    console.log("Download");
  }

  return (
    
    <Dropdown>
      <DropdownTrigger>
        <Button 
          variant="flat" 
          startContent={<FiShare className={iconClasses}/>}
        >
          Export/Save
        </Button>
      </DropdownTrigger>
      {user ? (
        <DropdownMenu variant="flat" aria-label="Dropdown menu with icons">
          <DropdownItem
            key="save"
            startContent={<FiSave className={iconClasses}/>}
            description="Save the report on our website"
            onAction={handleSave}
          >
            Save
          </DropdownItem>
          <DropdownItem
            key="download"
            startContent={<FiDownload className={iconClasses}/>}
            description="Download the report to your device"
            onAction={handleDownload}
          >
            Download
          </DropdownItem>
        </DropdownMenu> 
      ) : (
        <DropdownMenu variant="flat" aria-label="Dropdown menu with icons" disabledKeys={["save"]}>
          <DropdownItem
            key="save"
            startContent={<FiSave className={iconClasses}/>}
            description="Sign up or log in to save the report on our website"
            onAction={handleSave}
          >
            Save
          </DropdownItem>
          <DropdownItem
            key="download"
            startContent={<FiDownload className={iconClasses}/>}
            description="Download the report to your device"
            onAction={handleDownload}
          >
            Download
          </DropdownItem>
        </DropdownMenu> 
      )}
    </Dropdown>
  );
}
