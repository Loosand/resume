import DebugClientComponent from "../../components/debug/DebugClientComponent"

import {
  ResumeHeader,
  Section,
  Education,
  SkillSection,
  WorkExperience,
  ProjectExperience,
  Training,
  JobIntention,
  Referees,
} from "@/components/mdx/MdxComponents"

const components = {
  ResumeHeader,
  Section,
  Education,
  SkillSection,
  WorkExperience,
  ProjectExperience,
  Training,
  JobIntention,
  Referees,
}

export default async function Home() {
  return (
    <div className="flex h-screen flex-col bg-background">
      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/2 border-r p-4">
          <DebugClientComponent />
        </div>
        <div className="w-1/2 overflow-y-auto p-4"></div>
      </div>
    </div>
  )
}
