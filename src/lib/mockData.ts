import { UserProfile, UserSimpleProfile } from "./type";
import type { Profile } from "@liff/get-profile";

export const exampleSimpleUser: UserSimpleProfile = {
  image:
    "https://ca.slack-edge.com/T060W6FMWBF-U06D7EVJE4B-5ec28bf084d7-512#.png",
  name: "大塚 遥",
};

export const exampleUser: UserProfile = {
  userId: "otsuka",
  pictureUrl:
    "https://ca.slack-edge.com/T060W6FMWBF-U06D7EVJE4B-5ec28bf084d7-512#.png",
  displayName: "大塚 遥",
};

export const exampleLiffProfile: Profile = {
  displayName: "筧テスト",
  userId: "test1",
};
