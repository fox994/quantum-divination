# 量子筊問 - 後端伺服器

這是量子筊問互動敘事遊戲的後端伺服器。

## 配置環境變數

在啟動伺服器前，請確保正確配置環境變數：

1. 確認 `.env` 文件存在於 `src/server` 目錄中
2. 修改 MongoDB 連接字符串，將 `<db_password>` 替換為您的實際 MongoDB 密碼

```
PORT=3000
MONGO_URI=mongodb+srv://fox994:您的實際密碼@cluster0.ayigfoq.mongodb.net/quantum-divination?retryWrites=true&w=majority&appName=Cluster0
```

## 安裝依賴

```bash
npm install
```

## 啟動伺服器

```bash
node server.js
```

## API 端點

伺服器提供以下 API 端點：

- `POST /api/start` - 創建新玩家
- `POST /api/answer` - 記錄玩家的回答
- `GET /api/progress/:playerId` - 獲取玩家進度
- `GET /api/summary/:playerId` - 獲取玩家遊戲總結

## MongoDB 模型

- `Player` - 存儲玩家信息和心理資料
- `Answer` - 記錄玩家的選擇
- `Log` - 系統日誌記錄

## 部署到 Render.com

請參考項目根目錄的 `deploy-guide.md` 文件。 