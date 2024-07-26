import {extendVariants, Tab, Tabs} from "@nextui-org/react";

const WEETabs = extendVariants(Tabs, {
    variants: {
			color: {
					stone: {
						cursor: [
							"bg-jungleGreen-700",
							// dark
							"dark:bg-jungleGreen-400",
						],
				}
			}
    },
		defaultVariants: {
			color: "stone"
		}
})

export default WEETabs;  