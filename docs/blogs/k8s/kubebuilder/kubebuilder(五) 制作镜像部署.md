## 制作镜像

好了，前面是使用make run进行测试运行。现在我们把operator打出镜像进行分发。

先修改一下Dockerfile,否则可能下载依赖有问题

```
ENV GO111MODULE=on
ENV GOPROXY=https://goproxy.cn,direct
```

然后，默认的这个FROM gcr.io/distroless/static:nonroot也是下不到的

替换成这个

```
anjia0532/distroless.static:nonroot
```

![image-20240314175005139](kubebuilder(五)制作镜像部署.assets/image-20240314175005139.png)

我这里是自己搭的私有harbor

```
make docker-build docker-push IMG=harbor-test.xxx.net/paas/demo-operator:1.0
```

![image-20240314173521885](kubebuilder(五)制作镜像部署.assets\image-20240314173521885.png)



## 部署operator镜像

部署有两种方案

### make deploy

使用项目自带的deploy指令，这种方式是将operator部署到本地集群中，其实和make run差不多

```
make deploy IMG=harbor-test.xxx.net/paas/demo-operator:1.0
```

也可修改~/.kube/config来连接其他集群，但还是太麻烦。

```
kustomize build config/default | kubectl apply -f -
namespace/demo-operator-system created
customresourcedefinition.apiextensions.k8s.io/demoes.tutorial.demo.com unchanged
serviceaccount/demo-operator-controller-manager created
role.rbac.authorization.k8s.io/demo-operator-leader-election-role created
clusterrole.rbac.authorization.k8s.io/demo-operator-manager-role created
clusterrole.rbac.authorization.k8s.io/demo-operator-metrics-reader created
clusterrole.rbac.authorization.k8s.io/demo-operator-proxy-role created
rolebinding.rbac.authorization.k8s.io/demo-operator-leader-election-rolebinding created
clusterrolebinding.rbac.authorization.k8s.io/demo-operator-manager-rolebinding created
clusterrolebinding.rbac.authorization.k8s.io/demo-operator-proxy-rolebinding created
configmap/demo-operator-manager-config created
service/demo-operator-controller-manager-metrics-service created
deployment.apps/demo-operator-controller-manager created
```

查看部署情况

![image-20240315092100583](kubebuilder(五)制作镜像部署.assets\image-20240315092100583.png)

查看一下pod的日志

![image-20240315092820168](kubebuilder(五)制作镜像部署.assets\image-20240315092820168.png)

我们再部署一个demo测试一下

```
kubectl apply -f config/samples/tutorial_v1_demo.yaml
```

![image-20240315093227608](kubebuilder(五)制作镜像部署.assets\image-20240315093227608.png)

执行调谐完成



如果你的部署遇到问题，可能会遇到镜像下载不下来的问题。

原因还是gcr.io/kubebuilder/kube-rbac-proxy被墙了

改一下

![image-20240314175854575](kubebuilder(五)制作镜像部署.assets\image-20240314175854575.png)



### yaml部署

我们需要的当然是把写的operator分发到别的集群部署。

通过分析make deploy脚本，来编写yaml

```
.PHONY: deploy
deploy: manifests kustomize ## Deploy controller to the K8s cluster specified in ~/.kube/config.
	cd config/manager && $(KUSTOMIZE) edit set image controller=${IMG}
	$(KUSTOMIZE) build config/default | kubectl apply -f -
```

这个脚本的本质就是用kustomize对config下的manager和default中的yaml进行变量替换

然后整合成一个yaml，传给kubectl apply执行

所以啊，我们只要执行下这两行就可以得到我们想要的yaml文件，然后就可以随便到别的集群执行了哦

```
cd config/manager && /usr/local/bin/kustomize edit set image controller=harbor-test.xxx.net/paas/demo-operator:1.0

cd ../.. && /usr/local/bin/kustomize build config/default > demo-operator.yaml
```

输出这样一个yaml

```
apiVersion: v1
kind: Namespace
metadata:
  labels:
    control-plane: controller-manager
  name: demo-operator-system
---
太长了，不贴了
```

去别的集群，部署试试

部署operator

```
kubectl apply -f demo-operator.yaml
```

部署一个demo  crd

```
kubectl apply -f demo-simple.yaml
```

![image-20240315095308702](kubebuilder(五)制作镜像部署.assets\image-20240315095308702.png)

完成

