# GitHub 與 Render Blueprint 部署圖文教學

本文檔提供實際操作截圖和步驟，幫助您更直觀地完成 GitHub 設定和 Render 部署。

## GitHub 倉庫設定

### 創建新倉庫

1. 登入 GitHub 並點擊右上角 "+" 按鈕，選擇 "New repository"

   ![GitHub 創建倉庫](https://github.githubassets.com/assets/images/help/repository/repo-create.png)

2. 填寫倉庫信息：
   - 輸入倉庫名稱 "quantum-divination"
   - 添加描述
   - 選擇公開或私有
   - 勾選 "Add a README file"
   - 點擊 "Create repository"

   ![填寫倉庫信息](https://github.githubassets.com/assets/images/help/repository/create-repository-name.png)

### 從本地上傳代碼

在 Windows 命令提示符或 PowerShell 中：

```powershell
# 克隆倉庫
git clone https://github.com/您的用戶名/quantum-divination.git

# 切換到專案目錄
cd quantum-divination

# 複製您的專案文件到此目錄
# 例如：使用 PowerShell 複製文件
Copy-Item -Path "C:\Users\fox994\Desktop\AI專案\031 量子筊問\*" -Destination "." -Recurse

# 添加、提交和推送
git add .
git commit -m "初始提交：量子筊問專案"
git push origin main
```

**關鍵文件檢查清單**:

- [ ] `/src/server/models/` 目錄及其中的模型文件
- [ ] `/src/server/config/db.js` 
- [ ] `/src/server/server.js`
- [ ] `/src/utils/api.js`
- [ ] `/package.json`
- [ ] `/src/server/package.json`
- [ ] `/render.yaml`

### 設置 .gitignore

在倉庫根目錄創建 `.gitignore` 文件，內容為：

```
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
```

## MongoDB Atlas 設置

### 創建免費叢集

1. 登入 [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. 點擊 "Build a Database"
3. 選擇 "FREE" 計劃
4. 選擇雲服務提供商和地區 (例如 AWS Asia Pacific)
5. 點擊 "Create Cluster"

   ![MongoDB 創建叢集](https://www.mongodb.com/docs/atlas/images/create-cluster.png)

### 創建數據庫用戶

1. 在左側選單中選擇 "Database Access"
2. 點擊 "Add New Database User"
3. 選擇認證方法 "Password"
4. 設置用戶名和密碼 (例如 username: fox994)
5. 選擇 "Read and write to any database"
6. 點擊 "Add User"

   ![創建數據庫用戶](https://www.mongodb.com/docs/atlas/images/add-database-user.png)

### 設置網絡訪問

1. 在左側選單中選擇 "Network Access"
2. 點擊 "Add IP Address"
3. 選擇 "Allow Access from Anywhere" (0.0.0.0/0)
4. 點擊 "Confirm"

   ![設置網絡訪問](https://www.mongodb.com/docs/atlas/images/allow-ip-access.png)

### 獲取連接字符串

1. 在左側選單中選擇 "Database"
2. 點擊 "Connect" 按鈕
3. 選擇 "Connect your application"
4. 複製連接字符串
5. 替換 `<password>` 為您的密碼
6. 在連接字符串後添加 `quantum-divination?retryWrites=true&w=majority`

   ![獲取連接字符串](https://www.mongodb.com/docs/atlas/images/connection-string.png)

## Render Blueprint 部署

### 註冊 Render.com

1. 前往 [Render.com](https://render.com/)
2. 點擊 "Sign Up"
3. 推薦使用 "Sign up with GitHub" 選項以簡化流程

   ![Render 註冊](https://render.com/static/docs/sign-up.png)

### 使用 Blueprint 部署

1. 登入 Render Dashboard
2. 點擊右上角 "New +" 按鈕
3. 選擇 "Blueprint"

   ![選擇 Blueprint](https://render.com/static/docs/blueprint-menu.png)

4. 選擇 GitHub 倉庫
   - 如果沒有看到您的倉庫，點擊 "Configure GitHub App" 設置權限

   ![選擇倉庫](https://render.com/static/docs/select-repo.png)

5. Render 將檢測到 `render.yaml` 並顯示服務預覽
   - 您應該看到兩個服務：API 和前端
   
   ![Blueprint 預覽](https://render.com/static/docs/blueprint-preview.png)

### 設置環境變數

1. 在服務預覽中，找到 "quantum-divination-api" 服務
2. 點擊展開環境變數部分
3. 為 `MONGO_URI` 填寫您的 MongoDB 連接字符串：
   ```
   mongodb+srv://fox994:實際密碼@cluster0.ayigfoq.mongodb.net/quantum-divination?retryWrites=true&w=majority&appName=Cluster0
   ```

   ![設置環境變數](https://render.com/static/docs/env-vars-setup.png)

### 部署服務

1. 檢查所有設置後，點擊 "Apply" 按鈕
2. Render 將開始創建和部署服務
3. 部署過程可能需要 5-10 分鐘

   ![部署進行中](https://render.com/static/docs/deploy-progress.png)

4. 部署完成後，您將看到服務狀態和 URL

   ![部署完成](https://render.com/static/docs/deploy-complete.png)

### 訪問您的應用

1. 點擊 `quantum-divination` 服務的 URL
2. 您的應用應該可以正常加載和運行
3. 創建用戶並測試功能

   ![應用運行](https://example.com/app-running.png)

## 排錯與常見問題

### 部署失敗

1. 點擊失敗的服務進入詳細頁面
2. 選擇 "Logs" 標籤查看錯誤信息

   ![查看日誌](https://render.com/static/docs/view-logs.png)

### MongoDB 連接問題

如果出現 MongoDB 連接錯誤：

1. 確認 `MONGO_URI` 環境變數是否正確
2. 檢查密碼中是否包含特殊字符（需要 URL 編碼）
3. 確保 MongoDB Atlas 的網絡訪問設置允許來自任何地方的連接

### 前端無法連接後端

如果前端加載但無法與後端通信：

1. 檢查 `VITE_API_URL` 環境變數是否正確
2. 確保後端 API 正常運行
3. 查看瀏覽器控制台中的錯誤信息

## 結語

這個圖文教學應該能幫助您更順利地完成 GitHub 設定和 Render 部署流程。如果遇到任何問題，請參考 Render 和 MongoDB 的官方文檔，或在 GitHub 上提出問題。 