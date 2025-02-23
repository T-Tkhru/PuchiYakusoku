import { z } from "zod";

export const UserSimpleProfileSchema = z.object({
  image: z.string(),
  name: z.string(),
});

export type UserSimpleProfile = z.infer<typeof UserSimpleProfileSchema>;

export const UserProfileSchema = z.object({
  userId: z.string(),
  displayName: z.string(),
  pictureUrl: z.string(),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;
