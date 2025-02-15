export interface PrintVolume {
  date: string;
  count: number;
  totalCost: string;
}

export interface ProjectStats {
  projectId: number;
  projectName: string;
  totalPrints: number;
  totalCost: string;
  averageCostPerPrint: string;
}
