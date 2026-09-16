import type { ReactNode } from "react";

export function UberPageIntro({
  title,
  subtitle,
  kicker,
  action,
}: {
  title: string;
  subtitle?: ReactNode;
  kicker?: string;
  action?: ReactNode;
}) {
  return (
    <div className="uber-page-intro">
      <div className="uber-page-intro-copy">
        {kicker ? <p className="uber-home-kicker">{kicker}</p> : null}
        <h1 className="uber-home-title">{title}</h1>
        {subtitle ? <p className="uber-home-lead">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}
