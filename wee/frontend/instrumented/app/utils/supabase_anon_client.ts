function cov_2ihjlyljsp() {
  var path = "C:\\Users\\siyam\\Documents\\GitHub\\Web-Exploration-Engine\\wee\\frontend\\src\\app\\utils\\supabase_anon_client.ts";
  var hash = "da5481b48ddaf71a00136466dad02200ac401cf2";
  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "C:\\Users\\siyam\\Documents\\GitHub\\Web-Exploration-Engine\\wee\\frontend\\src\\app\\utils\\supabase_anon_client.ts",
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
          column: 26
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
          column: 57
        }
      },
      "6": {
        start: {
          line: 16,
          column: 24
        },
        end: {
          line: 16,
          column: 69
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
            line: 6,
            column: 0
          },
          end: {
            line: 8,
            column: 1
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
            line: 10,
            column: 0
          },
          end: {
            line: 12,
            column: 1
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
    hash: "da5481b48ddaf71a00136466dad02200ac401cf2"
  };
  var coverage = global[gcv] || (global[gcv] = {});
  if (!coverage[path] || coverage[path].hash !== hash) {
    coverage[path] = coverageData;
  }
  var actualCoverage = coverage[path];
  {
    // @ts-ignore
    cov_2ihjlyljsp = function () {
      return actualCoverage;
    };
  }
  return actualCoverage;
}
cov_2ihjlyljsp();
import { createClient } from '@supabase/supabase-js';
const SUPABASE_URL = (cov_2ihjlyljsp().s[0]++, process.env.NEXT_PUBLIC_SUPABASE_URL);
const SUPABASE_ANON_KEY = (cov_2ihjlyljsp().s[1]++, process.env.NEXT_PUBLIC_SUPABASE_ANON_PUBLIC_KEY);
cov_2ihjlyljsp().s[2]++;
if (!SUPABASE_URL) {
  cov_2ihjlyljsp().b[0][0]++;
  cov_2ihjlyljsp().s[3]++;
  throw new Error('Missing env.SUPABASE_URL');
} else {
  cov_2ihjlyljsp().b[0][1]++;
}
cov_2ihjlyljsp().s[4]++;
if (!SUPABASE_ANON_KEY) {
  cov_2ihjlyljsp().b[1][0]++;
  cov_2ihjlyljsp().s[5]++;
  throw new Error('Missing env.SUPABASE_ANON_PUBLIC_KEY');
} else {
  cov_2ihjlyljsp().b[1][1]++;
}
export const supabase = (cov_2ihjlyljsp().s[6]++, createClient(SUPABASE_URL, SUPABASE_ANON_KEY));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJjb3ZfMmloamx5bGpzcCIsImFjdHVhbENvdmVyYWdlIiwiY3JlYXRlQ2xpZW50IiwiU1VQQUJBU0VfVVJMIiwicyIsInByb2Nlc3MiLCJlbnYiLCJORVhUX1BVQkxJQ19TVVBBQkFTRV9VUkwiLCJTVVBBQkFTRV9BTk9OX0tFWSIsIk5FWFRfUFVCTElDX1NVUEFCQVNFX0FOT05fUFVCTElDX0tFWSIsImIiLCJFcnJvciIsInN1cGFiYXNlIl0sInNvdXJjZXMiOlsic3VwYWJhc2VfYW5vbl9jbGllbnQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY3JlYXRlQ2xpZW50IH0gZnJvbSAnQHN1cGFiYXNlL3N1cGFiYXNlLWpzJ1xyXG5cclxuY29uc3QgU1VQQUJBU0VfVVJMID0gcHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfU1VQQUJBU0VfVVJMXHJcbmNvbnN0IFNVUEFCQVNFX0FOT05fS0VZID0gcHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfU1VQQUJBU0VfQU5PTl9QVUJMSUNfS0VZXHJcblxyXG5pZiAoIVNVUEFCQVNFX1VSTCkge1xyXG4gIHRocm93IG5ldyBFcnJvcignTWlzc2luZyBlbnYuU1VQQUJBU0VfVVJMJylcclxufVxyXG5cclxuaWYgKCFTVVBBQkFTRV9BTk9OX0tFWSkge1xyXG4gIHRocm93IG5ldyBFcnJvcignTWlzc2luZyBlbnYuU1VQQUJBU0VfQU5PTl9QVUJMSUNfS0VZJylcclxufVxyXG5cclxuXHJcblxyXG5leHBvcnQgY29uc3Qgc3VwYWJhc2UgPSBjcmVhdGVDbGllbnQoU1VQQUJBU0VfVVJMLCBTVVBBQkFTRV9BTk9OX0tFWSkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQWVZO0lBQUFBLGNBQUEsWUFBQUEsQ0FBQTtNQUFBLE9BQUFDLGNBQUE7SUFBQTtFQUFBO0VBQUEsT0FBQUEsY0FBQTtBQUFBO0FBQUFELGNBQUE7QUFmWixTQUFTRSxZQUFZLFFBQVEsdUJBQXVCO0FBRXBELE1BQU1DLFlBQVksSUFBQUgsY0FBQSxHQUFBSSxDQUFBLE9BQUdDLE9BQU8sQ0FBQ0MsR0FBRyxDQUFDQyx3QkFBd0I7QUFDekQsTUFBTUMsaUJBQWlCLElBQUFSLGNBQUEsR0FBQUksQ0FBQSxPQUFHQyxPQUFPLENBQUNDLEdBQUcsQ0FBQ0csb0NBQW9DO0FBQUFULGNBQUEsR0FBQUksQ0FBQTtBQUUxRSxJQUFJLENBQUNELFlBQVksRUFBRTtFQUFBSCxjQUFBLEdBQUFVLENBQUE7RUFBQVYsY0FBQSxHQUFBSSxDQUFBO0VBQ2pCLE1BQU0sSUFBSU8sS0FBSyxDQUFDLDBCQUEwQixDQUFDO0FBQzdDLENBQUM7RUFBQVgsY0FBQSxHQUFBVSxDQUFBO0FBQUE7QUFBQVYsY0FBQSxHQUFBSSxDQUFBO0FBRUQsSUFBSSxDQUFDSSxpQkFBaUIsRUFBRTtFQUFBUixjQUFBLEdBQUFVLENBQUE7RUFBQVYsY0FBQSxHQUFBSSxDQUFBO0VBQ3RCLE1BQU0sSUFBSU8sS0FBSyxDQUFDLHNDQUFzQyxDQUFDO0FBQ3pELENBQUM7RUFBQVgsY0FBQSxHQUFBVSxDQUFBO0FBQUE7QUFJRCxPQUFPLE1BQU1FLFFBQVEsSUFBQVosY0FBQSxHQUFBSSxDQUFBLE9BQUdGLFlBQVksQ0FBQ0MsWUFBWSxFQUFFSyxpQkFBaUIsQ0FBQyIsImlnbm9yZUxpc3QiOltdfQ==