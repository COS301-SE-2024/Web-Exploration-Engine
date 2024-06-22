function cov_1f5ljhd499() {
  var path = "C:\\Users\\siyam\\Documents\\GitHub\\Web-Exploration-Engine\\wee\\frontend\\src\\app\\components\\Util\\Textarea.tsx";
  var hash = "1a37214d9be4839c5f5e701adfdb6a538e446068";
  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "C:\\Users\\siyam\\Documents\\GitHub\\Web-Exploration-Engine\\wee\\frontend\\src\\app\\components\\Util\\Textarea.tsx",
    statementMap: {
      "0": {
        start: {
          line: 4,
          column: 20
        },
        end: {
          line: 23,
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
    hash: "1a37214d9be4839c5f5e701adfdb6a538e446068"
  };
  var coverage = global[gcv] || (global[gcv] = {});
  if (!coverage[path] || coverage[path].hash !== hash) {
    coverage[path] = coverageData;
  }
  var actualCoverage = coverage[path];
  {
    // @ts-ignore
    cov_1f5ljhd499 = function () {
      return actualCoverage;
    };
  }
  return actualCoverage;
}
cov_1f5ljhd499();
import { extendVariants } from "@nextui-org/react";
import { Textarea } from "@nextui-org/input";
const WEETextarea = (cov_1f5ljhd499().s[0]++, extendVariants(Textarea, {
  variants: {
    color: {
      stone: {
        inputWrapper: ["bg-zinc-200", "focus-within:bg-zinc-200", "data-[hover=true]:bg-zinc-100",
        // dark theme
        "dark:bg-zinc-700", "dark:focus-within:bg-zinc-700", "dark:data-[hover=true]:bg-zinc-600"]
      }
    }
  },
  defaultVariants: {
    color: "stone"
  }
}));
export default WEETextarea;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJjb3ZfMWY1bGpoZDQ5OSIsImFjdHVhbENvdmVyYWdlIiwiZXh0ZW5kVmFyaWFudHMiLCJUZXh0YXJlYSIsIldFRVRleHRhcmVhIiwicyIsInZhcmlhbnRzIiwiY29sb3IiLCJzdG9uZSIsImlucHV0V3JhcHBlciIsImRlZmF1bHRWYXJpYW50cyJdLCJzb3VyY2VzIjpbIlRleHRhcmVhLnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2V4dGVuZFZhcmlhbnRzfSBmcm9tIFwiQG5leHR1aS1vcmcvcmVhY3RcIjtcclxuaW1wb3J0IHtUZXh0YXJlYX0gZnJvbSBcIkBuZXh0dWktb3JnL2lucHV0XCI7XHJcblxyXG5jb25zdCBXRUVUZXh0YXJlYSA9IGV4dGVuZFZhcmlhbnRzKFRleHRhcmVhLCB7XHJcbiAgICB2YXJpYW50czoge1xyXG4gICAgICAgIGNvbG9yOiB7XHJcbiAgICAgICAgICBzdG9uZTogeyBcclxuICAgICAgICAgICAgaW5wdXRXcmFwcGVyOiBbIFxyXG4gICAgICAgICAgICAgIFwiYmctemluYy0yMDBcIixcclxuICAgICAgICAgICAgICBcImZvY3VzLXdpdGhpbjpiZy16aW5jLTIwMFwiLFxyXG4gICAgICAgICAgICAgIFwiZGF0YS1baG92ZXI9dHJ1ZV06YmctemluYy0xMDBcIixcclxuICAgICAgICAgICAgICAvLyBkYXJrIHRoZW1lXHJcbiAgICAgICAgICAgICAgXCJkYXJrOmJnLXppbmMtNzAwXCIsXHJcbiAgICAgICAgICAgICAgXCJkYXJrOmZvY3VzLXdpdGhpbjpiZy16aW5jLTcwMFwiLFxyXG4gICAgICAgICAgICAgIFwiZGFyazpkYXRhLVtob3Zlcj10cnVlXTpiZy16aW5jLTYwMFwiLFxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgICBkZWZhdWx0VmFyaWFudHM6IHtcclxuICAgICAgICBjb2xvcjogXCJzdG9uZVwiLFxyXG4gICAgICB9LFxyXG4gIH0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgV0VFVGV4dGFyZWE7Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQWVZO0lBQUFBLGNBQUEsWUFBQUEsQ0FBQTtNQUFBLE9BQUFDLGNBQUE7SUFBQTtFQUFBO0VBQUEsT0FBQUEsY0FBQTtBQUFBO0FBQUFELGNBQUE7QUFmWixTQUFRRSxjQUFjLFFBQU8sbUJBQW1CO0FBQ2hELFNBQVFDLFFBQVEsUUFBTyxtQkFBbUI7QUFFMUMsTUFBTUMsV0FBVyxJQUFBSixjQUFBLEdBQUFLLENBQUEsT0FBR0gsY0FBYyxDQUFDQyxRQUFRLEVBQUU7RUFDekNHLFFBQVEsRUFBRTtJQUNOQyxLQUFLLEVBQUU7TUFDTEMsS0FBSyxFQUFFO1FBQ0xDLFlBQVksRUFBRSxDQUNaLGFBQWEsRUFDYiwwQkFBMEIsRUFDMUIsK0JBQStCO1FBQy9CO1FBQ0Esa0JBQWtCLEVBQ2xCLCtCQUErQixFQUMvQixvQ0FBb0M7TUFFeEM7SUFDRjtFQUNGLENBQUM7RUFDREMsZUFBZSxFQUFFO0lBQ2ZILEtBQUssRUFBRTtFQUNUO0FBQ0osQ0FBQyxDQUFDO0FBRUosZUFBZUgsV0FBVyIsImlnbm9yZUxpc3QiOltdfQ==