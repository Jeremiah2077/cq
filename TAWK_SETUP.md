# Tawk.to 在线客服接入说明

右下角实时人工客服，基于 [Tawk.to](https://www.tawk.to/)（免费托管）。

## 为什么这样接

本站点是**两套架构**，客服必须两边都覆盖：

| 部分 | 路径 | 渲染方式 | 接入点 |
|---|---|---|---|
| 静态营销站 | `public/*.html`（首页 `/`、`/contact`、各城市页等） | 经 `next.config.ts` 的 `rewrites()` 直接返回静态 HTML，**绕过 React layout** | 共用的 `public/script.js` |
| React 门户 | `src/app/*`（login / signup / dashboard 等） | App Router + `src/app/layout.tsx` | `src/components/TawkWidget.tsx` |

只挂在 `layout.tsx` 会导致首页等营销页没有客服按钮——访客最需要客服的恰恰是那些页面。

## 改动的文件

- **`src/components/TawkWidget.tsx`**（新增）
  用 `next/script`，策略 `lazyOnload`（Next.js 16 文档对聊天插件的推荐策略）。
- **`src/app/layout.tsx`**
  根 layout 挂 `<TawkWidget />`，覆盖所有门户页面。
- **`public/script.js`**
  文件末尾追加 Tawk 加载块。20 个引用 `script.js` 的静态营销页一处覆盖。
- **`public/survey-student.html`、`public/survey-teacher.html`**
  这两页不引用 `script.js`，单独在 `</body>` 前内联同一段脚本。

## Tawk 账号 / ID

- 账号：在 https://www.tawk.to/ 免费注册的 Property。
- 当前 Property/Widget ID（已写入代码）：
  ```
  https://embed.tawk.to/6a07971ba62ba71c346b8e4f/1jomqcgoo
  ```
- **ID 直接写在代码里、不走环境变量**，原因：
  1. Tawk 的 Property/Widget ID 在浏览器里本来就可见，非机密；
  2. 静态 `public/` 文件读不到 `NEXT_PUBLIC_*` 环境变量；
  3. 硬编码 = 单一来源、零额外配置、Vercel 上无需再设环境变量。

### 换一个 Tawk Property（如需）

全局替换这 4 处里的 embed URL：

- `src/components/TawkWidget.tsx`（`TAWK_EMBED_SRC` 常量）
- `public/script.js`（文件末尾 TAWK.TO 块）
- `public/survey-student.html`
- `public/survey-teacher.html`

## 改气泡颜色 / 外观

**不用改代码**，在 Tawk 后台改：
Administration → Channels → Chat Widget → 外观设置（Widget Appearance）。
建议填站点品牌强调色 **`#c4683c`**（与所有 CTA 按钮一致）。

## 验证

- 静态侧（已实测可用）：
  ```bash
  npm run dev
  curl -s http://localhost:3000/script.js | grep TAWK        # 含加载块
  curl -s http://localhost:3000/survey-student | grep embed.tawk.to
  ```
  浏览器打开 `http://localhost:3000/` → 右下角出现客服气泡。
- React 门户侧：代码已就位且 `npx tsc --noEmit` 通过。
  本地要看到这一侧的气泡，需先按 `PORTAL_SETUP.md` 配好 `.env.local`
  的 Supabase 变量——否则 `middleware.ts` 因缺少 `NEXT_PUBLIC_SUPABASE_*`
  会让所有门户路由 500（与本次接入无关，是环境未配置）。

## 备注

- `next.config.ts` 的安全响应头不影响 Tawk：`X-Frame-Options: DENY` 只限制本站被他人内嵌，不影响本站加载 Tawk 自己的 iframe；`Permissions-Policy` 关闭的 camera/mic/geo 是 Tawk 视频类增值功能才需要的，纯文字聊天不受影响。
- 基础文字客服完全免费；去掉 Tawk 小标识约 $19/月，可选。
