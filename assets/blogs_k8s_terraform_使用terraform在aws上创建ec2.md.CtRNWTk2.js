import{_ as s,c as n,o as a,a2 as p}from"./chunks/framework.DukRYrIy.js";const e="/assets/image-20240412093205067.CvA7NnkZ.png",l="/assets/image-20240412094957990.BhbLsZJw.png",f=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"blogs/k8s/terraform/使用terraform在aws上创建ec2.md","filePath":"blogs/k8s/terraform/使用terraform在aws上创建ec2.md","lastUpdated":1713348792000}'),r={name:"blogs/k8s/terraform/使用terraform在aws上创建ec2.md"},i=p('<p>下载安装</p><p><a href="https://developer.hashicorp.com/terraform/install" target="_blank" rel="noreferrer">Install | Terraform | HashiCorp Developer</a></p><p>我下载的二进制包，直接解压即可使用。最好把terraform加到环境变量里</p><p><img src="'+e+`" alt="image-20240412093205067"></p><p>terraform使用自己的HashiCorp配置语言（HCL）编写tl文件，来进行资源的编排。</p><p>配置文件的格式可以有两种格式：Terraform格式和JSON。Terraform格式更加人性化，支持注释，并且是大多数Terraform文件通常推荐的格式。JSON格式适用于机器创建，修改和更新，也可以由Terraform操作员完成。Terraform格式后缀名以.tf结尾，JSON格式后缀名以.tf.json结尾</p><p>在调用加载Terraform配置的任何命令时，Terraform将按字母顺序加载指定目录中的所有配置文件。</p><p>加载文件的后缀名必须是.tf或.tf.json。否则，文件将被忽略。</p><h2 id="开始" tabindex="-1">开始 <a class="header-anchor" href="#开始" aria-label="Permalink to &quot;开始&quot;">​</a></h2><p>编写tf文件</p><p>目录 demo-ec2 ec.tf</p><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>provider &quot;aws&quot; {</span></span>
<span class="line"><span>  region = &quot;us-east-1&quot;  </span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>resource &quot;aws_instance&quot; &quot;example&quot; {</span></span>
<span class="line"><span>  ami           = &quot;ami-0c55b159cbfafe1f0&quot;  </span></span>
<span class="line"><span>  instance_type = &quot;t2.micro&quot;</span></span>
<span class="line"><span>  tags = {</span></span>
<span class="line"><span>    Name = &quot;example-instance&quot;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  provisioner &quot;remote-exec&quot; {</span></span>
<span class="line"><span>    inline = [</span></span>
<span class="line"><span>      &quot;sudo yum install -y  httpd&quot;,</span></span>
<span class="line"><span>      &quot;sudo systemctl start httpd&quot;,</span></span>
<span class="line"><span>      &quot;sudo systemctl enable httpd&quot;</span></span>
<span class="line"><span>    ]</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  connection {</span></span>
<span class="line"><span>    type        = &quot;ssh&quot;</span></span>
<span class="line"><span>    user        = &quot;ec2-user&quot;</span></span>
<span class="line"><span>    private_key = file(&quot;~/.ssh/your_private_key.pem&quot;)  </span></span>
<span class="line"><span>    host        = self.public_ip</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>resource &quot;aws_security_group&quot; &quot;http_sg&quot; {</span></span>
<span class="line"><span>  name        = &quot;http_sg&quot;</span></span>
<span class="line"><span>  description = &quot;Allow HTTP inbound traffic&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  ingress {</span></span>
<span class="line"><span>    from_port   = 80</span></span>
<span class="line"><span>    to_port     = 80</span></span>
<span class="line"><span>    protocol    = &quot;tcp&quot;</span></span>
<span class="line"><span>    cidr_blocks = [&quot;0.0.0.0/0&quot;]</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  egress {</span></span>
<span class="line"><span>    from_port   = 0</span></span>
<span class="line"><span>    to_port     = 0</span></span>
<span class="line"><span>    protocol    = &quot;-1&quot;</span></span>
<span class="line"><span>    cidr_blocks = [&quot;0.0.0.0/0&quot;]</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br></div></div><p>ami: amazon machine image</p><p>init</p><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>terraform.exe init</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><p><img src="`+l+'" alt="image-20240412094957990"></p><p>init会根据当前目录下的tf文件，下载相应的插件</p><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>terraform plan</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>在正式执行之前，可以用plan命令预览执行计划</p>',19),t=[i];function c(o,u,b,m,d,_){return a(),n("div",null,t)}const q=s(r,[["render",c]]);export{f as __pageData,q as default};
