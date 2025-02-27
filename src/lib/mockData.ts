import type { Profile } from "@liff/get-profile";

import { UserProfile, UserSimpleProfile } from "./type";

export const exampleSimpleUser: UserSimpleProfile = {
  image:
    "https://ca.slack-edge.com/T060W6FMWBF-U06D7EVJE4B-5ec28bf084d7-512#.png",
  name: "大塚 遥",
  id: "testUser1",
};

export const exampleUser: UserProfile = {
  id: "user1-line-id",
  pictureUrl:
    "https://ca.slack-edge.com/T060W6FMWBF-U06D7EVJE4B-5ec28bf084d7-512#.png",
  displayName: "大塚 遥",
};

export const exampleUser2: UserProfile = {
  id: "user2-line-id",
  pictureUrl: "https://i.gyazo.com/0c8b621d7ffb02804c0fdbfd3f5de6fb.png",
  displayName: "かけひ　ばんり",
};

export const gestUser: UserProfile = {
  id: "",
  displayName: "ともだち",
};

export const exampleLiffProfile: Profile = {
  displayName: "筧テスト",
  userId: "test1",
};

