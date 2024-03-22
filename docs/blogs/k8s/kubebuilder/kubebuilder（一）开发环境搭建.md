## kubebuilder（一）开发环境搭建

开发一个k8s operator,当然可以在官方原生的controller-runtime 项目上从头构建，但是比较复杂。现在一般基于operator脚手架进行开发。目前最流行的的脚手架是Kubebuilder 或 OperatorSDK。Kubebuilder 或 OperatorSDK都是对controller-runtime 项目进行了上层的封装，使开发者可以专注于业务逻辑的实现。这里讲解kubebuilder的使用步骤。

首选需要一个可用的K8S集群。然后有一台linux服务器，能部署kubebuilder

![image-20221221155300941](kubebuilder（一）开发环境搭建.assets\image-20221221155300941.png)

### kubectl的配置

下载

```
curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl
```

给文件可执行权限；

```
chmod +x ./kubectl
```

将kubectl移动到可以全局执行的目录下：

```
 mv ./kubectl /usr/local/bin/kubectl
```

kubectl要想连接k8s集群，还需要一个k8s的config文件。就在k8s集群的/root/.kube/目录下。复制到我们的kubebuilder服务器上同样目录下。

现在我们在kubebuilder服务器上也可以操作k8s了。



### 部署kubebuilder

各个组件的版本

go  1.18.5

docker     19.03.0



#### 安装go

安装一些必要的工具

```
yum install unzip tree wget gcc gcc-c++ kernel-devel -y
```

安装go

安装官网安装的https://golang.google.cn/doc/install

额外执行以下命令

```
$ go env -w GO111MODULE=on
$ go env -w GOPROXY=https://goproxy.cn,direct
```

#### 安装docker

略

#### 安装kustomize

后面的操作中需要使用kustomize去做配置管理。

kustomize允许用户将不同环境所共享的配置放在一个文件目录下，而将其他不同的配置放在另外的目录下。这样用户就可以很容易的区分那些值是当前环境所特有的，从而在修改的时候会额外关注。

官方给出的安装方式，因为网络问题安装失败

基于模板生成YAML文件，下载kustomize二进制压缩包：https://github.com/kubernetes-sigs/kustomize/releases/download/kustomize/v3.8.1/kustomize_v3.8.1_linux_amd64.tar.gz

```
# 解压并安装
$ tar zxvf kustomize_v3.8.1_linux_amd64.tar.gz
$ chmod +x kustomize
$ mv kustomize /usr/local/bin/
$ kustomize version
{Version:kustomize/v3.8.1 GitCommit:0b359d0ef0272e6545eda0e99aacd63aef99c4d0 BuildDate:2020-07-16T00:58:46Z GoOs:linux GoArch:amd64}
```

#### 安装controller-gen

下载源码，编译安装

```
wget https://github.com/kubernetes-sigs/controller-tools/archive/refs/tags/v0.10.0.zip
$ unzip v0.10.0.zip
$ cd controller-tools-0.10.0
$ go build -a -o controller-gen cmd/controller-gen/main.go
$ mv controller-gen /usr/local/bin/
$ controller-gen --version
Version: (devel)
```

#### 安装kubebuilder

```
# go env GOOS -- 获取操作系统类型，例如：linux等
# go env GOARCH -- 获取系统架构，例如：arm或amd64等
$ curl -L -o kubebuilder https://go.kubebuilder.io/dl/latest/$(go env GOOS)/$(go env GOARCH)
$ chmod +x kubebuilder && mv kubebuilder /usr/local/bin/
```

安装完成，查看下版本

```
# kubebuilder version
Version: main.version{KubeBuilderVersion:"3.2.0", KubernetesVendor:"1.22.1", GitCommit:"b7a730c84495122a14a0faff95e9e9615fffbfc5", BuildDate:"2021-10-29T18:32:16Z", GoOs:"linux", GoArch:"amd64"}
```

