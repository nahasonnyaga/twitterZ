import { NextResponse } from "next/server";
import { createUser } from "@/utilities/createUser";

export async function GET() {
  const result = await createUser({
    username: "testuser",
    name: "Test User",
  });

  return NextResponse.json(result);
}
