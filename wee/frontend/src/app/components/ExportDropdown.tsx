import React from 'react';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from '@nextui-org/react';
import { FiShare, FiDownload, FiSave } from 'react-icons/fi';

interface ExportDropdownProps {
  onDownloadReport: () => void;
}

export const ExportDropdown: React.FC<ExportDropdownProps> = ({ onDownloadReport }) => {
  const iconClasses = 'text-xl text-default-500 pointer-events-none flex-shrink-0';

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
          onClick={onDownloadReport}
          data-testid="download-report-button"
        >
          Download
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
