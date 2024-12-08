import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ serverId: string }> }
) {
  try {
    const resolvedParams = await params;
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!resolvedParams.serverId) {
      return new NextResponse("Server ID Missing", { status: 400 });
    }
    const server = await db.server.update({
      where: {
        id: resolvedParams.serverId,
        profileId: profile.id,
      },
      data: {
        inviteCode: uuidv4(),
      },
    });
    return NextResponse.json(server);
  } catch (error) {
    console.log("Server_ID", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
