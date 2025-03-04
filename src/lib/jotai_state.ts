import { Liff } from "@line/liff";
import { atom } from "jotai";
import { atomWithStorage } from 'jotai/utils'

import { Promise, UserProfile, UserSimpleProfile } from "./type";

export const userState = atom<UserProfile | null>(null);
export const userSimpleState = atom<UserSimpleProfile | null>(null);
export const liffState = atom<Liff | null>(null);
export const superBaseIdState = atom<string | null>(null);

export const senderState = atom<UserProfile | null>(null);
export const receiverState = atom<UserProfile | null>(null);
export const promiseState = atom<Promise | null>(null);
export const promisesListState = atomWithStorage<Promise[]>("promisesList",[]);
