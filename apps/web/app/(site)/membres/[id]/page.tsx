import { notFound } from "next/navigation";
import { MemberProfileView } from "@/components/members/member-profile-view";
import { createClient } from "@/lib/supabase/server";
import {
  getPublicMemberProfile,
  listReceivedReviews,
} from "@livre-moi/shared/data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const result = await getPublicMemberProfile(supabase, id);
  const name = result.ok ? result.data?.full_name : null;
  return {
    title: name ?? "Membre",
  };
}

export default async function MemberProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const [profileResult, reviewsResult] = await Promise.all([
    getPublicMemberProfile(supabase, id),
    listReceivedReviews(supabase, id),
  ]);

  if (!profileResult.ok || !profileResult.data) notFound();

  return (
    <MemberProfileView
      member={profileResult.data}
      reviews={reviewsResult.ok ? reviewsResult.data : []}
    />
  );
}
