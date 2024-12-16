import { create } from "zustand"
import { persist } from "zustand/middleware"

import { ResumeMetadata } from "../../types/resume"

interface ResumeStore {
  resumeMetadata: ResumeMetadata
  pendingResumeMetadata: Partial<ResumeMetadata> | null
  resumeMarkdown: string
  pendingResumeMarkdown: string | null
  updateResumeMetadata: (newData: Partial<ResumeMetadata>) => void
  updateResumeMarkdown: (markdown: string) => void
  resetResumeMetadata: () => void
  resetResumeMarkdown: () => void
  setPendingResumeMetadata: (newData: Partial<ResumeMetadata> | null) => void
  setPendingResumeMarkdown: (markdown: string | null) => void
}

const initialResumeMetadata: ResumeMetadata = {
  基本信息: {
    姓名: "",
    性别: "",
    年龄: "",
    所在地: "",
    婚姻状况: "",
    职业状态: "",
    期望薪资: "",
  },
  联系方式: {
    微信: "",
    电话: "",
    邮箱: "",
    个人网站: "",
    LinkedIn: "",
    GitHub: "",
  },
  教育经历: [],
  技能: {
    技术技能: [],
    软技能: [],
    语言能力: [],
    证书与资格认证: [],
  },
  工作经历: [],
  项目经历: [],
  培训经历: [],
  求职意向: {
    目标岗位: "",
    期望行业: "",
    期望地点: "",
    期望薪资: "",
    工作模式: "",
  },
  兴趣爱好: [],
  推荐人: [],
}

const initialResumeMarkdown = `# 邢凯的简历\n\n## 基本信息\n\n- **姓名**: 邢凯\n- **性别**: 男\n- **出生日期**: 2001\n- **所在地**: 杭州\n- **婚姻状况**: 未婚\n- **职业状态**: 在职\n- **期望薪资**: 9k\n\n## 联系方式\n\n- **微信**: Loos_and\n- **电话**: 1534564804\n- **邮箱**: loosand@163.com\n\n## 求职意向\n\n- **目标岗位**: 前端开发\n- **期望行业**: 互联网\n- **期望地点**: 杭州\n- **期望薪资**: 9k\n- **工作模式**: 全职\n\n## 教育经历\n\n- **学校**: ��鞍山学院\n  - **专业**: 软件工程\n  - **学历**: 本科\n  - **证书**: CET-4\n  - **奖项**: 2023年度校级奖学金\n\n## 工作经历\n\n- **公司名称**: 杭州魔球科技\n  - **行业**: 互联网\n  - **职位**: 前端开发\n  - **职位类型**: 实习\n  - **入职时间**: 2023.11\n  - **离职时间**: 2024.05\n  - **主要职责**:\n    - 独立负责 Playtrac AI 运动相机项目小程序机构版项目的开发和迭代工作，使用 React、Taro 等技术。\n    - 对接后端服务接口，确保接口设计合理、安全。\n    - 负责 Playtrac 官网开发，实现响应式和 SEO 优化，基于 Next.js、Tailwind 等技术。\n\n## 项目经历\n\n- **项目名称**: Playtrac Court\n  - **使用技术**: React 18, Taro.js, TypeScript, Tailwind\n  - **项目类型**: 商业项目\n  - **项目描述**: 一款针对篮球等体育赛事的 AI 运动相机和数据分析的微信小程序，分为个人版/机构版。功能包括班级/课程/学生管理、上课/上课中、选择球场/打球、生涯数据/集锦、视频收藏/观看。\n  - **职责描述**:\n    - 独立负责所有功能开发、技术选型、与服务端联调，Mentor 负责备案、发版相关操作。\n  - **成果**: 上线地址: 微信小程序搜索 Playtrac Count，机构版暂未上线，可面试��演示。\n\n## 技能\n\n- **技术技能**:\n  - 熟练掌握 HTML5、CSS3、Tailwind、Less，使⽤ Tailwind 开发移动端优先的响应式⽹⻚。\n  - 熟练掌握 JavaScript 语法和 ES6 特性，熟练 TypeScript + React 开发。\n  - 熟练掌握 React 技术⽣态；熟练 Taro.JS 开发微信⼩程序，熟悉 Next.js 开发。\n  - 熟悉 Vue3 以及相关技术⽣态，能快速上⼿进⾏开发。\n  - 熟悉前端⼯程化、webpack 配置、JS 模块化。\n  - 了解 Node.js，能使⽤ Egg.js/Express 搭建服务器。\n  - 熟悉 HTTP 协议以及常⽤的⽹络调试⼯具，具备基础的⽹络知识。\n  - 熟悉常⽤的 Git 命令，了解团队代码提交流程和规范。`

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set) => ({
      resumeMetadata: initialResumeMetadata,
      resumeMarkdown: initialResumeMarkdown,
      pendingResumeMetadata: null,
      pendingResumeMarkdown: null,
      updateResumeMetadata: (newData) =>
        set((state) => ({
          resumeMetadata: { ...state.resumeMetadata, ...newData },
        })),
      updateResumeMarkdown: (markdown) => set({ resumeMarkdown: markdown }),
      resetResumeMetadata: () => set({ resumeMetadata: initialResumeMetadata }),
      resetResumeMarkdown: () => set({ resumeMarkdown: initialResumeMarkdown }),
      setPendingResumeMetadata: (newData) =>
        set({ pendingResumeMetadata: newData }),
      setPendingResumeMarkdown: (markdown) =>
        set({ pendingResumeMarkdown: markdown }),
    }),
    {
      name: "resume-storage",
      partialize: (state) => ({
        resumeMetadata: state.resumeMetadata,
        resumeMarkdown: state.resumeMarkdown,
      }),
    },
  ),
)
