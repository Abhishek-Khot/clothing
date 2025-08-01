import React from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { FiSliders } from "react-icons/fi";
import Filters from ".";

interface MobileFiltersProps {
  open: boolean;
  onClose: () => void;
}

const MobileFilters: React.FC<MobileFiltersProps> = ({ open, onClose }) => {
  return (
    <Drawer open={open} onOpenChange={val => { if (!val) onClose(); }}>
      <DrawerContent className="bg-white rounded-[20px] px-5 md:px-6 py-5 space-y-5 md:space-y-6 border border-black/10 max-h-[90%]">
        <DrawerHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-black text-xl">Filters</span>
              <FiSliders className="text-2xl text-black/40" />
            </div>
            <button
              className="text-2xl text-black/40 ml-2"
              onClick={onClose}
              aria-label="Close Filters"
            >
              ×
            </button>
          </div>
          <DrawerTitle className="hidden">filters</DrawerTitle>
          <DrawerDescription className="hidden">filters</DrawerDescription>
        </DrawerHeader>
        <div className="overflow-y-auto w-full">
          <Filters />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileFilters;
