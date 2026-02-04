# Blog Directory

This directory contains all blog posts written in Markdown format.

## Adding a New Blog Post

### 1. Create a Markdown File

Create a new `.md` file in this directory with a descriptive slug name (e.g., `my-new-post.md`).

### 2. Blog Post Format

Start your blog post with this header format:

```markdown
# Your Blog Post Title

**Published:** December 1, 2024
**Category:** DevOps

## Introduction

Your content starts here...
```

### 3. Markdown Features Supported

- **Headings**: `#`, `##`, `###`, etc.
- **Bold**: `**bold text**`
- **Italic**: `*italic text*`
- **Code blocks**: ``` with language specification
- **Inline code**: `code`
- **Lists**: Ordered and unordered (see examples below)
- **Links**: `[text](url)`
- **Images**: `![alt](path)`
- **Tables**: Standard markdown tables
- **Blockquotes**: `>`

### 4. How to Create Lists

**Unordered Lists** - Use `-`, `*`, or `+` followed by a space:

```markdown
## My Section

- First item
- Second item
- Third item
```

Or with asterisks:

```markdown
## My Section

* First item
* Second item
* Third item
```

**Ordered Lists** - Use numbers followed by a period and space:

```markdown
## My Section

1. First step
2. Second step
3. Third step
```

**IMPORTANT**: Always include a blank line before your list!

### 5. Add to Main Page

After creating your markdown file, add a new blog post entry in `index.html` under the Blog section:

```html
<li class="blog-post-item">
  <a href="./blog-post.html?post=my-new-post">

    <figure class="blog-banner-box">
      <img src="./assets/images/blog-X.jpg" alt="Your Post Title" loading="lazy">
    </figure>

    <div class="blog-content">

      <div class="blog-meta">
        <p class="blog-category">Your Category</p>
        <span class="dot"></span>
        <time datetime="2024-12-01">Dec 1, 2024</time>
      </div>

      <h3 class="h3 blog-item-title">Your Blog Post Title</h3>

      <p class="blog-text">
        Brief description of your blog post...
      </p>

    </div>

  </a>
</li>
```

### 6. Add a Thumbnail Image (Optional)

Place a blog thumbnail image in `assets/images/` (e.g., `blog-4.jpg`) and reference it in the HTML above.

## Existing Blog Posts

- `kubernetes-resilient-clusters.md` - Building Resilient Kubernetes Clusters
- `terraform-best-practices.md` - Terraform Best Practices
- `python-network-automation.md` - Python Network Automation

## Tips

- Use descriptive slugs for better SEO (e.g., `kubernetes-monitoring` instead of `post-1`)
- Keep the **Published** and **Category** metadata at the top for proper rendering
- Test locally before pushing to ensure markdown renders correctly
- Code blocks with language specification will have proper syntax highlighting
