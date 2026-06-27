import { CourseLevel } from '../entities/course.entity';
import { ImportStatus } from '../entities/catalog-import.entity';

export interface CourseSeed {
  courseCode: string;
  title: string;
  creditHours: number;
  level: CourseLevel;
  description: string;
}

export interface PrerequisiteSeed {
  courseCode: string;
  prerequisiteCode: string;
}

export interface CorequisiteSeed {
  courseCode: string;
  corequisiteCode: string;
}

export interface ProgramRequirementSeed {
  courseCode: string | null;
  minCredits: number | null;
  description: string | null;
  sortOrder: number;
}

export interface RequirementGroupSeed {
  name: string;
  description: string | null;
  minCredits: number | null;
  sortOrder: number;
  requirements: ProgramRequirementSeed[];
}

export interface ProgramSeed {
  name: string;
  abbreviation: string;
  description: string;
  academicYear: string;
  effectiveDate: string;
  requirementGroups: RequirementGroupSeed[];
}

// ──────────────────────────────────────────────────────────────
// COURSES (2025-2026 catalog)
// ──────────────────────────────────────────────────────────────

export const COURSES: CourseSeed[] = [
  // ── Undergraduate Math (Preparation) ──
  {
    courseCode: 'MATH201',
    title: 'Calculus I',
    creditHours: 3,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'Limits, derivatives, and integrals of functions of one variable, with applications.',
  },
  {
    courseCode: 'MATH202',
    title: 'Calculus II',
    creditHours: 3,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'Techniques of integration, sequences and series, and introduction to differential equations.',
  },
  {
    courseCode: 'MATH203',
    title: 'Discrete Mathematics',
    creditHours: 3,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'Logic, sets, relations, functions, combinatorics, graph theory, and proofs for computing.',
  },
  {
    courseCode: 'MATH208',
    title: 'Linear Algebra',
    creditHours: 3,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'Vectors, matrices, determinants, linear transformations, eigenvalues, and eigenvectors.',
  },

  // ── BSCS Core ──
  {
    courseCode: 'CS200',
    title: 'Introduction to Computer Science',
    creditHours: 3,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'Fundamental concepts of programming and problem solving using Python.',
  },
  {
    courseCode: 'CS230',
    title: 'Object-Oriented Programming',
    creditHours: 3,
    level: CourseLevel.UNDERGRADUATE,
    description: 'Object-oriented design principles and programming in Java.',
  },
  {
    courseCode: 'CS230L',
    title: 'Object-Oriented Programming Lab',
    creditHours: 1,
    level: CourseLevel.UNDERGRADUATE,
    description: 'Laboratory component for CS230.',
  },
  {
    courseCode: 'CS250',
    title: 'Data Structures',
    creditHours: 3,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'Arrays, linked lists, stacks, queues, trees, and graphs with algorithm analysis.',
  },
  {
    courseCode: 'CS250L',
    title: 'Data Structures Lab',
    creditHours: 1,
    level: CourseLevel.UNDERGRADUATE,
    description: 'Laboratory component for CS250.',
  },
  {
    courseCode: 'CE305',
    title: 'Digital Logic Design',
    creditHours: 3,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'Boolean algebra, combinational and sequential logic circuits, and digital system design.',
  },
  {
    courseCode: 'CS350',
    title: 'Operating Systems',
    creditHours: 3,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'Process management, memory management, file systems, and concurrent programming.',
  },
  {
    courseCode: 'CS350L',
    title: 'Operating Systems Lab',
    creditHours: 1,
    level: CourseLevel.UNDERGRADUATE,
    description: 'Laboratory component for CS350.',
  },
  {
    courseCode: 'CS360',
    title: 'Computer Networks',
    creditHours: 3,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'Network architecture, protocols, routing, transport, and application layers.',
  },
  {
    courseCode: 'CS360L',
    title: 'Computer Networks Lab',
    creditHours: 1,
    level: CourseLevel.UNDERGRADUATE,
    description: 'Laboratory component for CS360.',
  },
  {
    courseCode: 'CS380',
    title: 'Analysis of Algorithms',
    creditHours: 3,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'Algorithm design paradigms: divide-and-conquer, dynamic programming, greedy, and complexity theory.',
  },
  {
    courseCode: 'BUS450',
    title: 'Technology Entrepreneurship',
    creditHours: 3,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'Business planning, intellectual property, and launching technology ventures.',
  },
  {
    courseCode: 'CS455',
    title: 'Database Systems',
    creditHours: 3,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'Relational model, SQL, normalization, transaction management, and database design.',
  },
  {
    courseCode: 'CS457',
    title: 'Software Engineering',
    creditHours: 3,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'Software lifecycle, requirements, design patterns, testing, and project management.',
  },
  {
    courseCode: 'CS457L',
    title: 'Software Engineering Lab',
    creditHours: 1,
    level: CourseLevel.UNDERGRADUATE,
    description: 'Laboratory component for CS457.',
  },
  {
    courseCode: 'CS480',
    title: 'Artificial Intelligence',
    creditHours: 3,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'Search, knowledge representation, machine learning, and natural language processing.',
  },
  {
    courseCode: 'CS480L',
    title: 'Artificial Intelligence Lab',
    creditHours: 1,
    level: CourseLevel.UNDERGRADUATE,
    description: 'Laboratory component for CS480.',
  },
  {
    courseCode: 'CS481',
    title: 'Machine Learning',
    creditHours: 3,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'Supervised and unsupervised learning, neural networks, and deep learning fundamentals.',
  },
  {
    courseCode: 'CS487',
    title: 'Capstone Project I',
    creditHours: 3,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'First semester of senior capstone; project definition, design, and proposal.',
  },
  {
    courseCode: 'CS494',
    title: 'Capstone Project II',
    creditHours: 3,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'Second semester of senior capstone; implementation and final presentation.',
  },

  // ── BSCS Specialization Electives ──
  {
    courseCode: 'CE450',
    title: 'Computer Architecture',
    creditHours: 3,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'Instruction set architecture, pipelining, memory hierarchy, and parallel computing.',
  },
  {
    courseCode: 'CS453',
    title: 'Theory of Computation',
    creditHours: 3,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'Automata, formal languages, Turing machines, computability, and NP-completeness.',
  },
  {
    courseCode: 'CS470',
    title: 'Cybersecurity Fundamentals',
    creditHours: 3,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'Cryptography, network security, authentication, and security policy frameworks.',
  },
  {
    courseCode: 'CS477',
    title: 'Wireless Networks',
    creditHours: 3,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'Wireless protocols, mobile computing, IoT connectivity, and 5G fundamentals.',
  },
  {
    courseCode: 'CS478',
    title: 'Cloud Computing',
    creditHours: 3,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'Virtualization, cloud service models, distributed systems, and container orchestration.',
  },
  {
    courseCode: 'CS483',
    title: 'Computer Vision',
    creditHours: 3,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'Image processing, feature extraction, object detection, and deep learning for vision.',
  },
  {
    courseCode: 'CS485',
    title: 'Natural Language Processing',
    creditHours: 3,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'Text processing, language models, sentiment analysis, and transformer architectures.',
  },

  // ── MSCS Foundation ──
  {
    courseCode: 'CS455G',
    title: 'Database Systems (Graduate)',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'Graduate-level database systems: advanced SQL, NoSQL, query optimization, and concurrency.',
  },
  {
    courseCode: 'CS457G',
    title: 'Software Engineering (Graduate)',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'Graduate-level software engineering: agile methods, software architecture, and quality assurance.',
  },
  {
    courseCode: 'CS457LG',
    title: 'Software Engineering Lab (Graduate)',
    creditHours: 1,
    level: CourseLevel.GRADUATE,
    description: 'Graduate laboratory component for CS457G.',
  },
  {
    courseCode: 'CS500',
    title: 'Advanced Algorithms',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'Advanced algorithm design: approximation, randomized algorithms, and computational complexity.',
  },
  {
    courseCode: 'CS500L',
    title: 'Advanced Algorithms Lab',
    creditHours: 1,
    level: CourseLevel.GRADUATE,
    description: 'Laboratory component for CS500.',
  },
  {
    courseCode: 'CS501',
    title: 'Advanced Operating Systems',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'Advanced operating system design: kernel internals, distributed OS, and real-time systems.',
  },

  // ── MSCS Specialization — Cybersecurity ──
  {
    courseCode: 'CS535',
    title: 'Network Security',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'Firewalls, intrusion detection, VPNs, and secure protocol design.',
  },
  {
    courseCode: 'CS571',
    title: 'Advanced Cryptography',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'Public-key cryptography, zero-knowledge proofs, and applied cryptographic protocols.',
  },
  {
    courseCode: 'CS581',
    title: 'Secure Software Development',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'Secure coding practices, vulnerability analysis, penetration testing, and threat modeling.',
  },
  {
    courseCode: 'CS589',
    title: 'Special Topics in Computer Science',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'Rotating advanced topics in current areas of computer science research.',
  },
  {
    courseCode: 'CS477G',
    title: 'Wireless Networks (Graduate)',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'Graduate-level wireless networking: advanced protocols, security, and 5G architectures.',
  },

  // ── MSCS Specialization — Data Science ──
  {
    courseCode: 'CS550',
    title: 'Big Data Systems',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'Hadoop, Spark, distributed storage, and large-scale data processing pipelines.',
  },
  {
    courseCode: 'CS570',
    title: 'Deep Learning',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'Convolutional networks, recurrent networks, attention mechanisms, and large language models.',
  },
  {
    courseCode: 'CS481G',
    title: 'Machine Learning (Graduate)',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'Graduate-level machine learning: advanced methods, probabilistic models, and scalable learning.',
  },

  // ── MSCS Specialization — Network Engineering ──
  {
    courseCode: 'CS515',
    title: 'Advanced Computer Networks',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'Software-defined networking, network function virtualization, and cloud networking.',
  },
  {
    courseCode: 'CS565',
    title: 'Distributed Systems',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'Consistency models, consensus algorithms, fault tolerance, and distributed transactions.',
  },
  {
    courseCode: 'CS575',
    title: 'Internet of Things',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'IoT architectures, edge computing, sensor networks, and IoT security.',
  },

  // ── MSCS Capstone ──
  {
    courseCode: 'CS595',
    title: 'Computer Science Capstone',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'Graduate capstone project integrating advanced CS topics with research or industry application.',
  },

  // ── MSEE Foundation ──
  {
    courseCode: 'CE450G',
    title: 'Computer Architecture (Graduate)',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'Graduate-level computer architecture: advanced pipelining, cache design, and multicore systems.',
  },
  {
    courseCode: 'CE450LG',
    title: 'Computer Architecture Lab (Graduate)',
    creditHours: 1,
    level: CourseLevel.GRADUATE,
    description: 'Graduate laboratory component for CE450G.',
  },
  {
    courseCode: 'EE461G',
    title: 'Digital Signal Processing (Graduate)',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'Graduate DSP: Z-transform, FIR/IIR filters, FFT, and spectral estimation.',
  },
  {
    courseCode: 'EE461LG',
    title: 'Digital Signal Processing Lab (Graduate)',
    creditHours: 1,
    level: CourseLevel.GRADUATE,
    description: 'Graduate laboratory component for EE461G.',
  },
  {
    courseCode: 'EE488G',
    title: 'Embedded Systems (Graduate)',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'Graduate embedded systems: RTOS, hardware-software co-design, and IoT integration.',
  },

  // ── MSEE Specialization — IoT and Embedded Systems ──
  {
    courseCode: 'EE517',
    title: 'Advanced Embedded System Design',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'Advanced microcontroller programming, peripheral interfacing, and real-time design patterns.',
  },
  {
    courseCode: 'CE521',
    title: 'Field Programmable Gate Arrays',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'FPGA architecture, HDL design, timing analysis, and hardware accelerator implementation.',
  },
  {
    courseCode: 'CE522',
    title: 'System-on-Chip Design',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'SoC integration, bus architectures, IP core integration, and verification.',
  },
  {
    courseCode: 'CE523',
    title: 'Computer Architecture II',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'Out-of-order execution, branch prediction, memory consistency, and heterogeneous computing.',
  },
  {
    courseCode: 'CE530',
    title: 'IoT System Architecture',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'End-to-end IoT design: sensors, gateways, cloud integration, and edge analytics.',
  },

  // ── MSEE Specialization — Multicore and Parallel Computing ──
  {
    courseCode: 'EE504',
    title: 'Parallel Computing',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'Parallel programming models, GPU computing, and distributed memory architectures.',
  },
  {
    courseCode: 'EE553',
    title: 'High Performance Computing',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'HPC cluster design, MPI/OpenMP, performance profiling, and scientific computing.',
  },

  // ── MSEE Specialization — Modern Integrated Circuits ──
  {
    courseCode: 'EE505',
    title: 'VLSI Design',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'CMOS circuit design, layout, timing, and physical verification methodologies.',
  },
  {
    courseCode: 'EE511',
    title: 'Advanced VLSI Design',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'High-speed CMOS, low-power design techniques, and mixed-signal integration.',
  },
  {
    courseCode: 'EE520',
    title: 'Digital IC Design',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'RTL design methodologies, synthesis, static timing analysis, and sign-off.',
  },
  {
    courseCode: 'EE577',
    title: 'RF Circuit Design',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'RF amplifiers, filters, oscillators, and transceiver design for wireless applications.',
  },

  // ── MSEE Capstone ──
  {
    courseCode: 'EE595',
    title: 'Electrical Engineering Capstone',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'Graduate capstone project applying EE specialization to a substantial engineering problem.',
  },
];

// ──────────────────────────────────────────────────────────────
// PREREQUISITES (course → requires these courses)
// ──────────────────────────────────────────────────────────────

export const PREREQUISITES: PrerequisiteSeed[] = [
  // CS chain
  { courseCode: 'CS230', prerequisiteCode: 'CS200' },
  { courseCode: 'CS250', prerequisiteCode: 'CS230' },
  { courseCode: 'CS380', prerequisiteCode: 'CS250' },
  { courseCode: 'CS380', prerequisiteCode: 'MATH203' },
  { courseCode: 'CS350', prerequisiteCode: 'CS250' },
  { courseCode: 'CS360', prerequisiteCode: 'CS250' },
  { courseCode: 'CS455', prerequisiteCode: 'CS250' },
  { courseCode: 'CS457', prerequisiteCode: 'CS250' },
  { courseCode: 'CS480', prerequisiteCode: 'CS380' },
  { courseCode: 'CS481', prerequisiteCode: 'CS380' },
  { courseCode: 'CS481', prerequisiteCode: 'MATH208' },
  { courseCode: 'CS453', prerequisiteCode: 'CS380' },
  { courseCode: 'CS453', prerequisiteCode: 'MATH203' },
  { courseCode: 'CS470', prerequisiteCode: 'CS360' },
  { courseCode: 'CS477', prerequisiteCode: 'CS360' },
  { courseCode: 'CS478', prerequisiteCode: 'CS360' },
  { courseCode: 'CS483', prerequisiteCode: 'CS481' },
  { courseCode: 'CS485', prerequisiteCode: 'CS481' },
  { courseCode: 'CE450', prerequisiteCode: 'CE305' },
  { courseCode: 'CS487', prerequisiteCode: 'CS457' },
  { courseCode: 'CS494', prerequisiteCode: 'CS487' },
  // Math chain
  { courseCode: 'MATH202', prerequisiteCode: 'MATH201' },
  { courseCode: 'MATH208', prerequisiteCode: 'MATH201' },
  // Graduate CS
  { courseCode: 'CS500', prerequisiteCode: 'CS380' },
  { courseCode: 'CS535', prerequisiteCode: 'CS360' },
  { courseCode: 'CS550', prerequisiteCode: 'CS455G' },
  { courseCode: 'CS565', prerequisiteCode: 'CS515' },
  { courseCode: 'CS570', prerequisiteCode: 'CS481G' },
  { courseCode: 'CS571', prerequisiteCode: 'CS535' },
  { courseCode: 'CS581', prerequisiteCode: 'CS535' },
  // Graduate EE
  { courseCode: 'CE521', prerequisiteCode: 'CE450G' },
  { courseCode: 'CE522', prerequisiteCode: 'CE521' },
  { courseCode: 'CE523', prerequisiteCode: 'CE450G' },
  { courseCode: 'EE504', prerequisiteCode: 'CE450G' },
  { courseCode: 'EE505', prerequisiteCode: 'CE450G' },
  { courseCode: 'EE511', prerequisiteCode: 'EE505' },
  { courseCode: 'EE517', prerequisiteCode: 'EE488G' },
  { courseCode: 'EE520', prerequisiteCode: 'EE505' },
  { courseCode: 'EE553', prerequisiteCode: 'EE504' },
  { courseCode: 'EE577', prerequisiteCode: 'CE450G' },
];

// ──────────────────────────────────────────────────────────────
// COREQUISITES
// ──────────────────────────────────────────────────────────────

export const COREQUISITES: CorequisiteSeed[] = [
  { courseCode: 'CS230', corequisiteCode: 'CS230L' },
  { courseCode: 'CS250', corequisiteCode: 'CS250L' },
  { courseCode: 'CS350', corequisiteCode: 'CS350L' },
  { courseCode: 'CS360', corequisiteCode: 'CS360L' },
  { courseCode: 'CS457', corequisiteCode: 'CS457L' },
  { courseCode: 'CS480', corequisiteCode: 'CS480L' },
  { courseCode: 'CS457G', corequisiteCode: 'CS457LG' },
  { courseCode: 'CS500', corequisiteCode: 'CS500L' },
  { courseCode: 'CE450G', corequisiteCode: 'CE450LG' },
  { courseCode: 'EE461G', corequisiteCode: 'EE461LG' },
];

// ──────────────────────────────────────────────────────────────
// PROGRAMS (2025-2026)
// ──────────────────────────────────────────────────────────────

export const PROGRAMS: ProgramSeed[] = [
  // ── BSCS ──────────────────────────────────────────────────
  {
    name: 'Bachelor of Science in Computer Science',
    abbreviation: 'BSCS',
    description:
      'A four-year undergraduate program providing a rigorous foundation in computer science theory and practice, with specialization tracks in AI/ML, cybersecurity, and systems.',
    academicYear: '2025-2026',
    effectiveDate: '2025-08-01',
    requirementGroups: [
      {
        name: 'General Education',
        description: 'University-wide general education requirements.',
        minCredits: 30,
        sortOrder: 1,
        requirements: [
          {
            courseCode: null,
            minCredits: 30,
            description:
              'General Education courses as listed in the SFBU catalog.',
            sortOrder: 1,
          },
        ],
      },
      {
        name: 'Preparation Courses',
        description: 'Mathematics foundation required before CS core.',
        minCredits: 12,
        sortOrder: 2,
        requirements: [
          {
            courseCode: 'MATH201',
            minCredits: null,
            description: null,
            sortOrder: 1,
          },
          {
            courseCode: 'MATH202',
            minCredits: null,
            description: null,
            sortOrder: 2,
          },
          {
            courseCode: 'MATH203',
            minCredits: null,
            description: null,
            sortOrder: 3,
          },
          {
            courseCode: 'MATH208',
            minCredits: null,
            description: null,
            sortOrder: 4,
          },
        ],
      },
      {
        name: 'Core Courses',
        description: 'Required CS core — all courses mandatory.',
        minCredits: 48,
        sortOrder: 3,
        requirements: [
          {
            courseCode: 'CS200',
            minCredits: null,
            description: null,
            sortOrder: 1,
          },
          {
            courseCode: 'CS230',
            minCredits: null,
            description: null,
            sortOrder: 2,
          },
          {
            courseCode: 'CS230L',
            minCredits: null,
            description: null,
            sortOrder: 3,
          },
          {
            courseCode: 'CS250',
            minCredits: null,
            description: null,
            sortOrder: 4,
          },
          {
            courseCode: 'CS250L',
            minCredits: null,
            description: null,
            sortOrder: 5,
          },
          {
            courseCode: 'CE305',
            minCredits: null,
            description: null,
            sortOrder: 6,
          },
          {
            courseCode: 'CS350',
            minCredits: null,
            description: null,
            sortOrder: 7,
          },
          {
            courseCode: 'CS350L',
            minCredits: null,
            description: null,
            sortOrder: 8,
          },
          {
            courseCode: 'CS360',
            minCredits: null,
            description: null,
            sortOrder: 9,
          },
          {
            courseCode: 'CS360L',
            minCredits: null,
            description: null,
            sortOrder: 10,
          },
          {
            courseCode: 'CS380',
            minCredits: null,
            description: null,
            sortOrder: 11,
          },
          {
            courseCode: 'BUS450',
            minCredits: null,
            description: null,
            sortOrder: 12,
          },
          {
            courseCode: 'CS455',
            minCredits: null,
            description: null,
            sortOrder: 13,
          },
          {
            courseCode: 'CS457',
            minCredits: null,
            description: null,
            sortOrder: 14,
          },
          {
            courseCode: 'CS457L',
            minCredits: null,
            description: null,
            sortOrder: 15,
          },
          {
            courseCode: 'CS480',
            minCredits: null,
            description: null,
            sortOrder: 16,
          },
          {
            courseCode: 'CS480L',
            minCredits: null,
            description: null,
            sortOrder: 17,
          },
          {
            courseCode: 'CS481',
            minCredits: null,
            description: null,
            sortOrder: 18,
          },
          {
            courseCode: 'CS487',
            minCredits: null,
            description: null,
            sortOrder: 19,
          },
          {
            courseCode: 'CS494',
            minCredits: null,
            description: null,
            sortOrder: 20,
          },
        ],
      },
      {
        name: 'Specialization Electives',
        description:
          'Choose 15 credits from approved specialization electives.',
        minCredits: 15,
        sortOrder: 4,
        requirements: [
          {
            courseCode: 'CE450',
            minCredits: null,
            description: null,
            sortOrder: 1,
          },
          {
            courseCode: 'CS453',
            minCredits: null,
            description: null,
            sortOrder: 2,
          },
          {
            courseCode: 'CS470',
            minCredits: null,
            description: null,
            sortOrder: 3,
          },
          {
            courseCode: 'CS477',
            minCredits: null,
            description: null,
            sortOrder: 4,
          },
          {
            courseCode: 'CS478',
            minCredits: null,
            description: null,
            sortOrder: 5,
          },
          {
            courseCode: 'CS483',
            minCredits: null,
            description: null,
            sortOrder: 6,
          },
          {
            courseCode: 'CS485',
            minCredits: null,
            description: null,
            sortOrder: 7,
          },
        ],
      },
      {
        name: 'Free Electives',
        description: 'Remaining credits to reach 120 total.',
        minCredits: 15,
        sortOrder: 5,
        requirements: [
          {
            courseCode: null,
            minCredits: 15,
            description: 'Any approved upper-division courses.',
            sortOrder: 1,
          },
        ],
      },
    ],
  },

  // ── MSCS ──────────────────────────────────────────────────
  {
    name: 'Master of Science in Computer Science',
    abbreviation: 'MSCS',
    description:
      'A 36-credit graduate program offering advanced study in computer science with specialization tracks in Cybersecurity, Data Science, and Network Engineering.',
    academicYear: '2025-2026',
    effectiveDate: '2025-08-01',
    requirementGroups: [
      {
        name: 'Foundation Courses',
        description: 'Graduate-level CS foundation — all required.',
        minCredits: 11,
        sortOrder: 1,
        requirements: [
          {
            courseCode: 'CS455G',
            minCredits: null,
            description: null,
            sortOrder: 1,
          },
          {
            courseCode: 'CS457G',
            minCredits: null,
            description: null,
            sortOrder: 2,
          },
          {
            courseCode: 'CS457LG',
            minCredits: null,
            description: null,
            sortOrder: 3,
          },
          {
            courseCode: 'CS500',
            minCredits: null,
            description: 'Or CS501 (Advanced Operating Systems)',
            sortOrder: 4,
          },
          {
            courseCode: 'CS500L',
            minCredits: null,
            description: 'Required if CS500 selected',
            sortOrder: 5,
          },
        ],
      },
      {
        name: 'Specialization — Cybersecurity',
        description:
          'Choose this track OR Data Science OR Network Engineering (12 credits).',
        minCredits: 12,
        sortOrder: 2,
        requirements: [
          {
            courseCode: 'CS535',
            minCredits: null,
            description: null,
            sortOrder: 1,
          },
          {
            courseCode: 'CS571',
            minCredits: null,
            description: null,
            sortOrder: 2,
          },
          {
            courseCode: 'CS581',
            minCredits: null,
            description: null,
            sortOrder: 3,
          },
          {
            courseCode: 'CS589',
            minCredits: null,
            description: null,
            sortOrder: 4,
          },
          {
            courseCode: 'CS477G',
            minCredits: null,
            description: 'Elective option',
            sortOrder: 5,
          },
        ],
      },
      {
        name: 'Specialization — Data Science',
        description:
          'Choose this track OR Cybersecurity OR Network Engineering (12 credits).',
        minCredits: 12,
        sortOrder: 3,
        requirements: [
          {
            courseCode: 'CS550',
            minCredits: null,
            description: null,
            sortOrder: 1,
          },
          {
            courseCode: 'CS570',
            minCredits: null,
            description: null,
            sortOrder: 2,
          },
          {
            courseCode: 'CS589',
            minCredits: null,
            description: null,
            sortOrder: 3,
          },
          {
            courseCode: 'CS481G',
            minCredits: null,
            description: null,
            sortOrder: 4,
          },
        ],
      },
      {
        name: 'Specialization — Network Engineering',
        description:
          'Choose this track OR Cybersecurity OR Data Science (12 credits).',
        minCredits: 12,
        sortOrder: 4,
        requirements: [
          {
            courseCode: 'CS515',
            minCredits: null,
            description: null,
            sortOrder: 1,
          },
          {
            courseCode: 'CS535',
            minCredits: null,
            description: null,
            sortOrder: 2,
          },
          {
            courseCode: 'CS565',
            minCredits: null,
            description: null,
            sortOrder: 3,
          },
          {
            courseCode: 'CS575',
            minCredits: null,
            description: null,
            sortOrder: 4,
          },
        ],
      },
      {
        name: 'Graduate Electives',
        description: 'Approved graduate-level electives to total 36 credits.',
        minCredits: 10,
        sortOrder: 5,
        requirements: [
          {
            courseCode: null,
            minCredits: 10,
            description: 'Approved 500-level CS courses.',
            sortOrder: 1,
          },
        ],
      },
      {
        name: 'Capstone',
        description: 'Required graduate capstone.',
        minCredits: 3,
        sortOrder: 6,
        requirements: [
          {
            courseCode: 'CS595',
            minCredits: null,
            description: null,
            sortOrder: 1,
          },
        ],
      },
    ],
  },

  // ── MSEE ──────────────────────────────────────────────────
  {
    name: 'Master of Science in Electrical Engineering',
    abbreviation: 'MSEE',
    description:
      'A 36-credit graduate program offering advanced study in electrical engineering with specialization tracks in IoT/Embedded Systems, Multicore and Parallel Computing, and Modern Integrated Circuits.',
    academicYear: '2025-2026',
    effectiveDate: '2025-08-01',
    requirementGroups: [
      {
        name: 'Foundation Courses',
        description: 'Graduate-level EE foundation — all required.',
        minCredits: 11,
        sortOrder: 1,
        requirements: [
          {
            courseCode: 'CE450G',
            minCredits: null,
            description: null,
            sortOrder: 1,
          },
          {
            courseCode: 'CE450LG',
            minCredits: null,
            description: null,
            sortOrder: 2,
          },
          {
            courseCode: 'EE461G',
            minCredits: null,
            description: null,
            sortOrder: 3,
          },
          {
            courseCode: 'EE461LG',
            minCredits: null,
            description: null,
            sortOrder: 4,
          },
          {
            courseCode: 'EE488G',
            minCredits: null,
            description: null,
            sortOrder: 5,
          },
        ],
      },
      {
        name: 'Specialization — IoT and Embedded Systems',
        description:
          'Choose this track OR Multicore OR Modern IC (12 credits).',
        minCredits: 12,
        sortOrder: 2,
        requirements: [
          {
            courseCode: 'EE517',
            minCredits: null,
            description: null,
            sortOrder: 1,
          },
          {
            courseCode: 'CE521',
            minCredits: null,
            description: null,
            sortOrder: 2,
          },
          {
            courseCode: 'CE522',
            minCredits: null,
            description: null,
            sortOrder: 3,
          },
          {
            courseCode: 'CE523',
            minCredits: null,
            description: null,
            sortOrder: 4,
          },
          {
            courseCode: 'CE530',
            minCredits: null,
            description: null,
            sortOrder: 5,
          },
        ],
      },
      {
        name: 'Specialization — Multicore and Parallel Computing',
        description: 'Choose this track OR IoT OR Modern IC (12 credits).',
        minCredits: 12,
        sortOrder: 3,
        requirements: [
          {
            courseCode: 'EE504',
            minCredits: null,
            description: null,
            sortOrder: 1,
          },
          {
            courseCode: 'EE553',
            minCredits: null,
            description: null,
            sortOrder: 2,
          },
        ],
      },
      {
        name: 'Specialization — Modern Integrated Circuits',
        description: 'Choose this track OR IoT OR Multicore (12 credits).',
        minCredits: 12,
        sortOrder: 4,
        requirements: [
          {
            courseCode: 'EE505',
            minCredits: null,
            description: null,
            sortOrder: 1,
          },
          {
            courseCode: 'EE511',
            minCredits: null,
            description: null,
            sortOrder: 2,
          },
          {
            courseCode: 'EE520',
            minCredits: null,
            description: null,
            sortOrder: 3,
          },
          {
            courseCode: 'EE577',
            minCredits: null,
            description: null,
            sortOrder: 4,
          },
        ],
      },
      {
        name: 'Graduate Electives',
        description: 'Approved graduate-level electives to total 36 credits.',
        minCredits: 10,
        sortOrder: 5,
        requirements: [
          {
            courseCode: null,
            minCredits: 10,
            description: 'Approved 500-level EE/CE courses.',
            sortOrder: 1,
          },
        ],
      },
      {
        name: 'Capstone',
        description: 'Required graduate capstone.',
        minCredits: 3,
        sortOrder: 6,
        requirements: [
          {
            courseCode: 'EE595',
            minCredits: null,
            description: null,
            sortOrder: 1,
          },
        ],
      },
    ],
  },
];

export const CATALOG_IMPORT_STATUS = ImportStatus.COMPLETED;
