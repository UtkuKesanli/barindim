import { test } from "node:test";
import assert from "node:assert/strict";
import { createDemoHandler } from "../src/lib/demo-handler";

const valid = { name: " Deniz Örnek ", email: "deniz@example.com", service: "capacity", description: "Kurgusal barınak için kapasite takibi." };
function request(body: unknown, headers: Record<string, string> = {}) {
  return new Request("http://localhost:3000/api/demo-requests", { method: "POST", headers: { "Content-Type": "application/json", ...headers }, body: JSON.stringify(body) });
}

test("valid data is normalized; success waits for storage completion", async () => {
  let resolve!: (value: string) => void;
  let saved: unknown;
  const handler = createDemoHandler(async data => { saved = data; return new Promise<string>(r => { resolve = r; }); });
  let completed = false;
  const result = handler(request(valid)).then(r => { completed = true; return r; });
  await new Promise(r => setImmediate(r));
  assert.equal(completed, false);
  assert.deepEqual(saved, { ...valid, name: "Deniz Örnek" });
  resolve("fictional-record");
  const response = await result;
  assert.equal(response.status, 201);
  assert.deepEqual(await response.json(), { ok: true, id: "fictional-record" });
});

test("bypassing browser validation cannot write invalid fields", async () => {
  let writes = 0;
  const handler = createDemoHandler(async () => { writes++; return "id"; });
  const cases = [null, {}, { ...valid, name: "   " }, { ...valid, email: "wrong" }, { ...valid, service: "adoption" }, { ...valid, description: "  " }, { ...valid, name: 12 }, { ...valid, description: "x".repeat(2001) }, { ...valid, email: "a".repeat(255) }, { ...valid, service: null }, { ...valid, admin: true }];
  for (const body of cases) assert.equal((await handler(request(body))).status, 400);
  assert.equal(writes, 0);
});

test("database failure returns 503 without false success or internal details", async () => {
  const handler = createDemoHandler(async () => { throw new Error("PRIVATE_KEY_TEST_MARKER"); });
  const response = await handler(request(valid));
  assert.equal(response.status, 503);
  const text = await response.text();
  assert.equal(text.includes("PRIVATE_KEY_TEST_MARKER"), false);
  assert.equal(text.includes('"ok":true'), false);
});

test("malformed JSON and unsupported media type are rejected", async () => {
  const handler = createDemoHandler(async () => { throw new Error("must not write"); });
  assert.equal((await handler(new Request("http://localhost:3000/api/demo-requests", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{" }))).status, 400);
  assert.equal((await handler(request(valid, { "Content-Type": "text/plain" }))).status, 415);
});

test("cross-origin requests are rejected", async () => {
  const handler = createDemoHandler(async () => { throw new Error("must not write"); });
  assert.equal((await handler(request(valid, { origin: "https://other.example" }))).status, 403);
});

test("oversized body is rejected even without Content-Length", async () => {
  const handler = createDemoHandler(async () => { throw new Error("must not write"); });
  assert.equal((await handler(request({ ...valid, description: "x".repeat(17000) }))).status, 413);
});


test("same-origin browser requests work when internal URL differs from Host", async () => {
  const handler = createDemoHandler(async () => "fictional-id");
  const response = await handler(request(valid, { host: "127.0.0.1:3000", origin: "http://127.0.0.1:3000" }));
  assert.equal(response.status, 201);
});
