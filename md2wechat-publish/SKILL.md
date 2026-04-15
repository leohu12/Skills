---
name: md2wechat-publish
description: Obsidian MD to WeChat article - read a local .md file from Obsidian vault, convert it to a WeChat Official Account styled HTML article with engaging elements like cover image, title optimization, emojis, etc.
---

# MD to WeChat Article Publisher

Convert Obsidian markdown notes into polished WeChat Official Account articles.

## Trigger

When user says something like:
- "发表公众号文章" + "obsidian"
- "帮我发一篇公众号" + md file path
- "把 obsidian 的 xxx 转成公众号"
- "公众号发布" + obsidian link

## Workflow

### Step 1: Locate the MD File

User provides either:
- An **Obsidian vault link** (obsidian://open?vault=...&file=...)
- A **direct file path**
- A **relative path** within known Obsidian vault

**Parsing obsidian:// links:**
- Extract `vault` and `file` params
- Locate vault path: `%USERPROFILE%\Documents\Obsidian\<vault-name>\` or configured vault paths
- Construct full path: `<vault-path>/<file>.md`

### Step 2: Read and Analyze Content

1. Read the .md file with full UTF-8 encoding
2. Extract:
   - Title (first `# heading` or frontmatter `title:`)
   - Core content (body text)
   - Any images referenced
   - Tags / categories
   - Reading time estimate (words / 500)

### Step 3: Content Enhancement

Add WeChat-engaging elements:
1. **Hook title**: Keep original or rewrite to be more clickable
2. **Cover image**: If original has no image, suggest a thematic Unsplash image URL
3. **Section breaks**: Add decorative dividers (CSS/SVG) between sections
4. **Emphasis**: Bold key phrases, add emoji accents where natural
5. **Call-to-action**: End with engaging CTA if appropriate

### Step 4: Convert to HTML

Generate clean, mobile-friendly HTML following WeChat article conventions:
- Semantic HTML5 structure
- Inlined CSS for WeChat WebView compatibility
- Font stack: `-apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif`
- Content width: 100% (WeChat handles responsive)
- Image handling: lazy loading, max-width: 100%
- Proper heading hierarchy (H1 as article title, H2/H3 for sections)
- Blockquotes styled with left border accent
- Code blocks with subtle background

### Step 5: Output

1. Create output directory if not exists: `C:\Users\leo\WorkBuddy\Claw\公众号文章\`
2. Generate filename: `<original-title>-<YYYYMMDD>.html`
3. Sanitize filename (remove illegal chars)
4. Write the HTML file
5. Report the output path

## HTML Template Structure

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>{TITLE}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif; line-height: 1.8; color: #333; max-width: 680px; margin: 0 auto; padding: 20px; }
    h1 { font-size: 1.8em; font-weight: 700; margin-bottom: 0.5em; color: #1a1a1a; }
    h2 { font-size: 1.4em; margin-top: 1.5em; border-left: 4px solid #07c160; padding-left: 12px; }
    h3 { font-size: 1.2em; margin-top: 1.2em; }
    p { margin: 1em 0; text-align: justify; }
    img { max-width: 100%; height: auto; display: block; margin: 1em auto; border-radius: 4px; }
    blockquote { border-left: 3px solid #07c160; padding: 10px 15px; margin: 1em 0; background: #f8f8f8; border-radius: 0 4px 4px 0; }
    code { background: #f5f5f5; padding: 2px 6px; border-radius: 3px; font-size: 0.9em; }
    pre { background: #f5f5f5; padding: 15px; border-radius: 6px; overflow-x: auto; }
    .cover { width: 100%; max-height: 400px; object-fit: cover; margin-bottom: 1.5em; border-radius: 8px; }
    .meta { color: #999; font-size: 0.85em; margin-bottom: 1.5em; }
    hr { border: none; border-top: 1px dashed #eee; margin: 2em 0; }
    strong { color: #07c160; }
  </style>
</head>
<body>
  <!-- {CONTENT} -->
</body>
</html>
```

## Conversion Rules (MD → HTML)

| Markdown | HTML |
|----------|------|
| `# Title` | `<h1>` |
| `## Heading` | `<h2>` |
| `### Heading` | `<h3>` |
| `**bold**` | `<strong>` |
| `*italic*` | `<em>` |
| `> quote` | `<blockquote>` |
| `---` | `<hr>` |
| `` `code` `` | `<code>` |
| ````blocks```` | `<pre>` |
| `![alt](url)` | `<img src="url" alt="alt">` |
| `[text](url)` | `<a href="url">text</a>` |

## Notes

- Handle Chinese punctuation properly (no conversion needed, just preserve)
- Skip YAML frontmatter (already extracted as metadata)
- Preserve internal links if pointing to local vault files (convert to anchors or remove)
- Images: if relative path, try to resolve from vault root
- If file not found, report error with suggestions
