import { LegacyRef } from "react";

export interface Player {
    id: number;
    games_played: number;
    games_won: number;
    inviting_to_play: boolean;
    opponents_met: number;
    profile_image: string;
    total_points: number;
    password_is_null:boolean,
    user: User;
}


export interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    username: string;
  }

export interface Message {
    id: number;
    body: string;
    type: string;
    timestamp: string; 
    read: boolean;
    player: number;
    sent_by: SentBy;
    extra: string;
}

interface SentBy {
    id: number;
    profile_image: string;
    total_points: number;
    user: User;
}

// Layout

export interface rating {
  id: number;
  poolhouse: {
    address: string;
    id: number;
    title: string;
  };
  rate: number;
  rater: {
    profile_image: string;
    total_points: number;
    user: User;
  };
  review: string;
}

export interface PoolHall {
  id: number;
  title: string;
  address: string;
  tables: Table[];
  avg_rating: number;
  pics: Picture[];
  room_image:string
  table_count: number;
  slug: string;
  latitude: number;
  longitude: number;
  open_time:string;
  close_time:string;
}

export interface Table {
  id: number;
  current_session: current_session;
  free:boolean;
  left:number;
  top:number;
}

export interface current_session {
  id: number;
  start_time: string; 
  duration: number; 
  finished_reservation: boolean;
  other_player_details: PlayerDetails;
  player_reserving: PlayerDetails;
}

export interface PlayerDetails {
  id: number;
  profile_image: string; 
  total_points: number;
  user: User;
}

export interface Picture {
  id: number;
  image: string;
}

// Pool

export interface RatingBoxState {
    open: boolean,
    id:number,
    name:string
}

//uploadRatingsBox
  
 export interface GameResult {
    winner_player: SentBy;
    loser_player: SentBy;
    result_winner: number;
    result_loser: number;
    points_given: number;
    penalty_points: number;
    tie: boolean;
    timestamp: string; 
    poolhouse: PoolHall;
  }

// user

export interface chatMessage {
  after_outdated?: boolean;
  body: string;
  id?: number;
  sender: Sender;
  time_sent?: string;
}

interface Sender {
  id?: number;
  profile_image?: string;
  total_points?: number;
  user?: User;
}



// Messenger

export interface LayoutHeaderProps {
  setNotificationsOpen: (notificationsOpen: boolean | ((prev: boolean) => boolean)) => void; 
  setNotifications:(notifications:Message[])=>void,
  headerHeight:number,
  unReadNotifications:number,
  setLogOut:(logOut:boolean)=>void,
  userLogIn:boolean,
  setLoginBox:(loginBox:boolean)=>void;
  setSignUpBox:(loginBox:boolean)=>void
}

//LayoutHeader

export interface EmailCodeCheck{
  emptyEmailCodeErr:boolean,
  emailCode:LegacyRef<HTMLInputElement> |null,
  uiExpire:number,
  setUiExpire:(uiExpire:number)=>void,
  setAxiosError:(axiosError:string)=>void
}

//EmailCodeCheck

export interface SetNewPasswordPage{
  emptyNewPasswordErr:boolean,
  newPassword:LegacyRef<HTMLInputElement>|null,
  emptyRepeatPasswordErr:boolean,
  repeatPassword:LegacyRef<HTMLInputElement>|null
}

///SetNewPasswordPage