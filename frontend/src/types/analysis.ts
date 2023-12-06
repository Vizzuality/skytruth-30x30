export type AnalysisLocationArea = {
  code: string;
  protected_area: number;
};

export type AnalysisData = {
  locations_area: AnalysisLocationArea[];
  total_area: number;
};
