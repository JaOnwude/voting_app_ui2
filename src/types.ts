export type Tvoter = string;
export type Tcandidate = "lillian" | "victor" | "ifeanyi";
export type Tpoll = Partial<Record<Tcandidate, number>>;

export interface Result {
  totalVotes: number;
  winner: Tcandidate | undefined;
  poll: Tpoll;
}