#!/usr/bin/env sh

# 忽略错误
set -e

# 构建
yarn docs:build

# 进入待发布的目录
cd docs/.vitepress/dist

# 初始化 git 并强制提交到仓库
git init
git add -A
git commit -m "Updated docs"
git remote add origin https://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@github.com/jedyang/blog.git
git push -f origin master:gh-pages

cd -
