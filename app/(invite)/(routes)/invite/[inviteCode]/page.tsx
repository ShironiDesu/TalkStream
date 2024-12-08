import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { RedirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
type Params = Promise<{ inviteCode: string }>;

interface InviteCodePageProps {
  params: Params;
}

const InviteCodePage = async ({ params }: InviteCodePageProps) => {
  const resolvedParams = await params;
  const profile = await currentProfile();
  if (!profile) {
    return <RedirectToSignIn />;
  }
  if (!resolvedParams.inviteCode) {
    return redirect("/");
  }
  const existingServer = await db.server.findFirst({
    where: {
      inviteCode: resolvedParams.inviteCode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });
  if (existingServer) {
    return redirect(`/servers/${existingServer.id}`);
  }
  const server = await db.server.update({
    where: {
      inviteCode: resolvedParams.inviteCode,
    },
    data: {
      members: {
        create: [{ profileId: profile.id }],
      },
    },
  });
  if (server) {
    return redirect(`/servers/${server.id}`);
  }
  return null;
};

export default InviteCodePage;
