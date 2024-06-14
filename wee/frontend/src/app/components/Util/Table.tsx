import {extendVariants, Table} from "@nextui-org/react";

const WEETable = extendVariants(Table, {
    variants: {
      color: {
        stone: {
          th: [
            "bg-jungleGreen-700",
            "text-dark-primaryTextColor",
            // dark
            "dark:bg-jungleGreen-400",
            "dark:text-primaryTextColor",
          ],
          wrapper: [
            "shadow-none",
            "bg-zinc-100",
            // dark
            "dark:bg-zinc-800"
          ],
        },
      },
    },
    defaultVariants: {
      color: "stone",
    },
  });

export default WEETable;