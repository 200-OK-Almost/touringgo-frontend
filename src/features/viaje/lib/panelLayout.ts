export interface PanelLayoutInput {
  viewportWidth: number;
  isMobile: boolean;
  isChatOpen: boolean;
  isRecorridoOpen: boolean;
}

export interface PanelLayout {
  primaryWidth: number;
  secondaryWidth: number;
  panelWidth: number;
}

const PRIMARY_MIN = 360;
const PRIMARY_MAX = 480;
const PRIMARY_RATIO = 0.36;
const PRIMARY_COLLAPSED = 54;
const SECONDARY_MIN = 360;
const SECONDARY_MAX = 420;
const SECONDARY_RATIO = 0.32;
const SECONDARY_OVERLAP = 24;
const VIEWPORT_GUTTER = 16;

function clamp(valor: number, minimo: number, maximo: number): number {
  return Math.min(Math.max(valor, minimo), maximo);
}

export function calcularAnchosPanel({
  viewportWidth,
  isMobile,
  isChatOpen,
  isRecorridoOpen,
}: PanelLayoutInput): PanelLayout {
  if (isMobile) {
    return {
      primaryWidth: 0,
      secondaryWidth: 0,
      panelWidth: 0,
    };
  }

  const primaryWidth = isChatOpen
    ? Math.round(
        clamp(viewportWidth * PRIMARY_RATIO, PRIMARY_MIN, PRIMARY_MAX)
      )
    : PRIMARY_COLLAPSED;

  const secondaryWidth = Math.round(
    clamp(viewportWidth * SECONDARY_RATIO, SECONDARY_MIN, SECONDARY_MAX)
  );

  const recorridoWidth = isRecorridoOpen
    ? Math.max(0, secondaryWidth - SECONDARY_OVERLAP)
    : 0;

  return {
    primaryWidth,
    secondaryWidth,
    panelWidth: Math.min(
      viewportWidth - VIEWPORT_GUTTER,
      primaryWidth + recorridoWidth
    ),
  };
}
