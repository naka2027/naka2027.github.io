# Naka Research blog / user-first navigation pilot

This package is a source-level proposed v1 update, not a deployed site.

## Design goals
- Keep 60 published articles and all their permalinks.
- Create independent Chinese/English FAQ (12 research questions) and topic hubs (four topics).
- Change home and project introduction to lead with user questions and actual use constraints, not historical win-rate panels.
- Improve related research links within article pages.
- Remove duplicate H1 headings where post front matter already supplies the same title.
- Preserve the research strategy disclosure boundaries; historical backtests are not live profits.

## Important
- Existing article URL slugs containing legacy terminology were kept intact for link stability.
- The GitHub FAQ link assumes `docs/zh-CN/faq.md` and `docs/en/faq.md` are published (verified online on 2026-10-11).
- No live Jekyll production build was performed in this container, so check GitHub Pages deployment on a staging branch before publishing.
- Research facts and figures inside articles were not modified; only 16 duplicate top-level title headings removed.
