import{_ as e,c as s,o as a,a2 as n}from"./chunks/framework.DukRYrIy.js";const l="/assets/image-20221221155300941.Cezs4m5o.png",g=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"blogs/k8s/kubebuilder/kubebuilder（一）开发环境搭建.md","filePath":"blogs/k8s/kubebuilder/kubebuilder（一）开发环境搭建.md","lastUpdated":1711088688000}'),i={name:"blogs/k8s/kubebuilder/kubebuilder（一）开发环境搭建.md"},p=n('<h2 id="kubebuilder-一-开发环境搭建" tabindex="-1">kubebuilder（一）开发环境搭建 <a class="header-anchor" href="#kubebuilder-一-开发环境搭建" aria-label="Permalink to &quot;kubebuilder（一）开发环境搭建&quot;">​</a></h2><p>开发一个k8s operator,当然可以在官方原生的controller-runtime 项目上从头构建，但是比较复杂。现在一般基于operator脚手架进行开发。目前最流行的的脚手架是Kubebuilder 或 OperatorSDK。Kubebuilder 或 OperatorSDK都是对controller-runtime 项目进行了上层的封装，使开发者可以专注于业务逻辑的实现。这里讲解kubebuilder的使用步骤。</p><p>首选需要一个可用的K8S集群。然后有一台linux服务器，能部署kubebuilder</p><p><img src="'+l+`" alt="image-20221221155300941"></p><h3 id="kubectl的配置" tabindex="-1">kubectl的配置 <a class="header-anchor" href="#kubectl的配置" aria-label="Permalink to &quot;kubectl的配置&quot;">​</a></h3><p>下载</p><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>给文件可执行权限；</p><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>chmod +x ./kubectl</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>将kubectl移动到可以全局执行的目录下：</p><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span> mv ./kubectl /usr/local/bin/kubectl</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>kubectl要想连接k8s集群，还需要一个k8s的config文件。就在k8s集群的/root/.kube/目录下。复制到我们的kubebuilder服务器上同样目录下。</p><p>现在我们在kubebuilder服务器上也可以操作k8s了。</p><h3 id="部署kubebuilder" tabindex="-1">部署kubebuilder <a class="header-anchor" href="#部署kubebuilder" aria-label="Permalink to &quot;部署kubebuilder&quot;">​</a></h3><p>各个组件的版本</p><p>go 1.18.5</p><p>docker 19.03.0</p><h4 id="安装go" tabindex="-1">安装go <a class="header-anchor" href="#安装go" aria-label="Permalink to &quot;安装go&quot;">​</a></h4><p>安装一些必要的工具</p><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>yum install unzip tree wget gcc gcc-c++ kernel-devel -y</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>安装go</p><p>安装官网安装的<a href="https://golang.google.cn/doc/install" target="_blank" rel="noreferrer">https://golang.google.cn/doc/install</a></p><p>额外执行以下命令</p><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>$ go env -w GO111MODULE=on</span></span>
<span class="line"><span>$ go env -w GOPROXY=https://goproxy.cn,direct</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><h4 id="安装docker" tabindex="-1">安装docker <a class="header-anchor" href="#安装docker" aria-label="Permalink to &quot;安装docker&quot;">​</a></h4><p>略</p><h4 id="安装kustomize" tabindex="-1">安装kustomize <a class="header-anchor" href="#安装kustomize" aria-label="Permalink to &quot;安装kustomize&quot;">​</a></h4><p>后面的操作中需要使用kustomize去做配置管理。</p><p>kustomize允许用户将不同环境所共享的配置放在一个文件目录下，而将其他不同的配置放在另外的目录下。这样用户就可以很容易的区分那些值是当前环境所特有的，从而在修改的时候会额外关注。</p><p>官方给出的安装方式，因为网络问题安装失败</p><p>基于模板生成YAML文件，下载kustomize二进制压缩包：<a href="https://github.com/kubernetes-sigs/kustomize/releases/download/kustomize/v3.8.1/kustomize_v3.8.1_linux_amd64.tar.gz" target="_blank" rel="noreferrer">https://github.com/kubernetes-sigs/kustomize/releases/download/kustomize/v3.8.1/kustomize_v3.8.1_linux_amd64.tar.gz</a></p><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span># 解压并安装</span></span>
<span class="line"><span>$ tar zxvf kustomize_v3.8.1_linux_amd64.tar.gz</span></span>
<span class="line"><span>$ chmod +x kustomize</span></span>
<span class="line"><span>$ mv kustomize /usr/local/bin/</span></span>
<span class="line"><span>$ kustomize version</span></span>
<span class="line"><span>{Version:kustomize/v3.8.1 GitCommit:0b359d0ef0272e6545eda0e99aacd63aef99c4d0 BuildDate:2020-07-16T00:58:46Z GoOs:linux GoArch:amd64}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div><h4 id="安装controller-gen" tabindex="-1">安装controller-gen <a class="header-anchor" href="#安装controller-gen" aria-label="Permalink to &quot;安装controller-gen&quot;">​</a></h4><p>下载源码，编译安装</p><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>wget https://github.com/kubernetes-sigs/controller-tools/archive/refs/tags/v0.10.0.zip</span></span>
<span class="line"><span>$ unzip v0.10.0.zip</span></span>
<span class="line"><span>$ cd controller-tools-0.10.0</span></span>
<span class="line"><span>$ go build -a -o controller-gen cmd/controller-gen/main.go</span></span>
<span class="line"><span>$ mv controller-gen /usr/local/bin/</span></span>
<span class="line"><span>$ controller-gen --version</span></span>
<span class="line"><span>Version: (devel)</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div><h4 id="安装kubebuilder" tabindex="-1">安装kubebuilder <a class="header-anchor" href="#安装kubebuilder" aria-label="Permalink to &quot;安装kubebuilder&quot;">​</a></h4><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span># go env GOOS -- 获取操作系统类型，例如：linux等</span></span>
<span class="line"><span># go env GOARCH -- 获取系统架构，例如：arm或amd64等</span></span>
<span class="line"><span>$ curl -L -o kubebuilder https://go.kubebuilder.io/dl/latest/$(go env GOOS)/$(go env GOARCH)</span></span>
<span class="line"><span>$ chmod +x kubebuilder &amp;&amp; mv kubebuilder /usr/local/bin/</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><p>安装完成，查看下版本</p><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span># kubebuilder version</span></span>
<span class="line"><span>Version: main.version{KubeBuilderVersion:&quot;3.2.0&quot;, KubernetesVendor:&quot;1.22.1&quot;, GitCommit:&quot;b7a730c84495122a14a0faff95e9e9615fffbfc5&quot;, BuildDate:&quot;2021-10-29T18:32:16Z&quot;, GoOs:&quot;linux&quot;, GoArch:&quot;amd64&quot;}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div>`,39),r=[p];function t(o,u,c,d,b,m){return a(),s("div",null,r)}const k=e(i,[["render",t]]);export{g as __pageData,k as default};
