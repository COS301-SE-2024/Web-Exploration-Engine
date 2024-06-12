import {extendVariants, Select} from "@nextui-org/react";

const WEESelect = extendVariants(Select, {
    variants: {
      color: {
        stone: {
            trigger: [
                "bg-zinc-200",
                "focus-within:bg-zinc-200",
                "data-[hover=true]:bg-zinc-100",
                // dark theme
                "dark:bg-zinc-700",
                "dark:focus-within:bg-zinc-700",
                "dark:data-[hover=true]:bg-zinc-600",
            ],
            popoverContent: [
                "bg-zinc-200",
                // dark theme
                "dark:bg-zinc-700",
            ],
        },
      },
    },
    defaultVariants: {
      color: "stone",
    },
  });

export default WEESelect;