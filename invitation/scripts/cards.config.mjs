// Where the real details sit on each event's printed card, and the made-up
// details that replace them (used by edit_cards.mjs). Coordinates are in the
// original image's pixels; a patch is painted over with the card's background.
const PURPLE = "#5d3f70"
// the white inside the wedding wreath
const WREATH = [247, 247, 247]

export const CARDS = [
  {
    slug: "birthday",
    out: "birthday.jpg",
    branch: "origin/mallows-birthday",
    path: "invitation/src/assets/invitation-card.jpg",
    patches: [
      { x: 262, y: 762, w: 790, h: 192, dir: "h" }, // name
      { x: 476, y: 1274, w: 272, h: 74 }, // date
      { x: 476, y: 1474, w: 512, h: 42 }, // venue
    ],
    texts: [
      { text: "Isabel Sofia", x: 650, y: 915, size: 196, font: "Allura", gradient: ["#7a3f86", "#b77fbb", "#7d4389"], glow: "rgba(255,255,255,.7)" },
      { text: "SATURDAY,", x: 482, y: 1307, size: 31, font: "Cinzel", weight: 500, spacing: 7, align: "left", color: PURPLE },
      { text: "NOVEMBER 21", x: 482, y: 1341, size: 31, font: "Cinzel", weight: 500, spacing: 7, align: "left", color: PURPLE },
      { text: "CASA LUMIERE GARDEN", x: 482, y: 1507, size: 31, font: "Cinzel", weight: 500, spacing: 6, align: "left", color: PURPLE },
    ],
  },
  {
    slug: "graduation",
    out: "graduation.jpg",
    branch: "origin/joel-graduation",
    path: "invitation/src/assets/invitation-card.jpg",
    patches: [
      { x: 200, y: 668, w: 560, h: 330, dir: "h" }, // name + degree
      { x: 112, y: 1092, w: 736, h: 52, dir: "h" }, // date
      { x: 262, y: 1232, w: 436, h: 96, dir: "h" }, // venue + address
    ],
    texts: [
      { text: "Joaquin", x: 486, y: 826, size: 184, font: "Pinyon Script", color: "#f4eee4" },
      { text: "Bachelor of Science in Computer Science", x: 480, y: 932, size: 36, font: "EB Garamond", italic: true, color: "#efe7d8" },
      { text: "Cum Laude", x: 480, y: 984, size: 36, font: "EB Garamond", italic: true, color: "#efe7d8" },
      { text: "SATURDAY · JUNE 5 · 2027", x: 480, y: 1134, size: 42, font: "EB Garamond", weight: 500, spacing: 7, color: "#f2ece2" },
      { text: "THE PALMS HOTEL", x: 480, y: 1266, size: 34, font: "EB Garamond", weight: 500, spacing: 5, color: "#f2ece2" },
      { text: "Rizal Street, Iloilo City", x: 480, y: 1316, size: 30, font: "EB Garamond", italic: true, color: "#e8e0d2" },
    ],
  },
  {
    slug: "christening",
    out: "christening.jpg",
    branch: "origin/aya-christening",
    html: "invitation/card/card.html",
    size: { width: 960, height: 1440 },
    replace: [
      ["Moriah Avrielle", "Sofia Gabrielle"],
      ["“Aya”", "“Gabby”"],
      ["December 20", "December 6"],
      ["Montuya's Residence", "The Reyes Residence"],
    ],
  },
  {
    slug: "wedding",
    out: "wedding-1-nuptials.jpg",
    branch: "origin/claude/brendan-angelina-wedding",
    path: "invitation/src/assets/cards/1-nuptials.jpg",
    patches: [{ x: 66, y: 834, w: 566, h: 82, dir: "h" }],
    texts: [{ text: "Santos and Rivera", x: 346, y: 892, size: 66, font: "Great Vibes", color: "#1d1d1d" }],
  },
  {
    slug: "wedding",
    out: "wedding-2-ceremony.jpg",
    branch: "origin/claude/brendan-angelina-wedding",
    path: "invitation/src/assets/cards/2-ceremony.jpg",
    patches: [
      { x: 318, y: 243, w: 274, h: 149, feather: 5, color: WREATH }, // bride
      { x: 322, y: 446, w: 274, h: 134, feather: 8, color: WREATH }, // groom
      { x: 362, y: 898, w: 182, h: 42, feather: 6, dir: "h" }, // month
      { x: 404, y: 950, w: 98, h: 74, feather: 6 }, // day
      { x: 402, y: 1040, w: 100, h: 38, feather: 6 }, // year
      { x: 296, y: 1120, w: 304, h: 98 }, // church
    ],
    texts: [
      { text: "Elena", x: 452, y: 358, size: 150, font: "Allison", color: "#151515" },
      { text: "Marco", x: 452, y: 556, size: 150, font: "Allison", color: "#151515" },
      { text: "February", x: 451, y: 932, size: 31, font: "Montserrat", color: "#1c1c1c" },
      { text: "13", x: 452, y: 1017, size: 94, font: "Montserrat", weight: 300, color: "#111" },
      { text: "2027", x: 451, y: 1071, size: 31, font: "Montserrat", color: "#1c1c1c" },
      { text: "St. Brigid's", x: 450, y: 1152, size: 36, font: "Alegreya Sans SC", weight: 700, color: "#1c1c1c" },
      { text: "Church Killiney", x: 450, y: 1208, size: 26, font: "Montserrat", color: "#2b2b2b" },
    ],
  },
  {
    slug: "wedding",
    out: "wedding-3-reception.jpg",
    branch: "origin/claude/brendan-angelina-wedding",
    path: "invitation/src/assets/cards/3-reception.jpg",
    patches: [
      { x: 140, y: 569, w: 626, h: 101, dir: "h" }, // couple
      { x: 356, y: 734, w: 190, h: 40, feather: 6, dir: "h" }, // month
      { x: 392, y: 786, w: 118, h: 98, feather: 6 }, // day
      { x: 402, y: 896, w: 98, h: 38, feather: 6 }, // year
      { x: 160, y: 972, w: 580, h: 92 }, // venue
    ],
    texts: [
      { text: "Elena & Marco", x: 452, y: 636, size: 100, font: "Great Vibes", color: "#222" },
      { text: "February", x: 450, y: 765, size: 31, font: "Montserrat", weight: 500, color: "#1c1c1c" },
      { text: "13", x: 450, y: 876, size: 112, font: "Montserrat", weight: 300, color: "#1c1c1c" },
      { text: "2027", x: 450, y: 928, size: 31, font: "Montserrat", weight: 500, color: "#1c1c1c" },
      { text: "THE GLASSHOUSE HOTEL", x: 450, y: 1008, size: 33, font: "Montserrat", weight: 600, spacing: 3, color: "#1f1f1f" },
      { text: "Dalkey Road, Co. Dublin", x: 450, y: 1054, size: 26, font: "Montserrat", color: "#444" },
    ],
  },
]
