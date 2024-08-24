import { ReactNode } from "react";

import './ChartDivider.css';

type ChartDividerProps = {
  children: ReactNode;
};

export function ChartDivider({ children }: ChartDividerProps) {
  return (
    <div className="ChartDivider">
      <hr />
      <div>{children}</div>
      <hr />
    </div>
  );
}
