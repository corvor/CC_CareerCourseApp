/* Course catalog: Texas-style high school course names.
   Each course:
     id   unique key
     g    index into GROUPS (which list it appears under)
     n    display name
     t    "AP" or "DC" (dual credit), optional
     re   pattern used to recognize the course in pasted text. Text is lowercased,
          punctuation removed, and Roman numerals turned into digits first
          ("Algebra II" -> "algebra 2").
     kn   O*NET knowledge areas this course builds: 1 = intro, 2 = core, 3 = advanced
     cr   typical college credit (AP courses need a score of 3+). tags link to
          occupation path items; core = Texas Core Curriculum component.
   See docs/UPDATING-DATA.md before editing. */
/* ---------- O*NET knowledge areas ---------- */
const K = {
  EN:"English Language", MA:"Mathematics", PH:"Physics", CH:"Chemistry", BI:"Biology",
  MD:"Medicine and Dentistry", PS:"Psychology", TC:"Therapy and Counseling",
  CPS:"Customer and Personal Service", AM:"Administration and Management", AD:"Administrative",
  EA:"Economics and Accounting", LG:"Law and Government", PSS:"Public Safety and Security",
  CE:"Computers and Electronics", ET:"Engineering and Technology", DE:"Design", ME:"Mechanical",
  BC:"Building and Construction", PP:"Production and Processing", TR:"Transportation",
  TE:"Telecommunications", ED:"Education and Training", FA:"Fine Arts",
  CM:"Communications and Media", GE:"Geography"
};

/* ---------- High school courses (Texas-style names) ----------
   kn: knowledge weights (1 intro, 2 core, 3 advanced). cr: typical college credit (AP needs 3+). */
const GROUPS = ["English & Communication","Math","Science","Social Studies","Technology","Trades & Engineering (CTE)","Health Science (CTE)","Business, Law & Education (CTE)","Arts, Languages & Other","Work & Activities"];
const C = [
 // English
 {id:"dc_engl",g:0,n:"Dual Credit English (ENGL 1301/1302)",t:"DC",re:/(dual|\bdc\b|college).*(english|engl|comp)|engl ?130[12]|composition/,kn:{EN:3},cr:{tags:["comp"],hrs:6,col:"ENGL 1301 & 1302",core:"Communication"}},
 {id:"ap_lang",g:0,n:"AP English Language",t:"AP",re:/\bap\b.*lang/,kn:{EN:3},cr:{tags:["comp"],hrs:3,col:"ENGL 1301",core:"Communication"}},
 {id:"ap_lit",g:0,n:"AP English Literature",t:"AP",re:/\bap\b.*lit/,kn:{EN:3},cr:{tags:["comp"],hrs:3,col:"ENGL 1302 (varies)",core:"Communication"}},
 {id:"eng1",g:0,n:"English I",re:/\b(english|eng|ela)\s*1\b/,kn:{EN:1}},
 {id:"eng2",g:0,n:"English II",re:/\b(english|eng|ela)\s*2\b/,kn:{EN:1}},
 {id:"eng3",g:0,n:"English III",re:/\b(english|eng|ela)\s*3\b/,kn:{EN:2}},
 {id:"eng4",g:0,n:"English IV",re:/\b(english|eng|ela)\s*4\b/,kn:{EN:2}},
 {id:"speech",g:0,n:"Professional Communications / Speech",re:/professional comm|communication app|speech|public speaking|debate/,kn:{EN:1,CPS:1,CM:1}},
 // Math
 {id:"dc_math",g:1,n:"Dual Credit College Algebra",t:"DC",re:/(dual|\bdc\b).*(alg|math)|math ?1314|college algebra/,kn:{MA:3},cr:{tags:["math"],hrs:3,col:"MATH 1314 College Algebra",core:"Mathematics"}},
 {id:"ap_calc",g:1,n:"AP Calculus",t:"AP",re:/\bap\b.*calc/,kn:{MA:3,PH:1},cr:{tags:["calc","math"],hrs:4,col:"MATH 2413 Calculus I",core:"Mathematics"}},
 {id:"ap_stat",g:1,n:"AP Statistics",t:"AP",re:/\bap\b.*stat/,kn:{MA:3},cr:{tags:["stats","math"],hrs:3,col:"MATH 1342 Statistics",core:"Mathematics"}},
 {id:"alg1",g:1,n:"Algebra I",re:/\balg(ebra)?\s*1\b/,kn:{MA:1}},
 {id:"geom",g:1,n:"Geometry",re:/geometry|\bgeom\b/,kn:{MA:1,DE:1}},
 {id:"alg2",g:1,n:"Algebra II",re:/\balg(ebra)?\s*2\b/,kn:{MA:2}},
 {id:"precalc",g:1,n:"Precalculus",re:/pre ?calc/,kn:{MA:3}},
 {id:"stats",g:1,n:"Statistics",re:/statistics|\bstats?\b/,kn:{MA:2}},
 {id:"aqr",g:1,n:"Algebraic Reasoning / AQR",re:/quantitative reasoning|\baqr\b|algebraic reasoning/,kn:{MA:1}},
 {id:"finmath",g:1,n:"Financial Mathematics",re:/financial math/,kn:{MA:1,EA:2}},
 // Science
 {id:"ap_bio",g:2,n:"AP Biology",t:"AP",re:/\bap\b.*bio/,kn:{BI:3,MD:1},cr:{tags:["bio"],hrs:4,col:"BIOL 1406 Biology I",core:"Life & Physical Sciences"}},
 {id:"ap_chem",g:2,n:"AP Chemistry",t:"AP",re:/\bap\b.*chem/,kn:{CH:3},cr:{tags:["chem"],hrs:4,col:"CHEM 1411 General Chemistry I",core:"Life & Physical Sciences"}},
 {id:"ap_phys",g:2,n:"AP Physics",t:"AP",re:/\bap\b.*phys/,kn:{PH:3,ET:1,MA:1},cr:{tags:["phys"],hrs:4,col:"PHYS 1401 College Physics I",core:"Life & Physical Sciences"}},
 {id:"ap_env",g:2,n:"AP Environmental Science",t:"AP",re:/\bap\b.*environ/,kn:{BI:2,CH:1,GE:1},cr:{tags:["envsci"],hrs:4,col:"ENVR 1401",core:"Life & Physical Sciences"}},
 {id:"anat",g:2,n:"Anatomy & Physiology",re:/anatomy|physiology|\ba ?& ?p\b/,kn:{BI:2,MD:2}},
 {id:"bio",g:2,n:"Biology",re:/\bbio(logy)?\b/,kn:{BI:2}},
 {id:"chem",g:2,n:"Chemistry",re:/chem/,kn:{CH:2}},
 {id:"ipc",g:2,n:"IPC (Integrated Physics & Chemistry)",re:/\bipc\b|integrated physics/,kn:{PH:1,CH:1}},
 {id:"phys",g:2,n:"Physics",re:/physics/,kn:{PH:2,ME:1}},
 {id:"env",g:2,n:"Environmental Systems",re:/environmental/,kn:{BI:1,GE:1}},
 // Social studies
 {id:"dc_ush",g:3,n:"Dual Credit US History",t:"DC",re:/(dual|\bdc\b).*hist|hist ?130[12]/,kn:{LG:1},cr:{tags:["ushist"],hrs:6,col:"HIST 1301 & 1302",core:"American History"}},
 {id:"apush",g:3,n:"AP US History",t:"AP",re:/apush|\bap\b.*(us|u s|united states|american) hist/,kn:{LG:1},cr:{tags:["ushist"],hrs:3,col:"HIST 1301",core:"American History"}},
 {id:"dc_gov",g:3,n:"Dual Credit Government",t:"DC",re:/(dual|\bdc\b).*gov|govt ?230[56]/,kn:{LG:2},cr:{tags:["gov"],hrs:3,col:"GOVT 2305",core:"Government/Political Science"}},
 {id:"ap_gov",g:3,n:"AP Government",t:"AP",re:/\bap\b.*gov/,kn:{LG:3},cr:{tags:["gov"],hrs:3,col:"GOVT 2305",core:"Government/Political Science"}},
 {id:"ap_psych",g:3,n:"AP Psychology",t:"AP",re:/\bap\b.*psych/,kn:{PS:3,TC:1},cr:{tags:["psych"],hrs:3,col:"PSYC 2301 General Psychology",core:"Social & Behavioral Sciences"}},
 {id:"ap_hug",g:3,n:"AP Human Geography",t:"AP",re:/aphg|\bap\b.*human geo/,kn:{GE:3},cr:{tags:["soc"],hrs:3,col:"GEOG 1302 Human Geography",core:"Social & Behavioral Sciences"}},
 {id:"ap_macro",g:3,n:"AP Macroeconomics",t:"AP",re:/\bap\b.*(macro|econ)/,kn:{EA:3},cr:{tags:["econ"],hrs:3,col:"ECON 2301 Macroeconomics",core:"Social & Behavioral Sciences"}},
 {id:"wgeo",g:3,n:"World Geography",re:/world geo|\bgeography\b/,kn:{GE:2}},
 {id:"whist",g:3,n:"World History",re:/world hist/,kn:{GE:1}},
 {id:"ush",g:3,n:"US History",re:/(us|u s|united states|american) hist/,kn:{LG:1}},
 {id:"gov",g:3,n:"Government",re:/\bgov(ernment|t)?\b/,kn:{LG:2}},
 {id:"econ",g:3,n:"Economics",re:/econ/,kn:{EA:2}},
 {id:"psych",g:3,n:"Psychology",re:/psych/,kn:{PS:2,TC:1}},
 {id:"socio",g:3,n:"Sociology",re:/sociology/,kn:{PS:1}},
 // Technology
 {id:"ap_csa",g:4,n:"AP Computer Science A",t:"AP",re:/\bap\b.*(computer science a\b|csa\b|comp sci a\b)/,kn:{CE:3,MA:1},cr:{tags:["cs"],hrs:4,col:"COSC 1436 Programming I",core:null}},
 {id:"ap_csp",g:4,n:"AP Computer Science Principles",t:"AP",re:/\bap\b.*(principles|csp\b)/,kn:{CE:2},cr:{tags:["cs0"],hrs:3,col:"COSC 1301 Intro to Computing",core:null}},
 {id:"network",g:4,n:"Networking / Computer Maintenance",re:/network|computer maintenance|it essentials|cyber/,kn:{CE:2,TE:2}},
 {id:"cs1",g:4,n:"Computer Science / Programming",re:/computer science|programming|coding/,kn:{CE:2,MA:1}},
 {id:"digmedia",g:4,n:"Digital Media",re:/digital media/,kn:{CE:1,CM:1,DE:1}},
 {id:"robotics",g:4,n:"Robotics",re:/robot/,kn:{ET:2,CE:1,ME:1}},
 // Trades & engineering
 {id:"eng_design",g:5,n:"Engineering Design & Presentation",re:/engineering design|\bedp\b|\bcad\b/,kn:{DE:2,ET:2}},
 {id:"engr",g:5,n:"Principles of Applied Engineering",re:/engineering/,kn:{ET:2,DE:1}},
 {id:"arch",g:5,n:"Architectural Design",re:/architect/,kn:{DE:2,BC:1}},
 {id:"elec",g:5,n:"Electrical Technology",re:/electric/,kn:{BC:2,ME:1,PSS:1}},
 {id:"hvac",g:5,n:"HVAC & Refrigeration Technology",re:/hvac|refrigeration|air condition/,kn:{BC:2,ME:2,PSS:1}},
 {id:"constr",g:5,n:"Construction Technology",re:/construction|carpentry|building trades/,kn:{BC:3,PSS:1,MA:1}},
 {id:"weld",g:5,n:"Welding",re:/weld/,kn:{PP:3,ME:1,PSS:1}},
 {id:"diesel",g:5,n:"Diesel Equipment Technology",re:/diesel/,kn:{ME:3,TR:2}},
 {id:"auto",g:5,n:"Automotive Technology",re:/automotive|auto tech|\bauto\b|collision/,kn:{ME:3,TR:1,CE:1}},
 {id:"agmech",g:5,n:"Ag Mechanics & Metal Technologies",re:/ag mech|agricultural mech|metal tech|ag power|agricultural power/,kn:{ME:2,PP:2}},
 {id:"mfg",g:5,n:"Manufacturing / Machining",re:/manufactur|machining/,kn:{PP:2,ME:1}},
 // Health
 {id:"cna",g:6,n:"Practicum in Health Science / CNA",re:/\bcna\b|nurse aide|nursing assist|practicum in health/,kn:{MD:2,CPS:2,PSS:1}},
 {id:"emt",g:6,n:"EMT",re:/\bemt\b|emergency medical/,kn:{MD:2,PSS:2,CPS:1}},
 {id:"hs_theory",g:6,n:"Health Science Theory / Clinical",re:/health science (theory|clinical)/,kn:{MD:2,CPS:1,TC:1}},
 {id:"hs_prin",g:6,n:"Principles of Health Science",re:/principles of health|health science/,kn:{MD:1,CPS:1}},
 {id:"medterm",g:6,n:"Medical Terminology",re:/medical term/,kn:{MD:2,EN:1}},
 {id:"pharm",g:6,n:"Pharmacy Technician",re:/pharmac/,kn:{MD:2,CH:1}},
 // Business, law, education
 {id:"bim",g:7,n:"Business Information Management",re:/business information|\bbim\b/,kn:{AD:2,CE:1}},
 {id:"acct",g:7,n:"Accounting",re:/accounting/,kn:{EA:3,AD:1}},
 {id:"entre",g:7,n:"Entrepreneurship",re:/entrepreneur/,kn:{AM:2,EA:1}},
 {id:"bus",g:7,n:"Principles of Business / Marketing",re:/business|marketing/,kn:{AM:1,CPS:1}},
 {id:"law_enf",g:7,n:"Law Enforcement / Criminal Justice",re:/law enforcement|criminal|forensic|court system/,kn:{LG:2,PSS:2}},
 {id:"law_prin",g:7,n:"Principles of Law & Public Safety",re:/principles of law|public safety/,kn:{LG:1,PSS:1}},
 {id:"instr",g:7,n:"Instructional Practices / Child Development",re:/instructional practices|child (development|guidance)|human growth/,kn:{ED:2,PS:1}},
 {id:"edu",g:7,n:"Principles of Education & Training",re:/principles of education|education and training/,kn:{ED:1}},
 // Arts, languages, other
 {id:"graphic",g:8,n:"Graphic Design & Illustration",re:/graphic design|illustration|animation/,kn:{DE:2,FA:1,CE:1}},
 {id:"av",g:8,n:"Audio/Video Production",re:/audio|video|broadcast|\bfilm\b/,kn:{CM:2,CE:1}},
 {id:"journal",g:8,n:"Journalism / Yearbook",re:/journalism|yearbook|newspaper/,kn:{CM:2,EN:1}},
 {id:"art",g:8,n:"Art",re:/\bart\b|drawing|painting|ceramics/,kn:{FA:2,DE:1}},
 {id:"music",g:8,n:"Band, Choir, or Orchestra",re:/band|choir|orchestra|music/,kn:{FA:2}},
 {id:"theatre",g:8,n:"Theatre",re:/theat|drama/,kn:{FA:1,CM:1}},
 {id:"lote",g:8,n:"World Language (Spanish, ASL…)",re:/spanish|french|german|\basl\b|sign language|latin|chinese/,kn:{CPS:1}},
 {id:"health",g:8,n:"Health",re:/\bhealth\b/,kn:{MD:1}},
 {id:"pe",g:8,n:"PE / Athletics",re:/\bpe\b|physical ed|athletic/,kn:{}},
 // Work & activities
 {id:"job",g:9,n:"Part-time job with customers",re:/\bjob\b|work experience|employ|cashier/,kn:{CPS:2,AM:1}},
 {id:"vol",g:9,n:"Volunteer work",re:/volunteer/,kn:{CPS:1,ED:1}},
 {id:"jrotc",g:9,n:"JROTC",re:/rotc/,kn:{PSS:1,AM:1}},
 {id:"ffa",g:9,n:"FFA / 4-H project",re:/\bffa\b|4 ?h\b/,kn:{ME:1,AM:1}}
];
const byId = Object.fromEntries(C.map(c=>[c.id,c]));
