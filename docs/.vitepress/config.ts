export default {
  // 应用层面的配置
  lang: 'en-US', 
  // 渲染为： <html lang="en-US">
  title: '运维开发笔记', // 网站标题，显示在浏览器的标签上
  titleTemplate: 'Blog', // 网站标题后缀- “VitePress | Blog”
  description: 'Vite & Vue powered static site generator.', // 网站描述 
  // 渲染为：<meta name="description" content="Vite & Vue powered static site generator.">
  base: '/', // base url
  head: [
    [ 'link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' } ],
    // 渲染为: <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    [ 'link', { rel: 'icon', href: '/logo.svg' } ]
    // 渲染为: <link rel="icon" href="/logo.svg" />
  ],
  appearance: true, // 外观切换 - 深色浅色
  ignoreDeadLinks: false, // 当设置为 true 时，VitePress 不会因为死链接而导致构建失败。
  lastUpdated: true, // 显示页面最后更新时间
  cleanUrls: 'without-subfolders', // 删除路径中的.html后缀
  themeConfig: {
    siteTitle: '运维开发笔记', // 页面上的所测导航标题
    logo: '/logo.jpg', // 默认就对应的是public目录下的
    nav: [  // 页面上方导航
      { text: "运维", link: "/blogs/index" },
      { text: "开发", link: "/code/index" },
      { text: "生活", link: "/life/index" },  
      { text: "github", link: "https://github.com/jedyang" },
      { text: "gitee", link: "https://gitee.com/helloyunsheng" },
    ],
    sidebar: {
      "/blogs/": [
      {
        text: 'k8s',
        collapsible: true, // 可折叠
        collapsed: false, // 折叠
        items: [
          {
            text: 'kubebuilder',
            collapsible: true, // 可折叠
            collapsed: false, // 折叠
            items: [
              { text: '1.开发环境搭建', link: '/blogs/k8s/kubebuilder/kubebuilder（一）开发环境搭建' },
              { text: '2.创建项目', link: '/blogs/k8s/kubebuilder/kubebuilder（二）创建项目' },
              { text: '3.实现operator', link: '/blogs/k8s/kubebuilder/kubebuilder（三）实现operator' },
              { text: '4.部署&测试', link: '/blogs/k8s/kubebuilder/kubebuilder（四）部署' },
              { text: '5.制作镜像&部署', link: '/blogs/k8s/kubebuilder/kubebuilder(五) 制作镜像部署' },
              { text: '6.webhook', link: '/blogs/k8s/kubebuilder/kubebuilder（六）webhook' }
              
            ]
          },
          {
            text: 'velero',
            collapsible: true, // 可折叠
            collapsed: false, // 折叠
            items: [
              { text: 'Item1', link: '/k8s/item1' },
              { text: 'Item2', link: '/k8s/item2' }
            ]
          }
        ]
      },
      {
        text: 'redis',
        collapsible: true, // 可折叠
        collapsed: false, // 折叠
        items: [
          { text: 'Item1', link: '/k8s/item1' },
          { text: 'Item2', link: '/k8s/item2' }
        ]
      },
    ],
    "/code/": [
      {
        text: '前端',
        collapsible: true, // 可折叠
        collapsed: false, // 折叠
        items: [
          { text: 'vitepress+gitee部署静态网站', link: '/code/front/vitepress+gitee部署静态网站' },
          { text: 'Item2', link: '/k8s/item2' }
        ]
      }
    ]
  }  , // 侧边栏菜单
    outline: 'deep', // 在大纲中显示的标题级别
    outlineTitle: '快速导航', // 大纲的标题
    // editLink: { // 提供编辑页面的连接
    //   pattern: 'https://github.com/vuejs/vitepress/edit/main/docs/:path',
    //   text: 'Edit this page on GitHub'
    // },
    lastUpdatedText: '上次更新', // 上次更新时间显示文本
    docFooter: { // 文档底部文本
      prev: '上一节',
      next: '下一节'
    },
    footer: { // 有 sidebar 时不显示
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2019-present Evan You'
    },
    socialLinks: [ // 社交链接
      { icon: 'github', link: 'https://github.com/jedyang' },
      // 可以把不支持的加上
      {
        icon: {
          svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 0H0v24h24V0z" fill="none"/><path d="M12 2.04c-5.523 0-10 4.477-10 10s4.477 10 10 10 10-4.477 10-10-4.477-10-10-10zm0 18.12c-4.068 0-7.36-3.292-7.36-7.36s3.292-7.36 7.36-7.36 7.36 3.292 7.36 7.36-3.292 7.36-7.36-7.36-7.36-3.292-7.36-7.36 3.292-7.36 7.36 0 4.068 3.292 7.36 7.36 7.36zm0-12.78c-2.206 0-4 1.794-4 4s1.794 4 4 4 4-1.794 4-4-1.794-4-4-4 1.794-4 4-4 4-1.794-4-4-4 4zm0 10.56c-1.378 0-2.52-1.142-2.52-2.52s1.142-2.52 2.52-2.52 2.52-1.142 2.52-2.52-2.52 1.142 2.52 2.52 2.52z"/></svg>'
        },
        link: 'https://juejin.cn/user/1591748568036088'
      }
    ]
  }, 
  markdown: { // markdown 解析配置
    // theme: 'material-palenight', // 主体配色
    lineNumbers: true // 显示行号
  }
}

