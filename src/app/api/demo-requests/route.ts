import { createDemoHandler } from "@/lib/demo-handler";
import { saveDemoRequest } from "@/lib/firebase-admin";

export const runtime = "nodejs";
export const POST = createDemoHandler(saveDemoRequest);
