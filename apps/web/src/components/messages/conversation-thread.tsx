import { ConversationComposer } from "@/components/messages/conversation-composer";
import {
  AcceptTarifChatButton,
  type TarifChatMode,
} from "@/components/messages/accept-tarif-chat-button";
import { UberAvatar, UberCard } from "@/components/baseweb/uber-ui";
import { cn } from "@/lib/utils";
import type { ConversationMessage } from "@livre-moi/shared";
import Link from "next/link";

export type ConversationPerson = {
  name: string;
  avatarUrl: string | null;
  verified: boolean;
};

export type ConversationTarifAction = {
  listingId: string;
  conversationId: string;
  price: number;
  mode: TarifChatMode;
  hint: string;
};

function isTarifNotice(content: string) {
  return /^(Nouveau tarif proposé|Nouveau prix proposé|Contre-proposition|J[’']accepte le tarif|Tarif accepté)/i.test(
    content,
  );
}

function isAcceptNotice(content: string) {
  return /accepte le tarif/i.test(content);
}

function isProposalNotice(content: string) {
  return /^(Nouveau tarif proposé|Nouveau prix proposé|Contre-proposition)/i.test(
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
  tarifAction = null,
  tarifHref = null,
}: {
  conversationId: string;
  messages: ConversationMessage[];
  userId: string;
  people: Record<string, ConversationPerson>;
  tarifAction?: ConversationTarifAction | null;
  tarifHref?: string | null;
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
              const proposalFromOther =
                !mine &&
                isProposalNotice(message.content) &&
                tarifAction != null &&
                index === messages.length - 1;

              if (proposalFromOther && tarifAction) {
                return (
                  <li key={message.id} className="flex justify-center py-2">
                    <div className="flex max-w-[92%] flex-col items-center gap-2 rounded-2xl bg-white px-4 py-3 text-center shadow-sm ring-1 ring-black/5">
                      <p className="m-0 text-xs font-medium text-[#545454]">
                        {message.content}
                      </p>
                      <p className="m-0 text-[11px] leading-relaxed text-[#6B6B6B]">
                        {tarifAction.hint}
                      </p>
                      <AcceptTarifChatButton
                        listingId={tarifAction.listingId}
                        conversationId={tarifAction.conversationId}
                        price={tarifAction.price}
                        mode={tarifAction.mode}
                      />
                      {tarifHref ? (
                        <Link
                          href={tarifHref}
                          className="text-[11px] font-medium text-[#545454] underline-offset-2 hover:underline"
                        >
                          Proposer un autre tarif
                        </Link>
                      ) : null}
                    </div>
                  </li>
                );
              }

              return (
                <li key={message.id} className="flex justify-center py-1">
                  <div
                    className={cn(
                      "max-w-[90%] rounded-full px-3.5 py-1.5 text-center text-xs font-medium",
                      isAcceptNotice(message.content)
                        ? "bg-[#E8F5E9] text-[#1B5E20]"
                        : "bg-white text-[#545454]",
                    )}
                  >
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

        {tarifAction &&
        !(
          messages.length > 0 &&
          messages[messages.length - 1].sender_id !== userId &&
          isProposalNotice(messages[messages.length - 1].content)
        ) ? (
          <li className="sticky bottom-0 z-[1] flex justify-center bg-gradient-to-t from-[#F6F6F6] via-[#F6F6F6] to-transparent pt-4 pb-1">
            <div className="flex max-w-[92%] flex-col items-center gap-2 rounded-2xl bg-white px-4 py-3 text-center shadow-md ring-1 ring-black/5">
              <p className="m-0 text-xs leading-relaxed text-[#545454]">
                {tarifAction.hint}
              </p>
              <AcceptTarifChatButton
                listingId={tarifAction.listingId}
                conversationId={tarifAction.conversationId}
                price={tarifAction.price}
                mode={tarifAction.mode}
              />
              {tarifHref ? (
                <Link
                  href={tarifHref}
                  className="text-[11px] font-medium text-[#545454] underline-offset-2 hover:underline"
                >
                  Proposer un autre tarif
                </Link>
              ) : null}
            </div>
          </li>
        ) : null}
      </ul>
      <div className="border-t border-[#EEEEEE] bg-white p-4">
        <ConversationComposer conversationId={conversationId} />
      </div>
    </UberCard>
  );
}
