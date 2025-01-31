import { FunRouterOptions } from "../types.ts";
import { ObjectRawResponseStatic } from "./types.ts";
import syncCheckDir from "./syncCheckDir.ts";
import bunSyncCheckDir from "./syncCheckDir_Bun.ts";
import denoCheckRead from "./checkRead_Deno.ts";
import staticPaths from "./staticPaths.ts";
import mime from "../components/util/mime.ts";
import joiner from "../components/util/joiner.ts";
import atlas from "../builder/atlas/main1.ts";
import solver from "../builder/solver1.ts";
import split from "../builder/atlas/splitter.ts";

export default (o?: FunRouterOptions) =>
(f: ObjectRawResponseStatic): (r: Request) => Response | Promise<Response> =>
  ((p) =>
    ((re) =>
      (
        (s) => (r: Request) => re[3][s(r)](r)
      )(
        solver(o)(re),
      ))(
        atlas(o)(
          split(o)(
            staticPaths(
              "mime" in f && f.mime === false
                ? []
                : "extra" in f
                ? mime.concat(f.extra)
                : mime,
            )(p)(f.name)(f.path),
          ),
        ),
      ))(
      (
        (denoCheck) =>
          typeof denoCheck == "string"
            ? syncCheckDir(f.path).map((y) => y[0]).flat()
            : bunSyncCheckDir(joiner)(denoCheck.getFiles)(denoCheck.stats)(
              f.path,
            ).map((y) => y[0]).flat()
      )(
        denoCheckRead,
      ),
    );
