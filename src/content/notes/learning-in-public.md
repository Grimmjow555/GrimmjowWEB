---
pubDatetime: 2026-11-02T02:30:00.000Z
title: 公开学习：从理解到留下痕迹
description: 把学习笔记当作思维的可视化过程，而不是知识的最终答案。
tags:
  - 学习方法
  - 写作
featured: true
---

学习最容易产生的一种错觉，是“我看懂了”。把内容重新写一遍，才会暴露那些被熟悉的措辞遮住的空白。

## 为什么要有公开笔记

公开写作有三个直接好处：

1. 强迫自己把模糊的概念改写成可检验的句子。
2. 留下检索线索，未来的自己可以从旧笔记继续出发。
3. 让作品、思考与学习过程彼此连接，而不是散落在不同平台。

## 一个简单的记录循环

```ts
type LearningLoop = {
  capture: string;
  explain: string;
  connect: string;
  revisit: string;
};

const loop: LearningLoop = {
  capture: "先记录问题，不急着抄答案",
  explain: "用自己的语言解释一次",
  connect: "链接旧笔记、项目和现实经验",
  revisit: "一周后回看并修正",
};
```

数学笔记同样可以使用简洁的公式记录核心关系，例如信息量：

$$
H(X) = -\sum_{x \in X} p(x)\log_2 p(x)
$$

这条公式提醒我，笔记不是收集得越多越好，而是让不确定性真正下降。

## 本文是示例

你可以直接编辑 `src/content/notes/learning-in-public.md`，用真实经历替换这段内容。新增笔记只要复制文件并修改 frontmatter 即可。
