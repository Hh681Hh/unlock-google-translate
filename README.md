# 🔓 解锁谷歌翻译 (Unlock Google Translate)

一个极简、轻量的 Chrome 扩展插件（Manifest V3），用于自动移除网页上的 `translate="no"`、`class="notranslate"` 以及 `<meta name="google" content="notranslate">` 限制，让 Chrome 内置的原生 Google 翻译重新生效。

## 为什么做这个插件？

浏览许多海外 AI 工具或 React/Next.js 网站（例如 MiniMax 等）时，即使点击 Chrome 地址栏自带的 **Google 翻译 → 中文（简体）**，页面也纹丝不动。

排查后发现，并不是谷歌翻译坏了，也不是网络问题，而是网站在 `<html>` 标签上主动写了禁止翻译指令：

```html
<html lang="en" translate="no" class="notranslate">
```

Chrome 原生翻译会遵守该标记并直接跳过整个页面。这个插件就是为了**全自动解除该限制**，让你继续享受 Chrome 原生谷歌翻译的丝滑体验。

## 功能特点

- **全自动生效**：网页加载瞬间自动移除 `translate="no"`、`notranslate` 类名及 `notranslate` meta 标签。
- **防重新写回**：内置轻量 `MutationObserver`，防止单页应用（SPA）在切换路由时重新加上禁止翻译属性。
- **极简开关面板**：点击右上角蓝色 **「译」** 字图标，可随时一键开启/暂停自动解锁，或手动点击「立即解锁当前页」。
- **零隐私收集**：纯本地运行，仅申请极简 `storage` 权限用于保存开关状态，不联网、不收集任何数据。

## 安装方法（30 秒搞定）

1. 点击本仓库右上角绿色 **`Code`** 按钮 → **`Download ZIP`** 下载压缩包并解压（或 `git clone` 本仓库）。
2. 在 Chrome 地址栏输入 `chrome://extensions/` 并回车。
3. 打开页面**右上角**的 **「开发者模式」** 开关。
4. 点击页面**左上角**的 **「加载未打包的扩展程序」**（Load unpacked），选中解压后的文件夹即可安装完成。

## 使用说明

- 安装后默认开启，以后打开禁止翻译的英文网站，直接点 Chrome 地址栏的谷歌翻译即可生效。
- 如果在启用插件前已经打开了网页，刷新一次页面即可。
- 部分 React 网站强行翻译后，极少数动态按钮可能会出现偶发异常；如遇异常，点开插件关闭开关并刷新页面即可恢复原样。

## 开源协议

[MIT License](./LICENSE)
