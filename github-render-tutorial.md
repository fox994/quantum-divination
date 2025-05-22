# GitHub 倉庫設定與 Render Blueprint 部署詳細教學

本教學將指導您如何設置 GitHub 倉庫並使用 Render Blueprint 部署「量子筊問」應用。

## 第一部分：GitHub 倉庫設定

### 1. 創建 GitHub 倉庫

1. 登入您的 GitHub 帳戶
2. 點擊右上角 "+" 圖示，選擇 "New repository"
3. 填寫倉庫信息：
   - Repository name: `quantum-divination` (或您喜歡的名稱)
   - Description: `量子筊問 - 量子力學與中國傳統文化結合的互動敘事遊戲`
   - 選擇 "Public" (公開) 或 "Private" (私有)
   - 勾選 "Add a README file"
   - 點擊 "Create repository"

### 2. 配置 Git 並上傳代碼

確保您的電腦已安裝 Git，然後執行以下命令：

```bash
# 複製倉庫到本地
git clone https://github.com/您的用戶名/quantum-divination.git

# 將您的專案文件複製到倉庫目錄中
# (假設您的專案文件在 "031 量子筊問" 目錄中)

# 進入倉庫目錄
cd quantum-divination

# 添加所有文件
git add .

# 提交更改
git commit -m "初始提交：量子筊問專案文件"

# 推送到 GitHub
git push origin main
```

如果您已經有專案目錄且初始化了 Git，可以使用：

```bash
# 在專案目錄中
git remote add origin https://github.com/您的用戶名/quantum-divination.git
git branch -M main
git push -u origin main
```

### 3. 確認文件結構

確保您的 GitHub 倉庫中包含以下關鍵文件：

- `/src/server/models/` - MongoDB 模型文件
- `/src/server/config/db.js` - 數據庫連接配置
- `/src/server/server.js` - 後端伺服器代碼
- `/src/utils/api.js` - 前端 API 通信工具
- `/package.json` - 前端依賴配置
- `/src/server/package.json` - 後端依賴配置
- `/render.yaml` - Render Blueprint 配置

### 4. 設置 .gitignore

創建 `.gitignore` 文件，避免提交敏感信息：

```
# 敏感環境文件
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# 依賴目錄
node_modules/
dist/

# 日誌文件
logs
*.log
npm-debug.log*

# 操作系統文件
.DS_Store
Thumbs.db
```

提交 .gitignore 文件：

```bash
git add .gitignore
git commit -m "添加 .gitignore 文件"
git push origin main
```

## 第二部分：Render Blueprint 部署

### 1. 註冊並設置 Render.com 帳戶

1. 前往 [Render.com](https://render.com/) 並註冊帳戶
2. 註冊時選擇 "Sign up with GitHub" 可以簡化後續流程
3. 完成電子郵件驗證

### 2. 連接 GitHub 帳戶

如果您未使用 GitHub 註冊：

1. 登入 Render Dashboard
2. 點擊右上角頭像，選擇 "Account Settings"
3. 在左側選單中選擇 "GitHub"
4. 點擊 "Connect GitHub Account"
5. 授權 Render 訪問您的 GitHub 帳戶

### 3. 設置 Blueprint 部署

1. 在 Render Dashboard 點擊 "New" 按鈕
2. 從下拉選單中選擇 "Blueprint"

   ![選擇 Blueprint](https://render.com/static/blueprint-select.png)

3. 如果您是首次使用 Blueprint，會看到說明頁面，點擊 "Connect a repo"

4. 選擇您要部署的 GitHub 倉庫
   - 如果看不到您的倉庫，點擊 "Configure Account" 以獲取更多訪問權限
   - 授權 Render 訪問您想要部署的倉庫

5. 選擇包含 `quantum-divination` 倉庫，點擊 "Connect"

   ![連接倉庫](https://render.com/static/connect-repo.png)

6. Render 將自動檢測您倉庫中的 `render.yaml` 文件並顯示將創建的服務
   - 您應該看到兩個服務：`quantum-divination-api` 和 `quantum-divination`
   - 確認配置無誤

   ![Blueprint 預覽](https://render.com/static/blueprint-preview.png)

### 4. 設置環境變數

1. 在 Blueprint 部署頁面上，找到 `quantum-divination-api` 服務
2. 點擊展開該服務的設置
3. 找到 `MONGO_URI` 環境變數
4. 輸入您的 MongoDB 連接字符串：
   ```
   mongodb+srv://fox994:您的實際密碼@cluster0.ayigfoq.mongodb.net/quantum-divination?retryWrites=true&w=majority&appName=Cluster0
   ```
   確保替換 `您的實際密碼` 為您在 MongoDB Atlas 設置的真實密碼

   ![設置環境變數](https://render.com/static/env-vars.png)

5. 檢查其他環境變數是否已正確設置

### 5. 開始部署

1. 確認所有設置無誤後，點擊頁面底部的 "Apply" 按鈕
2. Render 將開始根據 `render.yaml` 文件創建和部署服務
3. 部署過程將顯示在屏幕上，包括建置日誌和狀態更新

   ![部署進行中](https://render.com/static/deploy-progress.png)

4. 部署可能需要 5-10 分鐘完成，請耐心等待

### 6. 查看部署狀態

1. 部署完成後，您將看到兩個服務的卡片：`quantum-divination-api` 和 `quantum-divination`
2. 每個服務卡片上會顯示部署狀態（成功或失敗）和公開 URL
3. 點擊服務名稱可以查看詳細信息，包括日誌和環境變數

   ![部署完成](https://render.com/static/deploy-complete.png)

### 7. 驗證部署

1. 點擊 `quantum-divination` 服務卡片上的 URL 打開前端應用
2. 測試應用功能：
   - 創建新用戶
   - 開始新遊戲
   - 進行一些選擇
3. 如果一切正常，應用應該可以正常運行並保存進度

### 8. 故障排除

如果部署失敗或應用不能正常工作：

1. 點擊服務名稱進入詳細頁面
2. 選擇 "Logs" 標籤查看錯誤信息
3. 常見問題：
   - **MongoDB 連接錯誤**：檢查 `MONGO_URI` 環境變數是否正確，密碼是否包含特殊字符（需要 URL 編碼）
   - **構建失敗**：檢查 `package.json` 文件和依賴項
   - **跨域錯誤**：確保 CORS 設置正確
   - **前端無法連接後端**：檢查 `VITE_API_URL` 環境變數

## 第三部分：後續維護與更新

### 1. 更新應用

1. 在本地修改代碼
2. 提交並推送到 GitHub：
   ```bash
   git add .
   git commit -m "更新：您的更新描述"
   git push origin main
   ```
3. Render 將自動檢測變更並重新部署（自動部署默認開啟）

### 2. 查看與管理部署

1. 隨時在 Render Dashboard 查看您的服務
2. 點擊服務名稱進入詳細頁面，可以：
   - 手動觸發重新部署
   - 修改環境變數
   - 暫停或刪除服務
   - 查看計費信息（如果使用付費計劃）

### 3. 自定義域名（可選）

如果您想使用自己的域名而不是 render.com 子域名：

1. 在服務詳細頁面選擇 "Settings"
2. 滾動至 "Custom Domains" 部分
3. 點擊 "Add Custom Domain"
4. 輸入您的域名並按照指示設置 DNS 記錄

## 結語

恭喜！您現在已經成功設置了 GitHub 倉庫並使用 Render Blueprint 部署了「量子筊問」應用。您的應用現在可以在互聯網上訪問，並可以持續更新和維護。

如有任何問題，請參考：
- [Render 文檔](https://render.com/docs)
- [GitHub 幫助](https://docs.github.com/cn)
- 專案的 `deploy-guide.md` 和 `src/server/README.md` 文件 