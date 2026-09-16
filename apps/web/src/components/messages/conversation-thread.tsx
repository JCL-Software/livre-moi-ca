import { ConversationComposer } from "@/components/messages/conversation-composer";
import { UberAvatar, UberCard } from "@/components/baseweb/uber-ui";
import { cn } from "@/lib/utils";
import type { ConversationMessage } from "@livre-moi/shared";

export type ConversationPerson = {
  name: string;
  avatarUrl: string | null;
  verified: boolean;
};

function isTarifNotice(content: string) {
  return /^(Nouveau tarif proposé|Nouveau prix proposé|Contre-proposition|J[’']accepte le tarif|Tarif accepté)/i.test(
    content,
  );
}

function formatChatTime(iso: string) {
  const date = new Date(iso);
  const now = new Date();
  const sameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();
  if (sameDay) {
    return date.toLocaleTimeString("fr-CA", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  return date.toLocaleString("fr-CA", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ConversationThread({
  conversationId,
  messages,
  userId,
  people,
}: {
  conversationId: string;
  messages: ConversationMessage[];
  userId: string;
  people: Record<string, ConversationPerson>;
}) {
  return (
    <UberCard padded={false} className="flex max-h-[min(40rem,calc(100vh-16rem))] min-h-[24rem] flex-1 flex-col overflow-hidden">
      <ul className="flex flex-1 flex-col gap-3 overflow-y-auto bg-[#F6F6F6] p-5">
        {messages.length === 0 ? (
          <li className="m-auto max-w-sm rounded-lg bg-white px-4 py-6 text-center text-sm text-[#545454]">
            Aucun message pour le moment. Écrivez le premier pour démarrer la discussion.
          </li>
        ) : (
          messages.map((message, index) => {
            const mine = message.sender_id === userId;
            const notice = isTarifNotice(message.content);
            const author = mine
              ? "Vous"
              : (people[message.sender_id]?.name ?? "Membre");
            const person = people[message.sender_id];
            const previous = messages[index - 1];
            const next = messages[index + 1];
            const previousNotice = previous ? isTarifNotice(previous.content) : false;
            const nextNotice = next ? isTarifNotice(next.content) : false;
            const firstInGroup =
              !previous ||
              previous.sender_id !== message.sender_id ||
              previousNotice;
            const lastInGroup =
              !next || next.sender_id !== message.sender_id || nextNotice;

            if (notice) {
              return (
                <li key={message.id} className="flex justify-center py-1">
                  <div className="max-w-[90%] rounded-full bg-white px-3.5 py-1.5 text-center text-xs font-medium text-[#545454]">
                    {message.content}
                  </div>
                </li>
              );
            }

            return (
              <li
                key={message.id}
                className={cn(
                  "flex items-end gap-2",
                  mine ? "justify-end" : "justify-start",
                  !firstInGroup && "-mt-1",
                )}
              >
                {!mine ? (
                  lastInGroup ? (
                    <UberAvatar
                      name={author}
                      src={person?.avatarUrl}
                      size="32px"
                      verified={Boolean(person?.verified)}
                    />
                  ) : (
                    <span className="h-8 w-8 shrink-0" aria-hidden />
                  )
                ) : null}
                <div className={cn("max-w-[78%]", mine ? "text-right" : "text-left")}>
                  {firstInGroup ? (
                    <p className="mb-1 px-1 text-[11px] font-medium text-[#545454]">
                      {author}
                    </p>
                  ) : null}
                  <div
                    className={cn(
                      "px-4 py-3 text-sm leading-relaxed shadow-sm",
                      mine
                        ? "rounded-2xl rounded-br-md bg-black text-white"
                        : "rounded-2xl rounded-bl-md bg-white text-black",
                      !firstInGroup && mine && "rounded-tr-md",
                      !firstInGroup && !mine && "rounded-tl-md",
                    )}
                  >
                    {message.content}
                  </div>
                  {lastInGroup ? (
                    <p className="mt-1 mb-0 px-1 text-[11px] text-[#6B6B6B]">
                      {formatChatTime(message.created_at)}
                    </p>
                  ) : null}
                </div>
              </li>
            );
          })
        )}
      </ul>
      <div className="border-t border-[#EEEEEE] bg-white p-4">
        <ConversationComposer conversationId={conversationId} />
      </div>
    </UberCard>
  );
}
