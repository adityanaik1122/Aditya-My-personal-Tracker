export type VideoProvider = "youtube" | "google-drive" | "other"

export type MainCategory =
  | "After Effects"
  | "Illustrator"
  | "Drawing"
  | "Brushes"
  | "Colour Theory"
  | "Python Course"
  | "Nuke"
  | "Blender"
  | "Houdini"
  | "Maya"
  | "Cinema 4D"
  | "Animation"
  | "Interview Preparation"
  | "DevOps"
  | "Frontend"
  | "Game Development"
  | "Designing and Video Editing"
  | "CGI for Product Advertising"
  | "Language Learning"

export const mainCategories: MainCategory[] = [
  "After Effects",
  "Illustrator",
  "Drawing",
  "Brushes",
  "Colour Theory",
  "Python Course",
  "Nuke",
  "Blender",
  "Houdini",
  "Maya",
  "Cinema 4D",
  "Animation",
  "Interview Preparation",
  "DevOps",
  "Frontend",
  "Game Development",
  "Designing and Video Editing",
  "CGI for Product Advertising",
  "Language Learning",
]

export interface VideoSource {
  provider: VideoProvider
  videoId?: string
  startTime?: number
  playlistId?: string
  fileId?: string
  url?: string
}

export interface Lesson {
  id: string
  title: string
  duration: string
  completed: boolean
  video: VideoSource
}

export interface CourseSection {
  id: string
  title: string
  lessons: Lesson[]
}

export interface Course {
  id: string
  title: string
  description: string
  instructor: string
  category: MainCategory
  thumbnail: string
  totalLessons: number
  completedLessons: number
  progress: number
  duration: string
  lastWatchedLessonId?: string
  isFavorite: boolean
  sections: CourseSection[]
}

const youtubeVideo = (videoId: string, startTime?: number): VideoSource => ({
  provider: "youtube",
  videoId,
  ...(startTime === undefined ? {} : { startTime }),
})

const youtubePlaylist = (playlistId: string): VideoSource => ({
  provider: "youtube",
  playlistId,
})

export const courses: Course[] = [
  {
    id: "python-course-01",
    title: "Python Courses",
    description: "A curated collection of Python courses and tutorials from YouTube.",
    instructor: "Personal library",
    category: "Python Course",
    thumbnail: "/course-thumbnails/python.svg",
    totalLessons: 6,
    completedLessons: 0,
    progress: 0,
    duration: "Self-paced",
    isFavorite: false,
    sections: [
      {
        id: "python-course-01-lessons",
        title: "Python Course lessons",
        lessons: [
          {
            id: "python-courses-lesson-01",
            title: "Python Full Course for free",
            duration: "YouTube video",
            completed: false,
            video: youtubeVideo("ix9cRaBkVe0"),
          },
          {
            id: "python-courses-lesson-02",
            title: "Harvard CS50’s Introduction to Programming with Python – Full University Course",
            duration: "YouTube video",
            completed: false,
            video: youtubeVideo("nLRL_NcnK-4"),
          },
          {
            id: "python-courses-lesson-03",
            title: "Python for AI - Full Beginner Course",
            duration: "YouTube video",
            completed: false,
            video: youtubeVideo("ygXn5nV5qFc"),
          },
          {
            id: "python-courses-lesson-04",
            title: "Python Tutorials",
            duration: "YouTube playlist",
            completed: false,
            video: youtubePlaylist("PL-osiE80TeTt2d9bfVyTiXJA-UTHn6WwU"),
          },
          {
            id: "python-courses-lesson-05",
            title: "Software Design in Python",
            duration: "YouTube playlist",
            completed: false,
            video: youtubePlaylist("PLC0nd42SBTaNuP4iB4L6SJlMaHE71FG6N"),
          },
          {
            id: "python-courses-lesson-06",
            title: "Python FastAPI Tutorial: Full Course for Beginners - Build a Full-Stack Web App",
            duration: "YouTube video",
            completed: false,
            video: youtubeVideo("iukOehU5aF4"),
          },
        ],
      },
    ],
  },
  {
    id: "after-effects-tutorials-01",
    title: "After Effects Tutorials 01",
    description: "A YouTube lesson added to test video playback in the After Effects category.",
    instructor: "Personal library",
    category: "After Effects",
    thumbnail: "/course-thumbnails/marketing.svg",
    totalLessons: 9,
    completedLessons: 0,
    progress: 0,
    duration: "YouTube video",
    isFavorite: false,
    sections: [
      {
        id: "after-effects-course-01-lessons",
        title: "After Effects Course lessons",
        lessons: [
          {
            id: "after-effects-course-01-introduction",
            title: "Create an Infinite Zoom Photos, Videos, Motion Graphics After Effects Tutori HD",
            duration: "YouTube video",
            completed: false,
            video: youtubeVideo("9unrL2OW4m0"),
          },
          {
            id: "after-effects-course-01-lesson-02",
            title: "Black Mixture Reacts to Your Best Glowing Scribble Dance Animations",
            duration: "YouTube video",
            completed: false,
            video: youtubeVideo("CYtybajMHZw"),
          },
          {
            id: "after-effects-course-01-lesson-03",
            title: "After Effects Tutorial Light Stroke No Plugins",
            duration: "YouTube video",
            completed: false,
            video: youtubeVideo("ZZ7I4KgyCwY"),
          },
          {
            id: "after-effects-course-01-lesson-04",
            title: "After Effects Tutorial Cinematic Title Animation in After Effects simple way!!! 2019",
            duration: "YouTube video",
            completed: false,
            video: youtubeVideo("HPSWDSOsFY0"),
          },
          {
            id: "after-effects-course-01-lesson-05",
            title: "After Effects BLACKPINK Glowing Scribble Dance Animation Tutorial part 2 + Free HD",
            duration: "YouTube video",
            completed: false,
            video: youtubeVideo("NR5cZDdrRp0"),
          },
          {
            id: "after-effects-course-01-lesson-06",
            title: "4 Background",
            duration: "YouTube video",
            completed: false,
            video: youtubeVideo("MhXsfXqH7z8"),
          },
          {
            id: "after-effects-course-01-lesson-07",
            title: "Freeze Frame Effect360p",
            duration: "YouTube video",
            completed: false,
            video: youtubeVideo("7ctIVu0Ag38"),
          },
          {
            id: "after-effects-course-01-lesson-08",
            title: "The Full SaaS Animations Masterclass in after effects | For Beginners | FREE Assets",
            duration: "YouTube video",
            completed: false,
            video: youtubeVideo("NPpeX_Suhpg"),
          },
          {
            id: "after-effects-course-01-lesson-09",
            title: "Create Your Own Plugin in After Effects (Free & Easy ScriptUI Panel Method)",
            duration: "YouTube video",
            completed: false,
            video: youtubeVideo("aOFrxATiN8c"),
          },
        ],
      },
    ],
  },
  {
    id: "interview-preparation",
    title: "Interview Preparation",
    description: "A focused collection of Java, Spring Boot, and software interview preparation resources.",
    instructor: "Personal library",
    category: "Interview Preparation",
    thumbnail: "/course-thumbnails/python.svg",
    totalLessons: 29,
    completedLessons: 0,
    progress: 0,
    duration: "Self-paced",
    isFavorite: false,
    sections: [
      {
        id: "interview-java",
        title: "Java",
        lessons: [
          { id: "interview-java-rest-controller", title: "Difference between Rest Controller and Controller : Java Spring Boot Interview Question 2", duration: "YouTube video", completed: false, video: youtubeVideo("KndaEmcreJo") },
          { id: "interview-java-msci", title: "Best Way To Crack Any Interview | MSCI Interview Experience Nobody Tells You", duration: "YouTube video", completed: false, video: youtubeVideo("2p21-VvHtWk") },
          { id: "interview-java-core", title: "Core Java frequently asked Interview Questions and Answers", duration: "YouTube playlist", completed: false, video: youtubePlaylist("PLyHJZXNdCXscoyL5XEZoHHZ86_6h3GWE1") },
          { id: "interview-java-react", title: "Top 20 React JS Interview Questions For 2025 | React Interviewer Questions & Answers | Intellipaat", duration: "YouTube video", completed: false, video: youtubeVideo("NkWOzTEEcco") },
          { id: "interview-java-javascript", title: "Top 30 JavaScript Interview Questions 2025 | JavaScript Interview Questions & Answers | Intellipaat", duration: "YouTube video", completed: false, video: youtubeVideo("MX48mv73jf8") },
          { id: "interview-java-html", title: "Top HTML Interview Questions And Answers | MOST ASKED HTML Interview Questions (2025) | Intellipaat", duration: "YouTube video", completed: false, video: youtubeVideo("FhTvNXk4LEQ") },
          { id: "interview-java-html-css", title: "HTML CSS Interview Questions and Answers | Top 30 HTML CSS Interview Questions | Edureka", duration: "YouTube video", completed: false, video: youtubeVideo("76RFEWtPFK0") },
          { id: "interview-java-csharp", title: "C# .NET Interview Questions for 10 Years Experience", duration: "YouTube playlist", completed: false, video: youtubePlaylist("PLQMqUlV2_B8ngL_PaT9UFsd0-PvnrpZGC") },
          { id: "interview-java-django", title: "30 Most Asked Django Interview Questions 2025 | Django Interview Questions And Answers | Intellipaat", duration: "YouTube video", completed: false, video: youtubeVideo("fJ8EAU87EFk") },
          { id: "interview-java-fastapi", title: "FastAPI Interview Questions and Answers 2025 | Crack Python FastAPI Interviews (Part 1)", duration: "YouTube video", completed: false, video: youtubeVideo("jsgUCcOEQMM") },
          { id: "interview-java-python", title: "50 Most Asked Python Interview Questions | Python Interview Questions & Answers", duration: "YouTube video", completed: false, video: youtubeVideo("WH_ieAsb4AI") },
          { id: "interview-java-software", title: "Software Engineering Job Interview – Full Mock Interview", duration: "YouTube video", completed: false, video: youtubeVideo("1qw5ITr3k9E") },
        ],
      },
      {
        id: "interview-spring-boot",
        title: "Spring Boot",
        lessons: [
          { id: "interview-spring-application", title: "@SpringBootApplication Internal Working | IOC Container & Dependency Injection in Spring Boot", duration: "YouTube video", completed: false, video: youtubeVideo("99M7TJvijUk") },
          { id: "interview-spring-rest-api", title: "Creating REST API using Spring Boot in Hindi | A Step-by-Step Tutorial", duration: "YouTube video", completed: false, video: youtubeVideo("rxT5RFYxjSg") },
          { id: "interview-spring-questions", title: "Spring Boot Interview Questions", duration: "YouTube playlist", completed: false, video: youtubePlaylist("PLwsTfOnizFBzMvAkP_vvbLj721BqIgYDh") },
        ],
      },
      {
        id: "interview-general-topics",
        title: "General Interview Preparation",
        lessons: [
          { id: "interview-job-prep", title: "Job Interview Prep", duration: "YouTube playlist", completed: false, video: youtubePlaylist("PLhrBmkjLNq1U9D_PVJpUNzh9qFxsNmEwo") },
          { id: "interview-data-science", title: "Data Science Job Interview – Full Mock Interview", duration: "YouTube video", completed: false, video: youtubeVideo("sD468LfeVdc") },
          { id: "interview-data-analytics", title: "Data Analytics Mock Interview 2026 | SQL Interview Questions & Answers for Freshers.", duration: "YouTube video", completed: false, video: youtubeVideo("Hh4EoUqiPfw") },
          { id: "interview-generative-ai", title: "Generative AI Interview Questions 2026 | Gen AI Interview Questions and Answers | MindMajix", duration: "YouTube video", completed: false, video: youtubeVideo("87mokYUWQng") },
          { id: "interview-machine-learning", title: "100 Most Common Interview Questions on Machine Learning | With Solutions", duration: "YouTube video", completed: false, video: youtubeVideo("yA_Vtygj5FA") },
          { id: "interview-rest-api", title: "REST API Interview Questions (Beginner Level)", duration: "YouTube video", completed: false, video: youtubeVideo("faMdrSCVDzc") },
          { id: "interview-behavioral-star", title: "STAR INTERVIEW QUESTIONS & ANSWERS! (The STAR TECHNIQUE for Behavioural Interview Questions!)", duration: "YouTube video", completed: false, video: youtubeVideo("uQEuo7woEEk") },
          { id: "interview-graphic-design", title: "Top Graphic Design Interview Questions and Answers | Yogi Arts Guide", duration: "YouTube video", completed: false, video: youtubeVideo("4BNI9bosVsM") },
          { id: "interview-ui-ux", title: "UI UX Designer Interview Questions And Answers 2025 | UI UX Design Interview Questions | Intellipaat", duration: "YouTube video", completed: false, video: youtubeVideo("AmdcTuEJ5o4") },
          { id: "interview-unknown", title: "Interview Preparation Video", duration: "YouTube video", completed: false, video: youtubeVideo("fxaOGu_Cdys") },
          { id: "interview-behavioral", title: "BEHAVIOURAL INTERVIEW QUESTIONS & ANSWERS!", duration: "YouTube video", completed: false, video: youtubeVideo("UdJIyqyJ84I") },
        ],
      },
      {
        id: "interview-logic-building",
        title: "Logic Building Programs",
        lessons: [
          { id: "interview-logic-building", title: "Logic Building Programs", duration: "YouTube playlist", completed: false, video: youtubePlaylist("PLQU_Gzt0f8XSPwChHoDYhPd4EK3Y604Gq") },
        ],
      },
      {
        id: "interview-python-programs",
        title: "Python Programs with Solutions",
        lessons: [
          { id: "interview-python-programs", title: "100+ Python Programs with Solutions Series by WsCube Tech", duration: "YouTube playlist", completed: false, video: youtubePlaylist("PLjVLYmrlmjGf3jtxG8lSo-zaPktQ7YbUw") },
        ],
      },
      {
        id: "interview-dsa",
        title: "Data Structures and Algorithms (DSA)",
        lessons: [
          { id: "interview-dsa", title: "Data Structures and Algorithms (DSA)", duration: "YouTube playlist", completed: false, video: youtubePlaylist("PLQU_Gzt0f8XSsX1Sxzpj0IiNpEXxd9FcF") },
        ],
      },
    ],
  },
  {
    id: "devops",
    title: "DevOps",
    description: "A practical DevOps learning resource from your personal course library.",
    instructor: "MPrashant",
    category: "DevOps",
    thumbnail: "/course-thumbnails/python.svg",
    totalLessons: 7,
    completedLessons: 0,
    progress: 0,
    duration: "YouTube video",
    isFavorite: false,
    sections: [
      {
        id: "devops-lessons",
        title: "DevOps lessons",
        lessons: [
          {
            id: "devops-aws-beginners",
            title: "AWS in ONE VIDEO 🔥 For Beginners 2026 [HINDI] | MPrashant",
            duration: "YouTube video",
            completed: false,
            video: youtubeVideo("N4sJj-SxX00", 310),
          },
          { id: "devops-jenkins-course", title: "Jenkins Full Course 2023 | Jenkins Tutorial For Beginners", duration: "YouTube video", completed: false, video: youtubeVideo("WvcHQtyPcTs") },
          { id: "devops-ai-course", title: "Full Stack AI DevOps Course + Real Projects 🚀 | Docker + Kubernetes + CI/CD + Terraform | Job Ready", duration: "YouTube video", completed: false, video: youtubeVideo("Kb-sw00KJ10") },
          { id: "devops-cicd", title: "CI/CD Explained: The DevOps Skill That Makes You 10x More Valuable", duration: "YouTube video", completed: false, video: youtubeVideo("AknbizcLq4w") },
          { id: "devops-jenkins-beginners", title: "Jenkins for Beginners", duration: "YouTube video", completed: false, video: youtubeVideo("1LE1llhafOE") },
          { id: "devops-introduction", title: "Introduction To DevOps | Devops Tutorial For Beginners | DevOps Training For Beginners | Simplilearn", duration: "YouTube video", completed: false, video: youtubeVideo("Me3ea4nUt0U") },
          { id: "devops-docker", title: "What Is Docker? | What Is Docker And How It Works? | Docker Tutorial For Beginners | Simplilearn", duration: "YouTube video", completed: false, video: youtubeVideo("rOTqprHv1YE") },
        ],
      },
    ],
  },
  {
    id: "frontend",
    title: "Frontend",
    description: "A complete HTML tutorial playlist for building frontend fundamentals.",
    instructor: "Thapa Technical",
    category: "Frontend",
    thumbnail: "/course-thumbnails/react.svg",
    totalLessons: 7,
    completedLessons: 0,
    progress: 0,
    duration: "YouTube playlist",
    isFavorite: false,
    sections: [
      {
        id: "frontend-lessons",
        title: "Frontend lessons",
        lessons: [
          {
            id: "frontend-html-complete-tutorial",
            title: "HTML Complete Tutorial for Beginners in Hindi 🔥Free Notes + Codes",
            duration: "YouTube playlist",
            completed: false,
            video: youtubePlaylist("PLwGdqUZWnOp3F_J159kfx22z7VmJ7LfU8"),
          },
          { id: "frontend-browser-work", title: "How does a browser work ? | Engineering side", duration: "YouTube video", completed: false, video: youtubeVideo("5rLFYtXHo9s") },
          { id: "frontend-browser-render", title: "Ryan Seddon: So how does the browser actually render a website | JSConf EU 2015", duration: "YouTube video", completed: false, video: youtubeVideo("SmE4OwHztCc") },
          { id: "frontend-browser-internals", title: "How Web Browsers Work", duration: "YouTube video", completed: false, video: youtubeVideo("EoYkl8rwbiM") },
          { id: "frontend-webgl", title: "WebGL 3D Graphics Explained in 100 Seconds", duration: "YouTube video", completed: false, video: youtubeVideo("f-9LEoYYvE4") },
          { id: "frontend-critical-rendering", title: "Critical Rendering Path (CRP) - an underrated topic #hindi #frontendengineer", duration: "YouTube video", completed: false, video: youtubeVideo("Tnp3yX9Z93Q") },
          { id: "frontend-rendering-process", title: "How Browsers Render Websites (The Step-by-Step Process)", duration: "YouTube video", completed: false, video: youtubeVideo("NBAjlYb6jIs") },
        ],
      },
    ],
  },
  {
    id: "game-development",
    title: "Game Development",
    description: "Explore game development with Unity and multiplayer game technologies.",
    instructor: "Personal library",
    category: "Game Development",
    thumbnail: "/course-thumbnails/react.svg",
    totalLessons: 2,
    completedLessons: 0,
    progress: 0,
    duration: "YouTube resources",
    isFavorite: false,
    sections: [
      {
        id: "game-development-lessons",
        title: "Game Development lessons",
        lessons: [
          { id: "game-development-unity-mmo", title: "Unity Tutorial – Massive Multiplayer Online (MMO) Game with SpacetimeDB", duration: "YouTube video", completed: false, video: youtubeVideo("msVwc0IwYl0") },
          { id: "game-development-course", title: "Game Development Course", duration: "YouTube playlist", completed: false, video: youtubePlaylist("PLBh8phtAyHPUY9fqgs1w6aHJALJ3_fMSc") },
        ],
      },
    ],
  },
  {
    id: "designing-and-video-editing",
    title: "Designing and Video Editing",
    description: "A collection of design, AI, video editing, motion graphics, and creative production resources.",
    instructor: "Personal library",
    category: "Designing and Video Editing",
    thumbnail: "/course-thumbnails/design.svg",
    totalLessons: 7,
    completedLessons: 0,
    progress: 0,
    duration: "YouTube resources",
    isFavorite: false,
    sections: [
      {
        id: "designing-video-editing-lessons",
        title: "Design and video lessons",
        lessons: [
          { id: "designing-video-design", title: "6 years of DESIGN in 6 minutes", duration: "YouTube video", completed: false, video: youtubeVideo("g-3Rtq_laok") },
          { id: "designing-video-ai-3d", title: "The NEW Way To Use AI For 3D Artists", duration: "YouTube video", completed: false, video: youtubeVideo("YB5Jp9_WN78") },
          { id: "designing-video-davinci", title: "Introduction to DaVinci Resolve - [Full Course] for Beginners (2026)", duration: "YouTube video", completed: false, video: youtubeVideo("MCDVcQIA3UM") },
          { id: "designing-video-twinmotion", title: "Twinmotion for Architecture - 2025 Full Extended Course", duration: "YouTube video", completed: false, video: youtubeVideo("zANebaA0yVA") },
          { id: "designing-video-weavy", title: "Weavy AI Masterclass: Build Next-Level AI Workflows (Figma Weave Course)", duration: "YouTube video", completed: false, video: youtubeVideo("dJZHl17YldM") },
          { id: "designing-video-motion", title: "Motion Graphics Masterclass (6 Hours) – Complete After Effects Training for Beginners to Pros", duration: "YouTube video", completed: false, video: youtubeVideo("QNMdUZ_WVq0") },
          { id: "designing-video-comfyui", title: "ComfyUI Course - Learn ComfyUI From Scratch | Pixaroma", duration: "YouTube playlist", completed: false, video: youtubePlaylist("PL-pohOSaL8P-FhSw1Iwf0pBGzXdtv4DZC") },
        ],
      },
    ],
  },
  {
    id: "cgi-product-advertising-blender",
    title: "CGI for Product Advertising - Blender 3D",
    description: "Learn Blender 3D workflows for CGI product advertising and visual production.",
    instructor: "CrossMind Studio",
    category: "CGI for Product Advertising",
    thumbnail: "/course-thumbnails/python.svg",
    totalLessons: 2,
    completedLessons: 0,
    progress: 0,
    duration: "YouTube resources",
    isFavorite: false,
    sections: [
      {
        id: "cgi-product-advertising-lessons",
        title: "Blender 3D lessons",
        lessons: [
          { id: "cgi-product-advertising-course", title: "CGI for Product Advertising - Blender 3D", duration: "YouTube playlist", completed: false, video: youtubePlaylist("PLgO2ChD7acqHF8-iBREcfEO08SAWeMF0f") },
          { id: "cgi-product-advertising-blender-course", title: "Blender 3D Hindi/Urdu Full Course (Beginner to Advanced)", duration: "YouTube video", completed: false, video: youtubeVideo("BgLYKrjgskU") },
        ],
      },
    ],
  },
  {
    id: "language-learning",
    title: "Language Learning",
    description: "Build a flexible language-learning collection with German and Italian resources.",
    instructor: "Personal library",
    category: "Language Learning",
    thumbnail: "/course-thumbnails/python.svg",
    totalLessons: 3,
    completedLessons: 0,
    progress: 0,
    duration: "YouTube resources",
    isFavorite: false,
    sections: [
      {
        id: "language-learning-lessons",
        title: "Language lessons",
        lessons: [
          { id: "language-german", title: "Learn German Step by Step | Full German A1 Course For Beginners | 9.5 Hours", duration: "YouTube video", completed: false, video: youtubeVideo("-KdGfbgL6sg") },
          { id: "language-italian-course", title: "Learn Italian in 30 Days (The Most Organized Online Course!)", duration: "YouTube playlist", completed: false, video: youtubePlaylist("PLHI2TAm-NyNPpFJriRvVbxVoJ4jksDUUH") },
          { id: "language-italian-mini-course", title: "Italian for Beginners: A Mini Language Course", duration: "YouTube video", completed: false, video: youtubeVideo("FAxsjpZ4lik") },
        ],
      },
    ],
  },
]

export const getCourseById = (courseId: string) =>
  courses.find((course) => course.id === courseId)

export function getLessonById(lessonId: string) {
  for (const course of courses) {
    for (const section of course.sections) {
      const lesson = section.lessons.find((item) => item.id === lessonId)

      if (lesson) {
        return { course, lesson }
      }
    }
  }
}
