"use server";

import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const Schema = z.object({
  attending: z.boolean(),
  party_size: z.number().int().min(1).max(20)
});

export async function saveRsvp(input: { attending: boolean; party_size: number }) {
  const parsed = Schema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Invalid data." };

  const supabase = createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { ok: false, message: "Not logged in." };

  const payload = {
    user_id: userData.user.id,
    attending: parsed.data.attending,
    party_size: parsed.data.attending ? parsed.data.party_size : 0
  };

  const { error } = await supabase.from("rsvps").upsert(payload);
  if (error) return { ok: false, message: error.message };
  return { ok: true };
}
