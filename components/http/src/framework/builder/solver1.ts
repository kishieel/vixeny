import { Atlas as Atlas1 } from "./atlas/main1.ts";
import { FunRouterOptions } from "../types.ts";
import solver from "./composer/methods1.ts";
import finderMethods from "./composer/finderMethods.ts";

export default (o?: FunRouterOptions) => (atlas: Atlas1) =>
  (
    (me) =>
      (
        (solve) =>
          (atlas[4][0] as Atlas1[0]).length === 0
            ? (r: Request) => solve[me(r.method)](r.url)
            : (
              (m1) =>
                (
                  (solve1) => (r: Request) =>
                    solve1[m1(r.method)](r.url) ?? solve[me(r.method)](r.url)
                )(
                  solver(o)(atlas[4] as Atlas1)(
                    atlas[3].length - (atlas[4][3] as Atlas1[3]).length,
                  )(null as unknown as number)(null as unknown as number),
                )
            )(
              finderMethods(
                atlas[4][0] as Atlas1[0],
              )(atlas[4][0]?.length as unknown as number),
            )
      )(
        solver(o)(atlas)(0)(
          (atlas[4][0] as Atlas1[0]).length === 0
            ? atlas[3].length - 4 + (atlas[4][3] as Atlas1[3]).length
            : atlas[3].length - 2,
        )(atlas[3].length - 1),
      )
  )(
    finderMethods(
      atlas[0],
    )(atlas[0].length),
  );
