# SEO Blocking Design

This design document outlines the changes required to prevent search engines from indexing the website.

## Objective

Configure the web application to instruct search engines not to crawl or index any of its pages.

## Proposed Changes

### Web Application

#### [MODIFY] [index.html](file:///Users/nico/CODE/neon-adressing-helper/src/main/webapp/index.html)

Add the following meta tag to the `<head>` block of the HTML file:

```html
<meta name="robots" content="noindex, nofollow" />
```

#### [NEW] [robots.txt](file:///Users/nico/CODE/neon-adressing-helper/src/main/webapp/public/robots.txt)

Create a new file in the public directory to block all search engine crawlers:

```text
User-agent: *
Disallow: /
```

## Verification Plan

### Manual Verification

- Check that [index.html](file:///Users/nico/CODE/neon-adressing-helper/src/main/webapp/index.html) contains `<meta name="robots" content="noindex, nofollow" />`.
- Check that [robots.txt](file:///Users/nico/CODE/neon-adressing-helper/src/main/webapp/public/robots.txt) is successfully created with correct disallow rules.
- Run `npm run build` or build check to verify everything builds correctly.
