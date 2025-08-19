import { ReactNode, CSSProperties } from "react";
import * as g from "../styles/grid.css";

type GridCols = {
  base: number;
  sm?: number;
  md?: number;
  lg?: number;
};

type Props = {
  cols: GridCols;
  gap?: string | number; // ex: "16px" sau 16
  className?: string;
  children: ReactNode;
};

type CSSVars = CSSProperties & {
  ["--cols"]?: number | string;
  ["--cols-sm"]?: number | string;
  ["--cols-md"]?: number | string;
  ["--cols-lg"]?: number | string;
  ["--gap"]?: number | string;
};

export default function Grid({ cols, gap, className, children }: Props) {
  const styleVars: CSSVars = {
    "--cols": cols.base,
    ...(cols.sm ? { "--cols-sm": cols.sm } : null),
    ...(cols.md ? { "--cols-md": cols.md } : null),
    ...(cols.lg ? { "--cols-lg": cols.lg } : null),
    ...(gap ? { "--gap": gap } : null),
  };

  return (
    <div className={`${g.grid} ${className ?? ""}`} style={styleVars}>
      {children}
    </div>
  );
}
