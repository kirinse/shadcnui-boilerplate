import { z } from "zod"

export const deviceType = ["ipad", "mac"] as const
export const deviceTypeSchema = z.enum(deviceType)
export type DeviceType = z.infer<typeof deviceTypeSchema>

export const regions = [
  {
    value: "650000",
    label: "新疆",
  },
  {
    value: "150000",
    label: "内蒙古",
  },
  {
    value: "640000",
    label: "宁夏",
  },
  {
    value: "630000",
    label: "青海",
  },
  {
    value: "620000",
    label: "甘肃",
  },
  {
    value: "610000",
    label: "陕西",
  },
  {
    value: "540000",
    label: "西藏",
  },
  {
    value: "530000",
    label: "云南",
  },
  {
    value: "520000",
    label: "贵州",
  },
  {
    value: "510000",
    label: "四川",
  },
  {
    value: "500000",
    label: "重庆",
  },
  {
    value: "460000",
    label: "海南",
  },
  {
    value: "450000",
    label: "广西",
  },
  {
    value: "440000",
    label: "广东",
  },
  {
    value: "430000",
    label: "湖南",
  },
  {
    value: "420000",
    label: "湖北",
  },
  {
    value: "410000",
    label: "河南",
  },
  {
    value: "370000",
    label: "山东",
  },
  {
    value: "360000",
    label: "江西",
  },
  {
    value: "350000",
    label: "福建",
  },
  {
    value: "340000",
    label: "安徽",
  },
  {
    value: "330000",
    label: "浙江",
  },
  {
    value: "110000",
    label: "北京",
  },
  {
    value: "120000",
    label: "天津",
  },
  {
    value: "130000",
    label: "河北",
  },
  {
    value: "140000",
    label: "山西",
  },
  {
    value: "210000",
    label: "辽宁",
  },
  {
    value: "220000",
    label: "吉林",
  },
  {
    value: "230000",
    label: "黑龙江",
  },
  {
    value: "310000",
    label: "上海",
  },
  {
    value: "320000",
    label: "江苏",
  },
]

export const wechatFormSchema = z.object({
  appId: z.string(),
  regionId: z.string({
    required_error: "请选择一个地区",
  }).refine((id) => {
    return regions.findIndex((r) => r.value === id) !== -1
  }, { message: "地区无效" }),
  proxyIp: z.string(),
  type: deviceTypeSchema,
})

export type WechatForm = z.infer<typeof wechatFormSchema>

export const qrSchema = z.object({
  appId: z.string(),
  qrData: z.string(),
  qrImgBase64: z.string().base64(),
  uuid: z.string(),
})
export type Qr = z.infer<typeof qrSchema>

export const wechatCheckSchema = z.object({
  appId: z.string(),
  proxyIp: z.string().optional(),
  uuid: z.string(),
  captchCode: z.string().optional(),
})

export type WechatCheck = z.infer<typeof wechatCheckSchema>

const checkSucceedSchema = z.object({
  headImgUrl: z.string().url().optional(),
  nickName: z.string().optional(),
  expiredTime: z.number(),
  status: z.number().refine((n) => n >= 0 && n < 3), // 0: 未扫码; 1: 已扫码; 2: 登录成功
  uuid: z.string(),
})
export type CheckSucceedResp = z.infer<typeof checkSucceedSchema>

const checkFailedSchema = z.object({
  code: z.number(),
  msg: z.string(),
  detail: z.string(),
})

export type CheckFailedResp = z.infer<typeof checkFailedSchema>

export const checkRespSchema = z.union([checkSucceedSchema, checkFailedSchema])

export type CheckResp = z.infer<typeof checkRespSchema>

export const appSchema = z.object({
  id: z.string(),
  wx_id: z.string(),
  device: deviceTypeSchema,
  region_id: z.string().length(6).refine((id) => regions.map((r) => r.value).includes(id)),
  proxy: z.string().optional(),
  name: z.string(),
  avatar: z.string().url(),
  online: z.boolean(),
  created_at: z.date(),
  updated_at: z.date(),
})
export type App = z.infer<typeof appSchema>

export const lottoType = ["福", "体"] as const
export const lottoTypeSchema = z.enum(lottoType)
export type LottoType = z.infer<typeof lottoTypeSchema>

export const dispatchFormSchema = z.object({
  // pid: z.string().uuid(),
  // appId: z.string({
  //   required_error: "请选择微信",
  // }).refine((appId) => appId.trim().length > 0, { message: "请选择微信" }),
  // toWxId: z.string().refine((id) => id.startsWith("wxid_") || id.endsWith("@chatroom"), { message: "微信号无效" }),
  lotto: lottoTypeSchema,
  keep: z.number().min(0, { message: "最少保留0单" }),
  content: z.string(),
  filter: z.array(z.string()),
})

export type DispatchForm = z.infer<typeof dispatchFormSchema>
