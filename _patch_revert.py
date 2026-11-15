from pathlib import Path
p = Path("assets/site.css"); c = p.read_text(encoding="utf-8")
start = c.find("/* ---------- 启动动画：仿 dsh-theme-endfield ---------- */")
end = c.find("/* ---------- 顶部命令栏 ---------- */")
if start != -1 and end != -1 and start < end:
    c = c[:start] + c[end:]
p.write_text(c, encoding="utf-8")

# README：去掉 Storybook / 启动动画段落，改成当前版式 + 部署说明
p = Path("README.md"); t = p.read_text(encoding="utf-8")
import re
t = re.sub(r"## 版式\n.*?## 动效", "## 版式\n\n首页是展示页：大字标、黄色横幅区、跑马灯、数据条、功能卡片、截图、上手、下载、FAQ。\n教程页是阅读页：左侧目录、右侧正文、细线分区。\n\n## 动效", t, flags=re.S)
t = re.sub(r"页面启动时有一次装载动画.*?\n\n", "", t, flags=re.S)
t = t.replace("- 侧栏实时时钟，每秒刷新；", "- 顶部实时时钟，每秒刷新；")
t = t.replace("- 侧栏导航随滚动高亮当前小节，功能分类 chips 实时筛选。", "- 顶部阅读进度条随滚动生长；回到顶部按钮可用。")
# 部署章节补 GitHub Pages
t = t.replace("""## 部署

任意静态托管都行：GitHub Pages、Cloudflare Pages、Netlify、Vercel、对象存储。把整个 `EndBoxWeb/` 目录传上去即可，无需服务端。""",
"""## 部署到 GitHub Pages

仓库：<https://github.com/comreade-123/EndBoxWeb>

```bash
git remote add origin https://github.com/comreade-123/EndBoxWeb.git   # 首次
git push -u origin main
```

然后在仓库 **Settings → Pages** 里选择：

- Source: `Deploy from a branch`
- Branch: `main` / 目录 `/(root)`

保存后等一两分钟，访问 <https://comreade-123.github.io/EndBoxWeb/>。

也可以任意静态托管：Cloudflare Pages、Netlify、Vercel、对象存储，把整个目录传上去即可，无需服务端。""")
# 补充“加启动动画”的过时描述（若还残留）
t = t.replace("页面启动时有一次工业风开机动画（真实图片加载进度，播放一次，`sessionStorage` 记住这次会话），结束后整块向上收起。\n\n", "")
p.write_text(t, encoding="utf-8")

# GitHub Pages 需要 .nojekyll；不忽略 shots（README 预览用）
Path(".nojekyll").write_text("", encoding="utf-8")
print("patched")
