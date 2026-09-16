import { UberEmpty } from "@/components/baseweb/uber-ui";

export function AccountEmpty({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return <UberEmpty title={title} description={description} action={action} />;
}
