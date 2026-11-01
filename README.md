# Ghost Whisperer

A benchmark and research platform for evaluating how people reason with AI under pressure, uncertainty, and evidence constraints.

Ghost Whisperer is designed to test three core capabilities that matter in real-world human-AI work:

- Intuition: reading situations when the information is incomplete
- Precision: reasoning from evidence, not intuition alone
- Imagination: constructing original arguments in contested or ambiguous territory

This repository contains the public-facing benchmark experience, scenario orchestration, server logic, and supporting material for the Pointspective evaluation flow.

Important: the deeper scoring logic, internal benchmark mechanics, private access paths, and certification details are intentionally not exposed in this public repository.

## Table of Contents

- [Overview](#overview)
- [Why this project exists](#why-this-project-exists)
- [How the benchmark works](#how-the-benchmark-works)
- [What is in this repo](#what-is-in-this-repo)
- [Getting started](#getting-started)
- [Repository structure](#repository-structure)
- [Public vs private](#public-vs-private)
- [Roadmap](#roadmap)
- [License](#license)

## Overview

Ghost Whisperer is not a generic chatbot app. It is a structured evaluation environment for testing whether a human can:

- reason under ambiguity
- adapt under constraints
- identify hidden structure and risk
- separate evidence from noise
- communicate with clarity and control

The public experience is intentionally polished and atmospheric, but the platform behind it is built for serious benchmark use. The benchmark is designed to surface signal, not just output quality.

## Why this project exists

Most AI demos are optimized for engagement. This project is optimized for judgment.

The goal is to measure the quality of a person’s reasoning process when interacting with AI systems that may be evasive, incomplete, persuasive, or strategically framed. The benchmark focuses on how someone handles ambiguity, evidence, and contradiction — not just whether they can produce a convincing answer.

In practice, this is useful for:

- evaluating reasoning quality under realistic conditions
- identifying where human judgment breaks down
- measuring differences between fluency and actual understanding
- creating a more rigorous standard for AI-assisted decision-making

## How the benchmark works

The benchmark is structured around three evaluation areas:

1. Intuition
   - assessing whether a user can detect subtle risk, hidden motive, and contextual pressure
2. Precision
   - assessing whether a user can use evidence carefully and build a defensible causal chain
3. Imagination
   - assessing whether a user can think original, coherent, and adaptive thoughts under uncertainty

Each area is scored with its own structured rubric. A participant may complete a benchmark scenario, receive a score, and, if qualified, continue into the broader Ghost Whisperer continuation layer.

## What is in this repo

This repository includes:

- a public landing and benchmark web experience
- scenario-driven benchmark flows
- backend orchestration for chat and judging
- benchmark prompts and evaluation structure
- certificate application and continuation surface
- supporting documentation and scenario materials

The public-facing repository intentionally keeps the most sensitive benchmark internals private and out of view.

## Getting started

### Prerequisites

- Node.js 18+
- npm
- Anthropic API access for model-backed benchmark flows

### Install

```bash
npm install
```

### Run locally

```bash
npm start
```

Then open:

```text
http://localhost:3000
```

## Repository structure

```text
.
├── candidate/                 # scenario and benchmark content
├── docs/                     # public-facing documentation
├── judge/                    # scoring prompts and rubric materials
├── public/                   # web UI and benchmark pages
├── clavdivs.js               # benchmark orchestration logic
├── server.js                 # Express server and API routes
├── package.json              # project metadata and dependencies
├── README.md                 # this file
├── index.html                # entry landing page
└── ...
```

## Public vs private

This repository is intentionally public-facing, but it is not a complete blueprint of the private benchmark system.

Publicly visible in this repo:

- benchmark framing
- public experience and UI
- general process and documentation
- scenario presentation and user-facing materials

Intentionally not exposed:

- private scoring logic
- protected benchmark internals
- internal access, certification, and qualification flows
- sensitive operational details

The project is designed to create curiosity and trust without revealing the system’s full mechanics.

## Roadmap

Planned directions include:

- expanding benchmark scenarios and evaluation depth
- improving benchmark clarity for qualified participants
- refining the public interface and narrative flow
- strengthening the distinction between public education and private benchmark systems

## License

This project is intentionally presented as a benchmark and research project. Please review repository ownership and usage terms before adapting or reusing any materials beyond the public-facing experience.

---

Ghost Whisperer is a platform for serious reasoning evaluation in the age of AI. The benchmark is designed to separate polished output from actual understanding.
