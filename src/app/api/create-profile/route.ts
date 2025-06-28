import { NextResponse } from "next/server";
import { createUser } from "@/utilities/createUser";

export async function POST(req: Request) {
  const { username, name } = await req.json();
  const { success, error } = await createUser({ username, name });

  return NextResponse.json({
    success,
    error: error ? { message: error.message, code: error.code } : null,
  });
}
