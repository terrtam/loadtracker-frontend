/** Time-series point containing volume and intensity values. */

export type VolumeIntensityPoint = {
  date: string;
  volume: number;
  intensity: number | null;
};
