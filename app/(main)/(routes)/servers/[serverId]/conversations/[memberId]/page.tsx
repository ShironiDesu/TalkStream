import { ChatHeader } from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import ChatMessages from "@/components/chat/chat-messages";
import { Mediaroom } from "@/components/media-room";
import { getOrCreateConversation } from "@/lib/conversation";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { RedirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

type Params = Promise<{ memberId: string; serverId: string }>;
type SearchParams = Promise<{ video?: boolean }>;

interface MemberIdPageProps {
  params: Params;
  searchParams: SearchParams;
}

const MemberIdPage = async ({ params, searchParams }: MemberIdPageProps) => {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const profile = await currentProfile();
  if (!profile) {
    return <RedirectToSignIn />;
  }

  const currentMember = await db.member.findFirst({
    where: {
      serverId: resolvedParams.serverId,
      profileId: profile.id,
    },
    include: {
      profile: true,
    },
  });

  if (!currentMember) {
    return redirect("/");
  }

  const conversation = await getOrCreateConversation(
    currentMember.id,
    resolvedParams.memberId
  );

  if (!conversation) {
    return redirect(`/servers/${resolvedParams.serverId}`);
  }

  const { memberOne, memberTwo } = conversation;
  const otherMember =
    memberOne.profileId === profile.id ? memberTwo : memberOne;

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        imageUrl={otherMember.profile.imageUrl}
        name={otherMember.profile.name}
        serverId={resolvedParams.serverId}
        type="conversation"
      />
      {resolvedSearchParams.video && (
        <Mediaroom chatId={conversation.id} video={true} audio={true} />
      )}
      {!resolvedSearchParams.video && (
        <>
          <ChatMessages
            member={currentMember}
            name={otherMember.profile.name}
            chatId={conversation.id}
            type="conversation"
            apiUrl="/api/direct-messages"
            paramKey="conversationId"
            paramValue={conversation.id}
            socketUrl="/api/socket/direct-messages"
            socketQuery={{ conversationId: conversation.id }}
          />
          <ChatInput
            name={otherMember.profile.name}
            type="conversation"
            apiUrl="/api/socket/direct-messages"
            query={{ conversationId: conversation.id }}
          />
        </>
      )}
    </div>
  );
};

export default MemberIdPage;
