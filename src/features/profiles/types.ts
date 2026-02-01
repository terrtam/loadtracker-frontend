/** Domain model representing a user-defined body part profile. */

export type BodyPartProfile = {
  id: number;
  bodyPartName: string;
  side: "left" | "right";
  archived: boolean;
};
