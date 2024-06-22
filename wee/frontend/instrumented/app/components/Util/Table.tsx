function cov_1he2i19qxc() {
  var path = "C:\\Users\\siyam\\Documents\\GitHub\\Web-Exploration-Engine\\wee\\frontend\\src\\app\\components\\Util\\Table.tsx";
  var hash = "1babe36d937cf97d2cfe65eafae72e5397a3f07e";
  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "C:\\Users\\siyam\\Documents\\GitHub\\Web-Exploration-Engine\\wee\\frontend\\src\\app\\components\\Util\\Table.tsx",
    statementMap: {
      "0": {
        start: {
          line: 3,
          column: 17
        },
        end: {
          line: 26,
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
    hash: "1babe36d937cf97d2cfe65eafae72e5397a3f07e"
  };
  var coverage = global[gcv] || (global[gcv] = {});
  if (!coverage[path] || coverage[path].hash !== hash) {
    coverage[path] = coverageData;
  }
  var actualCoverage = coverage[path];
  {
    // @ts-ignore
    cov_1he2i19qxc = function () {
      return actualCoverage;
    };
  }
  return actualCoverage;
}
cov_1he2i19qxc();
import { extendVariants, Table } from "@nextui-org/react";
const WEETable = (cov_1he2i19qxc().s[0]++, extendVariants(Table, {
  variants: {
    color: {
      stone: {
        th: ["bg-jungleGreen-700", "text-dark-primaryTextColor",
        // dark
        "dark:bg-jungleGreen-400", "dark:text-primaryTextColor"],
        wrapper: ["shadow-none", "bg-zinc-100",
        // dark
        "dark:bg-zinc-800"]
      }
    }
  },
  defaultVariants: {
    color: "stone"
  }
}));
export default WEETable;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJjb3ZfMWhlMmkxOXF4YyIsImFjdHVhbENvdmVyYWdlIiwiZXh0ZW5kVmFyaWFudHMiLCJUYWJsZSIsIldFRVRhYmxlIiwicyIsInZhcmlhbnRzIiwiY29sb3IiLCJzdG9uZSIsInRoIiwid3JhcHBlciIsImRlZmF1bHRWYXJpYW50cyJdLCJzb3VyY2VzIjpbIlRhYmxlLnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2V4dGVuZFZhcmlhbnRzLCBUYWJsZX0gZnJvbSBcIkBuZXh0dWktb3JnL3JlYWN0XCI7XHJcblxyXG5jb25zdCBXRUVUYWJsZSA9IGV4dGVuZFZhcmlhbnRzKFRhYmxlLCB7XHJcbiAgICB2YXJpYW50czoge1xyXG4gICAgICBjb2xvcjoge1xyXG4gICAgICAgIHN0b25lOiB7XHJcbiAgICAgICAgICB0aDogW1xyXG4gICAgICAgICAgICBcImJnLWp1bmdsZUdyZWVuLTcwMFwiLFxyXG4gICAgICAgICAgICBcInRleHQtZGFyay1wcmltYXJ5VGV4dENvbG9yXCIsXHJcbiAgICAgICAgICAgIC8vIGRhcmtcclxuICAgICAgICAgICAgXCJkYXJrOmJnLWp1bmdsZUdyZWVuLTQwMFwiLFxyXG4gICAgICAgICAgICBcImRhcms6dGV4dC1wcmltYXJ5VGV4dENvbG9yXCIsXHJcbiAgICAgICAgICBdLFxyXG4gICAgICAgICAgd3JhcHBlcjogW1xyXG4gICAgICAgICAgICBcInNoYWRvdy1ub25lXCIsXHJcbiAgICAgICAgICAgIFwiYmctemluYy0xMDBcIixcclxuICAgICAgICAgICAgLy8gZGFya1xyXG4gICAgICAgICAgICBcImRhcms6YmctemluYy04MDBcIlxyXG4gICAgICAgICAgXSxcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIGRlZmF1bHRWYXJpYW50czoge1xyXG4gICAgICBjb2xvcjogXCJzdG9uZVwiLFxyXG4gICAgfSxcclxuICB9KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFdFRVRhYmxlOyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFlWTtJQUFBQSxjQUFBLFlBQUFBLENBQUE7TUFBQSxPQUFBQyxjQUFBO0lBQUE7RUFBQTtFQUFBLE9BQUFBLGNBQUE7QUFBQTtBQUFBRCxjQUFBO0FBZlosU0FBUUUsY0FBYyxFQUFFQyxLQUFLLFFBQU8sbUJBQW1CO0FBRXZELE1BQU1DLFFBQVEsSUFBQUosY0FBQSxHQUFBSyxDQUFBLE9BQUdILGNBQWMsQ0FBQ0MsS0FBSyxFQUFFO0VBQ25DRyxRQUFRLEVBQUU7SUFDUkMsS0FBSyxFQUFFO01BQ0xDLEtBQUssRUFBRTtRQUNMQyxFQUFFLEVBQUUsQ0FDRixvQkFBb0IsRUFDcEIsNEJBQTRCO1FBQzVCO1FBQ0EseUJBQXlCLEVBQ3pCLDRCQUE0QixDQUM3QjtRQUNEQyxPQUFPLEVBQUUsQ0FDUCxhQUFhLEVBQ2IsYUFBYTtRQUNiO1FBQ0Esa0JBQWtCO01BRXRCO0lBQ0Y7RUFDRixDQUFDO0VBQ0RDLGVBQWUsRUFBRTtJQUNmSixLQUFLLEVBQUU7RUFDVDtBQUNGLENBQUMsQ0FBQztBQUVKLGVBQWVILFFBQVEiLCJpZ25vcmVMaXN0IjpbXX0=