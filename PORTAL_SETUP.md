# China Quest Pioneer Portal

先锋计划用户中心 — Next.js 16 (App Router) + Supabase + Vercel。

## 一次性搭建（~15 分钟）

### 1. 创建 Supabase 项目
1. 登录 https://supabase.com（你现有账号：info@milesminds.com）
2. New Project → 起名 `chinaquest-portal`，选区域 `Europe (Ireland)` 或 `Frankfurt`
3. 进入 SQL Editor → New query → 把 `supabase/schema.sql` 全文粘贴运行
4. 控制台左侧 Settings → API，拷贝两个值：
   - `Project URL`
   - `anon public` key

### 2. 本地环境变量
```bash
cd portal
cp .env.local.example .env.local
# 把上面两个值填进 .env.local
```

### 3. 本地跑起来
```bash
npm run dev
# http://localhost:3000
```
- `/signup` 注册 → 如果 Supabase 开了邮箱确认，收到邮件点链接
- `/login` 登录
- `/dashboard` 用户中心（显示申请状态 + 里程碑时间线）

### 4. Authentication 配置（Supabase 控制台）
- Authentication → URL Configuration
  - Site URL: 本地 `http://localhost:3000`，上线后改成正式域名
  - Redirect URLs: 加 `http://localhost:3000/auth/callback` 和上线域名的 `/auth/callback`
- Authentication → Providers → Email：Enable（默认开）
  - 如需邮箱确认：勾 Confirm email
  - 如想简化，暂时关闭邮箱确认

## 部署（Vercel）

因为这个 portal 是 `chinaquest-demo/portal/` 子目录，和根目录的静态站是两个不同项目，两种做法：

**方案 A：新建独立 Vercel 项目**（推荐）
1. Vercel Dashboard → Add New → Project → 选 `chinaquest-demo` 仓库
2. **Root Directory** 设为 `portal`
3. Framework Preset: Next.js（自动识别）
4. Environment Variables 填 `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy → 拿到 URL 后，绑定子域名如 `portal.chinaquest.ie`

**方案 B：从主站 rewrite 到 portal**
主站 `chinaquest-demo` Vercel 项目里加 `vercel.json`，把 `/portal/*` rewrite 到方案 A 部署出的 URL。

## 目录结构
```
portal/
├── src/
│   ├── app/
│   │   ├── page.tsx              # / — 根据登录态重定向
│   │   ├── login/page.tsx        # /login
│   │   ├── signup/page.tsx       # /signup
│   │   ├── dashboard/page.tsx    # /dashboard — 用户中心
│   │   ├── auth/
│   │   │   ├── actions.ts        # signIn / signUp / signOut
│   │   │   └── callback/route.ts # 邮件确认回调
│   │   └── globals.css           # CQ 品牌色 navy/red/gold
│   ├── components/
│   │   └── AuthShell.tsx
│   ├── lib/
│   │   ├── milestones.ts         # 里程碑数据（来自 pioneer_plan_v2）
│   │   └── supabase/
│   │       ├── client.ts
│   │       ├── server.ts
│   │       └── session.ts        # Proxy 用的会话刷新逻辑
│   └── proxy.ts                  # Next.js 16 proxy（原 middleware）
├── supabase/
│   └── schema.sql                # profiles + applications 表 + RLS
└── .env.local.example
```

## 后续可扩展
- 管理员端：加 `/admin` 路由 + service role key，审核申请、打分、改状态
- 申请表单：加 `/dashboard/apply`，视频上传到 Supabase Storage bucket `applications`
- 邮件通知：用 Supabase Edge Functions 或 Resend，在状态变更时发邮件
- 教师端：区分 `role` 字段（student / teacher / admin），分别展示不同义务清单
