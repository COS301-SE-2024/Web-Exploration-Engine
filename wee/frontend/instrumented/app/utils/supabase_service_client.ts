function cov_1eklte2vxu() {
  var path = "C:\\Users\\siyam\\Documents\\GitHub\\Web-Exploration-Engine\\wee\\frontend\\src\\app\\utils\\supabase_service_client.ts";
  var hash = "efae3853756067c03eb0c7741ccee02ae481fc5f";
  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "C:\\Users\\siyam\\Documents\\GitHub\\Web-Exploration-Engine\\wee\\frontend\\src\\app\\utils\\supabase_service_client.ts",
    statementMap: {
      "0": {
        start: {
          line: 3,
          column: 21
        },
        end: {
          line: 3,
          column: 57
        }
      },
      "1": {
        start: {
          line: 4,
          column: 25
        },
        end: {
          line: 4,
          column: 74
        }
      },
      "2": {
        start: {
          line: 6,
          column: 0
        },
        end: {
          line: 8,
          column: 1
        }
      },
      "3": {
        start: {
          line: 7,
          column: 2
        },
        end: {
          line: 7,
          column: 45
        }
      },
      "4": {
        start: {
          line: 10,
          column: 0
        },
        end: {
          line: 12,
          column: 1
        }
      },
      "5": {
        start: {
          line: 11,
          column: 2
        },
        end: {
          line: 11,
          column: 58
        }
      },
      "6": {
        start: {
          line: 14,
          column: 24
        },
        end: {
          line: 14,
          column: 68
        }
      }
    },
    fnMap: {},
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 6,
            column: 0
          },
          end: {
            line: 8,
            column: 1
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 6,
            column: 0
          },
          end: {
            line: 8,
            column: 1
          }
        }, {
          start: {
            line: undefined,
            column: undefined
          },
          end: {
            line: undefined,
            column: undefined
          }
        }],
        line: 6
      },
      "1": {
        loc: {
          start: {
            line: 10,
            column: 0
          },
          end: {
            line: 12,
            column: 1
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 10,
            column: 0
          },
          end: {
            line: 12,
            column: 1
          }
        }, {
          start: {
            line: undefined,
            column: undefined
          },
          end: {
            line: undefined,
            column: undefined
          }
        }],
        line: 10
      }
    },
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0
    },
    f: {},
    b: {
      "0": [0, 0],
      "1": [0, 0]
    },
    _coverageSchema: "1a1c01bbd47fc00a2c39e90264f33305004495a9",
    hash: "efae3853756067c03eb0c7741ccee02ae481fc5f"
  };
  var coverage = global[gcv] || (global[gcv] = {});
  if (!coverage[path] || coverage[path].hash !== hash) {
    coverage[path] = coverageData;
  }
  var actualCoverage = coverage[path];
  {
    // @ts-ignore
    cov_1eklte2vxu = function () {
      return actualCoverage;
    };
  }
  return actualCoverage;
}
cov_1eklte2vxu();
import { createClient } from '@supabase/supabase-js';
const SUPABASE_URL = (cov_1eklte2vxu().s[0]++, process.env.NEXT_PUBLIC_SUPABASE_URL);
const SUPABASE_SRV_KEY = (cov_1eklte2vxu().s[1]++, process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY);
cov_1eklte2vxu().s[2]++;
if (!SUPABASE_URL) {
  cov_1eklte2vxu().b[0][0]++;
  cov_1eklte2vxu().s[3]++;
  throw new Error('Missing env.SUPABASE_URL');
} else {
  cov_1eklte2vxu().b[0][1]++;
}
cov_1eklte2vxu().s[4]++;
if (!SUPABASE_SRV_KEY) {
  cov_1eklte2vxu().b[1][0]++;
  cov_1eklte2vxu().s[5]++;
  throw new Error('Missing env.SUPABASE_SERVICE_ROLE_KEY');
} else {
  cov_1eklte2vxu().b[1][1]++;
}
export const supabase = (cov_1eklte2vxu().s[6]++, createClient(SUPABASE_URL, SUPABASE_SRV_KEY));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJjb3ZfMWVrbHRlMnZ4dSIsImFjdHVhbENvdmVyYWdlIiwiY3JlYXRlQ2xpZW50IiwiU1VQQUJBU0VfVVJMIiwicyIsInByb2Nlc3MiLCJlbnYiLCJORVhUX1BVQkxJQ19TVVBBQkFTRV9VUkwiLCJTVVBBQkFTRV9TUlZfS0VZIiwiTkVYVF9QVUJMSUNfU1VQQUJBU0VfU0VSVklDRV9ST0xFX0tFWSIsImIiLCJFcnJvciIsInN1cGFiYXNlIl0sInNvdXJjZXMiOlsic3VwYWJhc2Vfc2VydmljZV9jbGllbnQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY3JlYXRlQ2xpZW50IH0gZnJvbSAnQHN1cGFiYXNlL3N1cGFiYXNlLWpzJ1xyXG5cclxuY29uc3QgU1VQQUJBU0VfVVJMID0gcHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfU1VQQUJBU0VfVVJMXHJcbmNvbnN0IFNVUEFCQVNFX1NSVl9LRVkgPSBwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19TVVBBQkFTRV9TRVJWSUNFX1JPTEVfS0VZXHJcblxyXG5pZiAoIVNVUEFCQVNFX1VSTCkge1xyXG4gIHRocm93IG5ldyBFcnJvcignTWlzc2luZyBlbnYuU1VQQUJBU0VfVVJMJylcclxufVxyXG5cclxuaWYgKCFTVVBBQkFTRV9TUlZfS0VZKSB7XHJcbiAgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nIGVudi5TVVBBQkFTRV9TRVJWSUNFX1JPTEVfS0VZJylcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHN1cGFiYXNlID0gY3JlYXRlQ2xpZW50KFNVUEFCQVNFX1VSTCwgU1VQQUJBU0VfU1JWX0tFWSkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQWVZO0lBQUFBLGNBQUEsWUFBQUEsQ0FBQTtNQUFBLE9BQUFDLGNBQUE7SUFBQTtFQUFBO0VBQUEsT0FBQUEsY0FBQTtBQUFBO0FBQUFELGNBQUE7QUFmWixTQUFTRSxZQUFZLFFBQVEsdUJBQXVCO0FBRXBELE1BQU1DLFlBQVksSUFBQUgsY0FBQSxHQUFBSSxDQUFBLE9BQUdDLE9BQU8sQ0FBQ0MsR0FBRyxDQUFDQyx3QkFBd0I7QUFDekQsTUFBTUMsZ0JBQWdCLElBQUFSLGNBQUEsR0FBQUksQ0FBQSxPQUFHQyxPQUFPLENBQUNDLEdBQUcsQ0FBQ0cscUNBQXFDO0FBQUFULGNBQUEsR0FBQUksQ0FBQTtBQUUxRSxJQUFJLENBQUNELFlBQVksRUFBRTtFQUFBSCxjQUFBLEdBQUFVLENBQUE7RUFBQVYsY0FBQSxHQUFBSSxDQUFBO0VBQ2pCLE1BQU0sSUFBSU8sS0FBSyxDQUFDLDBCQUEwQixDQUFDO0FBQzdDLENBQUM7RUFBQVgsY0FBQSxHQUFBVSxDQUFBO0FBQUE7QUFBQVYsY0FBQSxHQUFBSSxDQUFBO0FBRUQsSUFBSSxDQUFDSSxnQkFBZ0IsRUFBRTtFQUFBUixjQUFBLEdBQUFVLENBQUE7RUFBQVYsY0FBQSxHQUFBSSxDQUFBO0VBQ3JCLE1BQU0sSUFBSU8sS0FBSyxDQUFDLHVDQUF1QyxDQUFDO0FBQzFELENBQUM7RUFBQVgsY0FBQSxHQUFBVSxDQUFBO0FBQUE7QUFFRCxPQUFPLE1BQU1FLFFBQVEsSUFBQVosY0FBQSxHQUFBSSxDQUFBLE9BQUdGLFlBQVksQ0FBQ0MsWUFBWSxFQUFFSyxnQkFBZ0IsQ0FBQyIsImlnbm9yZUxpc3QiOltdfQ==