# EndBox 官网（EndBoxWeb）

EndBox 的项目介绍站：产品首页 + 使用教程。纯静态 HTML/CSS/JS，无构建步骤，直接托管即可。

## 本地预览

浏览器不允许从 `file://` 加载 ES 模块，请用静态服务器打开：

```bash
cd D:\我的文件\coding\EndBoxWeb
python -m http.server 8765
# 打开 http://127.0.0.1:8765/
```

## 页面

| 文件 | 内容 |
| --- | --- |
| `index.html` | 展示首页：简介、功能模块、运行截图、四步上手、下载、常见问题 |
| `guide.html` | 使用教程：安装、账号、技能轴、运行提示条、HUD、325、插件、更新、数据隐私、FAQ |
| `plugins.html` | 插件开发：目录与 manifest、PluginContext API、权限、调试、打包发布到市场 |

## 版式

首页是展示页：大字标、黄色横幅区、跑马灯、数据条、功能卡片、截图、上手、下载、FAQ。
教程页是阅读页：左侧目录、右侧正文、细线分区。

## 动效

常驻动效（系统「减少动态效果」时全部关闭）：

- 顶部跑马灯信息带循环滚动，悬停暂停；
- 顶部实时时钟，每秒刷新；
- 统计数字滚入时从 0 计数；
- 内容滚动进入淡入上移、截图扫描线、背景等高线漂移；
- 顶部阅读进度条随滚动生长；
- 卡片 / 截图悬停轻微上移，切角按钮悬停黄色擦入；
- 顶部阅读进度条随滚动生长；回到顶部按钮可用。

## 版本自动同步

页面不写死版本号、包名、大小和 SHA256：

- 优先请求 GitHub Releases 最新 Release（`api.github.com`），取 tag 和 zip 资产；
- 请求失败时用同目录的 `release.json` 兜底；
- 发布新版本时只要在 GitHub 打一个带 zip 资产的 Release，网站自动更新，不需要改页面。

## 目录

```
assets/
  endfield.css       终末地风味部件库（来自 endfield-ui skill）
  site.css           本站版式（颜色/字体/部件都来自 endfield.css）
  fx.js, variant.js  动效、深浅切换、变体
  contours/          背景等高线
  fonts/Saira.ttf    界面拉丁字体（SIL OFL 1.1，许可证同目录）
  img/               应用图标与运行截图
```

## 部署到 GitHub Pages

仓库：<https://github.com/comreade-123/EndBoxWeb>

```bash
git remote add origin https://github.com/comreade-123/EndBoxWeb.git   # 首次
git push -u origin main
```

然后在仓库 **Settings → Pages** 里选择：

- Source: `Deploy from a branch`
- Branch: `main` / 目录 `/(root)`

保存后等一两分钟，访问 <https://comreade-123.github.io/EndBoxWeb/>。

也可以任意静态托管：Cloudflare Pages、Netlify、Vercel、对象存储，把整个目录传上去即可，无需服务端。

GitHub Pages 建议：

1. 把本站文件放到仓库的 `docs/` 或 `web/` 目录（或单独仓库）；
2. 仓库 Settings → Pages → 选择分支和目录；
3. 设置里的下载链接指向 GitHub Releases。

## 内容维护

- 版本号、下载包大小、SHA256 出现在 `index.html`：发布新版时搜 `1.1.0` 和 `SHA256` 同步修改。
- 截图来自 `EndBox/shots/`（深色主题实际运行截图），更新截图后覆盖 `assets/img/` 同名文件即可。
- 功能与键位说明来自 `EndBox/docs/timeline.md`、`docs/account.md` 等，改功能时两边同步。

## 许可

页面代码 MIT。Saira 字体 SIL OFL 1.1。游戏相关素材与数据版权归鹰角网络，本站只做介绍，不提供游戏素材下载。
