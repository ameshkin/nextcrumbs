// lightweight Next.js Link mock for tests
import * as React from "react";

type LinkProps = React.PropsWithChildren<{
  href: string | { pathname: string };
  className?: string;
  [key: string]: any;
}>;

export default function Link({ href, children, ...rest }: LinkProps) {
  const to = typeof href === "string" ? href : href?.pathname || "/";
  return (
    <a href={to} {...rest}>
      {children}
    </a>
  );
}
