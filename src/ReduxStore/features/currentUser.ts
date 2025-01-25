import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Player } from "../../type";

const currentUser = createSlice({
  name: "currentUser",
  initialState: {
    id: 0,
    games_played: 0,
    games_won: 0,
    inviting_to_play: false,
    opponents_met: 0,
    profile_image: "",
    total_points: 0,
    user: {
      id: 0,
      email: "",
      first_name: "",
      last_name: "",
      username: "",
    },
  },
  reducers: {
    setCurrentUser: (state, action: PayloadAction<Player>) => {
      return (state = action.payload);
    },
    removeCurrentUser: () => {
      return {
        id: 0,
        games_played: 0,
        games_won: 0,
        inviting_to_play: false,
        opponents_met: 0,
        profile_image: "",
        total_points: 0,
        user: {
          id: 0,
          email: "",
          first_name: "",
          last_name: "",
          username: "",
        },
      };
    },
  },
});
export const  {setCurrentUser, removeCurrentUser} = currentUser.actions

export default currentUser.reducer