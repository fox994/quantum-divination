# 量子筊問 - Render.com 部署指南

本指南將幫助您將量子筊問應用部署到 Render.com 平台。

## 準備工作

1. 創建 [Render.com](https://render.com/) 帳戶
2. 創建 [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) 帳戶
3. 將專案上傳至 GitHub 倉庫

## 設置 MongoDB Atlas

1. 登入 MongoDB Atlas
2. 創建新的免費叢集
3. 設置數據庫用戶：
   - 前往 Security > Database Access
   - 點擊 "Add New Database User"
   - 創建用戶並設置密碼 (請記住此密碼!)
4. 設置網絡訪問：
   - 前往 Security > Network Access
   - 點擊 "Add IP Address"
   - 選擇 "Allow Access from Anywhere" (0.0.0.0/0)
5. 獲取連接字符串：
   - 前往 Databases > Connect
   - 選擇 "Connect your application"
   - 複製連接字符串 (例如: `mongodb+srv://username:<password>@cluster0.xxx.mongodb.net/`)
   - 替換 `<password>` 為您的密碼
   - 在連接字符串後加上 `quantum-divination?retryWrites=true&w=majority`

## 使用 Render Blueprint 部署 (推薦)

1. 前往 Render.com Dashboard
2. 點擊 "New" > "Blueprint"
3. 連接您的 GitHub 倉庫
4. 點擊倉庫名稱，然後選擇 "Connect"
5. 設置環境變數：
   - 找到 quantum-divination-api 服務
   - 設置 `MONGO_URI` 為您的 MongoDB 連接字符串
6. 點擊 "Apply" 按鈕開始部署

## 手動部署 (替代方案)

### 部署後端 API

1. 在 Render.com 儀表板點擊 "New" > "Web Service"
2. 連接您的 GitHub 倉庫
3. 配置服務：
   - 名稱：`quantum-divination-api`
   - 根目錄：`/` (專案根目錄)
   - 環境：`Node`
   - 區域：選擇最靠近您用戶的區域 (例如 Singapore)
   - 構建命令：`cd src/server && npm install`
   - 啟動命令：`cd src/server && node server.js`
4. 添加環境變數：
   - `PORT`: `10000`
   - `MONGO_URI`: 您的 MongoDB 連接字符串
   - `NODE_ENV`: `production`
5. 點擊 "Create Web Service"

### 部署前端應用

1. 在 Render.com 儀表板點擊 "New" > "Static Site"
2. 連接同一個 GitHub 倉庫
3. 配置服務：
   - 名稱：`quantum-divination`
   - 根目錄：`/` (專案根目錄)
   - 構建命令：`npm install && npm run build`
   - 發布目錄：`dist`
4. 添加環境變數：
   - `VITE_API_URL`: 您後端 API 的 URL + `/api` (例如: `https://quantum-divination-api.onrender.com/api`)
5. 點擊 "Create Static Site"

## 驗證部署

部署完成後：

1. 訪問前端 URL (例如: `https://quantum-divination.onrender.com`)
2. 創建新用戶並開始遊戲
3. 檢查 MongoDB Atlas 中是否有新的用戶數據

## 常見問題排除

1. **前端無法連接後端**: 確保 `VITE_API_URL` 環境變數已正確設置
2. **後端無法連接數據庫**: 檢查 `MONGO_URI` 連接字符串是否正確，確保 IP 訪問限制已正確設置
3. **跨域錯誤**: 確保後端的 CORS 設置允許前端域名

如有任何問題，請查看應用日誌以獲取更多信息。 