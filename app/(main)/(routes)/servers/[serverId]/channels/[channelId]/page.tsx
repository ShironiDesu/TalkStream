import { ChatHeader } from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import ChatMessages from "@/components/chat/chat-messages";
import { Mediaroom } from "@/components/media-room";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { RedirectToSignIn } from "@clerk/nextjs";
import { ChannelType } from "@prisma/client";
import { redirect } from "next/navigation";
type Params = Promise<{ serverId: string; channelId: string }>;
interface ChannelIdPageProps {
  params: Params;
}
const ChannelIdPage = async ({ params }: ChannelIdPageProps) => {
  const profile = await currentProfile();
  const resolvedParams = await params;
  if (!profile) {
    return <RedirectToSignIn />;
  }
  const channel = await db.channel.findUnique({
    where: {
      id: resolvedParams.channelId,
    },
  });
  const member = await db.member.findFirst({
    where: {
      serverId: resolvedParams.serverId,
      profileId: profile.id,
    },
  });
  if (!channel || !member) {
    redirect("/");
  }
  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        name={channel.name}
        serverId={channel.serverId}
        type="channel"
      />
      {channel.type === ChannelType.TEXT && (
        <>
          <ChatMessages
            member={member}
            name={channel.name}
            chatId={channel.id}
            type="channel"
            apiUrl="/api/messages"
            socketUrl="/api/socket/messages"
            socketQuery={{
              channelId: channel.id,
              serverId: channel.serverId,
            }}
            paramKey="channelId"
            paramValue={channel.id}
          />
          <ChatInput
            name={channel.name}
            type="channel"
            apiUrl="/api/socket/messages"
            query={{ channelId: channel.id, serverId: channel.serverId }}
          />
        </>
      )}
      {channel.type === ChannelType.AUDIO && (
        <Mediaroom
          chatId={channel.id}
          serverId={channel.serverId}
          video={false}
          audio={true}
        />
      )}
      {channel.type === ChannelType.VIDEO && (
        <Mediaroom
          chatId={channel.id}
          serverId={channel.serverId}
          video={true}
          audio={true}
        />
      )}
    </div>
  );
};

export default ChannelIdPage;
