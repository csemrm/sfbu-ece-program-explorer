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

export interface KnowledgeAreaSeed {
  name: string;
  description: string;
}

export interface CourseKnowledgeAreaSeed {
  courseCode: string;
  knowledgeAreaNames: string[];
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
  // Titles, credit hours and descriptions transcribed from
  // docs/sfbu-2025-2026-university-catalog-10.27.pdf.
  {
    courseCode: 'MATH201',
    title: 'Calculus – I',
    creditHours: 3,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'This course is the first of a series in calculus designed for students to build a ' +
      'fundamental background in calculus and to learn its applications to basic problems. ' +
      'Topics include functions, limits, continuous functions, derivatives and applications, ' +
      'antiderivatives, composite functions and chain rules, graphing techniques using ' +
      'derivatives, implicit differentiation, finite integrals, and fundamental theorems of ' +
      'calculus.',
  },
  {
    courseCode: 'MATH202',
    title: 'Calculus – II',
    creditHours: 3,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'This course is the second of the calculus series designed for students to understand ' +
      'integration techniques and extend the differentiation notion and methods to functions of ' +
      'multiple variables. Topics include logarithmic and exponential functions and their ' +
      'derivatives, inverse trigonometric functions, derivatives, as well as L’Hopital’s rule, ' +
      'integration techniques and their applications, sequence, series, partial derivatives, ' +
      'and improper integrals.',
  },
  {
    courseCode: 'MATH203',
    title: 'Linear Algebra',
    creditHours: 3,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'Linear algebra is one of the topics necessary to prepare students for higher-level math ' +
      'courses such as differential equations. It is also relevant to computer science and ' +
      'business students interested in data science since linear problems are often the ' +
      'simplest models of the natural world. In this course, students will learn the language, ' +
      'concepts, and techniques from the ground up, beginning with the geometric representation ' +
      'of systems by equations and progressing to the manipulation of abstract ideas such as ' +
      'singular value decomposition.',
  },
  {
    courseCode: 'MATH208',
    title: 'Probability and Statistics',
    creditHours: 3,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'This course is designed for students to understand the concepts, theory, and ' +
      'applications of probability and statistics. Topics include permutation, combination, ' +
      'random variables, distribution, means and variance, normal distribution, random ' +
      'sampling, estimation, confidence interval, hypothesis testing, linear correlation, and ' +
      'regression.',
  },
  {
    courseCode: 'CS200',
    title: 'Discrete Logic',
    creditHours: 3,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'Discrete logic for computing. (The 2025-2026 catalog prints a Linux and shell-scripting ' +
      'description under this course code, duplicating CS230; the description here is a ' +
      'placeholder pending departmental confirmation.)',
  },
  {
    courseCode: 'CS230',
    title: 'Linux & Shell Scripting',
    creditHours: 3,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'This course is designed to familiarize the students with the Linux environment. Topics ' +
      'include concepts of the Linux operating system, Shell commands, Visual editor, file ' +
      'manipulation and securities, Linux utility commands, shell features and shell ' +
      'environment, online manual, controlling user processes and managing jobs, the ' +
      'introduction of regular expression and its usage with grep, sed, and awk power ' +
      'utilities, basic shell programming techniques, large file management, and the user ' +
      'programming environment customization. Students are also introduced to Linux shells ' +
      '(bash, Bourne, and Korn), shell programming, basic Linux file systems, and resource ' +
      'management. The students will be able to write shell scripts to accomplish routine tasks ' +
      'for software development and testing. Hands-on exercises are required. Corequisite: ' +
      'CS230L',
  },
  {
    courseCode: 'CS230L',
    title: 'Linux & Shell Scripting Lab',
    creditHours: 1,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'This course is designed to be taken concurrently with the CS230 Linux & Shell Scripting ' +
      'course. The students gain hands-on experience with Unix/Linux commands, vi editor, Linux ' +
      'utility, shell scripting/programming, security issues, managing long files, and ' +
      'customization of user environment. Corequisite: CS230',
  },
  {
    courseCode: 'CS250',
    title: 'Introduction to Programming',
    creditHours: 3,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'This course is an introduction to computer science using Python programming language. ' +
      'Major topics covered include defining and analyzing problems, developing algorithms, ' +
      'implementation, debugging, documentation of programs, coverage of basic algorithms, ' +
      'programming concepts, and data types. Students will write computer programs that include ' +
      'control structures, iteration, methods, argument passing, and classes. Corequisite: ' +
      'CS250L',
  },
  {
    courseCode: 'CS250L',
    title: 'Introduction to Programming Lab',
    creditHours: 1,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'This course is designed to be taken concurrently with the CS250 Introduction to ' +
      'Programming course. It is aimed at students new to the Python language who may or may ' +
      'not have experience with other programming languages. Students will learn (a) how Python ' +
      'works and its place in the world of programming languages, (b) to work with and ' +
      'manipulate strings, (c) to perform math operations, (d) to work with Python sequences, ' +
      '(e) to collect user input and output results, (f) flow control processing, (g) to write ' +
      'to, and read from files, (h) to write functions, and (i) to handle exceptions. ' +
      'Corequisite: CS250',
  },
  {
    courseCode: 'CE305',
    title: 'Computer Organization',
    creditHours: 3,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'This course is designed to provide a fundamental understanding of the issues and ' +
      'challenges involved in designing and implementing modern computer systems. The primary ' +
      'goal is to help students become more skilled in their understanding of computer systems, ' +
      'including how the hardware and software interact with each other. This course will also ' +
      'provide an understanding of where computers come from and where they are going, as well ' +
      'as an understanding of their strengths and weaknesses, such as why compiled code will ' +
      'always execute faster than JAVA code. Subjects will include RISC vs. CISC CPU design ' +
      'approach, instruction sets, pipelining, instruction scheduling (branch prediction, ' +
      'speculative and out-of-order execution, etc.), cache, and storage hierarchy design. ' +
      'Additional key focuses will be on modern I/O architectures such as PCI, PCI-X, SATA, ' +
      'SCSI, and USB, among others, and their importance for performance and compatibility.',
  },
  {
    courseCode: 'CS350',
    title: 'Data Structures',
    creditHours: 3,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'This course is designed to teach efficient use of data structures and algorithms to ' +
      'solve problems. Students study the logical relationship between data structures ' +
      'associated with a problem and physical representation. Topics include introduction to ' +
      'algorithms and data organization, arrays, stacks, queues, trees, graphs, sorting, ' +
      'hashing, and heap structures. Hands-on exercises are required.',
  },
  {
    courseCode: 'CS350L',
    title: 'Data Structures Lab',
    creditHours: 1,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'This course is designed to be taken concurrently with the CS350 Data Structures course. ' +
      'C language, a structured programming language, is further investigated. Topics include ' +
      'pointer structure, structure and union, stack, queue, linked list, sort, binary tree, ' +
      'and heaps.',
  },
  {
    courseCode: 'CS360',
    title: 'Programming in C and C++',
    creditHours: 3,
    level: CourseLevel.UNDERGRADUATE,
    description:
      "This course is designed to develop students' skills in designing, coding, and " +
      'documenting application programs using the C and C++ programming languages. Emphasis is ' +
      'placed on defining design objectives, criteria, and specifications, as well as the ' +
      'processes of synthesis, analysis, construction, testing, and evaluation of open-ended ' +
      'programming problem Topics include an introduction to procedural programming in C and ' +
      'object-oriented programming in C++. Key concepts covered are data types, expressions, ' +
      'statements, functions, program scope, run-time memory allocation, function overloading, ' +
      'template functions, class mechanisms, inheritance, and transitioning from C to C++.',
  },
  {
    courseCode: 'CS360L',
    title: 'Programming in C and C++ Lab',
    creditHours: 1,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'This course is designed to be taken concurrently with the CS360 Programming in C and C++ ' +
      'course to practice and develop programming skills in both C and C++.',
  },
  {
    courseCode: 'CS380',
    title: 'Operating Systems',
    creditHours: 3,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'This course covers the fundamental concepts and implementation techniques of modern ' +
      'operating systems. Topics include processes, threads, concurrency, memory management, ' +
      'file systems, I/O systems, security, and OS virtualization. Popular operating systems ' +
      'will be selected for case studies, including Linux/UNIX, Windows, Android, and VMWare ' +
      'hypervisors. Hands-on exercises and projects are required.',
  },
  {
    courseCode: 'BUS450',
    title: 'Professional and Technical Writing',
    creditHours: 3,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'This course presents students with practical instructions about communicating in ' +
      'different kinds of academic and workplace environments, as well as ' +
      'professional/technical communities. Students will learn how to organize and produce ' +
      'common professional writing work, such as technical reports, white papers, proposals, ' +
      'and theses. The course also covers different forms of effective writing, writing styles, ' +
      'approaches, formats, and citations of referenced materials. Computer Systems Engineering',
  },
  {
    courseCode: 'CS455',
    title: 'Algorithms & Structured Programming',
    creditHours: 3,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'This course introduces students to the design, analysis, and implementation of ' +
      'algorithms to solve engineering problems using an object-oriented programming language. ' +
      'It covers the common algorithms, algorithmic complexity, and data structures used to ' +
      'solve these problems. The course concentrates on the design of algorithms and the ' +
      'analysis of their efficiency.',
  },
  {
    courseCode: 'CS457',
    title: 'Data Modeling and Implementation Techniques',
    creditHours: 3,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'This is the first of a series of courses designed to teach relational database concepts, ' +
      'design, and applications. Topics include database architecture, relational model, ' +
      'structured query language (SQL), data manipulation language (DML), data definition ' +
      'language (DDL), database design, ER modeling, database normalization, denormalization, ' +
      'and physical database design. Popular database systems, such as Oracle and Microsoft SQL ' +
      'servers, are used for hands-on exercises and projects.',
  },
  {
    courseCode: 'CS457L',
    title: 'Database Technologies Lab',
    creditHours: 1,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'This is a drill course designed to be taken concurrently with the CS457 Data Modeling ' +
      'and Implementation Techniques course. The students gain hands-on experience in database ' +
      'applications using popular database systems, including Oracle and Microsoft SQL servers. ' +
      'They are also guided in working on database design projects.',
  },
  {
    courseCode: 'CS480',
    title: 'Java and Internet Applications',
    creditHours: 3,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'This course introduces students to programming in Java, with an emphasis on object- ' +
      'oriented concepts, graphical user interface (GUI) design, and the use of core Java ' +
      'libraries. Students will learn fundamental Java language features, including syntax, ' +
      'classes, inheritance, interfaces, and reflection. Additional topics include graphics ' +
      'programming, event handling, Swing-based UI components, Java applets, exception ' +
      'handling, and working with streams and files.',
  },
  {
    courseCode: 'CS480L',
    title: 'Java Programming Lab',
    creditHours: 1,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'This is a drill course designed to be taken concurrently with the CS480 Java and ' +
      'Internet Applications course. The students gain Java programming skills in this weekly ' +
      'lab course through hands-on exercises that normally correspond with the lecture material ' +
      'offered each week.',
  },
  {
    courseCode: 'CS481',
    title: 'Introduction to Machine Learning and Data Science',
    creditHours: 3,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'Data science is an interdisciplinary field that combines mathematics, statistics, ' +
      'programming languages, and specific domain knowledge. This course describes (1) the ' +
      'process of gaining knowledge and insights from data in both a structured and an ' +
      'unstructured way and (2) scientific methods, processes, algorithms, and systems that can ' +
      'be employed to analyze, design, develop, and implement solutions to challenging novel ' +
      'and existing data science problems.',
  },
  {
    courseCode: 'CS487',
    title: 'Object-Oriented Design and Implementations',
    creditHours: 3,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'This course is designed to use an object-oriented programming language to achieve the ' +
      'goal of teaching the students the design methodology for algorithm development. The ' +
      'objective is to develop the students’ programming ability with proper logical and ' +
      'object-oriented thinking processes, as well as basic design patterns. The course covers ' +
      'two main topics: (1) problem specification and analysis: understand the problem, analyze ' +
      'it, and translate human thinking into a computer program, and (2) object-oriented design ' +
      'and analysis: understand data abstraction, encapsulation, aggregation, and inheritance. ' +
      'These concepts are the foundation for object- oriented programming languages such as ' +
      'Python, Java, C++, and C#. Hands-on practice using Python is required. Corequisite: ' +
      'CS250',
  },
  {
    courseCode: 'CS494',
    title: 'Senior Capstone Project – I',
    creditHours: 3,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'This is the first part of the senior capstone project series. The senior capstone ' +
      'project course is designed to develop the creativity of every senior graduating in ' +
      'computer science through the exercise of the design effort and implementation skills of ' +
      'a self-selected project. The design approach must employ modern design techniques and ' +
      'methodologies in the related fields that were acquired during the course of the program ' +
      'study. Completion of the project entails (1) proper research on relevant topics, (2) ' +
      'formulation of a design problem statement, (3) design specifications, (4) consideration ' +
      'of alternative solutions, (5) a development plan, (6) actual implementation, and (7) ' +
      'submission of a final report. The student must discuss with and follow the guidelines ' +
      'provided by the instructor through the period of research, implementation, testing, ' +
      'report writing, and related procedures.',
  },
  {
    courseCode: 'CE450',
    title: 'Fundamentals of Embedded Engineering',
    creditHours: 3,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'This is the first in a series of embedded systems courses designed for students who are ' +
      'interested in learning real-time embedded systems and practicing real-time programming ' +
      'of embedded systems. Topics include hardware issues such as platform, microprocessors ' +
      'commonly used in these systems and how a microprocessor works in such systems; the ' +
      'concept of memory, registers, I/O; interrupt generation and handling in an embedded ' +
      'system; the concept of real-time programming, multitasking, concurrency, mutual ' +
      'exclusion; overview of real-time kernel/OS, drivers; system initialization and startup, ' +
      'and debug issues. Hands-on exercises are required.',
  },
  {
    courseCode: 'CS453',
    title: 'Compiler Design',
    creditHours: 3,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'This course is designed to give students a fundamental knowledge of compilers and ' +
      'interpreters for modern computer languages. Topics include a study of modern computer ' +
      'languages, regular expressions, lexical analysis, parsing techniques, context-free ' +
      'grammar, and syntax-directed translation. Hands-on exercises and semester projects are ' +
      'required.',
  },
  {
    courseCode: 'CS470',
    title: 'Network Engineering and Management',
    creditHours: 3,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'This course is designed to introduce network communications. Topics include network- ' +
      'layered models (OSI, TCP/IP), architecture, principles, service models and protocols, ' +
      'data communication basics, switching, routing, security, network management, and ' +
      'wireless and mobile networks. Modern Internet technologies and implementations are ' +
      'presented in case studies. Hands-on exercises are required.',
  },
  {
    courseCode: 'CS477',
    title: 'Ethical Hacking and Penetration Testing',
    creditHours: 3,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'An ethical hacker is usually employed by an organization that trusts him or her to ' +
      'attempt to penetrate networks or computer systems, using the same methods as a hacker, ' +
      'for the purpose of finding and fixing computer security vulnerabilities. This course ' +
      'goes into computer hacking techniques in depth. The students leave with the ability to ' +
      'quantitatively assess and measure threats to information assets and discover where the ' +
      'organization is most vulnerable to hacking. This knowledge allows system administrators ' +
      'to deploy proactive countermeasures, stay ahead of information security developments, ' +
      'and exploit vulnerabilities.',
  },
  {
    courseCode: 'CS478',
    title: 'Blockchain Technology and Applications',
    creditHours: 3,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'This course explores the fundamentals and applications of blockchain technology, which ' +
      'is the transparent, secure, immutable, and distributed database used currently as the ' +
      'underlying technology for cryptocurrency. Types of blockchain will be introduced and ' +
      'studied with real-life cases. Through practical cases and research assignments, this ' +
      'course will introduce students to the workings and applications of this potentially ' +
      'disruptive technology and its potential impact on all aspects of the business world and ' +
      'society.',
  },
  {
    courseCode: 'CS483',
    title: 'Fundamentals of Artificial Intelligence',
    creditHours: 3,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'This course covers artificial intelligence (AI) applications in problem-solving, ' +
      'reasoning, planning, natural language understanding, computer vision, autonomous car ' +
      'navigation, machine learning, business intelligence, robot design, and so on. In order ' +
      'to solve AI problems, the major algorithms include machine learning, search, Markov ' +
      'decision processes, constraint satisfaction, graphical models, and logic. The main goal ' +
      'of this course is to equip students with the tools in the Python library to tackle a ' +
      'variety of AI problems in industries.',
  },
  {
    courseCode: 'CS485',
    title: 'JavaScript and Internet Programming',
    creditHours: 3,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'This course is designed to provide students with advanced programming knowledge and ' +
      'skills for application development on the Internet. Students study both client-side and ' +
      'server-side scripting, including HTML, JavaScript, and CSS, to develop interactive and ' +
      'responsive websites. Other topics covered include jQuery, Bootstrap, Node.js Express ' +
      'Framework, RESTful API, MongoDB (NoSQL), and various JavaScript frameworks such as ' +
      'Angular and React. Hands-on exercises are required.',
  },
  {
    courseCode: 'CS455G',
    title: 'Algorithms & Structured Programming',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'This course introduces students to the design, analysis, and implementation of ' +
      'algorithms to solve engineering problems using an object-oriented programming language. ' +
      'It covers the common algorithms, algorithmic complexity, and data structures used to ' +
      'solve these problems. The course concentrates on the design of algorithms and the ' +
      'analysis of their efficiency.',
  },
  {
    courseCode: 'CS457G',
    title: 'Data Modeling and Implementation Techniques',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'This is the first of a series of courses designed to teach relational database concepts, ' +
      'design, and applications. Topics include database architecture, relational models, ' +
      'structured query language (SQL), data manipulation language (DML), data definition ' +
      'language (DDL), database design, ER modeling, database normalization, denormalization, ' +
      'and physical database design. Popular database systems, such as Oracle and Microsoft SQL ' +
      'servers, are used for hands-on exercises and projects.',
  },
  {
    courseCode: 'CS457LG',
    title: 'Database Technologies Lab',
    creditHours: 1,
    level: CourseLevel.GRADUATE,
    description:
      'This drill course is designed to be taken concurrently with the CS457 Data Modeling and ' +
      'Implementation Techniques course. The students gain hands-on experience in database ' +
      'applications using popular database systems, including Oracle and Microsoft SQL servers. ' +
      'They are also guided to work on database design projects.',
  },
  {
    courseCode: 'CS500',
    title: 'Object-Oriented Design in Python',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'This course is designed to use object-oriented programming language to achieve the goal ' +
      'of teaching the students the object-oriented design methodology for software ' +
      'development. The objective is to develop the students’ programming ability with proper ' +
      'logical and object-oriented thinking processes, as well as software design patterns. The ' +
      'course covers three main topics: (1) object-oriented design and analysis: requirement ' +
      'analysis, design process, data abstraction, encapsulation, aggregation, and inheritance; ' +
      '(2) design patterns: reusable solutions to commonly occurring problems such as Abstract ' +
      'Factory, Observer, Command, Decorator, Adaptor, Iterator, and State; and (3) Python ' +
      'language: data types, control structures, functions, parameter passing, library ' +
      'functions, lists, tuples and dictionaries, I/O, modules, functional programming, and ' +
      'advanced python syntax. Hands-on practices are required.',
  },
  {
    courseCode: 'CS500L',
    title: 'Object-Oriented Design in Python Lab',
    creditHours: 1,
    level: CourseLevel.GRADUATE,
    description:
      'This course is designed to be taken concurrently with the CS500 Object-oriented Analysis ' +
      'and Design in Python course to practice object-oriented design and develop programming ' +
      'skills in Python.',
  },
  {
    courseCode: 'CS501',
    title: 'Practical Application of Algorithms',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'This course is designed to expand a student’s knowledge of algorithms by concentrating ' +
      'on the practical application to solve real-world computational problems. Students will ' +
      'be trained in the process of “Algorithmic Thinking,” allowing them to develop a good ' +
      'conceptual understanding and improve their ability to solve challenging problems. ' +
      'Students will learn how to implement abstract algorithmic thoughts in programs, explain ' +
      'them to others, and formulate simpler, more efficient solutions to real-life problems ' +
      'faced during an interview or in the workplace.',
  },
  {
    courseCode: 'CS535',
    title: 'Network Security Fundamentals',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'This course deals with security issues on the Internet and the web. Major topics include ' +
      'issues related to Internet infrastructure and applications running on the Internet, ' +
      'techniques to reduce security risks, and an introduction to the role of security as an ' +
      'enabling technology for electronic commerce. The course includes an overview of Internet ' +
      'and web security, its applications and legal issues, encryption and cryptography, SSL ' +
      'and browsers, web servers, and Java security.',
  },
  {
    courseCode: 'CS571',
    title: 'Cloud Computing Infrastructure',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'This course provides a comprehensive introduction to cloud computing infrastructure, ' +
      'covering key concepts such as cloud frameworks, design patterns, virtualization, and ' +
      'cloud-based applications. It then explores modern container technologies, with a focus ' +
      'on Docker and its role in application deployment. Building on this foundation, the ' +
      'course delves into Kubernetes, a leading open-source container orchestration platform ' +
      'that has transformed how applications are built, deployed, and managed in the cloud. ' +
      'Students will examine how Kubernetes supports scalable, resilient application ' +
      'development and why it has become a critical tool in cloud-native computing.',
  },
  {
    courseCode: 'CS581',
    title: 'Cloud Security',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'This course covers the basics of cloud infrastructure technologies such as computers, ' +
      'storage, containers, serverless, IAM, asset management, and more. Challenges of ' +
      'scalability and security in multi-cloud and hybrid-cloud environments are examined. ' +
      'Students will learn how various cybersecurity principles apply to cloud technology, such ' +
      'as Least Privilege, Defense in Depth, Attack Vector, Trust Boundaries, and Shared ' +
      'Responsibility Model, among others.',
  },
  {
    courseCode: 'CS589',
    title: 'Special Topics',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'Special topics courses are offered to graduate students in the Computer Science program ' +
      'by current faculty members or invited guest speakers to expose the students to emerging ' +
      'technologies related to their studies. These courses are conducted the same way as ' +
      'regular courses.',
  },
  {
    courseCode: 'CS477G',
    title: 'Ethical Hacking and Penetration Testing',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'An ethical hacker is usually employed by an organization that trusts him or her to ' +
      'attempt to penetrate networks or computer systems, using the same methods as a hacker, ' +
      'for the purpose of finding and fixing computer security vulnerabilities. This course ' +
      'goes into computer hacking techniques in depth. The students leave with the ability to ' +
      'quantitatively assess and measure threats to information assets and discover where the ' +
      'organization is most vulnerable to hacking. This knowledge allows system administrators ' +
      'to deploy proactive countermeasures, stay ahead of information security developments, ' +
      'and exploit vulnerabilities.',
  },
  {
    courseCode: 'CS550',
    title: 'Machine Learning and Business Intelligence',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'This course introduces methods and techniques for using stored business data to make ' +
      'business decisions. The student will learn data types, including operational or ' +
      'transactional data, such as data for sales, cost, and inventory; nonoperational data, ' +
      'such as forecast data and macroeconomic data; and metadata, as well as learn their ' +
      'patterns, associations, or relationships, and how to use this information for decision- ' +
      'making. Modern data warehouse concepts will also be introduced. Specific examples of ' +
      'businesses using data mining techniques will be given in the course. The student is ' +
      'required to work on course projects by using modern data analysis software and referring ' +
      'to cases studied.',
  },
  {
    courseCode: 'CS570',
    title: 'Big Data Processing & Analytics',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'This course aims to provide students with an understanding of the operating principles ' +
      'and hands- on experience with mainstream big data computing systems such as MapReduce, ' +
      'Hadoop, and, most recently, Apache Spark, a fast, in-memory distributed collections ' +
      'framework written in Scala. Applying these techniques to big data processing and ' +
      'analytic problems, such as PageRank, machining learning, and social network graph ' +
      'mining, will be discussed.',
  },
  {
    courseCode: 'CS481G',
    title: 'Introduction to Machine Learning and Data Science',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'Data science is an interdisciplinary field that combines mathematics, statistics, ' +
      'programming languages, and specific domain knowledge. This course describes (1) the ' +
      'process of gaining knowledge and insights from data in both a structured and an ' +
      'unstructured way and (2) scientific methods, processes, algorithms, and systems that can ' +
      'be employed to design, develop, and implement solutions to challenging novel and ' +
      'existing data science problems.',
  },
  {
    courseCode: 'CS515',
    title: 'UNIX/Linux Network Programming',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'This course is designed for graduate students to gain hands-on experience in UNIX/Linux ' +
      'network programming. The students will learn to develop UNIX/Linux network applications ' +
      'using a number of UNIX/Linux network programming interface techniques including Sockets, ' +
      'XTI, and RPC. Topics include an overview of transport layer (TCP/UDP), TCP sockets, UDP ' +
      'sockets, threads, and client- server design, XTI, RPC, and Streams. Hands-on exercises ' +
      'and projects are required.',
  },
  {
    courseCode: 'CS565',
    title: 'Advanced Network Management',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'This course is designed to give graduate students an in-depth understanding of and ' +
      'hands-on experience in the management of network systems and applications. Emphases are ' +
      'on simple network management protocol (SNMP) management, MIB, management tools, systems, ' +
      'and applications. Current widely used industry applications will be used to demonstrate ' +
      'management concepts. Computer-based training software will be used to check/verify the ' +
      'students’ network management skills in order to ensure they are prepared for the ' +
      'industry challenges. Topics include Network Management fundamentals; OSIMAN, SNMP, and ' +
      'TMN standards; RMON and ITU TMN architecture; inside structure and practical ' +
      'applications of SNMP, SNMP2, SNMP3, RMON, RMON2, and MIBs. Hands-on exercises are ' +
      'required.',
  },
  {
    courseCode: 'CS575',
    title: 'Network Analysis and Testing',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'This course covers computer network analysis, testing techniques, and experience-based ' +
      'strategies to isolate and solve network problems. Topics include wiring and cable ' +
      'testing issues, transmission encoding techniques, dissecting the IEEE 48-bit MAC ' +
      'address, the impact of different types of broadcast traffic, operational details and ' +
      'analysis considerations for switches, Ethernet and Token Ring operational details and ' +
      'analysis, the IEEE 802.2 LLC protocol, datagrams and routing, IP specifics, protocol ' +
      'analysis and troubleshooting, baselining throughput, and latency. Hands-on exercises ' +
      'using a protocol analyzer are required to reinforce the topics.',
  },
  {
    courseCode: 'CS595',
    title: 'Computer Science Capstone Course',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'Under the guidance of the course instructor, the capstone course is intended to ' +
      'integrate the knowledge and hands-on experience that the student has acquired from the ' +
      'foundation, core, and elective coursework required for the program in the course. The ' +
      'instructor determines the course objectives and scope based on the computer science ' +
      'curriculum and technology trend and guides the students to develop their integration ' +
      'ability. The student shall take the capstone course near the end of their program of ' +
      'study.',
  },
  {
    courseCode: 'CE450G',
    title: 'Fundamentals of Embedded Engineering',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'This is the first in a series of embedded systems courses designed for students who are ' +
      'interested in learning real-time embedded systems and practicing real-time programming ' +
      'of embedded systems. Topics include hardware issues such as platform, microprocessors ' +
      'commonly used in these systems and how a microprocessor works in such systems; the ' +
      'concept of memory, registers, I/O; interrupt generation and handling in an embedded ' +
      'system; the concept of real-time programming, multitasking, concurrency, mutual ' +
      'exclusion; overview of real-time kernel/OS, drivers; system initialization and startup, ' +
      'and debug issues. Hands-on exercises are required.',
  },
  {
    courseCode: 'CE450LG',
    title: 'Embedded Engineering Lab',
    creditHours: 1,
    level: CourseLevel.GRADUATE,
    description:
      'This is a drill course designed to be taken concurrently with the CE450G Fundamentals of ' +
      'Embedded Engineering course. The students gain hands-on experience with embedded systems ' +
      'programming and design. They are also guided to work on projects involving control ' +
      'systems.',
  },
  {
    courseCode: 'EE461G',
    title: 'Digital Design and HDL',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'This course develops the student’s ability to design commonly used basic building blocks ' +
      'of modern digital systems and provides them with a fundamental knowledge of state-of- ' +
      'the-art design methodology, design considerations, and verification strategies for ' +
      'complicated digital hardware design. Topics include Verilog HDL basics, logic modeling, ' +
      'state machine design, and memory modeling using Verilog HDL. Additional topics on FPGA ' +
      'architecture, device vendors, FPGA design tools, FPGA applications, and the latest ' +
      'trends in the programmable logic industry are also covered. Students can use Verilog ' +
      'tools such as Synopsys VCS, Mentor Modelsim, Cadence NC Verilog, and Silo III Verilog ' +
      'Simulator from SimuCAD for their homework and design projects. Hands-on practice is ' +
      'required. Students are encouraged to take the HDL-based sequence of courses EE461 and ' +
      'EE512 to gain knowledge and experience in semicustom IC design using industry-grade EDA ' +
      'design tools.',
  },
  {
    courseCode: 'EE461LG',
    title: 'Digital Design and HDL Lab',
    creditHours: 1,
    level: CourseLevel.GRADUATE,
    description:
      'This is a drill course designed to be taken concurrently with the EE461G Digital Design ' +
      'and HDL course. The students gain hands-on experience with Verilog simulation tools to ' +
      'learn logic design. They will have the chance to work on several design projects. They ' +
      'will also learn the essentials of several popular scripting languages: Perl, Python, and ' +
      'Unix/Linux Shell.',
  },
  {
    courseCode: 'EE488G',
    title: 'Computer Architecture',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'This course introduces the organization, design, and applications of modern computer ' +
      'architecture from both the hardware and software perspectives. Topics include ' +
      'performance benchmarks, instruction sets (for both RISC and CISC), computer arithmetic, ' +
      'memory, parallelism (instruction, data, and thread levels), I/O and storage, multicore ' +
      'processors and programming, and GPU (graphics processing unit). Hands-on labs involving ' +
      'HDL and SPIM simulations, assemblers, linkers, and multithread programming are required ' +
      'to enhance classroom learning.',
  },
  {
    courseCode: 'EE517',
    title: 'Introduction to the Internet of Things (IoT)',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'The Internet of Things (IoT) promises to make “things,” including consumer electronic ' +
      'devices or home appliances, such as refrigerators, security cameras, and temperature ' +
      'sensors, part of the Internet environment. To realize the full potential of the IoT ' +
      'paradigm, this introductory course will address challenges and the various solutions ' +
      'available. The course content will cover IoT concepts and architecture, IoT enablers and ' +
      'solutions, IoT data and knowledge management, and IoT security and reliability. The ' +
      'students will need to complete a term project to demonstrate the concept of IoT for a ' +
      'chosen application based on an embedded system or a development platform.',
  },
  {
    courseCode: 'CE521',
    title: 'Real-Time Systems and Programming',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'This is the second in the embedded systems series designed for students who are ' +
      'interested in learning real-time embedded systems and practicing real-time programming ' +
      'of embedded systems. By examining an off-the-shelf real-time operating system, students ' +
      'will gain hands-on experience in real-time operating system programming and ' +
      'implementations. Specific topics include a review of embedded system design, the concept ' +
      'of real-time systems, real-time specification and design techniques, real-time kernels, ' +
      'system performance analysis, memory management, task management, time management, ' +
      'synchronization of inter-task communication, queuing models, real-time operating system ' +
      'tools for embedded systems, and real-time programming examples. Hands-on exercises are ' +
      'required.',
  },
  {
    courseCode: 'CE522',
    title: 'Embedded Design in Networking Environment',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'This course is designed for the students to learn protocol stack implementation/porting ' +
      'in a real- time operating system (RTOS) kernel environment. Students learn the concept ' +
      'of network protocol stack implementation/porting, embedded real-time system software ' +
      'architecture, and real-time operating systems. They also learn to design and write ' +
      'programs as a collection of independent and concurrent tasks, non-preemptive and ' +
      'preemptive multitasking, task scheduling, and task synchronization and intertask ' +
      'communication, including semaphores and message queues. Industry-standard RTOS will be ' +
      'used for practice and projects.',
  },
  {
    courseCode: 'CE523',
    title: 'Embedded Design in Device Driver Environment',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'This course investigates the operating system (Windows NT, Linux, or Unix) components ' +
      'that interact with device drivers, the device driver building and debugging process, ' +
      'device driver architecture, functionality, and the relevant kernel APIs. Topics include ' +
      'operating system architecture; I/O API; operating system kernel; building, loading, and ' +
      'debugging device drivers; device driver entry points; device driver data structures; I/O ' +
      'request processing; plug, play and power management; interrupt-timers; memory ' +
      'management; direct memory access; and timing. The goal of the course is to present ' +
      'comprehensive coverage of the operating system kernel, HAL, device drivers, and the ' +
      'related APIs. On completion of the course, the student should be able to develop, build, ' +
      'install, and test basic device drivers, as well as to port existing drivers from one ' +
      'operating system to another. Hands-on practice is required.',
  },
  {
    courseCode: 'CE530',
    title: 'Embedded Software Design in Linux',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'This course prepares students to enter the challenging world of embedded Linux. It ' +
      'covers the following key topics: comparing Linux and traditional embedded environments, ' +
      'comparing leading embedded Linux processors, understanding the details of the Linux ' +
      'kernel initialization process, learning the basic concepts about Linux drivers, learning ' +
      'about the special role of bootloaders in embedded Linux systems with specific emphasis ' +
      'on U-Boot, using embedded Linux file systems, understanding the Memory Technology ' +
      'Devices subsystem for flash (and other) memory devices, mastering debugging tools such ' +
      'as gdb, KGDB, learning many tips and techniques for debugging within the Linux kernel, ' +
      'learning how to maximize productivity in cross-development environments, learning to ' +
      'prepare an entire development environment (including TFTP, DHCP, and NFS target ' +
      'servers), and learning to configure, build, and initialize BusyBox to support a set of ' +
      'unique requirements. Hands-on exercises are required.',
  },
  {
    courseCode: 'EE504',
    title: 'Advanced Computer Architecture',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'This course is designed to further investigate modern computer design introduced in ' +
      'course EE488G. Topics include an in-depth study of multiprocessor architecture and ' +
      'interconnection networks, pipelines, data flow, algorithm structures, memory system ' +
      'design, cache memory design, and a comparison of the performance and design among ' +
      'various computer architectures. Hands-on project experience is required.',
  },
  {
    courseCode: 'EE553',
    title: 'System on Chip (SoC) Design',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'System on Chip (SoC) is composed of many functional modules such as processor, memory, ' +
      'digital IPs, analog/mixed-signal modules, RF, and interfaces on a single chip. This ' +
      'course will focus on ARM-based on-chip bus platforms, digital IP verification, and the ' +
      'trend and integration of SoC.',
  },
  {
    courseCode: 'EE505',
    title: 'Advanced Digital IC Design',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'This advanced course in digital circuit design applies the knowledge of advanced circuit ' +
      'design concepts to digital IC in state-of-the-art CMOS technologies. It emphasizes the ' +
      'design and optimization of circuits/layouts for combinational logic gates, sequential ' +
      'logic circuits, arithmetic building blocks, and memory circuits. The challenges of ' +
      'today’s digital integrated circuit design, such as scaling, process variation, signal ' +
      'integrity, timing issues, interconnectivity, and power consumption, will be addressed ' +
      'specially. The circuit simulation tool (HSPICE), layout design tool (Virtuoso), and ' +
      'schematic entry tool (Composer) are used for homework assignments and projects.',
  },
  {
    courseCode: 'EE511',
    title: 'Advanced Analog IC Design',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'This course offers students extensive exposure to concepts and techniques in the ' +
      'analysis and design of analog IC, including device modeling, basic circuit building ' +
      'blocks, feedback system, frequency response, and noise. EDA tools may be used in ' +
      'homework assignments and projects.',
  },
  {
    courseCode: 'EE520',
    title: 'Advanced FPGA Design and Implementations',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'Digital design using FPGAs is a particularly important activity in industries due to ' +
      'reduced costs, compared with ASIC design, and faster time-to-market. To design a digital ' +
      'system using FPGA, the designers must understand the architecture of the FPGA as well as ' +
      'the accompanying CAD tools. The course will cover two major Xilinx FPGA architectures in ' +
      'detail. The student will learn to build various digital blocks such as combinational ' +
      'logic, sequential logic, finite state machines, RAM, and DSP by studying the ' +
      'architectures of the FPGAs. Hands-on exercises are required.',
  },
  {
    courseCode: 'EE577',
    title: 'Design Verification with System Verilog',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'This course is designed to cover the design verification methodologies commonly used in ' +
      'system- on-chip (SoC) design. Topics include design verification basics, introduction of ' +
      'various verification strategies, verification of soft and hard IP blocks, verification ' +
      'for networking/communication ASIC, verification for audio/video signal processing ASIC, ' +
      'how to build an efficient and effective verification platform, automation of ' +
      'verification flow, test case coverage, how to create design models using PLI routine, ' +
      'formal verification, and more. The students will also be informed that design ' +
      'verification is becoming the bottleneck in modern ASIC design cycles, especially in ' +
      'system- on-chip (SoC) design. The verification cycle could consume 70% of the design ' +
      'cycle.',
  },
  {
    courseCode: 'EE595',
    title: 'Electrical Engineering Capstone Course',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'Under the guidance of the course instructor, the capstone course is intended to ' +
      'integrate the knowledge and hands-on experience that the student has acquired from the ' +
      'foundation, core, and elective coursework required for the program. The instructor ' +
      'determines the course objectives and scope based on the electrical engineering ' +
      'curriculum and technology trend and guides the students to develop their integration ' +
      'ability. The student shall take the capstone course near the end of their program of ' +
      'study.',
  },
  {
    courseCode: 'CS521',
    title: 'Software Project Management',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'This course teaches students to apply current software development approaches to ' +
      'managing complex modern software projects. Practical strategies, tactics, and designs ' +
      'are discussed together with realistic exercises. Topics include software development ' +
      'process, project planning, requirements definition, design specification, usability ' +
      'engineering, verification and validation, project and change management, and process ' +
      'quality improvement. Students are required to participate in all course activities to ' +
      'develop a real-world software product.',
  },
  {
    courseCode: 'CS522',
    title: 'Software Quality Assurance and Test Automation',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'This course teaches students to learn practical static and dynamic techniques that allow ' +
      'software development teams to engineer high-quality products. The course begins with an ' +
      'overview of modern software development approaches. It then introduces quality ' +
      'management and test development based on preventive and agile principles as well as ' +
      'quality risk analysis. It covers system, integration, performance, and automated testing ' +
      'techniques. Quality improvement models for software development and testing are ' +
      'discussed. Several test automation tools are demonstrated in class. Students gain hands- ' +
      'on experience through assignments and exercises and learn to evaluate real-world ' +
      'applications.',
  },
  {
    courseCode: 'CS548',
    title: 'Web Services Techniques and REST Technologies',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'This course covers the fundamental concepts of the 3-tier model commonly used in ' +
      'Enterprise Application development. Topics include the Spring Framework, JDBC with ' +
      'database applications, JPA (Java Persistence API), Hibernate, Spring MVC, Java Servlets, ' +
      'and JavaBeans. In addition, the students will learn the best-practice development ' +
      'approach using the Sprint Framework with JDBC or ORM (Object Relational Mapping) tools ' +
      'to map business domain object models to the underlying relational database. At the end ' +
      'of this course, the students shall have a fresh view of both the fundamental and ' +
      'advanced skills needed to implement large-scale enterprise systems. Hands-on exercises ' +
      'are an integral part of the course.',
  },
  {
    courseCode: 'CS551',
    title: 'Mobile Computing for Android Mobile Devices',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'Google’s Android mobile phone software platform may be the next major opportunity for ' +
      'application software developers. Android has the potential to remove the barriers to ' +
      'successful development and sales of a new generation of mobile phone application ' +
      'software. Just as PCs have created the markets for desktop and server software, Android ' +
      'will create a new market for mobile applications by providing a standard mobile phone ' +
      'application environment. This hands-on course focuses on developing applications for ' +
      'Android, including map-based applications, camera-based applications, SMS, and the like. ' +
      'Advanced development topics are also covered, including security, IPC, and certain ' +
      'advanced graphics and user interface techniques.',
  },
  {
    courseCode: 'CS556',
    title: 'Mobile Applications on iPhone Platform',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'This course provides an in-depth study of the design, development, and publication of ' +
      'object- oriented applications for the iPhone platform using Apple SDK. Students will ' +
      'learn to utilize Xcode, SwiftUI, and UIKit to create iOS apps for iPhones.',
  },
  {
    courseCode: 'APP101',
    title: 'How to Tell Your Story',
    creditHours: 3,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'SFBU Agility Praxis Pathway general-education course, Area A: English Language ' +
      'Communication and Critical Thinking.',
  },
  {
    courseCode: 'APP102',
    title: 'How to Design Your Life',
    creditHours: 3,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'SFBU Agility Praxis Pathway general-education course, Area C: Arts and Humanities.',
  },
  {
    courseCode: 'APP103',
    title: 'How to Communicate in a Global Context',
    creditHours: 3,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'SFBU Agility Praxis Pathway general-education course, Area A: English Language ' +
      'Communication and Critical Thinking.',
  },
  {
    courseCode: 'APP104',
    title: 'How to Lead',
    creditHours: 3,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'SFBU Agility Praxis Pathway general-education course, Area D: Social Sciences.',
  },
  {
    courseCode: 'APP201',
    title: 'How to Use Math in Real Life',
    creditHours: 3,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'SFBU Agility Praxis Pathway general-education course, Area B: Mathematics and Natural ' +
      'Sciences.',
  },
  {
    courseCode: 'APP202',
    title: 'How Your Brain Works',
    creditHours: 3,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'SFBU Agility Praxis Pathway general-education course, Area B: Mathematics and Natural ' +
      'Sciences.',
  },
  {
    courseCode: 'APP203',
    title:
      'How to "Be Creative" in Partnership with Computation and Machine Learning',
    creditHours: 3,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'SFBU Agility Praxis Pathway general-education course, Area C: Arts and Humanities.',
  },
  {
    courseCode: 'APP204',
    title: 'How to Use Data Science and Game Thinking for Social Impact',
    creditHours: 3,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'SFBU Agility Praxis Pathway general-education course, Area D: Social Sciences.',
  },
  {
    courseCode: 'APP301',
    title:
      'How Can We Thrive? Scientific Inquiry & The Future of Sustainability',
    creditHours: 3,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'SFBU Agility Praxis Pathway general-education course, Area B: Mathematics and Natural ' +
      'Sciences.',
  },
  {
    courseCode: 'APP302',
    title: 'How to Design Social Innovation/Impact Solutions to Thrive',
    creditHours: 3,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'SFBU Agility Praxis Pathway general-education course, Area D: Social Sciences.',
  },

  // ── Added from the Fall 2026 registration list ──
  {
    courseCode: 'ACC110',
    title: 'Financial Accounting',
    creditHours: 3,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'Business course offered in Fall 2026. Transcribed from the SFBU Fall 2026 registration ' +
      'list; the 2025-2026 catalog carries no description for this course code.',
  },
  {
    courseCode: 'AI501',
    title: 'Management and Leadership in AI',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'Business course offered in Fall 2026. Transcribed from the SFBU Fall 2026 registration ' +
      'list; the 2025-2026 catalog carries no description for this course code.',
  },
  {
    courseCode: 'AI510',
    title: 'Data Science and AI',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'Business course offered in Fall 2026. Transcribed from the SFBU Fall 2026 registration ' +
      'list; the 2025-2026 catalog carries no description for this course code.',
  },
  {
    courseCode: 'AI511',
    title: 'Multiagent Development in AI',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'Business course offered in Fall 2026. Transcribed from the SFBU Fall 2026 registration ' +
      'list; the 2025-2026 catalog carries no description for this course code.',
  },
  {
    courseCode: 'AI520',
    title: 'Building an AI Business: From Idea to VC Funded Startup Launch',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'Business course offered in Fall 2026. Transcribed from the SFBU Fall 2026 registration ' +
      'list; the 2025-2026 catalog carries no description for this course code.',
  },
  {
    courseCode: 'BAN463',
    title: 'Data Visualization',
    creditHours: 3,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'Students will learn how to explore data and provide insight to others using data ' +
      'visualization techniques. After completing this course, students will be able to ' +
      'design, develop, analyze, and interpret various types of visualizations. They will ' +
      'also be able to develop compelling presentations and insightful stories based on a ' +
      'given case study. The approach used will include theory as well as a hands-on ' +
      'component.',
  },
  {
    courseCode: 'BAN472',
    title: 'Introduction to Artificial Intelligence (AI)',
    creditHours: 3,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'This course provides a comprehensive introduction to artificial intelligence (AI), ' +
      'covering its history, fundamental concepts, applications, risks, and mitigation ' +
      'strategies. It offers insights into AI components and technologies, development ' +
      'processes, and ethical considerations, preparing students to understand the evolving ' +
      'world of AI. Note: This course is not open to students enrolled in the School of ' +
      'Engineering without prior written approval from the Engineering Department Chair. ' +
      'Engineering students are encouraged to take CS483/CS483L Fundamentals of Artificial ' +
      'Intelligence. Business Law (3 credit hours required) BLAW310 Introduction to Business ' +
      'Law (3 credit hours; required) This course is designed as an introductory-level course ' +
      'in U.S. business law. The focus will be on preparing students to spot potential legal ' +
      'issues in the operation of businesses so they can operate legally and know when to ' +
      'consult an attorney before taking action. The course begins with an overview of the ' +
      'fundamental structures and processes of the U.S. legal system. Topics include sources ' +
      'of law and ethics, contracts, torts, agency, criminal law, business organizations, and ' +
      'judicial and administrative processes. Emphasis is placed on fundamental legal ' +
      'principles pertaining to business transactions. Business (3 credit hours required) ' +
      'BUS387 Independent Research Project (variable 1-3 credit hours) This course offers ' +
      'students a unique opportunity to engage in one-on-one mentorship with a faculty mentor ' +
      'to conduct in-depth research on a topic of their choice within the field of business. ' +
      'This course fosters independent research skills, critical thinking, and academic ' +
      'writing proficiency. The culmination of the course is a publication-quality research ' +
      'paper suitable for submission to a peer-reviewed academic journal. BUS450 Professional ' +
      'and Technical Writing (3 credit hours; required) This course presents students with ' +
      'practical instructions about communicating in different kinds of academic and ' +
      'workplace environments, as well as professional/technical communities. Students will ' +
      'learn how to organize and produce common professional writing work, such as technical ' +
      'reports, white papers, proposals, theses, and resumes. The course also covers ' +
      'different forms of effective writing, writing styles, approaches, formats, and ' +
      'citations of referenced materials.',
  },
  {
    courseCode: 'BAN501',
    title: 'Quantitative Methods for Business',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'Business course offered in Fall 2026. Transcribed from the SFBU Fall 2026 registration ' +
      'list; the 2025-2026 catalog carries no description for this course code.',
  },
  {
    courseCode: 'BLAW310',
    title: 'Introduction to Business Law',
    creditHours: 3,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'Business course offered in Fall 2026. Transcribed from the SFBU Fall 2026 registration ' +
      'list; the 2025-2026 catalog carries no description for this course code.',
  },
  {
    courseCode: 'BUS493',
    title: 'Senior Project',
    creditHours: 3,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'This instructor-driven course implements a senior project as a culminating ' +
      'undergraduate experience in a student’s professional area of interest, wherein ' +
      'students successfully demonstrate mastery of specialized knowledge and effectively ' +
      'communicate their results in writing and in oral presentations. Projects may later be ' +
      'used to showcase a student’s skills to potential industry employers or as material to ' +
      'support graduate-level studies.',
  },
  {
    courseCode: 'BUS587',
    title: 'Individual Research Project',
    creditHours: 1,
    level: CourseLevel.GRADUATE,
    description:
      'Business course offered in Fall 2026. Transcribed from the SFBU Fall 2026 registration ' +
      'list; the 2025-2026 catalog carries no description for this course code. Variable ' +
      'credit (1, 2, 3 credit hours); seeded at the minimum so planned credit totals are ' +
      'never overstated.',
  },
  {
    courseCode: 'BUS595',
    title: 'Business Capstone Course',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'Business course offered in Fall 2026. Transcribed from the SFBU Fall 2026 registration ' +
      'list; the 2025-2026 catalog carries no description for this course code.',
  },
  {
    courseCode: 'CS483L',
    title: 'Artificial Intelligence & Machine Learning Lab',
    creditHours: 1,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'Students will learn Python programming in the Google Colab platform with numpy, ' +
      'pandas, matplotlib, scikit-learn, seaborn, tensorflow models, and Keras API to ' +
      'implement algorithms covered in the lecture from different raw dataset sources. And ' +
      'they will have the chance to build systems for several hands-on design projects. In a ' +
      'two-hour lab session, students will become familiar with algorithm functions in the ' +
      'aforementioned libraries to implement different data processes in machine learning, ' +
      'search, Markov decision processes, constraint satisfaction, graphical models, and ' +
      'logic and to optimize design systems by plotting data process curves and error ' +
      'analysis in the model.',
  },
  {
    courseCode: 'CS547',
    title: 'Advanced Database Design and Analysis',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'This course is intended for graduate students to further explore database server ' +
      'development and database tuning. The course specifically details procedural extensions ' +
      'to SQL to develop stored procedures, functions, packages, and database triggers. In ' +
      'addition, it covers database performance tuning from an application development point ' +
      'of view by exploring query optimizers, database hints, and various database access ' +
      'methods. Hands-on exercises are required.',
  },
  {
    courseCode: 'CS582',
    title: 'Agentic AI',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'Computer Science course offered in Fall 2026. Transcribed from the SFBU Fall 2026 ' +
      'registration list; the 2025-2026 catalog carries no description for this course code.',
  },
  {
    courseCode: 'CS583',
    title: 'Enterprise AI',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'Computer Science course offered in Fall 2026. Transcribed from the SFBU Fall 2026 ' +
      'registration list; the 2025-2026 catalog carries no description for this course code.',
  },
  {
    courseCode: 'CS587',
    title: 'Individual Research Project',
    creditHours: 1,
    level: CourseLevel.GRADUATE,
    description:
      'Computer Science course offered in Fall 2026. Transcribed from the SFBU Fall 2026 ' +
      'registration list; the 2025-2026 catalog carries no description for this course code. ' +
      'Variable credit (1, 2, 3 credit hours); seeded at the minimum so planned credit totals ' +
      'are never overstated.',
  },
  {
    courseCode: 'DS500',
    title: 'Mathematics and Statistics for Data Science',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'This course is designed to provide students with a solid foundation in the fundamental ' +
      'mathematical and statistical concepts essential for success in the field of data ' +
      'science. It aims to equip students with the necessary quantitative skills to analyze ' +
      'and interpret data, make informed decisions, and derive meaningful insights from ' +
      'complex datasets.',
  },
  {
    courseCode: 'DS520',
    title: 'Deep Learning',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'This course is designed to provide students with a solid understanding of the core ' +
      'concepts, techniques, and applications of deep learning (DL). Deep learning, a subset ' +
      'of machine learning, has revolutionized the field of artificial intelligence and has ' +
      'become an impetus behind advancements in various domains, including computer vision, ' +
      'natural language processing, and speech recognition. Students will learn the concepts ' +
      'of neural networks (CNNs & RNNs), the development of generative models, and ' +
      'applications of DL in artificial intelligence.',
  },
  {
    courseCode: 'ECON201',
    title: 'Principles of Macroeconomics',
    creditHours: 3,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'Business course offered in Fall 2026. Transcribed from the SFBU Fall 2026 registration ' +
      'list; the 2025-2026 catalog carries no description for this course code.',
  },
  {
    courseCode: 'EE461',
    title: 'Digital Design and HDL',
    creditHours: 3,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'Electrical Engineering course offered in Fall 2026. Transcribed from the SFBU Fall ' +
      '2026 registration list; the 2025-2026 catalog carries no description for this course ' +
      'code.',
  },
  {
    courseCode: 'EE461L',
    title: 'Verilog HDL Lab',
    creditHours: 1,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'Electrical Engineering course offered in Fall 2026. Transcribed from the SFBU Fall ' +
      '2026 registration list; the 2025-2026 catalog carries no description for this course ' +
      'code.',
  },
  {
    courseCode: 'EE488',
    title: 'Computer Architecture',
    creditHours: 3,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'Electrical Engineering course offered in Fall 2026. Transcribed from the SFBU Fall ' +
      '2026 registration list; the 2025-2026 catalog carries no description for this course ' +
      'code.',
  },
  {
    courseCode: 'FIN310',
    title: 'Fundamentals of Finance',
    creditHours: 3,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'Business course offered in Fall 2026. Transcribed from the SFBU Fall 2026 registration ' +
      'list; the 2025-2026 catalog carries no description for this course code.',
  },
  {
    courseCode: 'FIN501',
    title: 'Financial Management',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'Business course offered in Fall 2026. Transcribed from the SFBU Fall 2026 registration ' +
      'list; the 2025-2026 catalog carries no description for this course code.',
  },
  {
    courseCode: 'FIN522',
    title: 'International Trade and Investment',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'This course covers the theories of international trade through comparative advantage ' +
      'and related corporate strategies, the impacts of emerging regional economic blocks, ' +
      'the institutions of the multilateral trading system, and trade barriers. Students will ' +
      'learn the mechanics of international payment, shipping, and distribution.',
  },
  {
    courseCode: 'FIN568',
    title: 'Corporate Finance',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'This course is in the accounting/finance area of interest. The first part of the ' +
      'course uses lectures, discussions, and case studies to cover essential corporate ' +
      'finance subjects, including executive compensation, corporate governance, and ' +
      'bankruptcy law. The second part of the course consists of discussions of corporate ' +
      'financing, such as mergers, acquisitions, and valuations; corporate restructuring; ' +
      'LBOs; MBOs; and merchant banking.',
  },
  {
    courseCode: 'FIN585',
    title: 'International Finance',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'This course prepares the students for a career in international finance by discussing ' +
      'the financial environment in which a multinational firm and its managers must ' +
      'function. It focuses on foreign exchange management and financial management in a ' +
      'multinational firm. It points out to the students the basic principles of profit- ' +
      'seeking and risk-avoidance practices in the volatile global financial markets.',
  },
  {
    courseCode: 'HRM531',
    title: 'Human Resource Management',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'This course provides students and practicing managers with a comprehensive overview of ' +
      'essential personnel management concepts and techniques. The focus is on essential ' +
      'topics such as job analysis, candidate screening, interviewing, testing, hiring, ' +
      'evaluating, training, motivating, promoting, and compensating and their associated ' +
      'legal constraints. Additional topics covered include global HR, diversity awareness ' +
      'and training, and sexual harassment legal requirements. Practical applications such as ' +
      'how to appraise performance and benefits and handle grievances are explored. ' +
      'Additionally, developing independent work teams that foster creativity and innovation ' +
      'will be discussed.',
  },
  {
    courseCode: 'MGT310',
    title: 'Principles of Management',
    creditHours: 3,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'Business course offered in Fall 2026. Transcribed from the SFBU Fall 2026 registration ' +
      'list; the 2025-2026 catalog carries no description for this course code.',
  },
  {
    courseCode: 'MGT451',
    title: 'Project Management',
    creditHours: 3,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'Business course offered in Fall 2026. Transcribed from the SFBU Fall 2026 registration ' +
      'list; the 2025-2026 catalog carries no description for this course code.',
  },
  {
    courseCode: 'MGT460',
    title: 'Production and Operations Management',
    creditHours: 3,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'This course balances the theory and practice of production and operations management, ' +
      'covering quantitative, qualitative, and behavioral aspects. Students will learn how to ' +
      'identify and apply strategies, business process design principles, and quantitative ' +
      'techniques. This knowledge will then be applied to optimize business operations, ' +
      'enhance efficiency, and improve competitiveness. Students will develop quantitative ' +
      'models and use software tools such as Microsoft Excel Analysis Tool Pak and Solver to ' +
      'create solutions for multivariate operational constraints. Typical control cases ' +
      'include service and product design choices, sales forecasting, scheduling, metrics for ' +
      'production/inventory control, statistical quality control, and logistical constraints. ' +
      'MGT480 Entrepreneurship (3 credit hours; required) This course explores the full range ' +
      'of entrepreneurial processes, including the evaluation, development, and creation of a ' +
      'successful business. It will help potential entrepreneurs and professionals visualize ' +
      'and experience entrepreneurial development. The course explores the entrepreneurial ' +
      'approach to resources, such as developing an organizational structure, market ' +
      'analysis, financing entrepreneurial ventures, and screening venture opportunities. ' +
      'Individuals will experiment and evaluate what it takes to be an entrepreneur, ' +
      'including developing a plan for a new business.',
  },
  {
    courseCode: 'MGT480',
    title: 'Entrepreneurship',
    creditHours: 3,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'Business course offered in Fall 2026. Transcribed from the SFBU Fall 2026 registration ' +
      'list; the 2025-2026 catalog carries no description for this course code.',
  },
  {
    courseCode: 'MGT500',
    title: 'Risk Management',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'This course is designed to teach the students risk management concepts, processes, and ' +
      'strategy making and implementation in a corporate environment. Topics covered include ' +
      'the nature and concept of risks, risk management structure and process flow, ' +
      'information and gathering techniques, data analysis methodology and tools, and risk ' +
      'management techniques. Case studies and a project are required.',
  },
  {
    courseCode: 'MGT510',
    title: 'Strategic Management and Leadership',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'Business course offered in Fall 2026. Transcribed from the SFBU Fall 2026 registration ' +
      'list; the 2025-2026 catalog carries no description for this course code.',
  },
  {
    courseCode: 'MGT538',
    title: 'International Business Management',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'In this course, students will begin by appraising and deconstructing the environment ' +
      'of international business by examining the economic, financial, political, and ' +
      'cultural aspects of global trade. They will then learn how to assess and critique ' +
      'global organizational design and international business management techniques for ' +
      'various situations. After examining business practices and opportunities in various ' +
      'regions around the world, students will prepare a country screening analysis or ' +
      'similar project as a way to apply their knowledge of strategic international business ' +
      'management concepts to real-world situations.',
  },
  {
    courseCode: 'MGT542',
    title: 'Technology and Product Management',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'Designed to give students practical experience in product development, this course ' +
      'focuses on managing engineering and technology activities. Topics include technology ' +
      'product design, planning, production, marketing, sales, and maintenance; technological ' +
      'product life cycle from research and development through new product introduction; ' +
      'marketing requirement documentation (MRD); product positioning; channel inventory ' +
      'management; outbound communications; and the organizational role of the product ' +
      'marketing manager. Case studies and project presentations are required.',
  },
  {
    courseCode: 'MKT310',
    title: 'Principles of Marketing',
    creditHours: 3,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'Business course offered in Fall 2026. Transcribed from the SFBU Fall 2026 registration ' +
      'list; the 2025-2026 catalog carries no description for this course code.',
  },
  {
    courseCode: 'MKT483',
    title: 'Monetizing Intellectual Property',
    creditHours: 3,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'Intellectual property (IP) is a firm’s most valuable asset. Ideal for social media ' +
      'content creators and going beyond traditional IP definition and usage, students in ' +
      'this course will learn innovative models and interesting strategies for generating ' +
      'capital and value from intangible assets. The rapidly growing U.S. market for leasing ' +
      'intellectual property is already greater than $63 billion per year. Course topics ' +
      'include Outright Sales, Third-Party Licensing, Royalty Securitizations, Bowie Bonds, ' +
      'Collateralization, Donations, Copyrights, Trademarks, Trade Secrets and Patents, etc. ' +
      'This course contains assignments with research and role-playing.',
  },
  {
    courseCode: 'MKT491',
    title: 'The Art of Negotiation',
    creditHours: 3,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'This course will enable students to acquire comprehensive knowledge and develop ' +
      'advanced skills to navigate complex negotiation scenarios and influence various ' +
      'stakeholders, including customers, vendors, managers, peers, and direct reports. ' +
      'Throughout the course, students will analyze and apply theories and practical ' +
      'strategies to achieve mutually beneficial outcomes, commonly known as win-win ' +
      'solutions. The curriculum emphasizes the importance of a strategic mindset, ' +
      'disciplined preparation, and the development of key interpersonal skills that are ' +
      'crucial for achieving desired objectives in negotiations. Students will engage in ' +
      'real-world and practical applications through case studies and simulations relevant to ' +
      'Silicon Valley. They will analyze various negotiation contexts, including ' +
      'entertainment and sports, and participate in projects focused on negotiating to ' +
      'maximize profitability. By integrating real-world examples with theoretical concepts, ' +
      'this course prepares students to apply negotiation skills effectively in diverse ' +
      'business environments. Professional Development P450 Career Development (1 credit ' +
      'hour; required) This course is designed for students to take in preparation for ' +
      'becoming working professionals. Topics include effective communication strategies, ' +
      'emotional intelligence, diversity and cultural awareness, professional behavior, and ' +
      'interview skills. Note: SOC501 Emotional Intelligence Essentials may be used as a ' +
      'substitute for P450. ************* Business – Graduate Programs Course Numbering and ' +
      'Descriptions Master’s degree courses are numbered in the 500s. Each master’s degree ' +
      'program allows for a limited number of credits for 400-level courses with a “G” ' +
      'suffix. Course No. Description 450G–499G Cross-listed specialized skills courses taken ' +
      'for graduate-level credits 500–599 Graduate-level courses For information on ' +
      'prerequisites, corequisites, or subjects numbered below 450, refer to the section ' +
      'Business — Undergraduate Programs Course Numbering and Descriptions above. Courses are ' +
      'listed by subject: Accounting, Artificial Intelligence, Business Analytics, Business ' +
      'Law, Business, Curriculum Practicum, Finance, Green Business Management, Management, ' +
      'Marketing, Professional Development, and Social Science. Each course description is ' +
      'followed by any prerequisite or corequisite information or recommendations. Each ' +
      '1-credit-hour lab course requires at least 2 contact hours of lab work each week. Each ' +
      '1- credit hour of a practicum course requires at least 45 contact hours of practical ' +
      'experience related to the student’s program curriculum. Accounting',
  },
  {
    courseCode: 'MKT541',
    title: 'Strategic Marketing',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'This course will teach the students fundamental concepts and practices in marketing ' +
      'research and marketing data analysis, as well as using data and financial analysis to ' +
      'set strategic positioning strategies. Emphasis will be on practical marketing research ' +
      'skills development and basic analysis mechanisms leading to strategic marketing. ' +
      'Students will learn both primary sources (such as surveys) and secondary sources ' +
      '(internet, publications, etc.) through research techniques. Students will also engage ' +
      'in their own marketing research projects. Although statistical analysis will be ' +
      'covered in the course, quantitative analysis skills will be the focus. The course also ' +
      'covers an overview of quantitative and qualitative tools for strategic marketing, ' +
      'market segmentation process, strategic positioning, and channel marketing issues. Case ' +
      'studies and marketing requirements reports are required.',
  },
  {
    courseCode: 'MKT551',
    title: 'Sales Management',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'With a strong focus on selling as a career, this course covers a spectrum of selling ' +
      'strategies, sales force management, strategic, relationship, and product selling ' +
      'approaches, ownership of the customer relationship, and building customer personas. ' +
      'Additional topics may include forecasting, pricing and negotiation strategies, ' +
      'recruitment, territory assignment, quotas, channel management, etc. After completing ' +
      'this course, the student can build and manage a sales team, formulate, and implement ' +
      'sales programs, and evaluate and control the sales process.',
  },
  {
    courseCode: 'MKT553',
    title: 'Digital Marketing and Social Media',
    creditHours: 3,
    level: CourseLevel.GRADUATE,
    description:
      'Using a robust combination of creativity, critical thinking, data analysis, and ' +
      'project tracking skills, this course will enable students to master digital marketing ' +
      'and social media influence. After completing this course, the student will be able to ' +
      'explain in detail the ASCOR digital marketing framework (assessment phase, strategy ' +
      'phase, channel and communication plan, digital marketing operations, refinement ' +
      'phase), optimize a firm’s online value proposition by aligning its strengths with ' +
      'ever-changing market economics; and create a multistage digital marketing campaign ' +
      'from the initial activities through final deployment.',
  },
  {
    courseCode: 'PSY210',
    title: 'Introduction to Psychology',
    creditHours: 3,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'This psychology course reflects on theories and concepts of behavior and processes of ' +
      'the mind. Students will be introduced to topics such as motivation, emotion, ' +
      'personality, social behavior, perception, learning, and development. Different areas ' +
      'of psychology will be examined, such as cognitive, forensic, social, and developmental ' +
      'psychology. Additional topics may include environmental and biological factors ' +
      'affecting behavior, adaptation to stress and adversity, common disorders, experimental ' +
      'methods, and current research trends, among others. PSY450 Cyberpsychology: ' +
      'Understanding Human Behavior in the Digital Age Explore how digital technologies shape ' +
      'human behavior identity, relationships, mental health, and society. This ' +
      'interdisciplinary course examines online behavior through psychological and ethical ' +
      'lenses, covering topics like social media, cyberbullying, digital addiction, AI, VR, ' +
      'UX, and algorithmic bias. Students engage in weekly reflections, discussions, and ' +
      'hands-on projects, culminating in a final design promoting digital well-being or ' +
      'equity. Open to students from all disciplines; no prerequisites.',
  },
  {
    courseCode: 'PSY220',
    title: 'Abnormal Psychology',
    creditHours: 3,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'Psychology course offered in Fall 2026. Transcribed from the SFBU Fall 2026 ' +
      'registration list; the 2025-2026 catalog carries no description for this course code.',
  },
  {
    courseCode: 'PSY260',
    title: 'Social Psychology',
    creditHours: 3,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'Psychology course offered in Fall 2026. Transcribed from the SFBU Fall 2026 ' +
      'registration list; the 2025-2026 catalog carries no description for this course code.',
  },
  {
    courseCode: 'SEMINAR100',
    title: 'Design Thinking: Your Passion Project',
    creditHours: 1,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'General Education course offered in Fall 2026. Transcribed from the SFBU Fall 2026 ' +
      'registration list; the 2025-2026 catalog carries no description for this course code.',
  },
  {
    courseCode: 'SEMINAR200',
    title: 'Passion in Progress: Build, Test, Launch',
    creditHours: 1,
    level: CourseLevel.UNDERGRADUATE,
    description:
      'General Education course offered in Fall 2026. Transcribed from the SFBU Fall 2026 ' +
      'registration list; the 2025-2026 catalog carries no description for this course code.',
  },
  {
    courseCode: 'SOC501',
    title: 'Emotional Intelligence Essentials',
    creditHours: 1,
    level: CourseLevel.GRADUATE,
    description:
      'Business course offered in Fall 2026. Transcribed from the SFBU Fall 2026 registration ' +
      'list; the 2025-2026 catalog carries no description for this course code.',
  },
];

// ──────────────────────────────────────────────────────────────
// PREREQUISITES (course → requires these courses)
// ──────────────────────────────────────────────────────────────

export const PREREQUISITES: PrerequisiteSeed[] = [
  // Every link below is stated in the catalog's own course descriptions.
  // Disjunctive prerequisites ("CS250 or CS360") are deliberately absent: this
  // model is a hard AND, so recording both would block a student who satisfied
  // either one. Tracked in TASKS.md.
  { courseCode: 'CE450', prerequisiteCode: 'CS250' },
  { courseCode: 'CE450G', prerequisiteCode: 'CS250' },
  { courseCode: 'CE450LG', prerequisiteCode: 'CS250L' },
  { courseCode: 'CE521', prerequisiteCode: 'CE450' },
  { courseCode: 'CE522', prerequisiteCode: 'CE450' },
  { courseCode: 'CE523', prerequisiteCode: 'CE450' },
  { courseCode: 'CE530', prerequisiteCode: 'CE450' },
  { courseCode: 'CS350', prerequisiteCode: 'CS250' },
  { courseCode: 'CS350L', prerequisiteCode: 'CS250L' },
  { courseCode: 'CS360', prerequisiteCode: 'CS250' },
  { courseCode: 'CS360L', prerequisiteCode: 'CS250L' },
  { courseCode: 'CS380', prerequisiteCode: 'CS250' },
  { courseCode: 'CS453', prerequisiteCode: 'CS350' },
  { courseCode: 'CS455', prerequisiteCode: 'CS350' },
  { courseCode: 'CS455G', prerequisiteCode: 'CS350' },
  { courseCode: 'CS457', prerequisiteCode: 'CS250' },
  { courseCode: 'CS457G', prerequisiteCode: 'CS250' },
  { courseCode: 'CS457L', prerequisiteCode: 'CS250L' },
  { courseCode: 'CS457LG', prerequisiteCode: 'CS250L' },
  { courseCode: 'CS470', prerequisiteCode: 'CS250' },
  { courseCode: 'CS477', prerequisiteCode: 'CS250' },
  { courseCode: 'CS477G', prerequisiteCode: 'CS250' },
  { courseCode: 'CS481', prerequisiteCode: 'MATH208' },
  { courseCode: 'CS481G', prerequisiteCode: 'MATH208' },
  { courseCode: 'CS483', prerequisiteCode: 'CS250' },
  { courseCode: 'CS483L', prerequisiteCode: 'CS250L' },
  { courseCode: 'CS485', prerequisiteCode: 'CS250' },
  { courseCode: 'CS500', prerequisiteCode: 'CS250' },
  { courseCode: 'CS500L', prerequisiteCode: 'CS250' },
  { courseCode: 'CS501', prerequisiteCode: 'CS250' },
  { courseCode: 'CS515', prerequisiteCode: 'CS230' },
  { courseCode: 'CS515', prerequisiteCode: 'CS250' },
  { courseCode: 'CS521', prerequisiteCode: 'CS250' },
  { courseCode: 'CS522', prerequisiteCode: 'CS250' },
  { courseCode: 'CS535', prerequisiteCode: 'CS250' },
  { courseCode: 'CS547', prerequisiteCode: 'CS457' },
  { courseCode: 'CS548', prerequisiteCode: 'CS480' },
  { courseCode: 'CS550', prerequisiteCode: 'CS457' },
  { courseCode: 'CS551', prerequisiteCode: 'CS500' },
  { courseCode: 'CS565', prerequisiteCode: 'CS470' },
  { courseCode: 'CS570', prerequisiteCode: 'CS500' },
  { courseCode: 'CS571', prerequisiteCode: 'CS500' },
  { courseCode: 'CS575', prerequisiteCode: 'CS250' },
  { courseCode: 'DS500', prerequisiteCode: 'MATH208' },
  { courseCode: 'EE488G', prerequisiteCode: 'CS250' },
  { courseCode: 'EE488G', prerequisiteCode: 'EE461' },
  { courseCode: 'EE504', prerequisiteCode: 'EE461' },
  { courseCode: 'EE505', prerequisiteCode: 'EE461' },
  { courseCode: 'EE511', prerequisiteCode: 'EE461' },
  { courseCode: 'EE517', prerequisiteCode: 'CS230' },
  { courseCode: 'EE517', prerequisiteCode: 'CS250' },
  { courseCode: 'EE520', prerequisiteCode: 'EE461' },
  { courseCode: 'EE553', prerequisiteCode: 'EE488' },
  { courseCode: 'EE577', prerequisiteCode: 'EE461' },
  { courseCode: 'FIN568', prerequisiteCode: 'FIN501' },
  { courseCode: 'FIN585', prerequisiteCode: 'FIN501' },
  { courseCode: 'MATH202', prerequisiteCode: 'MATH201' },
  { courseCode: 'MATH203', prerequisiteCode: 'MATH201' },
  { courseCode: 'MATH208', prerequisiteCode: 'MATH201' },
];

// ──────────────────────────────────────────────────────────────
// COREQUISITES
// ──────────────────────────────────────────────────────────────

export const COREQUISITES: CorequisiteSeed[] = [
  // Direction follows the catalog: the course that states the corequisite is the subject.
  { courseCode: 'CE450G', corequisiteCode: 'CE450LG' },
  { courseCode: 'CS230', corequisiteCode: 'CS230L' },
  { courseCode: 'CS250', corequisiteCode: 'CS250L' },
  { courseCode: 'CS350', corequisiteCode: 'CS350L' },
  { courseCode: 'CS360', corequisiteCode: 'CS360L' },
  { courseCode: 'CS457', corequisiteCode: 'CS457L' },
  { courseCode: 'CS457G', corequisiteCode: 'CS457LG' },
  { courseCode: 'CS480', corequisiteCode: 'CS480L' },
  { courseCode: 'CS487', corequisiteCode: 'CS250' },
  { courseCode: 'CS500', corequisiteCode: 'CS500L' },
  { courseCode: 'EE461G', corequisiteCode: 'EE461LG' },
];

// ──────────────────────────────────────────────────────────────
// KNOWLEDGE AREAS
//
// Learning domains used to group courses across all programs.
// These are a pedagogical taxonomy layered over the catalog — the
// catalog itself organizes courses by requirement group, not by
// subject matter. A course may belong to more than one area.
// ──────────────────────────────────────────────────────────────

export const KNOWLEDGE_AREAS: KnowledgeAreaSeed[] = [
  {
    name: 'Programming Foundations',
    description:
      'Introductory and object-oriented programming, problem decomposition, and core language skills.',
  },
  {
    name: 'Data Structures & Algorithms',
    description:
      'Fundamental data structures, algorithm design paradigms, complexity analysis, and computability.',
  },
  {
    name: 'Mathematical Foundations',
    description:
      'Calculus, linear algebra, discrete mathematics, and the formal reasoning that underpins computing.',
  },
  {
    name: 'Operating Systems & Distributed Computing',
    description:
      'Process and memory management, concurrency, distributed systems, virtualization, and cloud platforms.',
  },
  {
    name: 'Computer Networks',
    description:
      'Network architecture and protocols, routing, wireless and mobile networking, and software-defined networks.',
  },
  {
    name: 'Cybersecurity',
    description:
      'Cryptography, network defense, secure software development, and security policy and analysis.',
  },
  {
    name: 'Artificial Intelligence & Machine Learning',
    description:
      'Search and knowledge representation, statistical learning, deep learning, computer vision, and language models.',
  },
  {
    name: 'Data Management & Analytics',
    description:
      'Relational and NoSQL database design, query processing, and large-scale data engineering.',
  },
  {
    name: 'Software Engineering',
    description:
      'Software lifecycle and process, architecture and design patterns, testing, and quality assurance.',
  },
  {
    name: 'Computer Architecture & Digital Design',
    description:
      'Digital logic, instruction set architecture, pipelining, memory hierarchy, FPGAs, and system-on-chip design.',
  },
  {
    name: 'Embedded Systems & IoT',
    description:
      'Microcontroller and real-time design, hardware-software co-design, sensor networks, and edge computing.',
  },
  {
    name: 'Signal Processing & Integrated Circuits',
    description:
      'Digital signal processing, VLSI and CMOS circuit design, RF design, and physical verification.',
  },
  {
    name: 'High-Performance & Parallel Computing',
    description:
      'Parallel programming models, GPU and multicore computing, HPC clusters, and performance engineering.',
  },
  {
    name: 'Capstone & Professional Practice',
    description:
      'Culminating project work, research and industry application, entrepreneurship, and special topics.',
  },
];

// ──────────────────────────────────────────────────────────────
// COURSE → KNOWLEDGE AREA MAPPING
//
// Names must match KNOWLEDGE_AREAS above; the seeder warns and
// skips on any mismatch rather than failing the whole run.
// ──────────────────────────────────────────────────────────────

export const COURSE_KNOWLEDGE_AREAS: CourseKnowledgeAreaSeed[] = [
  // Re-derived from the corrected course identities. The ten APP general-education
  // courses are deliberately unmapped — they are university-wide breadth requirements,
  // not ECE knowledge areas, and forcing them into this taxonomy would distort coverage.
  {
    courseCode: 'BUS450',
    knowledgeAreaNames: ['Capstone & Professional Practice'],
  },
  {
    courseCode: 'CE305',
    knowledgeAreaNames: ['Computer Architecture & Digital Design'],
  },
  { courseCode: 'CE450', knowledgeAreaNames: ['Embedded Systems & IoT'] },
  { courseCode: 'CE450G', knowledgeAreaNames: ['Embedded Systems & IoT'] },
  { courseCode: 'CE450LG', knowledgeAreaNames: ['Embedded Systems & IoT'] },
  { courseCode: 'CE521', knowledgeAreaNames: ['Embedded Systems & IoT'] },
  { courseCode: 'CE522', knowledgeAreaNames: ['Embedded Systems & IoT'] },
  { courseCode: 'CE523', knowledgeAreaNames: ['Embedded Systems & IoT'] },
  { courseCode: 'CE530', knowledgeAreaNames: ['Embedded Systems & IoT'] },
  {
    courseCode: 'CS200',
    knowledgeAreaNames: ['Mathematical Foundations', 'Programming Foundations'],
  },
  { courseCode: 'CS230', knowledgeAreaNames: ['Programming Foundations'] },
  { courseCode: 'CS230L', knowledgeAreaNames: ['Programming Foundations'] },
  { courseCode: 'CS250', knowledgeAreaNames: ['Programming Foundations'] },
  { courseCode: 'CS250L', knowledgeAreaNames: ['Programming Foundations'] },
  { courseCode: 'CS350', knowledgeAreaNames: ['Data Structures & Algorithms'] },
  {
    courseCode: 'CS350L',
    knowledgeAreaNames: ['Data Structures & Algorithms'],
  },
  { courseCode: 'CS360', knowledgeAreaNames: ['Programming Foundations'] },
  { courseCode: 'CS360L', knowledgeAreaNames: ['Programming Foundations'] },
  {
    courseCode: 'CS380',
    knowledgeAreaNames: ['Operating Systems & Distributed Computing'],
  },
  { courseCode: 'CS453', knowledgeAreaNames: ['Programming Foundations'] },
  { courseCode: 'CS455', knowledgeAreaNames: ['Data Structures & Algorithms'] },
  {
    courseCode: 'CS455G',
    knowledgeAreaNames: ['Data Structures & Algorithms'],
  },
  { courseCode: 'CS457', knowledgeAreaNames: ['Data Management & Analytics'] },
  { courseCode: 'CS457G', knowledgeAreaNames: ['Data Management & Analytics'] },
  { courseCode: 'CS457L', knowledgeAreaNames: ['Data Management & Analytics'] },
  {
    courseCode: 'CS457LG',
    knowledgeAreaNames: ['Data Management & Analytics'],
  },
  { courseCode: 'CS470', knowledgeAreaNames: ['Computer Networks'] },
  { courseCode: 'CS477', knowledgeAreaNames: ['Cybersecurity'] },
  { courseCode: 'CS477G', knowledgeAreaNames: ['Cybersecurity'] },
  {
    courseCode: 'CS478',
    knowledgeAreaNames: ['Cybersecurity', 'Software Engineering'],
  },
  {
    courseCode: 'CS480',
    knowledgeAreaNames: ['Programming Foundations', 'Software Engineering'],
  },
  { courseCode: 'CS480L', knowledgeAreaNames: ['Programming Foundations'] },
  {
    courseCode: 'CS481',
    knowledgeAreaNames: [
      'Artificial Intelligence & Machine Learning',
      'Data Management & Analytics',
    ],
  },
  {
    courseCode: 'CS481G',
    knowledgeAreaNames: [
      'Artificial Intelligence & Machine Learning',
      'Data Management & Analytics',
    ],
  },
  {
    courseCode: 'CS483',
    knowledgeAreaNames: ['Artificial Intelligence & Machine Learning'],
  },
  {
    courseCode: 'CS485',
    knowledgeAreaNames: ['Programming Foundations', 'Software Engineering'],
  },
  { courseCode: 'CS487', knowledgeAreaNames: ['Software Engineering'] },
  {
    courseCode: 'CS494',
    knowledgeAreaNames: ['Capstone & Professional Practice'],
  },
  { courseCode: 'CS500', knowledgeAreaNames: ['Programming Foundations'] },
  { courseCode: 'CS500L', knowledgeAreaNames: ['Programming Foundations'] },
  { courseCode: 'CS501', knowledgeAreaNames: ['Data Structures & Algorithms'] },
  {
    courseCode: 'CS515',
    knowledgeAreaNames: [
      'Computer Networks',
      'Operating Systems & Distributed Computing',
    ],
  },
  { courseCode: 'CS521', knowledgeAreaNames: ['Software Engineering'] },
  { courseCode: 'CS522', knowledgeAreaNames: ['Software Engineering'] },
  { courseCode: 'CS535', knowledgeAreaNames: ['Cybersecurity'] },
  { courseCode: 'CS548', knowledgeAreaNames: ['Software Engineering'] },
  {
    courseCode: 'CS550',
    knowledgeAreaNames: [
      'Artificial Intelligence & Machine Learning',
      'Data Management & Analytics',
    ],
  },
  { courseCode: 'CS551', knowledgeAreaNames: ['Software Engineering'] },
  { courseCode: 'CS556', knowledgeAreaNames: ['Software Engineering'] },
  { courseCode: 'CS565', knowledgeAreaNames: ['Computer Networks'] },
  { courseCode: 'CS570', knowledgeAreaNames: ['Data Management & Analytics'] },
  {
    courseCode: 'CS571',
    knowledgeAreaNames: ['Operating Systems & Distributed Computing'],
  },
  { courseCode: 'CS575', knowledgeAreaNames: ['Computer Networks'] },
  { courseCode: 'CS581', knowledgeAreaNames: ['Cybersecurity'] },
  { courseCode: 'CS589', knowledgeAreaNames: ['Software Engineering'] },
  {
    courseCode: 'CS595',
    knowledgeAreaNames: ['Capstone & Professional Practice'],
  },
  {
    courseCode: 'EE461G',
    knowledgeAreaNames: ['Computer Architecture & Digital Design'],
  },
  {
    courseCode: 'EE461LG',
    knowledgeAreaNames: ['Computer Architecture & Digital Design'],
  },
  {
    courseCode: 'EE488G',
    knowledgeAreaNames: ['Computer Architecture & Digital Design'],
  },
  {
    courseCode: 'EE504',
    knowledgeAreaNames: [
      'Computer Architecture & Digital Design',
      'High-Performance & Parallel Computing',
    ],
  },
  {
    courseCode: 'EE505',
    knowledgeAreaNames: ['Signal Processing & Integrated Circuits'],
  },
  {
    courseCode: 'EE511',
    knowledgeAreaNames: ['Signal Processing & Integrated Circuits'],
  },
  { courseCode: 'EE517', knowledgeAreaNames: ['Embedded Systems & IoT'] },
  {
    courseCode: 'EE520',
    knowledgeAreaNames: ['Signal Processing & Integrated Circuits'],
  },
  {
    courseCode: 'EE553',
    knowledgeAreaNames: [
      'Signal Processing & Integrated Circuits',
      'Computer Architecture & Digital Design',
    ],
  },
  {
    courseCode: 'EE577',
    knowledgeAreaNames: ['Signal Processing & Integrated Circuits'],
  },
  {
    courseCode: 'EE595',
    knowledgeAreaNames: ['Capstone & Professional Practice'],
  },
  { courseCode: 'MATH201', knowledgeAreaNames: ['Mathematical Foundations'] },
  { courseCode: 'MATH202', knowledgeAreaNames: ['Mathematical Foundations'] },
  { courseCode: 'MATH203', knowledgeAreaNames: ['Mathematical Foundations'] },
  { courseCode: 'MATH208', knowledgeAreaNames: ['Mathematical Foundations'] },
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
        description:
          'SFBU Agility Praxis Pathway — 10 interdisciplinary courses across Areas A–D.',
        minCredits: 30,
        sortOrder: 1,
        requirements: [
          // Area A — English Language Communication and Critical Thinking (6 cr)
          {
            courseCode: 'APP101',
            minCredits: null,
            description: null,
            sortOrder: 1,
          },
          {
            courseCode: 'APP103',
            minCredits: null,
            description: null,
            sortOrder: 2,
          },
          // Area B — Mathematics and Natural Sciences (9 cr)
          {
            courseCode: 'APP201',
            minCredits: null,
            description: null,
            sortOrder: 3,
          },
          {
            courseCode: 'APP202',
            minCredits: null,
            description: null,
            sortOrder: 4,
          },
          {
            courseCode: 'APP301',
            minCredits: null,
            description: null,
            sortOrder: 5,
          },
          // Area C — Arts and Humanities (6 cr)
          {
            courseCode: 'APP102',
            minCredits: null,
            description: null,
            sortOrder: 6,
          },
          {
            courseCode: 'APP203',
            minCredits: null,
            description: null,
            sortOrder: 7,
          },
          // Area D — Social Sciences (9 cr)
          {
            courseCode: 'APP104',
            minCredits: null,
            description: null,
            sortOrder: 8,
          },
          {
            courseCode: 'APP204',
            minCredits: null,
            description: null,
            sortOrder: 9,
          },
          {
            courseCode: 'APP302',
            minCredits: null,
            description: null,
            sortOrder: 10,
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
          // The lab for CS483, grouped with its lecture as CS480/CS480L are.
          {
            courseCode: 'CS483L',
            minCredits: null,
            description: null,
            sortOrder: 8,
          },
        ],
      },
      {
        name: 'Free Electives',
        description:
          'Any discipline, to reach 120 total credits. Courses listed are those on the current schedule.',
        minCredits: 15,
        sortOrder: 5,
        requirements: [
          {
            courseCode: null,
            minCredits: 15,
            description: 'Any approved upper-division courses.',
            sortOrder: 1,
          },
          // The catalog allows electives from any discipline. These are the
          // non-major courses actually on the schedule; the credit requirement
          // above still governs — this list is not exhaustive.
          {
            courseCode: 'ACC110',
            minCredits: null,
            description: null,
            sortOrder: 2,
          },
          {
            courseCode: 'BAN463',
            minCredits: null,
            description: null,
            sortOrder: 3,
          },
          {
            courseCode: 'BAN472',
            minCredits: null,
            description: null,
            sortOrder: 4,
          },
          {
            courseCode: 'BLAW310',
            minCredits: null,
            description: null,
            sortOrder: 5,
          },
          {
            courseCode: 'BUS493',
            minCredits: null,
            description: null,
            sortOrder: 6,
          },
          {
            courseCode: 'ECON201',
            minCredits: null,
            description: null,
            sortOrder: 7,
          },
          {
            courseCode: 'EE461',
            minCredits: null,
            description: null,
            sortOrder: 8,
          },
          {
            courseCode: 'EE461L',
            minCredits: null,
            description: null,
            sortOrder: 9,
          },
          {
            courseCode: 'EE488',
            minCredits: null,
            description: null,
            sortOrder: 10,
          },
          {
            courseCode: 'FIN310',
            minCredits: null,
            description: null,
            sortOrder: 11,
          },
          {
            courseCode: 'MGT310',
            minCredits: null,
            description: null,
            sortOrder: 12,
          },
          {
            courseCode: 'MGT451',
            minCredits: null,
            description: null,
            sortOrder: 13,
          },
          {
            courseCode: 'MGT460',
            minCredits: null,
            description: null,
            sortOrder: 14,
          },
          {
            courseCode: 'MGT480',
            minCredits: null,
            description: null,
            sortOrder: 15,
          },
          {
            courseCode: 'MKT310',
            minCredits: null,
            description: null,
            sortOrder: 16,
          },
          {
            courseCode: 'MKT483',
            minCredits: null,
            description: null,
            sortOrder: 17,
          },
          {
            courseCode: 'MKT491',
            minCredits: null,
            description: null,
            sortOrder: 18,
          },
          {
            courseCode: 'PSY210',
            minCredits: null,
            description: null,
            sortOrder: 19,
          },
          {
            courseCode: 'PSY220',
            minCredits: null,
            description: null,
            sortOrder: 20,
          },
          {
            courseCode: 'PSY260',
            minCredits: null,
            description: null,
            sortOrder: 21,
          },
          {
            courseCode: 'SEMINAR100',
            minCredits: null,
            description: null,
            sortOrder: 22,
          },
          {
            courseCode: 'SEMINAR200',
            minCredits: null,
            description: null,
            sortOrder: 23,
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
            // The catalog offers CS501 as the alternative to CS455G, not to CS500.
            description: 'Or CS501 (Practical Application of Algorithms)',
            sortOrder: 1,
          },
          {
            courseCode: 'CS501',
            minCredits: null,
            description: 'Alternative to CS455G',
            sortOrder: 2,
          },
          {
            courseCode: 'CS457G',
            minCredits: null,
            description: null,
            sortOrder: 3,
          },
          {
            courseCode: 'CS457LG',
            minCredits: null,
            description: null,
            sortOrder: 4,
          },
          {
            courseCode: 'CS500',
            minCredits: null,
            description: null,
            sortOrder: 5,
          },
          {
            courseCode: 'CS500L',
            minCredits: null,
            description: 'Taken concurrently with CS500',
            sortOrder: 6,
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
      // The catalog separates named concentrations (above) from "cluster courses" —
      // example groupings a student may draw four courses from to satisfy the same
      // 12-credit specialization requirement without declaring a concentration.
      {
        name: 'Cluster — Cloud Computing and Big Data',
        description:
          'Example cluster; any four cluster courses satisfy the specialization requirement.',
        minCredits: 12,
        sortOrder: 5,
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
            courseCode: 'CS571',
            minCredits: null,
            description: null,
            sortOrder: 3,
          },
        ],
      },
      {
        name: 'Cluster — Mobile Application Technologies',
        description:
          'Example cluster; any four cluster courses satisfy the specialization requirement.',
        minCredits: 12,
        sortOrder: 6,
        requirements: [
          {
            courseCode: 'CS548',
            minCredits: null,
            description: null,
            sortOrder: 1,
          },
          {
            courseCode: 'CS551',
            minCredits: null,
            description: null,
            sortOrder: 2,
          },
          {
            courseCode: 'CS556',
            minCredits: null,
            description: null,
            sortOrder: 3,
          },
        ],
      },
      {
        name: 'Cluster — QA Engineering',
        description:
          'Example cluster; any four cluster courses satisfy the specialization requirement.',
        minCredits: 12,
        sortOrder: 7,
        requirements: [
          {
            courseCode: 'CS521',
            minCredits: null,
            description: null,
            sortOrder: 1,
          },
          {
            courseCode: 'CS522',
            minCredits: null,
            description: null,
            sortOrder: 2,
          },
          {
            courseCode: 'CS548',
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
        description:
          'Any graduate-level course, including outside the department, to total 36 credits. Courses listed are those on the current schedule.',
        minCredits: 10,
        sortOrder: 8,
        requirements: [
          {
            courseCode: null,
            minCredits: 10,
            description: 'Approved 500-level CS courses.',
            sortOrder: 1,
          },
          // The catalog allows any graduate-level course, including those outside
          // the department. These are the ones actually on the schedule; the
          // credit requirement above still governs — this list is not exhaustive.
          {
            courseCode: 'AI501',
            minCredits: null,
            description: null,
            sortOrder: 2,
          },
          {
            courseCode: 'AI510',
            minCredits: null,
            description: null,
            sortOrder: 3,
          },
          {
            courseCode: 'AI511',
            minCredits: null,
            description: null,
            sortOrder: 4,
          },
          {
            courseCode: 'AI520',
            minCredits: null,
            description: null,
            sortOrder: 5,
          },
          {
            courseCode: 'BAN501',
            minCredits: null,
            description: null,
            sortOrder: 6,
          },
          {
            courseCode: 'BUS587',
            minCredits: null,
            description: null,
            sortOrder: 7,
          },
          {
            courseCode: 'BUS595',
            minCredits: null,
            description: null,
            sortOrder: 8,
          },
          {
            courseCode: 'CS547',
            minCredits: null,
            description: null,
            sortOrder: 9,
          },
          {
            courseCode: 'CS582',
            minCredits: null,
            description: null,
            sortOrder: 10,
          },
          {
            courseCode: 'CS583',
            minCredits: null,
            description: null,
            sortOrder: 11,
          },
          {
            courseCode: 'CS587',
            minCredits: null,
            description: null,
            sortOrder: 12,
          },
          {
            courseCode: 'DS500',
            minCredits: null,
            description: null,
            sortOrder: 13,
          },
          {
            courseCode: 'DS520',
            minCredits: null,
            description: null,
            sortOrder: 14,
          },
          {
            courseCode: 'FIN501',
            minCredits: null,
            description: null,
            sortOrder: 15,
          },
          {
            courseCode: 'FIN522',
            minCredits: null,
            description: null,
            sortOrder: 16,
          },
          {
            courseCode: 'FIN568',
            minCredits: null,
            description: null,
            sortOrder: 17,
          },
          {
            courseCode: 'FIN585',
            minCredits: null,
            description: null,
            sortOrder: 18,
          },
          {
            courseCode: 'HRM531',
            minCredits: null,
            description: null,
            sortOrder: 19,
          },
          {
            courseCode: 'MGT500',
            minCredits: null,
            description: null,
            sortOrder: 20,
          },
          {
            courseCode: 'MGT510',
            minCredits: null,
            description: null,
            sortOrder: 21,
          },
          {
            courseCode: 'MGT538',
            minCredits: null,
            description: null,
            sortOrder: 22,
          },
          {
            courseCode: 'MGT542',
            minCredits: null,
            description: null,
            sortOrder: 23,
          },
          {
            courseCode: 'MKT541',
            minCredits: null,
            description: null,
            sortOrder: 24,
          },
          {
            courseCode: 'MKT551',
            minCredits: null,
            description: null,
            sortOrder: 25,
          },
          {
            courseCode: 'MKT553',
            minCredits: null,
            description: null,
            sortOrder: 26,
          },
          {
            courseCode: 'SOC501',
            minCredits: null,
            description: null,
            sortOrder: 27,
          },
        ],
      },
      {
        name: 'Capstone',
        description: 'Required graduate capstone.',
        minCredits: 3,
        sortOrder: 9,
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
        name: 'Cluster — Internet of Things (IoT) and Embedded Systems',
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
        name: 'Cluster — Multicore Computing',
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
        name: 'Cluster — Modern IC Technologies',
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
        description:
          'Any graduate-level course, including outside the department, to total 36 credits. Courses listed are those on the current schedule.',
        minCredits: 10,
        sortOrder: 5,
        requirements: [
          {
            courseCode: null,
            minCredits: 10,
            description: 'Approved 500-level EE/CE courses.',
            sortOrder: 1,
          },
          // The catalog allows any graduate-level course, including those outside
          // the department. These are the ones actually on the schedule; the
          // credit requirement above still governs — this list is not exhaustive.
          {
            courseCode: 'AI501',
            minCredits: null,
            description: null,
            sortOrder: 2,
          },
          {
            courseCode: 'AI510',
            minCredits: null,
            description: null,
            sortOrder: 3,
          },
          {
            courseCode: 'AI511',
            minCredits: null,
            description: null,
            sortOrder: 4,
          },
          {
            courseCode: 'AI520',
            minCredits: null,
            description: null,
            sortOrder: 5,
          },
          {
            courseCode: 'BAN501',
            minCredits: null,
            description: null,
            sortOrder: 6,
          },
          {
            courseCode: 'BUS587',
            minCredits: null,
            description: null,
            sortOrder: 7,
          },
          {
            courseCode: 'BUS595',
            minCredits: null,
            description: null,
            sortOrder: 8,
          },
          {
            courseCode: 'CS547',
            minCredits: null,
            description: null,
            sortOrder: 9,
          },
          {
            courseCode: 'CS582',
            minCredits: null,
            description: null,
            sortOrder: 10,
          },
          {
            courseCode: 'CS583',
            minCredits: null,
            description: null,
            sortOrder: 11,
          },
          {
            courseCode: 'CS587',
            minCredits: null,
            description: null,
            sortOrder: 12,
          },
          {
            courseCode: 'DS500',
            minCredits: null,
            description: null,
            sortOrder: 13,
          },
          {
            courseCode: 'DS520',
            minCredits: null,
            description: null,
            sortOrder: 14,
          },
          {
            courseCode: 'FIN501',
            minCredits: null,
            description: null,
            sortOrder: 15,
          },
          {
            courseCode: 'FIN522',
            minCredits: null,
            description: null,
            sortOrder: 16,
          },
          {
            courseCode: 'FIN568',
            minCredits: null,
            description: null,
            sortOrder: 17,
          },
          {
            courseCode: 'FIN585',
            minCredits: null,
            description: null,
            sortOrder: 18,
          },
          {
            courseCode: 'HRM531',
            minCredits: null,
            description: null,
            sortOrder: 19,
          },
          {
            courseCode: 'MGT500',
            minCredits: null,
            description: null,
            sortOrder: 20,
          },
          {
            courseCode: 'MGT510',
            minCredits: null,
            description: null,
            sortOrder: 21,
          },
          {
            courseCode: 'MGT538',
            minCredits: null,
            description: null,
            sortOrder: 22,
          },
          {
            courseCode: 'MGT542',
            minCredits: null,
            description: null,
            sortOrder: 23,
          },
          {
            courseCode: 'MKT541',
            minCredits: null,
            description: null,
            sortOrder: 24,
          },
          {
            courseCode: 'MKT551',
            minCredits: null,
            description: null,
            sortOrder: 25,
          },
          {
            courseCode: 'MKT553',
            minCredits: null,
            description: null,
            sortOrder: 26,
          },
          {
            courseCode: 'SOC501',
            minCredits: null,
            description: null,
            sortOrder: 27,
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

// ── Course Offerings ───────────────────────────────────────────

export interface OfferedCourseSeed {
  courseCode: string;
  /** False when the course runs but the registrar has closed registration. */
  openForRegistration: boolean;
  /** Sections on the published schedule; omitted when the list does not say. */
  sectionCount?: number;
  /** Registrar's note, verbatim — "Cancelled due to low enrollment" and the like. */
  statusNote?: string;
}

export interface CourseOfferingSeed {
  /** Must match an academic_terms.name created by the CourseOfferings migration. */
  termName: string;
  courses: OfferedCourseSeed[];
}

/**
 * Which courses actually run in which term.
 *
 * Fall 2026 is transcribed from the real SFBU registration list
 * (`docs/Fall 2026.md`) — it is not a plausible-looking guess. The real term
 * is graduate Computer Science only: no undergraduate courses, no EE/CE, and
 * notably no EE595 capstone.
 *
 * Six courses on the official list have no catalog entry yet and are therefore
 * omitted rather than invented: CS521 Software Project Management, CS522
 * Software Quality Assurance and Test Automation, CS547 Advanced Database
 * Design and Analysis, CS582 Agentic AI, CS583 Enterprise AI, and CS587
 * Individual Research Project. Seeding offerings for courses that do not exist
 * would fail; adding the courses themselves needs catalog data (prerequisites,
 * requirement-group placement, knowledge areas) that the registration list
 * does not carry.
 *
 * Spring 2027 is deliberately absent. No real schedule for it exists, and
 * inventing one would put fabricated availability in front of students. A term
 * with no curated offerings is treated as "not yet curated" (offered: null),
 * not as "offers nothing" — see PlannerService.
 *
 * Two fields on the official list are not modeled: "Open For Registration"
 * (false for CS522, CS571 and CS583 — the course runs but is not open) and
 * section counts. Capturing those needs a schema change; until then a seeded
 * offering means "runs this term", not "you can register right now".
 */
export const COURSE_OFFERINGS: CourseOfferingSeed[] = [
  {
    termName: 'Fall 2026',
    // The full published schedule, transcribed from the official SFBU Fall 2026
    // registration list — 96 courses across every department, not just ECE.
    //
    // CS500 and FIN310 arrive contradicting themselves: both carry a cancellation
    // note and Open For Registration: true. Cancelled wins here, because showing a
    // cancelled course as registrable sends a student to enrol in something that
    // will not run.
    courses: [
      { courseCode: 'ACC110', openForRegistration: true, sectionCount: 2 },
      { courseCode: 'AI501', openForRegistration: true, sectionCount: 1 },
      { courseCode: 'AI510', openForRegistration: true, sectionCount: 2 },
      { courseCode: 'AI511', openForRegistration: true, sectionCount: 1 },
      { courseCode: 'AI520', openForRegistration: true, sectionCount: 1 },
      { courseCode: 'APP101', openForRegistration: true, sectionCount: 3 },
      { courseCode: 'APP102', openForRegistration: true, sectionCount: 2 },
      { courseCode: 'APP103', openForRegistration: false, sectionCount: 2 },
      { courseCode: 'APP104', openForRegistration: true, sectionCount: 1 },
      { courseCode: 'APP201', openForRegistration: true, sectionCount: 3 },
      { courseCode: 'APP202', openForRegistration: true, sectionCount: 2 },
      { courseCode: 'APP203', openForRegistration: false, sectionCount: 2 },
      { courseCode: 'APP204', openForRegistration: false, sectionCount: 2 },
      { courseCode: 'APP301', openForRegistration: false, sectionCount: 1 },
      { courseCode: 'BAN463', openForRegistration: true, sectionCount: 1 },
      { courseCode: 'BAN472', openForRegistration: false, sectionCount: 1 },
      { courseCode: 'BAN501', openForRegistration: true, sectionCount: 1 },
      {
        courseCode: 'BLAW310',
        openForRegistration: false,
        sectionCount: 1,
        statusNote: 'Cancelled. Will Return Next Semester.',
      },
      { courseCode: 'BUS450', openForRegistration: false, sectionCount: 1 },
      { courseCode: 'BUS493', openForRegistration: true, sectionCount: 1 },
      { courseCode: 'BUS587', openForRegistration: true, sectionCount: 1 },
      { courseCode: 'BUS595', openForRegistration: true, sectionCount: 2 },
      { courseCode: 'CE305', openForRegistration: false, sectionCount: 1 },
      { courseCode: 'CE530', openForRegistration: true, sectionCount: 1 },
      { courseCode: 'CS200', openForRegistration: true, sectionCount: 1 },
      { courseCode: 'CS250', openForRegistration: true, sectionCount: 1 },
      { courseCode: 'CS250L', openForRegistration: true, sectionCount: 1 },
      { courseCode: 'CS350', openForRegistration: true, sectionCount: 1 },
      { courseCode: 'CS350L', openForRegistration: true, sectionCount: 1 },
      {
        courseCode: 'CS360',
        openForRegistration: true,
        sectionCount: 1,
        statusNote:
          'From Shak: for CS 360 -- can you please increase the waiting by 2 as I need one student (Viplab) need to signup to grade this fall',
      },
      { courseCode: 'CS360L', openForRegistration: true, sectionCount: 1 },
      { courseCode: 'CS455', openForRegistration: true, sectionCount: 1 },
      { courseCode: 'CS457', openForRegistration: true, sectionCount: 1 },
      { courseCode: 'CS457L', openForRegistration: true, sectionCount: 1 },
      { courseCode: 'CS470', openForRegistration: true, sectionCount: 1 },
      { courseCode: 'CS477', openForRegistration: false, sectionCount: 1 },
      {
        courseCode: 'CS478',
        openForRegistration: false,
        sectionCount: 1,
        statusNote: 'Shak has approved to update waitlist capacity to 4',
      },
      { courseCode: 'CS481', openForRegistration: false, sectionCount: 1 },
      { courseCode: 'CS483', openForRegistration: true, sectionCount: 2 },
      { courseCode: 'CS483L', openForRegistration: true, sectionCount: 1 },
      { courseCode: 'CS487', openForRegistration: false, sectionCount: 1 },
      { courseCode: 'CS494', openForRegistration: true, sectionCount: 1 },
      {
        courseCode: 'CS500',
        openForRegistration: false,
        sectionCount: 2,
        statusNote: 'Cancelled due to low enrollment',
      },
      { courseCode: 'CS500L', openForRegistration: true, sectionCount: 2 },
      { courseCode: 'CS501', openForRegistration: false, sectionCount: 1 },
      { courseCode: 'CS521', openForRegistration: true, sectionCount: 1 },
      {
        courseCode: 'CS522',
        openForRegistration: false,
        sectionCount: 1,
        statusNote: 'Cancelled due to low enrollment',
      },
      { courseCode: 'CS547', openForRegistration: true, sectionCount: 2 },
      { courseCode: 'CS550', openForRegistration: true, sectionCount: 1 },
      { courseCode: 'CS570', openForRegistration: true, sectionCount: 1 },
      { courseCode: 'CS571', openForRegistration: false, sectionCount: 1 },
      { courseCode: 'CS575', openForRegistration: true, sectionCount: 1 },
      { courseCode: 'CS582', openForRegistration: true, sectionCount: 1 },
      {
        courseCode: 'CS583',
        openForRegistration: false,
        sectionCount: 1,
        statusNote: 'Cancelled due to sequencing issues',
      },
      { courseCode: 'CS587', openForRegistration: true, sectionCount: 1 },
      { courseCode: 'CS595', openForRegistration: true, sectionCount: 2 },
      { courseCode: 'DS500', openForRegistration: true, sectionCount: 1 },
      {
        courseCode: 'DS520',
        openForRegistration: false,
        sectionCount: 1,
        statusNote: 'Cancelled due to low enrollment',
      },
      { courseCode: 'ECON201', openForRegistration: true, sectionCount: 1 },
      { courseCode: 'EE461', openForRegistration: true, sectionCount: 1 },
      { courseCode: 'EE461L', openForRegistration: true, sectionCount: 1 },
      { courseCode: 'EE488', openForRegistration: true, sectionCount: 1 },
      {
        courseCode: 'EE505',
        openForRegistration: false,
        sectionCount: 1,
        statusNote: 'Cancelled due to low enrollment',
      },
      {
        courseCode: 'EE517',
        openForRegistration: false,
        sectionCount: 1,
        statusNote: 'Cancelled due to low enrollment',
      },
      {
        courseCode: 'EE577',
        openForRegistration: false,
        sectionCount: 1,
        statusNote: 'Cancelled due to low enrollment',
      },
      { courseCode: 'EE595', openForRegistration: true, sectionCount: 1 },
      {
        courseCode: 'FIN310',
        openForRegistration: false,
        sectionCount: 2,
        statusNote: 'Cancelled due to faculty availability',
      },
      { courseCode: 'FIN501', openForRegistration: true, sectionCount: 2 },
      {
        courseCode: 'FIN522',
        openForRegistration: false,
        sectionCount: 1,
        statusNote: 'Cancelled due to low enrollment',
      },
      {
        courseCode: 'FIN568',
        openForRegistration: false,
        sectionCount: 1,
        statusNote: 'Cancelled due to low enrollment',
      },
      { courseCode: 'FIN585', openForRegistration: true, sectionCount: 1 },
      { courseCode: 'HRM531', openForRegistration: true, sectionCount: 1 },
      { courseCode: 'MATH201', openForRegistration: true, sectionCount: 2 },
      { courseCode: 'MATH202', openForRegistration: true, sectionCount: 1 },
      { courseCode: 'MATH203', openForRegistration: true, sectionCount: 1 },
      { courseCode: 'MATH208', openForRegistration: false, sectionCount: 1 },
      { courseCode: 'MGT310', openForRegistration: true, sectionCount: 2 },
      { courseCode: 'MGT451', openForRegistration: true, sectionCount: 1 },
      { courseCode: 'MGT460', openForRegistration: true, sectionCount: 1 },
      { courseCode: 'MGT480', openForRegistration: true, sectionCount: 1 },
      {
        courseCode: 'MGT500',
        openForRegistration: false,
        sectionCount: 1,
        statusNote: 'Cancelled due to low enrollment',
      },
      { courseCode: 'MGT510', openForRegistration: true, sectionCount: 2 },
      {
        courseCode: 'MGT538',
        openForRegistration: false,
        sectionCount: 1,
        statusNote: 'Cancelled due to low enrollment',
      },
      { courseCode: 'MGT542', openForRegistration: true, sectionCount: 1 },
      { courseCode: 'MKT310', openForRegistration: true, sectionCount: 1 },
      { courseCode: 'MKT483', openForRegistration: false, sectionCount: 1 },
      { courseCode: 'MKT491', openForRegistration: true, sectionCount: 1 },
      {
        courseCode: 'MKT541',
        openForRegistration: false,
        sectionCount: 1,
        statusNote: 'Cancelled due to low enrollment',
      },
      {
        courseCode: 'MKT551',
        openForRegistration: false,
        sectionCount: 1,
        statusNote: 'Cancelled due to low enrollment',
      },
      { courseCode: 'MKT553', openForRegistration: true, sectionCount: 1 },
      { courseCode: 'PSY210', openForRegistration: true, sectionCount: 1 },
      { courseCode: 'PSY220', openForRegistration: false, sectionCount: 1 },
      { courseCode: 'PSY260', openForRegistration: true, sectionCount: 1 },
      { courseCode: 'SEMINAR100', openForRegistration: false, sectionCount: 1 },
      { courseCode: 'SEMINAR200', openForRegistration: false, sectionCount: 1 },
      {
        courseCode: 'SOC501',
        openForRegistration: false,
        sectionCount: 1,
        statusNote: 'Cancelled due to low enrollment',
      },
    ],
  },
];
