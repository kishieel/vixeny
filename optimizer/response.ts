
import { funRouterOptions } from "../types.ts";
import { ObjectRawCommonRequest, ObjectRawResponseCommon } from "./types.ts";
import checkAsync from "./recursiveCheckAsync.ts"
import checker from "./checker.ts";
import aComposer from "./aComposer.ts";
import mime from "../components/util/mime.ts";
import jsonComposer from "../components/stringify/stringify.ts";
import elements from "../components/util/elements.ts";

export default (o?: funRouterOptions) =>
  (f: ObjectRawResponseCommon | ObjectRawCommonRequest) =>
    ((elementsUsed) => (
      table =>
        (composition =>
          (table.headers && table.json)
            ? composition(table.json)(table.headers)(f.f)(aComposer(o)(f as ObjectRawResponseCommon)(elementsUsed))
            : table.headers
              ? composition(table.headers)(f.f)(aComposer(o)(f as ObjectRawResponseCommon)(elementsUsed))
              : table.json
                ? composition(table.json)(f.f)(aComposer(o)(f as ObjectRawResponseCommon)(elementsUsed))
                : composition(f.f)(aComposer(o)(f as ObjectRawResponseCommon)(elementsUsed))
        )(
          "type" in f
            ?
            new Function(`
      return ${table.json ? "j=>" : ""}f=>c=>${table.async || table.asyncResolve ? "async " : ""}r=>${table.async || table.asyncResolve ? "await f" : "f"}(${table.asyncResolve ? "await c" : "c"}(${"mutable" in f ? "{r:r,m:{}}" : "r"}))`)()
            : new Function(
              `return ${table.json ? "j=>" : ""}${table.headers ? "h=>" : ""}${table.async ? "f=>" : "f=>"}${table.asyncResolve ? "c=>" : "c=>"}${table.async || table.asyncResolve ? "async " : ""}r=> new Response(${table.async || table.asyncResolve ? "await f" : "f"}(${table.asyncResolve ? "await c" : "c"}(${"mutable" in f ? "{r:r,m:{}}" : "r"}))${table.headers ? ",h" : ""})`
            )()
        )
    )(
      {
        async: f.f.constructor.name === "AsyncFunction",
        asyncResolve: checkAsync(f as ObjectRawResponseCommon),
        headers: "status" in f || "headers" in f
          ?
          {
            headers: new Headers(
              typeof f.headers === "string"
                ? {
                  "Content-Type": mime.find((x) => x[0] === f.headers)![1],
                }
                : f.headers ? Object.entries({ ...f.headers }) : { "Content-Type": "text/plain" },
            ),
            status: "status" in f ? f.status : 200,
          }
          : null,
        json: "json" in f ? jsonComposer(f.json.scheme) : null
      }
    ))
      ((typeof f.only !== "undefined" && f.only.length > 0) ? f.only : checker(f?.delete || [])(elements)(f?.add || [])(f.f.toString()));
