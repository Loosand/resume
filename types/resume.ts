export interface ResumeMetadata {
  基本信息: {
    姓名: string
    性别: string
    年龄: string
    所在地: string
    婚姻状况: string
    职业状态: string
    期望薪资: string
  }
  联系方式: {
    微信: string
    电话: string
    邮箱: string
    个人网站: string
    LinkedIn: string
    GitHub: string
  }
  教育经历: Array<{
    学校: string
    专业: string
    学历: string
    入学时间: string
    毕业时间: string
    证书: string[]
    奖项: string[]
  }>
  技能: {
    技术技能: Array<{ 技能名: string; 熟练程度: string }>
    软技能: Array<{ 技能名: string; 熟练程度: string }>
    语言能力: Array<{ 语言: string; 水平: string }>
    证书与资格认证: Array<{
      证书名称: string
      颁发机构: string
      取得时间: string
    }>
  }
  工作经历: Array<{
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
  }>
  项目经历: Array<{
    项目名称: string
    使用技术: string[]
    项目类型: string
    角色: string
    项目描述: string
    职责描述: string[]
    成果: string
    上线地址: string
    其他备注: string
  }>
  培训经历: Array<{
    培训机构: string
    课程名称: string
    培训时间: string
    证书: string
  }>
  求职意向: {
    目标岗位: string
    期望行业: string
    期望地点: string
    期望薪资: string
    工作模式: string
  }
  兴趣爱好: string[]
  推荐人: Array<{
    姓名: string
    职位: string
    公司: string
    联系方式: string
  }>
}

export interface AIResponse {
  content: string
  resumeMetadata: ResumeMetadata
  resumeMarkdown: string
  template?: {
    fields: Array<{
      key: string
      label: string
      type: string
    }>
  }
}
