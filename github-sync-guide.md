# 同步量子筊問專案到 GitHub 詳細步驟指南

本指南將協助您將本地「量子筊問」專案同步到 GitHub，為後續部署到 Render.com 做準備。這些步驟專為 Windows 系統設計。

## 前置準備

### 1. 安裝 Git

1. 前往 [Git 官網](https://git-scm.com/download/win) 下載適合您 Windows 系統的版本
2. 安裝時選擇默認選項即可
3. 安裝完成後，打開 PowerShell 或命令提示符，輸入以下命令確認安裝成功：

```powershell
git --version
```

### 2. 創建 GitHub 帳戶

1. 前往 [GitHub](https://github.com/) 註冊帳戶
2. 驗證電子郵件地址

### 3. 配置 Git 用戶信息

在 PowerShell 中運行以下命令，將 "Your Name" 和 "your.email@example.com" 替換為您的信息：

```powershell
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## 創建 GitHub 倉庫

### 1. 創建新倉庫

1. 登入 GitHub 帳戶
2. 點擊頁面右上角 "+" 圖標，選擇 "New repository"
3. 倉庫名稱輸入 "quantum-divination"
4. 描述欄位可輸入："量子筊問 - 結合量子力學與中國文化的互動敘事遊戲"
5. 選擇 "Public"（公開）或 "Private"（私有）
6. 勾選 "Add a README file"（添加 README 文件）
7. 點擊 "Create repository"（創建倉庫）

## 同步本地專案到 GitHub

### 方法一：克隆後複製文件（推薦新手）

1. 創建一個臨時目錄用於克隆倉庫：

```powershell
# 在桌面創建臨時目錄
mkdir C:\Users\fox994\Desktop\temp-quantum
cd C:\Users\fox994\Desktop\temp-quantum
```

2. 克隆新創建的 GitHub 倉庫：

```powershell
git clone https://github.com/您的用戶名/quantum-divination.git
cd quantum-divination
```

3. 複製專案文件到克隆的倉庫中：

```powershell
# 使用 PowerShell 的 Copy-Item 命令
Copy-Item -Path "C:\Users\fox994\Desktop\AI專案\031 量子筊問\*" -Destination "." -Recurse -Force
```

4. 創建 .gitignore 文件：

```powershell
# 創建 .gitignore 文件
@"
# 依賴目錄
node_modules/
dist/

# 環境變數
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# 日誌
logs
*.log
npm-debug.log*

# 操作系統文件
.DS_Store
Thumbs.db
"@ | Out-File -FilePath .gitignore -Encoding utf8
```

5. 將修改添加到暫存區並提交：

```powershell
git add .
git commit -m "初始提交：添加量子筊問專案文件"
```

6. 推送到 GitHub：

```powershell
git push origin main
```

### 方法二：現有 Git 倉庫連接到 GitHub（適合有經驗者）

如果您的專案已經是 Git 倉庫：

1. 進入專案目錄：

```powershell
cd "C:\Users\fox994\Desktop\AI專案\031 量子筊問"
```

2. 檢查是否已初始化 Git：

```powershell
# 如果目錄中有 .git 文件夾則已初始化
# 否則需初始化
git init
```

3. 創建 .gitignore 文件：

```powershell
# 創建 .gitignore 文件
@"
# 依賴目錄
node_modules/
dist/

# 環境變數
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# 日誌
logs
*.log
npm-debug.log*

# 操作系統文件
.DS_Store
Thumbs.db
"@ | Out-File -FilePath .gitignore -Encoding utf8
```

4. 添加所有文件到暫存區：

```powershell
git add .
```

5. 提交更改：

```powershell
git commit -m "初始提交：量子筊問專案"
```

6. 添加 GitHub 倉庫作為遠程倉庫：

```powershell
git remote add origin https://github.com/您的用戶名/quantum-divination.git
```

7. 推送到 GitHub：

```powershell
# 如果這是一個新的 Git 倉庫
git push -u origin main

# 如果提示分支名稱錯誤，可能需要改用 master
git push -u origin master

# 如果出現錯誤，可能需要先拉取
git pull origin main --allow-unrelated-histories
git push -u origin main
```

## 確認關鍵文件

在推送到 GitHub 之前，請確保以下關鍵文件已包含在您的專案中：

- [x] `/src/server/models/` 目錄及模型文件
- [x] `/src/server/config/db.js`
- [x] `/src/server/server.js`
- [x] `/src/utils/api.js`
- [x] `/render.yaml`
- [x] `/package.json`
- [x] `/src/server/package.json`

## 驗證同步結果

1. 在瀏覽器中訪問您的 GitHub 倉庫頁面
2. 確認所有文件都已成功上傳
3. 檢查 `/src/server` 和 `/src/client` 目錄是否包含所有必要文件

## 更新已有倉庫

如果您需要更新專案：

1. 進行本地修改
2. 添加更改到暫存區：

```powershell
git add .
```

3. 提交更改：

```powershell
git commit -m "更新：描述您的更改"
```

4. 推送到 GitHub：

```powershell
git push origin main
```

## 常見問題解決

### 推送失敗

如果遇到 "failed to push some refs" 錯誤：

```powershell
# 先拉取遠程更改
git pull origin main --allow-unrelated-histories

# 解決任何合併衝突後
git push origin main
```

### 文件太大

如果有文件超過 GitHub 大小限制 (100MB)：

1. 添加大文件到 .gitignore
2. 如果已提交：

```powershell
git rm --cached 大文件路徑
git commit -m "移除大文件"
```

### 身份驗證問題

如果遇到身份驗證錯誤：

1. 使用 GitHub 個人訪問令牌登錄
2. 或設置 SSH 金鑰（高級選項）

## 後續步驟

成功同步到 GitHub 後，您就可以：

1. 按照 `github-render-tutorial.md` 中的步驟設置 Render Blueprint
2. 部署您的應用到 Render.com

恭喜！您已成功將本地專案同步到 GitHub，為雲端部署做好了準備。 