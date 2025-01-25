export interface Player {
    id: number;
    games_played: number;
    games_won: number;
    inviting_to_play: boolean;
    opponents_met: number;
    profile_image: string;
    total_points: number;
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