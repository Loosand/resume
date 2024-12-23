"use client"

import React from "react"
import Image from "next/image"

export {
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

function ResumeHeader({
  basicInfo,
  contactInfo,
}: {
  basicInfo: {
    姓名: string
    性别: string
    年龄: string
    出生日期: string
    所在地: string
    婚姻状况: string
    职业状态: string
    期望薪资: string
  }
  contactInfo: {
    微信: string
    电话: string
    邮箱: string
    个人网站: string
    LinkedIn: string
    GitHub: string
  }
}) {
  return (
    <header className="mb-6 flex flex-col items-center gap-6 bg-gray-800 p-6 text-white lg:flex-row lg:items-start">
      <Image
        src="/placeholder.svg?height=200&width=200"
        alt={basicInfo.姓名}
        width={96}
        height={96}
        className="rounded-full object-cover"
      />
      <div className="text-center lg:text-left">
        <h1 className="mb-2 text-3xl font-bold">{basicInfo.姓名}</h1>
        <p className="mb-4 text-xl text-gray-300">{basicInfo.职业状态}</p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <p>性别: {basicInfo.性别}</p>
          <p>年龄: {basicInfo.年龄}</p>
          <p>出生日期: {basicInfo.出生日期}</p>
          <p>所在地: {basicInfo.所在地}</p>
          <p>婚姻状况: {basicInfo.婚姻状况}</p>
          <p>期望薪资: {basicInfo.期望薪资}</p>
        </div>
      </div>
      <div className="text-sm">
        <h2 className="mb-2 font-semibold">联系方式</h2>
        <p>微信: {contactInfo.微信}</p>
        <p>电话: {contactInfo.电话}</p>
        <p>邮箱: {contactInfo.邮箱}</p>
        <p>
          个人网站:{" "}
          <a
            href={contactInfo.个人网站}
            className="text-blue-300 hover:underline"
          >
            {contactInfo.个人网站}
          </a>
        </p>
        <p>
          LinkedIn:{" "}
          <a
            href={contactInfo.LinkedIn}
            className="text-blue-300 hover:underline"
          >
            {contactInfo.LinkedIn}
          </a>
        </p>
        <p>
          GitHub:{" "}
          <a
            href={contactInfo.GitHub}
            className="text-blue-300 hover:underline"
          >
            {contactInfo.GitHub}
          </a>
        </p>
      </div>
    </header>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="mb-6">
      <h2 className="mb-4 border-b border-gray-200 pb-2 text-xl font-semibold">
        {title}
      </h2>
      {children}
    </section>
  )
}

function Education({
  education,
}: {
  education: {
    学校: string
    专业: string
    学历: string
    入学时间: string
    毕业时间: string
    证书: string[]
    奖项: string[]
  }
}) {
  return (
    <div className="mb-4">
      <h3 className="font-semibold">{education.学校}</h3>
      <p className="text-gray-600">
        {education.专业} - {education.学历}
      </p>
      <p className="text-sm">
        {education.入学时间} - {education.毕业时间}
      </p>
      {education.证书.length > 0 && (
        <div className="mt-2">
          <p className="font-medium">证书:</p>
          <ul className="list-inside list-disc">
            {education.证书.map((cert, index) => (
              <li key={index}>{cert}</li>
            ))}
          </ul>
        </div>
      )}
      {education.奖项.length > 0 && (
        <div className="mt-2">
          <p className="font-medium">奖项:</p>
          <ul className="list-inside list-disc">
            {education.奖项.map((award, index) => (
              <li key={index}>{award}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function SkillSection({
  skills,
}: {
  skills: {
    技术技能: { 技能名: string; 熟练程度: string }[]
    软技能: { 技能名: string; 熟练程度: string }[]
    语言能力: { 语言: string; 水平: string }[]
    证书与资格认证: { 证书名称: string; 颁发机构: string; 取得时间: string }[]
  }
}) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div>
        <h3 className="mb-2 font-semibold">技术技能</h3>
        {skills.技术技能.map((skill, index) => (
          <p key={index}>
            {skill.技能名}: {skill.熟练程度}
          </p>
        ))}
      </div>
      <div>
        <h3 className="mb-2 font-semibold">软技能</h3>
        {skills.软技能.map((skill, index) => (
          <p key={index}>
            {skill.技能名}: {skill.熟练程度}
          </p>
        ))}
      </div>
      <div>
        <h3 className="mb-2 font-semibold">语言能力</h3>
        {skills.语言能力.map((lang, index) => (
          <p key={index}>
            {lang.语言}: {lang.水平}
          </p>
        ))}
      </div>
      <div>
        <h3 className="mb-2 font-semibold">证书与资格认证</h3>
        {skills.证书与资格认证.map((cert, index) => (
          <p key={index}>
            {cert.证书名称} - {cert.颁发机构} ({cert.取得时间})
          </p>
        ))}
      </div>
    </div>
  )
}

function WorkExperience({
  experience,
}: {
  experience: {
    公司名称: string
    行业: string
    职位: string
    职位类型: string
    工作性质: string
    团队规模: string
    入职时间: string
    离职时间: string
    主要职责: string[]
    业绩和成果: string[]
  }
}) {
  return (
    <div className="mb-6">
      <div className="mb-2 flex items-start justify-between">
        <div>
          <h3 className="font-semibold">{experience.公司名称}</h3>
          <p className="text-gray-600">
            {experience.职位} ({experience.职位类型})
          </p>
        </div>
        <div className="text-right">
          <p className="text-gray-600">{experience.行业}</p>
          <p className="text-sm">
            {experience.入职时间} - {experience.离职时间}
          </p>
        </div>
      </div>
      <p className="mb-2 text-sm">
        工作性质: {experience.工作性质} | 团队规模: {experience.团队规模}
      </p>
      <div className="mt-2">
        <p className="font-medium">主要职责:</p>
        <ul className="list-inside list-disc">
          {experience.主要职责.map((duty, index) => (
            <li key={index}>{duty}</li>
          ))}
        </ul>
      </div>
      <div className="mt-2">
        <p className="font-medium">业绩和成果:</p>
        <ul className="list-inside list-disc">
          {experience.业绩和成果.map((achievement, index) => (
            <li key={index}>{achievement}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function ProjectExperience({
  project,
}: {
  project: {
    项目名称: string
    使用技术: string[]
    项目类型: string
    角色: string
    项目描述: string
    职责描述: string[]
    成果: string
    上线地址: string
    其他备注: string
  }
}) {
  return (
    <div className="mb-6">
      <h3 className="font-semibold">{project.项目名称}</h3>
      <p className="mb-2 text-gray-600">
        {project.角色} | {project.项目类型}
      </p>
      <p className="mb-2 text-sm">使用技术: {project.使用技术.join(", ")}</p>
      <p className="mb-2">{project.项目描述}</p>
      <div className="mt-2">
        <p className="font-medium">职责描述:</p>
        <ul className="list-inside list-disc">
          {project.职责描述.map((duty, index) => (
            <li key={index}>{duty}</li>
          ))}
        </ul>
      </div>
      <p className="mt-2">
        <span className="font-medium">成果:</span> {project.成果}
      </p>
      {project.上线地址 && (
        <p className="mt-2">
          <span className="font-medium">上线地址:</span>{" "}
          <a href={project.上线地址} className="text-blue-600 hover:underline">
            {project.上线地址}
          </a>
        </p>
      )}
      {project.其他备注 && (
        <p className="mt-2">
          <span className="font-medium">其他备注:</span> {project.其他备注}
        </p>
      )}
    </div>
  )
}

function Training({
  training,
}: {
  training: {
    培训机构: string
    课程名称: string
    培训时间: string
    证书: string
  }
}) {
  return (
    <div className="mb-4">
      <h3 className="font-semibold">{training.培训机构}</h3>
      <p className="text-gray-600">{training.课程名称}</p>
      <p className="text-sm">{training.培训时间}</p>
      {training.证书 && (
        <p className="mt-1">
          <span className="font-medium">证书:</span> {training.证书}
        </p>
      )}
    </div>
  )
}

function JobIntention({
  intention,
}: {
  intention: {
    目标岗位: string
    期望行业: string
    期望地点: string
    期望薪资: string
    工作模式: string
  }
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <p>
        <span className="font-medium">目标岗位:</span> {intention.目标岗位}
      </p>
      <p>
        <span className="font-medium">期望行业:</span> {intention.期望行业}
      </p>
      <p>
        <span className="font-medium">期望地点:</span> {intention.期望地点}
      </p>
      <p>
        <span className="font-medium">期望薪资:</span> {intention.期望薪资}
      </p>
      <p>
        <span className="font-medium">工作模式:</span> {intention.工作模式}
      </p>
    </div>
  )
}

function Referees({
  referees,
}: {
  referees: {
    姓名: string
    职位: string
    公司: string
    联系方式: string
  }[]
}) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {referees.map((referee, index) => (
        <div key={index} className="rounded-lg border p-4">
          <h3 className="font-semibold">{referee.姓名}</h3>
          <p className="text-gray-600">{referee.职位}</p>
          <p className="text-sm">{referee.公司}</p>
          <p className="mt-2 text-sm">联系方式: {referee.联系方式}</p>
        </div>
      ))}
    </div>
  )
}
