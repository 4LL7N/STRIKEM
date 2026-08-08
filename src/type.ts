import { RefObject } from "@fullcalendar/core/preact.js";
import { LegacyRef } from "react";

//#region Home
export interface GeoLocation {
  coords: GeoLocationCoords | undefined;
  isGeolocationAvailable: boolean;
  isGeolocationEnabled: boolean;
}

export interface GeoLocationCoords {
  latitude: number;
  longitude: number;
  altitude: number | null;
  accuracy: number;
  altitudeAccuracy: number | null;
  heading: number | null;
  speed: number | null;
}

//#endregion

//#region Layout
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
//#endregion

//#region Pool
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
//#endregion

//#region uploadRatingsBox
export interface RatingBoxState {
    open: boolean,
    id:number,
    name:string
}
//#endregion
  
//#region user
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
//#endregion 

//#region Messenger
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
//#endregion 

//#region LayoutHeader
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
//#endregion

//#region EmailCodeCheck
export interface EmailCodeCheck{
  emptyEmailCodeErr:boolean,
  emailCode:LegacyRef<HTMLInputElement> |null,
  uiExpire:number,
  setUiExpire:(uiExpire:number)=>void,
  setAxiosError:(axiosError:string)=>void
}
//#endregion

//#region SetNewPasswordPage
export interface SetNewPasswordPage{
  emptyNewPasswordErr:boolean,
  newPassword:LegacyRef<HTMLInputElement>|null,
  emptyRepeatPasswordErr:boolean,
  repeatPassword:LegacyRef<HTMLInputElement>|null
}
//#endregion

//#region LoginForgetEmailCodeCheck
export interface LoginForgetEmailCodeCheck{
  LoginEmailCode:LegacyRef<HTMLInputElement>|null,
  emptyLoginEmailCodeErr:boolean,
  uiExpire:number
}
//#endregion

//#region CheckEmail
export interface CheckEmail {
  emptyCheckEmailErr:boolean,
  CheckEmailRef:LegacyRef<HTMLInputElement>|null,
  notEmailCheckEmailErr:string
}
//#endregion

//#region LoginForgetSetNewPassword
export interface LoginForgetSetNewPassword{
  emptyLogNewPasswordErr:boolean,
  logNewPassword:LegacyRef<HTMLInputElement>|null,
  emptyLogRepeatPasswordErr:boolean,
  logRepeatPassword:LegacyRef<HTMLInputElement>|null
}
//#endregion

//#region ChangeUsername
export interface ChangeUsername {
  emptyLogUsernameErr:boolean,
  logUsername:LegacyRef<HTMLInputElement>|null,
  emptyLogPassErr:boolean,
  logPassword:LegacyRef<HTMLInputElement>|null
}
//#endregion

//#region ChangeProfilePicture
export interface ChangeProfilePicture {
  fileRef:RefObject<HTMLInputElement>|null,
  emptyFileError:boolean,
  setSelectedFile:(selectedFile:File|null)=>void,
  selectedFile:File|null
}
//#endregion