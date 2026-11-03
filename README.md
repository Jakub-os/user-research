# User Research — Expresta

Claude Code agent definitions for UX research on the Expresta websites
(expresta.eu / .sk / .cz / .de / .at / .hu).

## Agents

- `.claude/agents/user-research-specialist.md` — Senior UX Researcher & Usability Testing
  Specialist. Runs evidence-based exploratory usability testing (configurators, upload,
  cart/checkout, mobile, localization) and documents findings in the Expresta UX research
  FigJam board. Never places real orders.

## Skills

- `.claude/skills/usability-testing/` — usability-testing guidance (study design, fidelity choice, recruiting, common mistakes) with `references/guest-insights.md`. Preloaded into the agent; also usable directly in any session as `/usability-testing`.

## Usage

Start a Claude Code session with this repository (`Jakub-os/user-research`) selected, then ask:

> Use the user-research-specialist agent to run the Expresta usability research.

Evidence (screenshots, notes) can be committed under `ux-evidence/`.
