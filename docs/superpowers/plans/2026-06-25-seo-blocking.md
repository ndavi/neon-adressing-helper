# SEO Blocking Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prevent search engines from indexing the website by using a robots meta tag and robots.txt.

**Architecture:** Combine meta robots tag in index.html for page-level blocking and robots.txt at the serving root for crawler-level blocking.

**Tech Stack:** HTML, Static Assets.

## Global Constraints

None.

---

### Task 1: HTML Meta Tag

**Files:**

- Modify: `src/main/webapp/index.html`

- [ ] **Step 1: Edit index.html**
      Add `<meta name="robots" content="noindex, nofollow" />` inside the `<head>` tag.

- [ ] **Step 2: Commit**
  ```bash
  git add src/main/webapp/index.html
  git commit -m "feat: add meta robots noindex tag to index.html"
  ```

---

### Task 2: robots.txt Configuration

**Files:**

- Create: `src/main/webapp/public/robots.txt`

- [ ] **Step 1: Create robots.txt**
      Create `src/main/webapp/public/robots.txt` with:

  ```text
  User-agent: *
  Disallow: /
  ```

- [ ] **Step 2: Commit**
  ```bash
  git add src/main/webapp/public/robots.txt
  git commit -m "feat: add robots.txt to disallow all crawlers"
  ```

---

### Task 3: Verification & Build Check

- [ ] **Step 1: Run build check**
      Run: `npm run build` or `pnpm run build` to verify the project builds and outputs the assets correctly.

- [ ] **Step 2: Verify output files**
      Verify that the built output includes both the modified `index.html` with the meta tag and the `robots.txt` file at the root.
