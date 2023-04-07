# Misc

---

```yaml
			- name: download notes as html.zip and markdown.zip
        uses: ./backup-notion
        env:
            NOTION_TOKEN: ${{ secrets.NOTION_TOKEN }}
            NOTION_SPACE_ID: ${{ secrets.NOTION_SPACE_ID }}

      - name: cache if notion not changed
        id: cache
        uses: actions/cache@v2
        with:
          path: html.zip
          key: ${{runner.os}}--${{hashFiles('html.zip')}}
```

```bash
# linux openssl 加密和解密
# 加密的ciphers: -bf-cbc, -des-ede3-cbc, -aes-256-cbc ...
1. 加密
	openssl enc -aes-256-cbc -salt -in 源文件 -out 目标文件 -pbkdf2 -k 密码
2. 解密
	openssl enc -d -aes-256-cbc -salt -in 源文件 -out 目标文件 -pbkdf2 -k 密码
```

```powershell
<#
# create a release
# your_token
$header = @{
  Authorization="Bearer "+"your_token"
  Accept="application/vnd.github.v3+json"  
}
$data = @{
  tag_name="v0.0.1"
  name="new title"
  body="some content"
} | convertto-json
$rt = invoke-webrequest -method post -header $header -body $data -uri https://api.github.com/repos/用户名/仓库名/releases
$rt.content
#>

<#
# upload assets to a release
# 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
$header = @{
  Authorization="Bearer "+"your_token"
  Accept="application/vnd.github.v3+json"
  "Content-type"="application/octet-stream"
}
$file_path = "文件路径"
$rt = invoke-webrequest -method post -header $header  -infile $file_path -uri https://uploads.github.com/repos/用户名/仓库名/releases/release_id编号/assets?name=文件的名字加后缀
$rt.content
#>
```

## Microsoft 365 E5 开发者订阅

主要用它的 onedrive, 容量 5T, 同时还有 onenote, email 等功能.

订阅有效期 默认 90 天, **续期** 需要向 Microsoft 证明你是开发者,在积极的开发中.

- Microsoft 365 E5 管理入口
    
    [https://office.com/?auth=2](https://office.com/?auth=2)
    
- Microsoft 365 E5 订阅剩余天数
    
    [https://developer.microsoft.com/en-us/microsoft-365/dev-program](https://developer.microsoft.com/zh-cn/microsoft-365/dev-program)
    
    使用申请 E5 开发者订阅的那个账号, 而不是类似 xx@xx.onmicrosoft.com 登录.
    

```bash
# 通过 api 访问OneDrive,并下载文件.

# 通过 oauth 2.0 的两种grant_type来获取 access_token.
# grant_type: password
# 这种方式 需要 开发者的账号和密码
curl -X POST -H "Content-Type: application/x-www-form-urlencoded" \
-d 'client_id={client_id}&username={your_username}&password={your_password}&scope=openid&client_secret={client_secret}&grant_type=password' \
'https://login.microsoftonline.com/{tenant_id}/oauth2/v2.0/token' 

# grant_type: client_credentials
# 这种方式, 需要 {client_secret}
# 这样获取的token, 访问 onedrive api时, 需要**显示指定用户**
# 要添加 **/user/{user_id}/**drive/root/children
# 直接 /me/drive/root/children 会 报错: Unable to retrieve user's mysite URL
curl -X POST -H "Content-Type: application/x-www-form-urlencoded" -d 'client_id={client_id}&scope=https%3A%2F%2Fgraph.microsoft.com%2F.default&client_secret={client_secret}&grant_type=client_credentials' \
'https://login.microsoftonline.com/{tenant_id}/oauth2/v2.0/token'

# 查看 onedrive 里面的文件信息
# {token},替换成上面获取到的.
# 若要获取文件夹的下载链接, https://graph.microsoft.com/v1.0/me/drive/items/{folder_id}/children
curl https://graph.microsoft.com/v1.0/me/drive/root/children -H "Authorization: Bearer ${token}"

```