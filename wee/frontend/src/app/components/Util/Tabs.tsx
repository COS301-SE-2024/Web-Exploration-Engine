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
						tabContent: [
              "group-data-[selected=true]:text-dark-primaryTextColor",
              "group-data-[selected=true]:font-medium",
              // dark
              "dark:group-data-[selected=true]:dark:text-primaryTextColor",
              "dark:group-data-[selected=true]:font-medium"
						],
				}
			}
    },
		defaultVariants: {
			color: "stone",
      size: 'lg'
		}
})

export default WEETabs;  