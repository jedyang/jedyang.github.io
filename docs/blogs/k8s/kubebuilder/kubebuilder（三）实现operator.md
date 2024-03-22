## kubebuilder（三）实现operator

在前面的文章我们已经了解了operator项目的基本结构。现在我们来写一点简单的代码，然后把我们的crd和operator部署到k8s集群中。

## 需求

这是一个真实的需求，只不过做了简化。

在开发公司自己的paas平台，有一个需求是，用户在发版的时候，只需要在页面上填几个字段，我们在k8s中自动拉起service和deployment等资源，屏蔽k8s的底层技术对上层用户的困扰。

我们这里只要让用户填一下 业务名，镜像地址和副本数。



## 定义API

修改api目录下的demo_types.go文件,这个文件定义了我们的CRD中spec可用的字段。

注意: json 标签是必需的。为了能够序列化字段，任何你添加的新的字段一定有json标签。

![image-20240129171326962](kubebuilder（三）实现operator.assets\image-20240129171326962.png)



```
type DemoSpec struct {
	// +kubebuilder:validation:Required
	Image string `json:"image,omitempty"`
	// +kubebuilder:validation:Required
	SvcName string `json:"svcName,omitempty"`
	// +kubebuilder:validation:Required
	Replicas *int32 `json:"replicas,omitempty"`
}
```

然后定义下资源的status

```
type DemoStatus struct {
	Replicas *int32 `json:"replicas,omitempty"`
}
```

每次修改API定义后，需要执行命令自动重新生成CRD定义代码

```
# make manifests
```

![image-20240130112827332](kubebuilder（三）实现operator.assets\image-20240130112827332.png)

可以看到生成了我们的crd



### 实现controller

kubebuilder已经很贴心的告诉了我们代码应该写在哪

![image-20240129172302802](kubebuilder（三）实现operator.assets\image-20240129172302802.png)

代码流程

根据crd资源创建service和deployment

如果修改ctd中的replicas，同样触发deployment的变更

代码比较长，放在github上了

https://github.com/jedyang/demo/tree/master/kubebuilder

这里先不开发代码也是可以的，先打几行日志，把流程跑通

默认情况下，Reconcile方法返回错误就会触发再次循环。

### 配置监听

我们写完了Reconcile()，那么什么时候这个Reconcile会得到执行呢？

这就要看SetupWithManager()方法

SetupWithManager方法，就是用于添加我们关心哪些资源的变动。

默认生成的是这样的

```
func (r *DemoReconciler) SetupWithManager(mgr ctrl.Manager) error {
	return ctrl.NewControllerManagedBy(mgr).
		For(&tutorialv1.Demo{}).
		Complete(r)
}
```

表示监听我们自定义的这个tutorialv1.Demo资源。也就是我们在k8s中只要这个crd的变动，就会触发我们的Reconcile()方法

如果修改为

```
import (
	...
	appsv1 "k8s.io/api/apps/v1"
	corev1 "k8s.io/api/core/v1"
)
func (r *DemoReconciler) SetupWithManager(mgr ctrl.Manager) error {
	return ctrl.NewControllerManagedBy(mgr).
		For(&tutorialv1.Demo{}).
		Owns(&corev1.Pod{}).
		Owns(&corev1.Service{}).
		Owns(&appsv1.Deployment{}).
		Complete(r)
}
```

就是对任何tutorialv1.Demo或Service、Deployment、Pod的变化，我们的Controller都会监听到，并生成事件，触发Reconcile()方法。



### 开发参考资源

kubebuilder官方手册：https://book.kubebuilder.io/introduction.html

kubenetes api文档：https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.21/

https://kubernetes.io/docs/reference/kubernetes-api/





