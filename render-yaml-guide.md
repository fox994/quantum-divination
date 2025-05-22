# Render.yaml 配置文件詳解

`render.yaml` 是 Render Blueprint 的核心配置文件，它定義了您的應用架構和服務。本指南將詳細解釋如何配置 `render.yaml` 以適應量子筊問專案。

## 基本結構

以下是專案中的 `render.yaml` 文件結構：

```yaml
services:
  # 後端 API 服務
  - type: web
    name: quantum-divination-api
    env: node
    region: singapore
    buildCommand: cd src/server && npm install
    startCommand: cd src/server && node server.js
    healthCheckPath: /
    envVars:
      - key: PORT
        value: 10000
      - key: MONGO_URI
        sync: false
      - key: NODE_ENV
        value: production

  # 前端應用
  - type: web
    name: quantum-divination
    env: static
    region: singapore
    buildCommand: npm install && npm run build
    staticPublishPath: ./dist
    headers:
      - path: /*
        name: Cache-Control
        value: no-cache
    routes:
      - type: rewrite
        source: /*
        destination: /index.html
    envVars:
      - key: VITE_API_URL
        fromService:
          name: quantum-divination-api
          type: web
          property: url
        postfix: /api
```

## 服務配置詳解

### 後端 API 服務

```yaml
- type: web                          # 服務類型：web 表示 HTTP 服務
  name: quantum-divination-api       # 服務名稱，用於在 Render 控制台中識別
  env: node                          # 運行環境：Node.js
  region: singapore                  # 部署區域：新加坡 (亞洲最佳選擇)
  buildCommand: cd src/server && npm install  # 構建命令
  startCommand: cd src/server && node server.js  # 啟動命令
  healthCheckPath: /                 # 健康檢查路徑，用於確認服務是否正常運行
  envVars:                           # 環境變數設置
    - key: PORT                      # 端口配置
      value: 10000                   # 設為 10000，Render 會自動映射
    - key: MONGO_URI                 # MongoDB 連接字符串
      sync: false                    # sync: false 表示這是一個需要手動設置的值
    - key: NODE_ENV                  # Node 環境
      value: production              # 設為生產環境
```

#### 重要配置說明：

- **buildCommand**: 這裡我們進入 `src/server` 目錄並安裝依賴。確保您的 `src/server` 目錄中有正確的 `package.json` 文件。
- **startCommand**: 啟動 Node.js 伺服器的命令。
- **MONGO_URI**: 設置為 `sync: false` 表示您需要在 Render 控制台中手動設置此值，這是出於安全考慮，避免將數據庫憑證存儲在代碼中。

### 前端應用

```yaml
- type: web                          # 服務類型：web
  name: quantum-divination           # 服務名稱：前端應用
  env: static                        # 環境：靜態網站
  region: singapore                  # 部署區域：新加坡
  buildCommand: npm install && npm run build  # 構建命令
  staticPublishPath: ./dist          # 靜態文件發布路徑：Vite 預設 dist 目錄
  headers:                           # HTTP 頭設置
    - path: /*                       # 應用於所有路徑
      name: Cache-Control            # 設置 Cache-Control 頭
      value: no-cache                # 禁用緩存，確保用戶始終獲取最新版本
  routes:                            # 路由配置
    - type: rewrite                  # 重寫類型
      source: /*                     # 所有路徑
      destination: /index.html       # 重定向到 index.html (SPA 必需)
  envVars:                           # 環境變數
    - key: VITE_API_URL              # 前端 API URL 環境變數
      fromService:                   # 從另一個服務獲取 URL
        name: quantum-divination-api # 引用的服務名
        type: web                    # 服務類型
        property: url                # 獲取 URL 屬性
      postfix: /api                  # 在 URL 後附加 /api
```

#### 重要配置說明：

- **env: static**: 表示這是一個靜態網站，適用於 React/Vue/Angular 等前端框架。
- **staticPublishPath**: 指定構建後的靜態文件目錄，對於 Vite 專案，這通常是 `./dist`。
- **routes**: SPA (單頁應用) 需要這個配置，確保所有路由都導向 `index.html`。
- **VITE_API_URL**: 使用 `fromService` 動態引用後端 API 的 URL，加上 `/api` 前綴。這樣即使服務 URL 變化，前端仍能正確連接後端。

## 自定義 render.yaml

### 添加數據庫服務 (可選)

如果您想在 Render 上託管 MongoDB 而不是使用 Atlas，可以添加：

```yaml
- type: pserv
  name: quantum-divination-db
  env: docker
  region: singapore
  image:
    url: mongo:latest
  disk:
    name: data
    mountPath: /data/db
    sizeGB: 1
```

### 添加環境變數 (根據需要)

可以添加更多環境變數：

```yaml
envVars:
  - key: JWT_SECRET
    generateValue: true  # 自動生成安全值
  - key: ADMIN_EMAIL
    value: admin@example.com
```

### 添加自動擴展配置 (高級用戶)

```yaml
autoscaling:
  min: 1
  max: 3  # 最多 3 個實例
  targetCPUUtilizationPercent: 75  # CPU 利用率超過 75% 時擴展
```

## 驗證 render.yaml

在提交到 GitHub 之前，可以使用以下命令驗證 YAML 語法：

```bash
npm install -g yaml-lint
yamllint render.yaml
```

## 注意事項

1. **敏感信息**: 永遠不要將敏感信息 (如密碼、API 密鑰) 直接寫入 `render.yaml`。使用 `sync: false` 或 `generateValue: true`。

2. **目錄結構**: 確保 `buildCommand` 和 `startCommand` 中的路徑與您的實際目錄結構相符。

3. **環境變數**: 使用 `VITE_` 前綴的環境變數才能在 Vite 前端中訪問 (`import.meta.env.VITE_XXX`)。

4. **區域選擇**: 選擇離您用戶最近的區域可以提高訪問速度，亞洲用戶建議選擇 `singapore`。

5. **資源限制**: 注意 Render 免費方案有資源限制，如果需要更高性能，請考慮升級到付費方案。

## 常見錯誤

1. **構建失敗**: 檢查 `buildCommand` 和專案依賴。
2. **服務啟動失敗**: 檢查 `startCommand` 和環境變數配置。
3. **前後端連接問題**: 確認 `VITE_API_URL` 配置正確。
4. **數據庫連接失敗**: 檢查 `MONGO_URI` 環境變數設置。

透過正確配置 `render.yaml`，您可以實現一鍵部署整個應用架構，大大簡化部署流程。 