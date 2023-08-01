import signer from "../../components/tokens/signer.ts";
import aComposer from "../../optimizer/aComposer.ts";
import { assertEquals } from "https://deno.land/std@0.160.0/testing/asserts.ts";

Deno.test(
  "Query",
  (_) =>
    assertEquals(
      (aComposer({ hasName: "http://localhost:8080/" })({
        param: { elements: ["id"] },
        path: "/test",
        f: (r) => r.query.hello || "nothing",
      })(["query"]))(new Request("http://localhost:8080/test?hello=hi")).query
        .hello,
      "hi",
    ),
);
Deno.test(
  "Query",
  (_) =>
    assertEquals(
      (aComposer()({
        path: "/test",
        param: { elements: ["id"] },
        f: (r) => r.query.hello || "nothing",
      })(["query"]))(new Request("http://localhost:8080/test?hello=hi")).query
        .hello,
      "hi",
    ),
);
Deno.test(
  "Query",
  (_) =>
    assertEquals(
      (aComposer({ hasName: "http://localhost:8080/" })({
        param: { elements: ["id"] },
        path: "/test",
        f: (r) => r.query.hello || "nothing",
      })(["query", "req"]))(new Request("http://localhost:8080/test?hello=hi"))
        .query.hello,
      "hi",
    ),
);
Deno.test(
  "Params",
  (_) =>
    assertEquals(
      (aComposer({ hasName: "http://localhost:8080/" })({
        path: "/test/:id",
        param: { elements: ["id"] },
        f: (r) => r.param.id,
      })(["param"]))(new Request("http://localhost:8080/test/1")).param.id,
      "1",
    ),
);

Deno.test(
  "Params",
  (_) =>
    assertEquals(
      (aComposer({ hasName: "http://localhost:8080/" })({
        path: "/test/:a/:b/:c/",
        param: { elements: ["a", "b", "c"] },
        f: (r) => r.param.id,
      })(["param"]))(new Request("http://localhost:8080/test/1/2/3/")).param.b,
      "2",
    ),
);
Deno.test(
  "Params",
  (_) =>
    assertEquals(
      (aComposer()({
        path: "/test/:a/:b/:c/",
        f: (r) => r.param.id.toString(),
      })(["param"]))(new Request("http://localhost:8080/test/1/2/3/")).param.b,
      "2",
    ),
);
Deno.test(
  "Sign",
  (_) =>
    assertEquals(
      (aComposer()({
        path: "/test/",
        signer: { seed: "test" },
        f: (r) => r.sign("hello"),
      })(["sign"]))(new Request("http://localhost:8080/test/")).sign("hello"),
      signer({ seed: "test" })("hello"),
    ),
);
Deno.test(
  "Date",
  (_) =>
    assertEquals(
      typeof (aComposer()({
        path: "/test/",
        signer: { seed: "test" },
        f: (r) => r.date.toString(),
      })(["date"]))(new Request("http://localhost:8080/test/")).date,
      "number",
    ),
);
Deno.test(
  "randomNumber",
  (_) =>
    assertEquals(
      typeof (aComposer()({
        path: "/test/",
        signer: { seed: "test" },
        f: (r) => r.randomNumber.toString(),
      })(["randomNumber"]))(new Request("http://localhost:8080/test/")).randomNumber,
      "number",
    ),
);
Deno.test(
  "Hash",
  (_) =>
    assertEquals(
      typeof (aComposer()({
        path: "/test/",
        signer: { seed: "test" },
        f: (r) => r.hash,
      })(["hash"]))(new Request("http://localhost:8080/test/")).hash,
      "string",
    ),
);
Deno.test(
  "cookie",
  (_) =>
    assertEquals(
      (aComposer()({
        path: "/test/",
        signer: { seed: "test" },
        f: (r) => r.cookie?.id ?? "not_found",
      })(["cookie"]))(new Request("http://localhost:8080/test/", {
        headers: {
          'Content-Type': 'application/json',
          'Cookie': 'id=user'
        }
      })).cookie,
      { id: "user" },
    ),
);
