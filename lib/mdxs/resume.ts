export const resumeContent = `
<div className="max-w-[210mm] mx-auto bg-white min-h-screen shadow-lg">
  <ResumeHeader
    basicInfo={{
      姓名: "张三",
      性别: "男",
      年龄: "28",
      出生日期: "1995-01-15",
      所在地: "北京市朝阳区",
      婚姻状况: "未婚",
      职业状态: "在职",
      期望薪资: "25k-30k"
    }}
    contactInfo={{
      微信: "zhangsan_1995",
      电话: "13800138000",
      邮箱: "zhangsan@example.com",
      个人网站: "https://zhangsan.dev",
      LinkedIn: "https://www.linkedin.com/in/zhangsan",
      GitHub: "https://github.com/zhangsan"
    }}
  />

  <div className="px-6">
    <Section title="教育经历">
      <Education
        education={{
          学校: "北京大学",
          专业: "计算机科学与技术",
          学历: "本科",
          入学时间: "2013-09",
          毕业时间: "2017-07",
          证书: ["优秀毕业生"],
          奖项: ["校级奖学金", "ACM程序设计大赛三等奖"]
        }}
      />
    </Section>

    <Section title="技能">
      <SkillSection
        skills={{
          技术技能: [
            { 技能名: "JavaScript", 熟练程度: "精通" },
            { 技能名: "React", 熟练程度: "熟练" },
            { 技能名: "Node.js", 熟练程度: "熟练" },
            { 技能名: "Python", 熟练程度: "良好" }
          ],
          软技能: [
            { 技能名: "团队协作", 熟练程度: "优秀" },
            { 技能名: "项目管理", 熟练程度: "良好" },
            { 技能名: "沟通能力", 熟练程度: "优秀" }
          ],
          语言能力: [
            { 语言: "中文", 水平: "母语" },
            { 语言: "英语", 水平: "流利" }
          ],
          证书与资格认证: [
            { 证书名称: "AWS Certified Developer", 颁发机构: "Amazon", 取得时间: "2022-03" },
            { 证书名称: "PMP", 颁发机构: "PMI", 取得时间: "2021-09" }
          ]
        }}
      />
    </Section>

    <Section title="工作经历">
      <WorkExperience
        experience={{
          公司名称: "北京科技有限公司",
          行业: "互联网",
          职位: "高级前端开发工程师",
          职位类型: "全职",
          工作性质: "技术",
          团队规模: "20-30人",
          入职时间: "2019-03",
          离职时间: "至今",
          主要职责: [
            "负责公司核心产品的前端开发和维护",
            "优化前端性能，提升用户体验",
            "参与技术方案的讨论和制定",
            "指导初级开发人员，协助团队成长"
          ],
          业绩和成果: [
            "将产品首页加载时间减少50%，显著提升用户体验",
            "设计并实现了可复用的组件库，提高了开发效率",
            "成功带领团队完成了三个大型项目的开发和上线"
          ]
        }}
      />
    </Section>

    <Section title="项目经历">
      <ProjectExperience
        project={{
          项目名称: "企业级数据分析平台",
          使用技术: ["React", "Node.js", "GraphQL", "AWS"],
          项目类型: "Web应用",
          角色: "前端负责人",
          项目描述: "为大型企业客户开发的一款数据分析和可视化平台，支持实时数据处理和复杂的数据展示。",
          职责描述: [
            "负责前端架构设计和技术选型",
            "实现复杂的数据可视化功能",
            "优化前端性能，确保大数据量下的流畅体验",
            "与后端团队协作，设计和实现API"
          ],
          成果: "成功上线并获得客户好评，帮助客户提升了30%的数据分析效率",
          上线地址: "https://example.com/data-platform",
          其他备注: "该项目获得了公司年度最佳项目奖"
        }}
      />
    </Section>

    <Section title="培训经历">
      <Training
        training={{
          培训机构: "前端大师课程",
          课程名称: "高级React与性能优化",
          培训时间: "2022-06 至 2022-08",
          证书: "课程结业证书"
        }}
      />
    </Section>

    <Section title="求职意向">
      <JobIntention
        intention={{
          目标岗位: "前端架构师",
          期望行业: "互联网/人工智能",
          期望地点: "北京/上海/深圳",
          期望薪资: "年薪50万以上",
          工作模式: "全职"
        }}
      />
    </Section>

    <Section title="兴趣爱好">
      <p>摄影、阅读、爬山、编程开源项目</p>
    </Section>

    <Section title="推荐人">
      <Referees
        referees={[
          {
            姓名: "李四",
            职位: "技术总监",
            公司: "北京科技有限公司",
            联系方式: "lisi@example.com"
          },
          {
            姓名: "王五",
            职位: "项目经理",
            公司: "上海创新科技公司",
            联系方式: "wangwu@example.com"
          }
        ]}
      />
    </Section>
  </div>
</div>
`
