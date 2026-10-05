import { demoSchema, type DemoRequest } from "./demo-schema";

const MAX_BYTES = 16_384;
class BodyTooLarge extends Error {}

// Limit actual bytes, including requests without a Content-Length header.
async function readBody(request: Request): Promise<unknown> {
  if (!request.body) return null;
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_BYTES) {
      await reader.cancel();
      throw new BodyTooLarge();
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  return JSON.parse(new TextDecoder().decode(bytes));
}

function reply(status: number, body: object) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

// Storage is injected so failure and pending writes can be tested without credentials.
export function createDemoHandler(save: (data: DemoRequest) => Promise<string>) {
  return async (request: Request): Promise<Response> => {
    const origin = request.headers.get("origin");
    const url = new URL(request.url);
    const expectedOrigin = `${url.protocol}//${request.headers.get("host") ?? url.host}`;
    if (origin && origin !== expectedOrigin) {
      return reply(403, { message: "Bu adresten talep gönderilemiyor." });
    }
    if (request.headers.get("content-type")?.split(";")[0].trim() !== "application/json") {
      return reply(415, { message: "Talep JSON biçiminde gönderilmeli." });
    }
    let body: unknown;
    try { body = await readBody(request); }
    catch (error) {
      return reply(error instanceof BodyTooLarge ? 413 : 400, { message: "Talep okunamadı. Alanları kontrol edin." });
    }
    const parsed = demoSchema.safeParse(body);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form");
        errors[key] ??= issue.message;
      }
      return reply(400, { message: "Lütfen form alanlarını kontrol edin.", errors });
    }
    try {
      const id = await save(parsed.data);
      return reply(201, { ok: true, id });
    } catch {
      // Never log request fields, credentials, or raw SDK errors.
      console.error("demo_request_write_failed");
      return reply(503, { message: "Talebiniz kaydedilemedi. Bilgileriniz korunuyor; lütfen tekrar deneyin." });
    }
  };
}
