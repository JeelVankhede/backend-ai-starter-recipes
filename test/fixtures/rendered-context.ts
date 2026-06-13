/**
 * In-memory `RenderedContext` fixtures for adapter tests. Replaces the v1.1
 * `minimal-ai/` on-disk fixture; adapters now consume `RenderedContext` directly.
 */
import type { RenderedContext } from '../../src/types.js';

export const MINIMAL_RENDERED: RenderedContext = {
  agent: '# BARE Test Agent\n\nMinimal agent body for adapter tests.\n',
  rules: {
    'architecture-api':
      '---\ndescription: Architecture and API rule\nalwaysApply: true\n---\n\n# Architecture & API\n\nArchitecture body.\n',
    'data-layer-migrations':
      '---\ndescription: Data layer and migrations rule\n---\n\n# Data Layer\n\nData layer body with prisma references.\n',
    testing:
      '---\ndescription: Testing rule\n---\n\n# Testing\n\nTesting body with .spec.ts references.\n',
  },
  lifecycle: {
    think: '# Think\n\nLifecycle fixture think.\n',
    plan: '# Plan\n\nLifecycle fixture plan.\n',
    build: '# Build\n\nLifecycle fixture build.\n',
    review: '# Review\n\nLifecycle fixture review.\n',
    test: '# Test\n\nLifecycle fixture test.\n',
    ship: '# Ship\n\nLifecycle fixture ship.\n',
    reflect: '# Reflect\n\nLifecycle fixture reflect.\n',
  },
};

export const EMPTY_RENDERED: RenderedContext = {
  agent: '# Empty Agent\n',
  rules: {},
  lifecycle: {},
};
