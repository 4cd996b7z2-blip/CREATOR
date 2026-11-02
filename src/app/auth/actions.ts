"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { endCreatorSession, startCreatorSession } from "@/lib/session";
import { getStore } from "@/lib/store";
import type { FormState } from "@/lib/types";
import { genVerifyCode, normalizeHandle, str } from "@/lib/utils";

// A real bcrypt hash, so unknown usernames cost the same time as known ones.
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", 10);

export async function registerCreator(_prev: FormState, fd: FormData): Promise<FormState> {
  const values = { handle: str(fd, "handle"), display_name: str(fd, "display_name") };

  if (str(fd, "website")) redirect("/"); // honeypot

  const fieldErrors: Record<string, string> = {};
  const handle = normalizeHandle(values.handle);
  if (!handle) fieldErrors.handle = "err_handle";
  if (values.display_name.length < 2 || values.display_name.length > 60) fieldErrors.display_name = "err_required";
  const password = String(fd.get("password") ?? "");
  if (password.length < 8 || Buffer.byteLength(password) > 72) fieldErrors.password = "err_password";
  if (fd.get("consent") !== "on") fieldErrors.consent = "err_consent";
  if (Object.keys(fieldErrors).length || !handle) return { fieldErrors, values };

  const result = await getStore().createCreator({
    handle,
    instagram_url: `https://instagram.com/${handle}`,
    display_name: values.display_name,
    password_hash: await bcrypt.hash(password, 10),
    verify_code: genVerifyCode(),
  });
  if (!result.ok) return { fieldErrors: { handle: "err_handle_taken" }, values };

  await startCreatorSession(result.id);
  redirect("/dashboard");
}

export async function loginCreator(_prev: FormState, fd: FormData): Promise<FormState> {
  const values = { handle: str(fd, "handle") };
  const handle = normalizeHandle(values.handle);
  const password = String(fd.get("password") ?? "");
  if (!handle || !password) return { error: "err_login", values };

  const store = getStore();
  const auth = await store.getAuthByHandle(handle);
  if (!auth) {
    await bcrypt.compare(password, DUMMY_HASH);
    return { error: "err_login", values };
  }
  if (auth.locked_until && new Date(auth.locked_until).getTime() > Date.now()) {
    return { error: "err_locked", values };
  }
  const ok = await bcrypt.compare(password, auth.password_hash);
  if (!ok) {
    await store.registerLoginFailure(auth.id);
    return { error: "err_login", values };
  }
  await store.clearLoginFailures(auth.id);
  await startCreatorSession(auth.id);
  redirect("/dashboard");
}

export async function logoutCreator() {
  await endCreatorSession();
  redirect("/");
}
