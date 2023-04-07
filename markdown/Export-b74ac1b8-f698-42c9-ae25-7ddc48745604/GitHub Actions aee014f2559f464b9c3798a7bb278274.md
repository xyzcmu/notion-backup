# GitHub Actions

[官方文档](https://docs.github.com/en/actions)

![GitHub%20Actions%20aee014f2559f464b9c3798a7bb278274/github-actions.svg](GitHub%20Actions%20aee014f2559f464b9c3798a7bb278274/github-actions.svg)

在 **某个事件** 触发的时候,或者 **定时**, 执行 workflow.

<aside>
💡 这里的定时,并不能准时执行,大部分情况下会延时,具体延时多久也不确定!

</aside>

---

- 基本用法
    - workflow 采用 yaml 格式编写
        
        ```yaml
        # This is a basic workflow to help you get started with Actions
        
        name: CI
        
        # Controls when the action will run. 
        on:
          # Triggers the workflow on push or pull request events but only for the main branch
          push:
            branches: [ main ]
          pull_request:
            branches: [ main ]
        
          # Allows you to run this workflow manually from the Actions tab
          workflow_dispatch:
        
        # A workflow run is made up of one or more jobs that can run sequentially or in parallel
        jobs:
          # This workflow contains a single job called "build"
          build:
            # The type of runner that the job will run on
            runs-on: ubuntu-latest
        
            # Steps represent a sequence of tasks that will be executed as part of the job
            steps:
              # Checks-out your repository under $GITHUB_WORKSPACE, so your job can access it
              - uses: actions/checkout@v2
        
              # Runs a single command using the runners shell
              - name: Run a one-line script
                run: echo Hello, world!
        
              # Runs a set of commands using the runners shell
              - name: Run a multi-line script
                run: |
                  echo Add other actions to build,
                  echo test, and deploy your project. 
        ```
        
    - 文件位置
        
        .github/workflows
        
        所有的 workflow 都用 yaml 格式编写,并放在该目录下.
        
- 自定义 action
    
    [Finding and customizing actions](https://docs.github.com/en/actions/learn-github-actions/finding-and-customizing-actions)
    
    - **使用 JavaScript 编写**
        - 创建
            - action.yml
                
                [详细](https://docs.github.com/en/actions/creating-actions/metadata-syntax-for-github-actions#about-yaml-syntax-for-github-actions) 
                
                - 包括 输入/输出 参数(如果有的话)
                - 指定 具体逻辑文件所在的位置
            - index.js
                
                文件名 自定义
                
                具体的 action 逻辑.
                
        - 使用
            
            在 .github/workflows/ 下创建一个 workflow 文件, 比如 custom.yml
            
            并在 steps 下的 uses 字段中 填上 action.yml 文件所在的目录即可.
            
- action 中, 调用 rest api
    
    ```yaml
    - name: create-release
            run: |
              curl \
              -X POST \
              -H "Authorization: Bearer $token" \
              -H "Accept: application/vnd.github.v3+json" \
              -d '{"tag_name":"v0.0.1","name":"release_title","body":"release_content"}' \
              https://api.github.com/repos/your_username/your_repo/releases
            env:
              token: ${{github.token}}
    
    - name: upload-assets
            run: |
              curl \
              -X POST \
              -H "Authorization: Bearer $token" \
              -H "content-type: your_file_MIME_TYPE" \
              -H "Accept: application/vnd.github.v3+json" \
              --data-binary @path-to-your-file \
              https://uploads.github.com/repos/your_username/your_repo/releases/your_release_id/assets?name=display_name
            env:
              token: ${{github.token}}
    
    - name: delete-assets
            run: |
              curl \
              -X DELETE \
              -H "Authorization: Bearer $token" \
              -H "Accept: application/vnd.github.v3+json" \
              https://api.github.com/repos/your_username/your_repo/releases/assets/your_assets_id
            env:
              token: ${{github.token}}
    
    - name: delete-release
            run: |
              curl \
              -X DELETE \
              -H "Authorization: Bearer $token" \
              -H "Accept: application/vnd.github.v3+json" \
              https://api.github.com/repos/your_username/your_repo/releases/your_release_id
            env:
              token: ${{github.token}}
    
    - name: delete-tag
            run: |
              curl \
              -X DELETE \
              -H "Authorization: Bearer $token" \
              -H "Accept: application/vnd.github.v3+json" \
              https://api.github.com/repos/your_username/your_repo/git/refs/tags/your_tag
            env:
              token: ${{github.token}}
    ```