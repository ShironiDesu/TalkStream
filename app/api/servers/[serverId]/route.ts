import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ serverId: string }> }
) {
  try {
    const resolvedParams = await params;
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const server = await db.server.delete({
      where: {
        id: resolvedParams.serverId,
        profileId: profile.id,
      },
    });
    return NextResponse.json(server);
  } catch (error) {
    console.log("SERVER_ID_Delete", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ serverId: string }> }
) {
  try {
    const resolvedParams = await params;
    const profile = await currentProfile();
    const { name, imageUrl } = await req.json();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const server = await db.server.update({
      where: {
        id: resolvedParams.serverId,
        profileId: profile.id,
      },
      data: {
        name,
        imageUrl,
      },
    });
    return NextResponse.json(server);
  } catch (error) {
    console.log("SERVER_ID_PATCH", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
