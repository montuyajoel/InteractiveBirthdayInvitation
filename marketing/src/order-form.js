// Builds marketing/digital-invitation-order-form.docx:  node order-form.js <out.docx>
const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, ShadingType,
  BorderStyle, AlignmentType, Footer, PageNumber, VerticalAlign, HeightRule,
} = require("docx");

const INK = "5C3A63", BRAND = "9A6AA0", SOFT = "F3EAF5", LINE = "C9B3D0", FONT = "Arial";
const W = 10080; // content width (Letter, 0.75" margins)
const none = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const line = { style: BorderStyle.SINGLE, size: 6, color: LINE };
const NOB = { top: none, bottom: none, left: none, right: none };

const t = (text, o = {}) => new TextRun({ text, font: FONT, size: o.size || 20, bold: o.bold, italics: o.italics, color: o.color });
const p = (runs, o = {}) => new Paragraph({ children: Array.isArray(runs) ? runs : [runs], spacing: { before: o.before ?? 0, after: o.after ?? 0 }, alignment: o.align, keepNext: o.keepNext });

function section(n, title, hint) {
  const head = new Paragraph({
    children: [t(`${n}  `, { size: 24, bold: true, color: BRAND }), t(title.toUpperCase(), { size: 24, bold: true, color: INK })],
    spacing: { before: 280, after: hint ? 40 : 100 }, keepNext: true,
    border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: BRAND, space: 4 } },
  });
  return hint ? [head, p(t(hint, { size: 17, italics: true, color: "77657C" }), { after: 100, keepNext: true })] : [head];
}

const cell = (children, width, o = {}) => new TableCell({
  children: Array.isArray(children) ? children : [children], width: { size: width, type: WidthType.DXA },
  borders: o.borders || NOB, shading: o.fill ? { type: ShadingType.CLEAR, color: "auto", fill: o.fill } : undefined,
  margins: { top: 60, bottom: 60, left: 120, right: 120 }, verticalAlign: o.v || VerticalAlign.BOTTOM, columnSpan: o.span,
});

// label | write-in line rows; pairs = [[label, hint?], ...], `cols` pairs per row
function fields(pairs, cols = 1, height = 440) {
  const per = W / cols, lw = cols === 1 ? 3000 : 1900, fw = per - lw;
  const rows = [];
  for (let i = 0; i < pairs.length; i += cols) {
    const cells = [];
    for (let k = 0; k < cols; k++) {
      const pr = pairs[i + k];
      if (!pr) { cells.push(cell(p(t("")), lw), cell(p(t("")), fw)); continue; }
      const [label, hint] = pr;
      cells.push(cell([p(t(label, { bold: true, size: 18, color: INK })), ...(hint ? [p(t(hint, { size: 15, italics: true, color: "8A7590" }))] : [])], lw));
      cells.push(cell(p(t("")), fw, { borders: { ...NOB, bottom: line } }));
    }
    rows.push(new TableRow({ children: cells, height: { value: height, rule: HeightRule.ATLEAST }, cantSplit: true }));
  }
  return new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: Array(cols).fill([lw, fw]).flat(), rows, borders: { ...NOB, insideHorizontal: none, insideVertical: none } });
}

// rows of ☐ options; opts = strings; cols per row
function checks(label, opts, cols = 3, lw = 3000) {
  const ow = Math.floor((W - lw) / cols), rows = [];
  for (let i = 0; i < opts.length; i += cols) {
    const cells = [cell(i === 0 ? p(t(label, { bold: true, size: 18, color: INK })) : p(t("")), lw, { v: VerticalAlign.TOP })];
    for (let k = 0; k < cols; k++) {
      const o = opts[i + k];
      cells.push(cell(o ? p([t("☐  ", { size: 22, color: BRAND }), t(o, { size: 18 })]) : p(t("")), ow, { v: VerticalAlign.TOP }));
    }
    rows.push(new TableRow({ children: cells, cantSplit: true }));
  }
  const widths = [lw, ...Array(cols).fill(ow)];
  widths[widths.length - 1] += W - widths.reduce((a, b) => a + b, 0);
  return new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: widths, rows, borders: { ...NOB, insideHorizontal: none, insideVertical: none } });
}

function box(height, label) { // big write-in box
  return new Table({
    width: { size: W, type: WidthType.DXA }, columnWidths: [W],
    rows: [new TableRow({ height: { value: height, rule: HeightRule.EXACT }, cantSplit: true,
      children: [cell(label ? p(t(label, { size: 16, italics: true, color: "A08EA6" })) : p(t("")), W, { v: VerticalAlign.TOP, borders: { top: line, bottom: line, left: line, right: line } })] })],
  });
}

const gap = (n = 80) => p(t(""), { after: n });

// package table
function packages() {
  const ws = [600, 2000, 1500, 5980];
  const hdr = ["", "Package", "Price", "Includes"].map((h, i) => cell(p(t(h, { bold: true, size: 18, color: "FFFFFF" })), ws[i], { fill: INK, v: VerticalAlign.CENTER }));
  const rows = [
    ["Basic", "₱1,999", "Envelope reveal, countdown + calendar, map & directions, online RSVP, host guest list, preset theme, 1 revision, online 1 month after the event"],
    ["Classic", "₱3,499", "Everything in Basic + email confirmations, guest photo wall, your colours & fonts, 2 revisions, online 3 months after"],
    ["Signature", "₱5,499", "Everything in Classic + your own .com (1 yr), card designed for you, custom decorations, 3 revisions, online 12 months after"],
  ].map(([n, pr, inc], i) => new TableRow({ cantSplit: true, children: [
    cell(p(t("☐", { size: 26, color: BRAND }), { align: AlignmentType.CENTER }), ws[0], { v: VerticalAlign.CENTER, fill: i === 1 ? SOFT : undefined, borders: { ...NOB, bottom: line } }),
    cell([p(t(n, { bold: true, size: 20, color: INK })), ...(i === 1 ? [p(t("Most popular", { size: 15, italics: true, color: BRAND }))] : [])], ws[1], { v: VerticalAlign.CENTER, fill: i === 1 ? SOFT : undefined, borders: { ...NOB, bottom: line } }),
    cell(p(t(pr, { bold: true, size: 20 })), ws[2], { v: VerticalAlign.CENTER, fill: i === 1 ? SOFT : undefined, borders: { ...NOB, bottom: line } }),
    cell(p(t(inc, { size: 17 })), ws[3], { v: VerticalAlign.CENTER, fill: i === 1 ? SOFT : undefined, borders: { ...NOB, bottom: line } }),
  ] }));
  return new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: ws, rows: [new TableRow({ children: hdr }), ...rows] });
}

const terms = [
  "A 50% down payment confirms your booking and starts the design work. The balance is due before the site goes live.",
  "The down payment is non-refundable once design work has started.",
  "Revision rounds are as listed in your package; extra rounds are ₱400 each.",
  "Please double-check names, dates, times and the address. They go into calendar invites and confirmation emails.",
  "Guest information (names, emails, wishes, photos) is used only for your event and is deleted after the site goes offline, in line with the Data Privacy Act of 2012 (RA 10173).",
  "Never write passwords on this form. We'll ask for your guest-list password privately.",
];

const children = [
  p(t("DIGITAL INVITATION", { size: 20, bold: true, color: BRAND }), { align: AlignmentType.CENTER }),
  p(t("Order Form", { size: 52, bold: true, color: INK }), { align: AlignmentType.CENTER }),
  p(t("Fill this in and send it back with your invitation card design (if you have one). We'll confirm everything before we start.", { size: 18, italics: true, color: "77657C" }), { align: AlignmentType.CENTER, after: 60 }),
  fields([["Order date"], ["Reference no.", "we'll fill this in"]], 2, 380),

  ...section("1", "Your details"),
  fields([["Full name"], ["Mobile / Viber"], ["Email"], ["Facebook / Instagram"]], 2),
  checks("Best way to reach you", ["Call / SMS", "Viber", "Messenger", "Instagram DM", "Email"], 3),

  ...section("2", "Package & add-ons", "Tick one package and any add-ons."),
  packages(),
  gap(100),
  checks("Add-ons", ["Rush, 48 hours (₱800)", "Card design (₱1,200)", ".com domain, 1 yr (₱1,000)", "IG story teaser video (₱800)", "Extra revision (₱400)",
    "Photo wall, Basic (₱700)", "Email confirmations, Basic (₱500)", "+6 months online (₱500)", "All photos as ZIP (₱300)", "QR code for prints (₱150)"], 2, 1800),

  ...section("3", "Event details", "Exactly as they should appear on the invitation."),
  checks("Occasion", ["Birthday", "Debut / 18th", "Sweet 16", "Wedding", "Christening / Baptism", "Anniversary", "Reunion", "Other: ____________"], 3),
  fields([["Celebrant's full name", "or the couple's names"], ["Name used in sentences", "e.g. \"Amelia\" or \"Ana & Marco\""], ["Age / milestone", "e.g. 18th, 7th, 25th"]]),
  fields([["Event date"], ["Day of the week"], ["Start time"], ["End time / duration"], ["Guests arrive by", "optional"], ["Dress code", "optional"]], 2),
  fields([["Venue name"], ["Full address"], ["Google Maps link", "share the pin from Google Maps"]]),
  checks("Is it a surprise?", ["Yes, keep it secret", "No"], 2),
  p(t("If it's a surprise, guests see \"Shhh… it's a surprise!\" on the site and in their email, and are asked not to post until after the reveal.", { size: 16, italics: true, color: "8A7590" }), { before: 40 }),

  ...section("4", "Design"),
  checks("Invitation card", ["I have a design (send JPG/PNG)", "Please design one for me", "Use a simple card with my details"], 2),
  checks("Colour theme", ["Lilac garden", "Sage & gold", "Midnight & champagne", "Blush & rose gold", "Ocean breeze", "Kids' party (bright)", "Match my card", "Custom: ________"], 3),
  checks("Lettering style", ["Romantic script", "Classic wedding", "Formal", "Playful", "Modern minimal"], 3),
  checks("Decorations", ["Flowers", "Butterflies", "Hearts", "Stars & sparkles", "Leaves", "Balloons & confetti", "Shells & waves", "None", "Other: ____________"], 3),
  gap(60),
  p(t("Invitation message", { bold: true, size: 18, color: INK }), { after: 60 }),
  box(1100, "e.g. \"Join us for an evening of love, good food and great company.\""),
  gap(60),
  p(t("Anything else about the look? (inspiration links, colours to avoid…)", { bold: true, size: 18, color: INK }), { after: 60 }),
  box(800),

  ...section("5", "Website & guests"),
  fields([["Preferred web address", "e.g. amelia16.vercel.app or amelia16.com"], ["Estimated number of guests"], ["RSVP deadline"]]),
  checks("Confirmation emails sent from", ["Our service's email", "My own Gmail (we'll guide you)"], 2),
  checks("Photo wall", ["Yes, let guests upload photos", "No photo wall"], 2),
  fields([["Host email(s)", "who manages the guest list"]]),
  p(t("Extra question for guests? (default: first name, last name, email and a birthday wish)", { bold: true, size: 18, color: INK }), { before: 120, after: 60 }),
  box(700),

  ...section("6", "Timeline & payment"),
  fields([["Site needed by", "when you'll start sending the link"], ["Total amount"], ["Down payment (50%)"], ["Balance"]], 2),
  checks("Payment method", ["GCash", "Maya", "Bank transfer", "Cash"], 4),

  ...section("7", "Terms"),
  ...terms.map((x, i) => p([t(`${i + 1}.  `, { bold: true, size: 17, color: BRAND }), t(x, { size: 17 })], { after: 70 })),
  gap(200),
  fields([["Client signature"], ["Date"]], 2, 600),

  p(t(""), { before: 300 }),
  new Table({
    width: { size: W, type: WidthType.DXA }, columnWidths: [W],
    rows: [new TableRow({ cantSplit: true, children: [cell([
      p(t("FOR OFFICE USE", { bold: true, size: 16, color: BRAND }), { after: 80 }),
      p([t("Received: ____________     Down payment: ₱__________  ☐ Paid     Balance: ₱__________  ☐ Paid", { size: 17 })], { after: 80 }),
      p([t("☐ Details confirmed     ☐ Design started     ☐ Sent for review     ☐ Live     ☐ Taken offline (date: ________)", { size: 17 })]),
    ], W, { fill: SOFT, v: VerticalAlign.TOP })] })],
  }),
];

const doc = new Document({
  styles: { default: { document: { run: { font: FONT, size: 20 } } } },
  sections: [{
    properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1000, bottom: 1000, left: 1080, right: 1080 } } },
    footers: { default: new Footer({ children: [p([t("Digital Invitation Order Form  ·  Page ", { size: 15, color: "8A7590" }), new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 15, color: "8A7590" })], { align: AlignmentType.CENTER })] }) },
    children,
  }],
});
Packer.toBuffer(doc).then(b => { fs.writeFileSync(process.argv[2], b); console.log("wrote", process.argv[2]); });
