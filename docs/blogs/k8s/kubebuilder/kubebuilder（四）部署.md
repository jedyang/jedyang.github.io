## kubebuilder（四）部署

### 将crd部署到k8s

```
make install
```

日志：

>kustomize build config/crd | kubectl apply -f -
>customresourcedefinition.apiextensions.k8s.io/demoes.tutorial.demo.com created

查看下

```
[root@paas-m-k8s-master-1 demo-operator]# kubectl api-resources | grep demo
demoes                                              tutorial.demo.com                  true         Demo
```

确实有了，不错哦。



### 编译运行controller

```
make run
```

保持窗口开启

```
。。。日志如下
go run ./main.go
I0314 14:37:11.802311   20314 request.go:665] Waited for 1.037997549s due to client-side throttling, not priority and fairness, request: GET:https://apiserver.cluster.local:6443/apis/rbac.istio.io/v1alpha1?timeout=32s
2024-03-14T14:37:13.055+0800    INFO    controller-runtime.metrics      metrics server is starting to listen    {"addr": ":8080"}
2024-03-14T14:37:13.055+0800    INFO    setup   starting manager
2024-03-14T14:37:13.055+0800    INFO    starting metrics server {"path": "/metrics"}
2024-03-14T14:37:13.055+0800    INFO    controller.demo Starting EventSource    {"reconciler group": "tutorial.demo.com", "reconciler kind": "Demo", "source": "kind source: /, Kind="}
2024-03-14T14:37:13.055+0800    INFO    controller.demo Starting Controller     {"reconciler group": "tutorial.demo.com", "reconciler kind": "Demo"}
2024-03-14T14:37:13.258+0800    INFO    controller.demo Starting workers        {"reconciler group": "tutorial.demo.com", "reconciler kind": "Demo", "worker count": 1}
```

### 创建一个crd实例

在samples目录下有一个默认的资源描述文件tutorial_v1_demo.yaml

我们可以使用进行部署测试

```
apiVersion: tutorial.demo.com/v1
kind: Demo
metadata:
  namespace: demo
  name: demo-sample
spec:
  # TODO(user): Add fields here
  image: nginx:1.22
  svcName: demo-ng
  replicas: 3

```



现在还没有我们自定义的demo crd实例，demo nameSpace下也没有任何pod

```
# kubectl -n demo get demo
No resources found in default namespace.
# kubectl -n demo get pod
No resources found in demo namespace.
```

我们apply一下这个demo crd

```
# kubectl apply -f config/samples/tutorial_v1_demo.yaml
```

查看自定义资源

```
#  kubectl get demo -n demo
NAME          AGE
demo-sample   12s
```





### controller的日志

![image-20240314160120867](kubebuilder（四）部署.assets\image-20240314160120867.png)



### 查看资源

```
# kubectl -n demo get pod
NAME                       READY   STATUS    RESTARTS   AGE
demo-ng-6df8f7c68f-4mg9n   1/1     Running   0          4m33s
demo-ng-6df8f7c68f-699bv   1/1     Running   0          4m33s
demo-ng-6df8f7c68f-n6zkc   1/1     Running   0          4m33s
```

看到3个pod都创建出来了



验证通过patch修改podNum，来增减pod的数量

```
kubectl -n demo patch demo demo-sample --type merge --patch '{"spec": {"replicas": 5}}'
```

![image-20240314160619545](kubebuilder（四）部署.assets\image-20240314160619545.png)

自动加到了5个



减一下

```
kubectl -n demo patch demo demo-sample --type merge --patch '{"spec": {"replicas": 2}}'
```

![image-20240314160740364](kubebuilder（四）部署.assets\image-20240314160740364.png)

controller中也会看到对应的日志

![image-20240314162601021](kubebuilder（四）部署.assets\image-20240314162601021.png)



