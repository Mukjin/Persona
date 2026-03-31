import { ReactNode } from "react";

export function Container({ children }: { children: ReactNode }) {
  return <div className="mx-auto w-full max-w-[1360px] px-5 sm:px-8 lg:px-12 xl:px-16">{children}</div>;
}
