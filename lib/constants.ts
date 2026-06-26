export const AUTHOR = {
  fullName: "George Yiakoumi",
  firstName: "George",
} as const;

export const SOCIAL_LINKS = {
  github: {
    url: "https://github.com/georgeyiakoumi",
    label: "GitHub",
    ariaLabel: `Visit ${AUTHOR.firstName}'s GitHub profile`,
  },
  linkedin: {
    url: "https://linkedin.com/in/georgeyiakoumi",
    label: "LinkedIn",
    ariaLabel: `Connect with ${AUTHOR.firstName} on LinkedIn`,
  },
} as const;

export const NAV_LINKS = {
  about: {
    href: "/",
    label: "About",
    ariaLabel: `About ${AUTHOR.firstName}`,
  },
  projects: {
    href: "/projects",
    label: "Projects",
    ariaLabel: `View ${AUTHOR.firstName}'s projects`,
  },
} as const;