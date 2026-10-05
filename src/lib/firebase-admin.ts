import "server-only";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import type { DemoRequest } from "./demo-schema";

export async function saveDemoRequest(data: DemoRequest): Promise<string> {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!projectId || !clientEmail || !privateKey) throw new Error("Missing server configuration");
  const app = getApps().find((app) => app.name === "barindim") ?? initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  }, "barindim");
  const record = await getFirestore(app).collection("demoRequests").add({
    ...data,
    createdAt: FieldValue.serverTimestamp(),
  });
  return record.id;
}
