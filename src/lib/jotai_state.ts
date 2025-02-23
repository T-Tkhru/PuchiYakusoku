import { Liff } from "@line/liff";
import { atom } from "jotai";

import { UserProfile, UserSimpleProfile } from "./type";

export const userState = atom<UserProfile | null>(null);
export const userSimpleState = atom<UserSimpleProfile | null>(null);
export const liffState = atom<Liff | null>(null);
