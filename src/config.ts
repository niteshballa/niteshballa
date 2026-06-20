export const SITE = {
  website: "https://nitesh.is-a.dev/",
  author: "Nitesh Balla",
  profile: "https://github.com/niteshballa",
  desc: "Nitesh Balla, Forward Deployed Engineer at Manif. Field notes on payments, infrastructure, and running software in production.",
  title: "Nitesh Balla",
  ogImage: "",
  lightAndDarkMode: false,
  postPerIndex: 4,
  postPerPage: 4,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true,
  editPost: {
    enabled: false,
    text: "Edit page",
    url: "https://github.com/niteshballa/nitesh-blog/edit/main/",
  },
  dynamicOgImage: true,
  dir: "ltr",
  lang: "en",
  timezone: "Asia/Kolkata",
} as const;
