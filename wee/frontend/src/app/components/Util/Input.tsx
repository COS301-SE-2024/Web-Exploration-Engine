import {extendVariants, Input} from "@nextui-org/react";

const WEEInput = extendVariants(Input, {
    variants: {
      color: {
        stone: { 
          inputWrapper: [ 
            "bg-zinc-200",
            "focus-within:bg-zinc-200",
            "data-[hover=true]:bg-zinc-100",
            // dark theme
            "dark:bg-zinc-700",
            "dark:focus-within:bg-zinc-700",
            "dark:data-[hover=true]:bg-zinc-600",
          ],
        },
      },
    },
    defaultVariants: {
      color: "stone",
    },
  });

export default WEEInput;