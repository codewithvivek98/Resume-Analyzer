const express = require("express");
const cors    = require("cors");
const multer  = require("multer");
const path    = require("path");
const fs      = require("fs");
const pdfParse = require("pdf-parse");
const mammoth  = require("mammoth");



const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ── Health Check for server (backend) 
app.get("/", (req, res) => {
  res.send("ResumeIQ Backend is running ✅");
});

// ── Multer ────────────────────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "uploads");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const fileFilter = (req, file, cb) => {
  const ok = ["application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
  ok.includes(file.mimetype) ? cb(null, true) : cb(new Error("Only PDF and DOCX allowed!"), false);
};
const upload = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } });

// ── Industry Definitions ──────────────────────────────────────────────────────
const INDUSTRIES = {
  technology: {
    label: "Technology / Software", emoji: "💻",
    keywords: ["software","developer","engineer","programming","coding","frontend",
               "backend","fullstack","devops","cloud","api","database","algorithm",
               "javascript","python","java","react","node","aws","docker","github","typescript"],
    skills: ["JavaScript","Python","Java","React","Node.js","SQL","Git",
             "Docker","AWS","TypeScript","HTML","CSS","REST API","Agile",
             "CI/CD","MongoDB","Linux","Kubernetes","GraphQL","Testing"],
  },
  healthcare: {
    label: "Healthcare / Medical", emoji: "🏥",
    keywords: ["nurse","doctor","physician","medical","hospital","clinic","patient care",
               "pharmacist","therapist","diagnosis","treatment","clinical","healthcare",
               "icu","ehr","emr","hipaa","surgery","nursing","radiology","pathology"],
    skills: ["Patient Care","Clinical Assessment","EHR/EMR","HIPAA Compliance",
             "Medication Administration","Vital Signs","CPR/BLS","IV Therapy",
             "Wound Care","Triage","Medical Terminology","Care Planning",
             "Infection Control","Patient Education","Phlebotomy"],
  },
  finance: {
    label: "Finance / Accounting", emoji: "💰",
    keywords: ["accountant","finance","banking","investment","audit","tax",
               "financial analyst","budget","cpa","bookkeeping","payroll",
               "balance sheet","ledger","gaap","ifrs","equity","portfolio","actuary"],
    skills: ["Financial Analysis","Excel / Spreadsheets","GAAP","Budgeting",
             "Forecasting","Tax Preparation","Accounts Payable","Accounts Receivable",
             "Auditing","SAP","QuickBooks","Payroll","Risk Management",
             "Financial Reporting","Data Analysis"],
  },
  marketing: {
    label: "Marketing / Advertising", emoji: "📣",
    keywords: ["marketing","brand","campaign","seo","sem","social media","content",
               "digital marketing","advertising","copywriting","analytics",
               "email marketing","lead generation","crm","growth hacking","pr","publicist"],
    skills: ["SEO / SEM","Social Media Marketing","Content Strategy","Google Analytics",
             "Email Marketing","Copywriting","Brand Management","CRM Tools",
             "PPC / Paid Ads","Market Research","A/B Testing","Canva / Design Tools",
             "Lead Generation","HubSpot","Campaign Management"],
  },
  education: {
    label: "Education / Teaching", emoji: "📚",
    keywords: ["teacher","professor","instructor","curriculum","classroom","students",
               "lesson plan","academic","tutor","school","university","pedagogy",
               "assessment","syllabus","learning outcomes","faculty","principal","dean"],
    skills: ["Curriculum Development","Lesson Planning","Classroom Management",
             "Student Assessment","Differentiated Instruction","LMS Tools",
             "Special Education","Parent Communication","Grading","Research",
             "Public Speaking","Google Classroom","E-Learning","IEP Writing",
             "Behavioral Management"],
  },
  design: {
    label: "Design / Creative", emoji: "🎨",
    keywords: ["designer","ui","ux","graphic","visual","figma","adobe","photoshop",
               "illustrator","branding","typography","wireframe","prototype","motion",
               "animation","creative director","art director","video editor","3d"],
    skills: ["Figma","Adobe Photoshop","Adobe Illustrator","UI Design","UX Research",
             "Wireframing","Prototyping","Typography","Color Theory","Branding",
             "InDesign","After Effects","User Testing","Design Systems","Sketch"],
  },
  sales: {
    label: "Sales / Business Development", emoji: "🤝",
    keywords: ["sales","account executive","business development","revenue","b2b","b2c",
               "crm","pipeline","quota","prospecting","negotiation","closing",
               "client relationship","salesforce","territory","retail","account manager"],
    skills: ["Salesforce CRM","Lead Generation","Cold Calling","Negotiation",
             "Account Management","Pipeline Management","Closing Deals","Prospecting",
             "Client Relationship","Presentation Skills","B2B Sales","Revenue Growth",
             "Product Demos","Sales Forecasting","Customer Retention"],
  },
  hr: {
    label: "Human Resources", emoji: "👥",
    keywords: ["hr","human resources","recruiter","talent acquisition","onboarding",
               "payroll","performance review","employee relations","hris","benefits",
               "compensation","training","labor law","workforce","organizational development"],
    skills: ["Talent Acquisition","Onboarding","HRIS Systems","Performance Management",
             "Employee Relations","Labor Law","Payroll Processing","Benefits Administration",
             "Training & Development","Conflict Resolution","Diversity & Inclusion",
             "Compensation Analysis","Policy Writing","Workday / BambooHR","ATS Tools"],
  },
  legal: {
    label: "Legal / Law", emoji: "⚖️",
    keywords: ["lawyer","attorney","paralegal","legal","law","litigation","contract",
               "compliance","counsel","court","statute","jurisdiction","brief",
               "deposition","intellectual property","corporate law","solicitor","barrister"],
    skills: ["Legal Research","Contract Drafting","Litigation Support","Compliance",
             "Legal Writing","Case Management","Document Review","Westlaw / LexisNexis",
             "Regulatory Affairs","Client Counseling","Negotiation",
             "Court Filings","Intellectual Property","Due Diligence","Deposition Support"],
  },
  operations: {
    label: "Operations / Supply Chain", emoji: "⚙️",
    keywords: ["operations","supply chain","logistics","warehouse","inventory","procurement",
               "vendor","manufacturing","lean","six sigma","project management",
               "process improvement","erp","fulfillment","production","facilities"],
    skills: ["Supply Chain Management","Inventory Control","ERP Systems (SAP/Oracle)",
             "Procurement","Lean / Six Sigma","Process Improvement","Vendor Management",
             "Logistics Coordination","Forecasting","KPI Reporting",
             "Project Management","Quality Assurance","Warehousing","Cost Reduction","PMP"],
  },
  general: {
    label: "General / Other", emoji: "📄",
    keywords: [],
    skills: ["Communication","Microsoft Office","Project Management","Teamwork",
             "Problem Solving","Time Management","Customer Service","Data Entry",
             "Reporting","Research","Presentation","Multitasking",
             "Attention to Detail","Adaptability","Leadership"],
  },
};

const SECTION_KEYWORDS = {
  summary:      ["summary","objective","profile","about me","overview","professional statement"],
  experience:   ["experience","work history","employment","professional experience","career history","work experience"],
  education:    ["education","academic","degree","university","college","bachelor","master","phd","certification","qualification"],
  skills:       ["skills","competencies","technologies","tools","expertise","proficiencies","capabilities"],
  achievements: ["achievement","award","honor","recognition","accomplishment","accolade","distinction"],
  projects:     ["project","portfolio","case study","initiative","publication","research","volunteer"],
};

// ── Text Extraction ───────────────────────────────────────────────────────────
async function extractText(filePath, ext) {
  if (ext === ".pdf") {
    const data = await pdfParse(fs.readFileSync(filePath));
    return data.text;
  }
  if (ext === ".docx") {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  }
  throw new Error("Unsupported file type.");
}

// ── Industry Detection ────────────────────────────────────────────────────────
function detectIndustry(text) {
  const lower = text.toLowerCase();
  const scores = {};
  for (const [key, def] of Object.entries(INDUSTRIES)) {
    if (key === "general") continue;
    scores[key] = def.keywords.filter(kw => lower.includes(kw)).length;
  }
  const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  return best && best[1] >= 2 ? best[0] : "general";
}

// ── Skill Detection ───────────────────────────────────────────────────────────
function detectSkills(text, industryKey) {
  const lower = text.toLowerCase();
  const found = [], missing = [];
  for (const skill of INDUSTRIES[industryKey].skills) {
    const pat = new RegExp(
      skill.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+"), "i"
    );
    (pat.test(lower) ? found : missing).push(skill);
  }
  const softSkills = [
    "leadership","communication","teamwork","problem solving","time management",
    "adaptability","critical thinking","collaboration","attention to detail","creativity",
  ].filter(s => lower.includes(s));
  return { found, missing, softSkills };
}

// ── Section Detection ─────────────────────────────────────────────────────────
function detectSections(text) {
  const lower = text.toLowerCase();
  const r = {};
  for (const [k, kws] of Object.entries(SECTION_KEYWORDS)) r[k] = kws.some(kw => lower.includes(kw));
  return r;
}

// ── Score ─────────────────────────────────────────────────────────────────────
function calcScore(text, foundSkills, industryKey, sections) {
  const total = INDUSTRIES[industryKey].skills.length;
  const skillScore = total > 0 ? Math.round((foundSkills.length / total) * 40) : 20;

  const secKeys = Object.keys(SECTION_KEYWORDS);
  const secFound = secKeys.filter(k => sections[k]).length;
  const secScore = Math.round((secFound / secKeys.length) * 40);

  const words = text.trim().split(/\s+/).length;
  let r = 0;
  if (words >= 150) r += 5;
  if (words >= 300) r += 5;
  if (words >= 500) r += 5;
  if (words >= 800) r += 5;

  return Math.min(100, skillScore + secScore + r);
}

// ── Suggestions ───────────────────────────────────────────────────────────────
function makeSuggestions(score, foundSkills, missingSkills, sections, wordCount, industryKey) {
  const tips = [];
  const label = INDUSTRIES[industryKey].label;

  if (!sections.summary)
    tips.push(`Add a professional summary tailored to ${label} roles — it is the first section recruiters read.`);
  if (!sections.experience)
    tips.push("Include a clear work experience section with dates, employer names, and bullet-pointed responsibilities.");
  if (!sections.education)
    tips.push("Add your educational background, degrees, certifications, or relevant training.");
  if (!sections.achievements)
    tips.push("Quantify your achievements — e.g. 'Increased sales by 30%' or 'Managed a team of 10 staff'.");
  if (!sections.projects)
    tips.push("Add a Projects or Portfolio section to demonstrate real-world experience in your field.");

  if (missingSkills.length > 0 && missingSkills.length <= 5)
    tips.push(`Add these in-demand ${label} skills if applicable: ${missingSkills.slice(0, 4).join(", ")}.`);
  else if (missingSkills.length > 5)
    tips.push(`Strengthen your skill set — your resume is missing several expected ${label} competencies.`);

  if (wordCount < 300)
    tips.push("Your resume looks short. Aim for 400-600 words to give hiring managers enough context.");
  if (score < 50)
    tips.push("Use strong action verbs like 'Led', 'Managed', 'Delivered', 'Improved' throughout.");
  if (score >= 70)
    tips.push("Strong resume! Tailor keywords to each specific job posting for maximum impact.");

  tips.push("Keep consistent formatting: same font, date style (Month Year), and bullet style throughout.");
  tips.push("Limit your resume to 1-2 pages and remove outdated or irrelevant experience.");

  return tips.slice(0, 6);
}

// ── Route ─────────────────────────────────────────────────────────────────────
app.post("/analyze-resume", upload.single("resume"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded or invalid file type." });
  const filePath = req.file.path;
  const ext = path.extname(req.file.originalname).toLowerCase();
  try {
    const text = await extractText(filePath, ext);
    if (!text || text.trim().length < 30)
      throw new Error("Could not extract text. Ensure the file is not image-based.");

    const industryKey   = detectIndustry(text);
    const { found: foundSkills, missing: missingSkills, softSkills } = detectSkills(text, industryKey);
    const sections      = detectSections(text);
    const wordCount     = text.trim().split(/\s+/).length;
    const score         = calcScore(text, foundSkills, industryKey, sections);
    const suggestions   = makeSuggestions(score, foundSkills, missingSkills, sections, wordCount, industryKey);

    res.json({
      score, industryKey,
      industryLabel: INDUSTRIES[industryKey].label,
      industryEmoji: INDUSTRIES[industryKey].emoji,
      foundSkills, missingSkills, softSkills, suggestions,
      meta: { filename: req.file.originalname, wordCount, sections, analyzedAt: new Date().toISOString() },
    });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ error: err.message || "Analysis failed." });
  } finally {
    fs.unlink(filePath, () => {});
  }
});

app.get("/health", (req, res) => res.json({ ok: true }));
app.use((err, req, res, next) => {
  if (err) return res.status(400).json({ error: err.message });
  next();
});
app.listen(PORT, () => console.log(`✅  Server running → http://localhost:${PORT}`));
