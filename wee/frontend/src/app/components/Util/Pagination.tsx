import {extendVariants, Pagination} from "@nextui-org/react";

const WEEPagination = extendVariants(Pagination, {
    variants: {
      color: {
        stone: {
          item: [
            "bg-zinc-300",
            "hover:bg-zinc-100",
            // dark theme
            "dark:bg-zinc-700",
            "dark:hover:bg-zinc-500",
          ],
          prev: [
            "bg-zinc-300",
            "hover:bg-zinc-100",
            // dark theme
            "dark:bg-zinc-700",
            "dark:hover:bg-zinc-500",
          ],
          next: [
            "bg-zinc-300",
            "hover:bg-zinc-100",
            // dark theme
            "dark:bg-zinc-700",
            "dark:hover:bg-zinc-500",
          ],
          cursor: [
            "bg-default",
            // dark theme
            "dark:bg-default",
          ],
        },
      },
    },
    defaultVariants: {
      color: "stone",
    },
  });

export default WEEPagination;