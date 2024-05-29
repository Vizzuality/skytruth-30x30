/**
 * NOTE: The reason for the separation of tools and static pages, is for Typescript purposes.
 * In certain cases (eg: <LocationSelector />) we need to validate that the target page passed
 * as a prop is actually a tool page (progress tracker, modelling tool) as static pages won't
 * support the parameters that will be passed to them by the location selector. For general
 * purposes PAGES can be used instead, as usual.
 */

export const TOOLS_PAGES = {
  progressTracker: '/progress-tracker',
  conservationBuilder: '/conservation-builder',
} as const;

export const STATIC_PAGES = {
  homepage: '/',
  knowledgeHub: '/knowledge-hub',
  contact: '/contact',
  about: '/about',
} as const;

export const PAGES = {
  ...TOOLS_PAGES,
  ...STATIC_PAGES,
} as const;
