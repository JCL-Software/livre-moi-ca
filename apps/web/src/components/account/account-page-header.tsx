import { UberPageIntro } from "@/components/baseweb/uber-page-intro";

export function AccountPageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return <UberPageIntro title={title} subtitle={description} action={actions} />;
}
