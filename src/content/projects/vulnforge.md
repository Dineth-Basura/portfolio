---
title: VulnForge
category: Cybersecurity
description: A modular Python CLI for scoped web security assessments and structured findings reports.
technologies: [Python 3.11+, asyncio, SQLite, YAML, SARIF 2.1]
date: "2026"
order: 0
featured: true
repository: https://github.com/Dineth-Basura/VulnForge
image: /images/projects/vulnforge-v3.webp
imageAlt: Charcoal and copper concept artwork for vulnforge
imageType: concept
visual: network
---
## Problem

A web security assessment can produce disconnected output across multiple tools. VulnForge brings assessment stages and reporting into one CLI workflow.

## System overview

**Scope configuration → Assessment stages → Findings history → Report exports**

The CLI and wizard share scope profiles and assessment stages. SQLite stores findings history, and checkpoints let an interrupted assessment resume.

## Implemented features

- Manual, selective, and automatic assessment modes
- Scope profiles, checkpoint resume, and findings comparisons
- Markdown, HTML, JSON, and SARIF 2.1 export
- Optional AI-assisted triage
- 45 local tests for parsing, reporting, history, and resume, as listed in the CV

## Design considerations

Scope profiles make assessment boundaries explicit. Structured outputs keep findings reviewable across runs.
