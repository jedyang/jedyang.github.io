## kubebuilder（二）创建项目及初始化

一个demo项目来了解kubebuilder的项目结构

### 初始化项目

```
mkdir demo-operator
cd demo-operator
kubebuilder init --domain demo.com --repo demo.com/tutorial
```

这一步创建了 Go module 工程基本的模板文件，引入了必要的依赖

如果不用--repo参数，也可以先

```
go mod init demo.com/tutorial
```

手动初始化一个go module工程

打印的日志

```
Writing kustomize manifests for you to edit...
Writing scaffold for you to edit...
Get controller runtime:
$ go get sigs.k8s.io/controller-runtime@v0.10.0
Update dependencies:
$ go mod tidy
Next: define a resource with:
$ kubebuilder create api
```

可以看到我这里使用的controller-runtime是0.10.0版本。

查看

```
[root@paas-m-k8s-master-1 demo-operator]# tree
.
├── config
│   ├── default
│   │   ├── kustomization.yaml
│   │   ├── manager_auth_proxy_patch.yaml
│   │   └── manager_config_patch.yaml
│   ├── manager
│   │   ├── controller_manager_config.yaml
│   │   ├── kustomization.yaml
│   │   └── manager.yaml
│   ├── prometheus
│   │   ├── kustomization.yaml
│   │   └── monitor.yaml
│   └── rbac
│       ├── auth_proxy_client_clusterrole.yaml
│       ├── auth_proxy_role_binding.yaml
│       ├── auth_proxy_role.yaml
│       ├── auth_proxy_service.yaml
│       ├── kustomization.yaml
│       ├── leader_election_role_binding.yaml
│       ├── leader_election_role.yaml
│       ├── role_binding.yaml
│       └── service_account.yaml
├── Dockerfile
├── go.mod
├── go.sum
├── hack
│   └── boilerplate.go.txt
├── main.go
├── Makefile
└── PROJECT

6 directories, 24 files

```

就是一个标准的go module项目

### 一些重要的文件

1. Makefile：非常重要的工具，以后编译构建、部署、运行都会用到；
2. PROJECT：kubebuilder工程的元数据，在生成各种API的时候会用到这里面的信息；
3. config/default：基于kustomize制作的配置文件，为controller提供标准配置，也可以按需要去修改调整；
4. config/manager：一些和manager有关的细节配置，例如镜像的资源限制；
5. config/rbac：如果需要限制operator在kubernetes中的操作权限，就要通过rbac来做精细的权限配置了



main.go是程序的入口，初始化了Manager，由manager来管理api和controller

![img](kubebuilder（二）创建项目.assets\v2-371736f46c2077c9a8a759a09a0e5a21_720w.webp)

我们现在捋一下，k8s接收crd资源描述，crd被我们将要编写的controllrt控制。那么manager是什么

manager是用来管理controller的控制器，代码的主要功能就是启动controller，并使多个controller共存

下面我们继续创建crd文件和对应的controller代码

### 创建crd文件和controller

创建api的命令如下：但先别急着执行

```
kubebuilder create api --group tutorial --version v1 --kind Demo
```

> ```
> 也就是常说的GVK
> 1）group参数表示组的概念
> 2）version定义版本
> 3）kind定义自定义资源类型
> 4）以上参数组成了自定义资源的yaml 的 apiVersion和kind
> ```

如果直接执行，你可能会遇到这个错误

![image-20240129164353991](kubebuilder（二）创建项目.assets\image-20240129164353991.png)

原因是

在执行过程中，会根据Makefile来执行操作。

其中有一步是使用controller-gen来生成代码

![image-20240129164517895](kubebuilder（二）创建项目.assets\image-20240129164517895.png)

这里寻找controller-gen的路径是$(shell pwd)/bin/controller-gen

并不是我之前安装的controller-gen路径，所以需要修改以下。

否则找不到，就会去下载，但是我当前工作目录下并没有bin目录。会失败

改成

```
CONTROLLER_GEN = controller-gen
```

因为我上一篇准备工作，已经放到全局可执行了。

同理，把kustomize也顺手改掉，后面的make会用到

![image-20240129164933847](kubebuilder（二）创建项目.assets\image-20240129164933847.png)

```
KUSTOMIZE = kustomize
```

现在执行一下创建命令

![image-20240129165802014](kubebuilder（二）创建项目.assets\image-20240129165802014.png)

执行成功之后，查看下目录

![image-20240129165924556](kubebuilder（二）创建项目.assets\image-20240129165924556.png)

可以看到，kubebuilder自动为我们创建了几个关键的目录和文件

- api/v1 ：对应于创建时指定的version  v1。  名字demo对应我们创建时指定的Kind
- config/crd
- controllers



我们查看几个重要的文件

1. 在PROJECT文件中新增了API资源声明

   ```
   domain: demo.com
   layout:
   - go.kubebuilder.io/v3
   projectName: demo-operator
   repo: demo.com/tutorial
   resources:
   - api:
       crdVersion: v1
       namespaced: true
     controller: true
     domain: demo.com
     group: tutorial
     kind: Demo
     path: demo.com/tutorial/api/v1
     version: v1
   version: "3"
   
   ```

2. 新增了api目录，包含crd的类型定义

3. 新增了crd目录，是crd的描述文件

4. 在rbac目录中新增了对应的role文件

5. 新增controller目录，包含controller文件

6. 还有一个不容易发现的修改点是main.go文件

   ```
   	if err = (&controllers.DemoReconciler{
   		Client: mgr.GetClient(),
   		Scheme: mgr.GetScheme(),
   	}).SetupWithManager(mgr); err != nil {
   		setupLog.Error(err, "unable to create controller", "controller", "Demo")
   		os.Exit(1)
   	}
   ```

   注册了我们的controller



### 一些不重要的文件

可以看到在api下还有两个文件

- groupversion_info.go
- zz_generated.deepcopy.go

这两个文件都不需要去修改。groupversion_info是一些group和version信息，zz_generated.deepcopy.go是会自动生成的。



