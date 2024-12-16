import { z } from "zod"

import { ResumeMetadata } from "@/types/resume"

export const resumeSchema = z.object({
  content: z.string().describe("回复话语"),
  resumeMetadata: z.object({
    基本信息: z.object({
      姓名: z.string(),
      性别: z.string(),
      年龄: z.string(),
      所在地: z.string(),
      婚姻状况: z.string(),
      职业状态: z.string(),
      期望薪资: z.string(),
    }),
    联系方式: z.object({
      微信: z.string(),
      电话: z.string(),
      邮箱: z.string(),
      个人网站: z.string(),
      LinkedIn: z.string(),
      GitHub: z.string(),
    }),
    教育经历: z.array(
      z.object({
        学校: z.string(),
        专业: z.string(),
        学历: z.string(),
        入学时间: z.string(),
        毕业时间: z.string(),
        证书: z.array(z.string()),
        奖项: z.array(z.string()),
      }),
    ),
    技能: z.object({
      技术技能: z.array(
        z.object({
          技能名: z.string(),
          熟练程度: z.string(),
        }),
      ),
      软技能: z.array(
        z.object({
          技能名: z.string(),
          熟练程度: z.string(),
        }),
      ),
      语言能力: z.array(
        z.object({
          语言: z.string(),
          水平: z.string(),
        }),
      ),
      证书与资格认证: z.array(
        z.object({
          证书名称: z.string(),
          颁发机构: z.string(),
          取得时间: z.string(),
        }),
      ),
    }),
    工作经历: z.array(
      z.object({
        公司名称: z.string(),
        行业: z.string(),
        职位: z.string(),
        职位类型: z.string(),
        工作性质: z.string(),
        团队规模: z.string(),
        入职时间: z.string(),
        离职时间: z.string(),
        主要职责: z.array(z.string()),
        业绩和成果: z.array(z.string()),
      }),
    ),
    项目经历: z.array(
      z.object({
        项目名称: z.string(),
        使用技术: z.array(z.string()),
        项目类型: z.string(),
        角色: z.string(),
        项目描述: z.string(),
        职责描述: z.array(z.string()),
        成果: z.string(),
        上线地址: z.string(),
        其他备注: z.string(),
      }),
    ),
    培训经历: z.array(
      z.object({
        培训机构: z.string(),
        课程名称: z.string(),
        培训时间: z.string(),
        证书: z.string(),
      }),
    ),
    求职意向: z.object({
      目标岗位: z.string(),
      期望行业: z.string(),
      期望地点: z.string(),
      期望薪资: z.string(),
      工作模式: z.string(),
    }),
    兴趣爱好: z.array(z.string()),
    推荐人: z.array(
      z.object({
        姓名: z.string(),
        职位: z.string(),
        公司: z.string(),
        联系方式: z.string(),
      }),
    ),
  }),
  resumeMarkdown: z.string().describe("基于metadata渲染的markdown数据"),
})
