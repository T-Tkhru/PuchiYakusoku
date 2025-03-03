import { z } from "zod";

const DateTimeSchema = z.string().refine((val) => !isNaN(Date.parse(val)), {
  message: "Invalid DateTime format",
});

export const UserSimpleProfileSchema = z.object({
  image: z.string(),
  name: z.string(),
  id: z.string(),
});

export type UserSimpleProfile = z.infer<typeof UserSimpleProfileSchema>;

export const UserProfileSchema = z.object({
  id: z.string(),
  displayName: z.string(),
  pictureUrl: z.string().optional(),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;

const LevelEnum = z.enum(["HIGH", "LOW", "MEDIUM"]);

export const PromiseSchema = z.object({
  id: z.string(),
  direction: z.boolean().nullable(),
  content: z.string().nullable(),
  isAccepted: z.boolean().nullable(),
  completedAt: DateTimeSchema.nullable(),
  cancelAt: DateTimeSchema.nullable(),
  dueDate: DateTimeSchema.nullable(),
  level: LevelEnum,
  sender: UserProfileSchema,
  receiver: UserProfileSchema.nullable(),
});

export type Promise = z.infer<typeof PromiseSchema>;
