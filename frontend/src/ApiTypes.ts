export type Player = {
  _id: string,
  player_name: string,
  player_team_id: string,
  player_position_id: string,
  player_image_url: string,
  rank_ecr: string,
}

export type UserRoster = {
  RosterName: string,
  RosterId: string,
  players: Player[]
}

