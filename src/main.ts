import { castVote, getResult, candidates, totalVotes } from './logic';
import type { Tcandidate } from './types';

const voteForm = document.getElementById("vote-form") as HTMLFormElement;
const voterName = document.getElementById("voter-name") as HTMLInputElement;
const candidateSelect = document.getElementById("candidate") as HTMLSelectElement;
const voteCounter = document.getElementById("vote-count") as HTMLDivElement;

const checkResultBtn = document.getElementById('check-result-btn') as HTMLButtonElement;
const closeResultBtn = document.getElementById('close-result-btn') as HTMLButtonElement;
const resultDialog = document.getElementById('result-dialog') as HTMLDialogElement;

const winnerEl = document.getElementById("result-winner") as HTMLSpanElement;
const winnerVotesEl = document.getElementById("result-winner-votes") as HTMLSpanElement;
const totalVotesEl = document.getElementById("result-total-votes") as HTMLSpanElement;

function populateCandidates(selectEl: HTMLSelectElement, candidateList: readonly Tcandidate[]) {
  candidateList.forEach((candidate) => {
    const option = document.createElement('option');
    option.value = candidate;
    option.textContent = candidate.charAt(0).toUpperCase() + candidate.slice(1);
    selectEl.appendChild(option);
  });
}

function refreshVoteCount() {
  voteCounter.textContent = String(totalVotes());
}

function showErrorMsg(reason: "empty-name" | "invalid-candidate" | "already-voted") {
  switch (reason) {
    case "empty-name":
      alert("Please enter your name.");
      break;
    case "invalid-candidate":
      alert("Selected candidate does not exist.");
      break;
    case "already-voted":
      alert("You have already voted!");
      break;
  }
}

populateCandidates(candidateSelect, candidates);
refreshVoteCount();

voteForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const vote = castVote(voterName.value, candidateSelect.value);
  if (vote.success) {
    alert("Your vote has been recorded!");
    voterName.value = '';
    candidateSelect.value = '';
    refreshVoteCount();
  } else {
    showErrorMsg(vote.reason);
  }
});

checkResultBtn.addEventListener("click", () => {
  const result = getResult();
  const winner = result.winner;
  winnerEl.textContent = winner ? winner.charAt(0).toUpperCase() + winner.slice(1) : "No winner yet";
  winnerVotesEl.textContent = winner ? String(result.poll[winner] ?? 0) : "0";
  totalVotesEl.textContent = String(result.totalVotes);

  resultDialog.showModal();
});

closeResultBtn.addEventListener("click", () => resultDialog.close());

resultDialog.addEventListener("click", (event) => {
  if (event.target === resultDialog) {
    resultDialog.close();
  }
});