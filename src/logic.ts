import type { Tvoter, Tcandidate, Tpoll, Result } from './types';

export const candidates: Readonly<Tcandidate[]> = ["lillian", "victor", "ifeanyi"];
const poll: Tpoll = {};
const votingRecord: Record<Tvoter, Tcandidate> = {};

export const totalVotes = () => Object.keys(votingRecord).length;

type CastVoteResult = 
  | { success: true } 
  | { success: false; reason: "empty-name" | "already-voted" | "invalid-candidate" };

function isCandidate(value: string): value is Tcandidate {
  return candidates.includes(value as Tcandidate);
}

export function castVote(voter: Tvoter, votedFor: string): CastVoteResult {
  const trimmedVoter = voter.trim();
  const candidate = votedFor.toLowerCase().trim();

  if (trimmedVoter === '') return { success: false, reason: "empty-name" };
  if (votingRecord[trimmedVoter]) return { success: false, reason: "already-voted" };
  if (!isCandidate(candidate)) return { success: false, reason: "invalid-candidate" };

  votingRecord[trimmedVoter] = candidate;
  poll[candidate] = (poll[candidate] ?? 0) + 1;
  return { success: true };
}

function getWinner(): Tcandidate | undefined {
  const polled = Object.entries(poll);
  if (polled.length === 0) return undefined;

  let winner: string | undefined;
  let winnerCount = -Infinity;
  let isTied = false;

  for (const [contestant, value] of polled) {
    const newCount = Number(value);
    if (newCount > winnerCount) {
      winner = contestant;
      winnerCount = newCount;
      isTied = false;
    } else if (newCount === winnerCount) {
      isTied = true;
    }
  }

  return isTied ? undefined : (winner as Tcandidate);
}

export const getResult = (): Result => {
  return {
    totalVotes: Object.keys(votingRecord).length,
    winner: getWinner(),
    poll
  };
};