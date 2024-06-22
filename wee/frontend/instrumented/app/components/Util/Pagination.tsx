function cov_d1aerai6e() {
  var path = "C:\\Users\\siyam\\Documents\\GitHub\\Web-Exploration-Engine\\wee\\frontend\\src\\app\\components\\Util\\Pagination.tsx";
  var hash = "7f20ca5750c6d4a1a61b14343a566bc387b0d536";
  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "C:\\Users\\siyam\\Documents\\GitHub\\Web-Exploration-Engine\\wee\\frontend\\src\\app\\components\\Util\\Pagination.tsx",
    statementMap: {
      "0": {
        start: {
          line: 3,
          column: 22
        },
        end: {
          line: 39,
          column: 4
        }
      }
    },
    fnMap: {},
    branchMap: {},
    s: {
      "0": 0
    },
    f: {},
    b: {},
    _coverageSchema: "1a1c01bbd47fc00a2c39e90264f33305004495a9",
    hash: "7f20ca5750c6d4a1a61b14343a566bc387b0d536"
  };
  var coverage = global[gcv] || (global[gcv] = {});
  if (!coverage[path] || coverage[path].hash !== hash) {
    coverage[path] = coverageData;
  }
  var actualCoverage = coverage[path];
  {
    // @ts-ignore
    cov_d1aerai6e = function () {
      return actualCoverage;
    };
  }
  return actualCoverage;
}
cov_d1aerai6e();
import { extendVariants, Pagination } from "@nextui-org/react";
const WEEPagination = (cov_d1aerai6e().s[0]++, extendVariants(Pagination, {
  variants: {
    color: {
      stone: {
        item: ["bg-zinc-300", "hover:bg-zinc-100",
        // dark theme
        "dark:bg-zinc-700", "dark:hover:bg-zinc-500"],
        prev: ["bg-zinc-300", "hover:bg-zinc-100",
        // dark theme
        "dark:bg-zinc-700", "dark:hover:bg-zinc-500"],
        next: ["bg-zinc-300", "hover:bg-zinc-100",
        // dark theme
        "dark:bg-zinc-700", "dark:hover:bg-zinc-500"],
        cursor: ["bg-default",
        // dark theme
        "dark:bg-default"]
      }
    }
  },
  defaultVariants: {
    color: "stone"
  }
}));
export default WEEPagination;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJjb3ZfZDFhZXJhaTZlIiwiYWN0dWFsQ292ZXJhZ2UiLCJleHRlbmRWYXJpYW50cyIsIlBhZ2luYXRpb24iLCJXRUVQYWdpbmF0aW9uIiwicyIsInZhcmlhbnRzIiwiY29sb3IiLCJzdG9uZSIsIml0ZW0iLCJwcmV2IiwibmV4dCIsImN1cnNvciIsImRlZmF1bHRWYXJpYW50cyJdLCJzb3VyY2VzIjpbIlBhZ2luYXRpb24udHN4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7ZXh0ZW5kVmFyaWFudHMsIFBhZ2luYXRpb259IGZyb20gXCJAbmV4dHVpLW9yZy9yZWFjdFwiO1xyXG5cclxuY29uc3QgV0VFUGFnaW5hdGlvbiA9IGV4dGVuZFZhcmlhbnRzKFBhZ2luYXRpb24sIHtcclxuICAgIHZhcmlhbnRzOiB7XHJcbiAgICAgIGNvbG9yOiB7XHJcbiAgICAgICAgc3RvbmU6IHtcclxuICAgICAgICAgIGl0ZW06IFtcclxuICAgICAgICAgICAgXCJiZy16aW5jLTMwMFwiLFxyXG4gICAgICAgICAgICBcImhvdmVyOmJnLXppbmMtMTAwXCIsXHJcbiAgICAgICAgICAgIC8vIGRhcmsgdGhlbWVcclxuICAgICAgICAgICAgXCJkYXJrOmJnLXppbmMtNzAwXCIsXHJcbiAgICAgICAgICAgIFwiZGFyazpob3ZlcjpiZy16aW5jLTUwMFwiLFxyXG4gICAgICAgICAgXSxcclxuICAgICAgICAgIHByZXY6IFtcclxuICAgICAgICAgICAgXCJiZy16aW5jLTMwMFwiLFxyXG4gICAgICAgICAgICBcImhvdmVyOmJnLXppbmMtMTAwXCIsXHJcbiAgICAgICAgICAgIC8vIGRhcmsgdGhlbWVcclxuICAgICAgICAgICAgXCJkYXJrOmJnLXppbmMtNzAwXCIsXHJcbiAgICAgICAgICAgIFwiZGFyazpob3ZlcjpiZy16aW5jLTUwMFwiLFxyXG4gICAgICAgICAgXSxcclxuICAgICAgICAgIG5leHQ6IFtcclxuICAgICAgICAgICAgXCJiZy16aW5jLTMwMFwiLFxyXG4gICAgICAgICAgICBcImhvdmVyOmJnLXppbmMtMTAwXCIsXHJcbiAgICAgICAgICAgIC8vIGRhcmsgdGhlbWVcclxuICAgICAgICAgICAgXCJkYXJrOmJnLXppbmMtNzAwXCIsXHJcbiAgICAgICAgICAgIFwiZGFyazpob3ZlcjpiZy16aW5jLTUwMFwiLFxyXG4gICAgICAgICAgXSxcclxuICAgICAgICAgIGN1cnNvcjogW1xyXG4gICAgICAgICAgICBcImJnLWRlZmF1bHRcIixcclxuICAgICAgICAgICAgLy8gZGFyayB0aGVtZVxyXG4gICAgICAgICAgICBcImRhcms6YmctZGVmYXVsdFwiLFxyXG4gICAgICAgICAgXSxcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIGRlZmF1bHRWYXJpYW50czoge1xyXG4gICAgICBjb2xvcjogXCJzdG9uZVwiLFxyXG4gICAgfSxcclxuICB9KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFdFRVBhZ2luYXRpb247Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQWVZO0lBQUFBLGFBQUEsWUFBQUEsQ0FBQTtNQUFBLE9BQUFDLGNBQUE7SUFBQTtFQUFBO0VBQUEsT0FBQUEsY0FBQTtBQUFBO0FBQUFELGFBQUE7QUFmWixTQUFRRSxjQUFjLEVBQUVDLFVBQVUsUUFBTyxtQkFBbUI7QUFFNUQsTUFBTUMsYUFBYSxJQUFBSixhQUFBLEdBQUFLLENBQUEsT0FBR0gsY0FBYyxDQUFDQyxVQUFVLEVBQUU7RUFDN0NHLFFBQVEsRUFBRTtJQUNSQyxLQUFLLEVBQUU7TUFDTEMsS0FBSyxFQUFFO1FBQ0xDLElBQUksRUFBRSxDQUNKLGFBQWEsRUFDYixtQkFBbUI7UUFDbkI7UUFDQSxrQkFBa0IsRUFDbEIsd0JBQXdCLENBQ3pCO1FBQ0RDLElBQUksRUFBRSxDQUNKLGFBQWEsRUFDYixtQkFBbUI7UUFDbkI7UUFDQSxrQkFBa0IsRUFDbEIsd0JBQXdCLENBQ3pCO1FBQ0RDLElBQUksRUFBRSxDQUNKLGFBQWEsRUFDYixtQkFBbUI7UUFDbkI7UUFDQSxrQkFBa0IsRUFDbEIsd0JBQXdCLENBQ3pCO1FBQ0RDLE1BQU0sRUFBRSxDQUNOLFlBQVk7UUFDWjtRQUNBLGlCQUFpQjtNQUVyQjtJQUNGO0VBQ0YsQ0FBQztFQUNEQyxlQUFlLEVBQUU7SUFDZk4sS0FBSyxFQUFFO0VBQ1Q7QUFDRixDQUFDLENBQUM7QUFFSixlQUFlSCxhQUFhIiwiaWdub3JlTGlzdCI6W119