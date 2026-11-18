import type { ReactNode } from "react";

export type RenderDay = (date: Date, outside?: boolean) => ReactNode;
