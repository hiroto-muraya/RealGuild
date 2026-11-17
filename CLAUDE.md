# CLAUDE.md

RealGuild は、現実の行動（勉強・運動・仕事・趣味）を RPG のクエストとして管理する Web アプリです。コンセプトは「現実の努力を、冒険の成果に。」で、世界観はファンタジー RPG です。
技術構成の確定事項・未決定事項・決定ログは [docs/tech-stack.md](docs/tech-stack.md) にまとめています。技術判断の前に必ず読んでください。
要件は [docs/requirements.md](docs/requirements.md)、設計（画面・DB・API・ゲームのルール）は [docs/design.md](docs/design.md) にあります。機能を実装する前に必ず読んでください。

## 開発プロセス

要件定義 → 基本設計（画面・DB・API）→ 実装計画 → 実装 の順に進める。要件定義と設計は Claude Code がたたき台を作り、ユーザーが確認・承認する。
- ドキュメントの状態（たたき台 / 承認済み）は各ファイルの冒頭に書く。**承認済みでない仕様をもとに大規模な実装をしない。**
- 仕様を決めるときは推奨案とその理由を示し、ユーザーに判断を仰ぐ点は重要なものから少しずつ聞く。

## 進め方のルール（重要）

- **確定していない技術・ライブラリを勝手に採用しない。** docs/tech-stack.md にないものを追加するときは、候補とメリット・デメリットを示して、ユーザーの合意を得てから採用する。
- **合意を得る前に大規模な実装を始めない。** 方針を提示してから実装する。
- 相談するときは、重要な項目から順番に、一度に少しずつ聞く。
- 専門用語は初心者にも分かるように説明する。
- 有料サービスを前提にしない。無料プランの制限があれば説明する。
- 技術構成が決まったら docs/tech-stack.md（決定ログを含む）を更新する。
- 回答・ドキュメント・コードコメントは日本語で書く。

## リポジトリ構成

```
backend/                     C# / ASP.NET Core Web API (.NET 10)
  RealGuild.slnx
  dotnet-tools.json          dotnet-ef（ローカルツール）
  Dockerfile                 Render デプロイ用
  src/RealGuild.Api/         API 本体
    Controllers/             API の入り口
    Services/                処理の流れ（DB 操作を含む）
    Domain/Entities/         エンティティ
    Domain/GameRules/        経験値・レベル・能力値の計算（純粋なロジック。単体テスト必須）
    Contracts/               リクエスト / レスポンスの型（record）
    Infrastructure/          Identity の拡張など
    Data/                    AppDbContext、Configurations/、Migrations/
  tests/RealGuild.Api.Tests/ xUnit
frontend/                    React + TypeScript + Vite
  src/app/                   ルーター、ログインが必要な画面を守る仕組み
  src/pages/                 画面（docs/design.md 2.1）
  src/features/<機能>/api.ts  API 呼び出しと TanStack Query のフック
  src/components/ui/         shadcn/ui のコンポーネント
  src/components/game/       ゲーム用の UI（経験値バーなど）
  src/components/layout/     レイアウト・ナビ
  src/lib/api.ts             API 呼び出しの共通処理（ApiError）
  vercel.json                Vercel の設定（/api を Render に中継 + SPA のリライト）
docker-compose.yml           ローカル開発用 PostgreSQL
docs/                        設計・技術ドキュメント
```

## よく使うコマンド

```bash
# ローカル DB を起動（Docker の実行環境を先に起動しておく）
docker compose up -d

# バックエンド（http://localhost:5094）
cd backend
dotnet tool restore
dotnet run --project src/RealGuild.Api
dotnet build
dotnet test

# マイグレーション
dotnet ef migrations add <Name> --project src/RealGuild.Api --output-dir Data/Migrations
dotnet ef database update --project src/RealGuild.Api

# フロントエンド（http://localhost:5173）
cd frontend
pnpm install
pnpm dev
pnpm build       # 型チェック + ビルド
pnpm lint        # oxlint
pnpm dlx shadcn@latest add <component>   # UI コンポーネントを追加
```

疎通確認: `GET http://localhost:5094/api/health` → `{ "status": "ok", "databaseConnected": true }`

## 実装の規約

### バックエンド
- API は Controller 方式で、ルートは `api/[controller]`。レスポンスの型は `record` で定義する。
- **ゲームのルール（経験値・レベル・報酬の計算）は必ずバックエンドに置く。** フロントから送られてきた計算結果は信用しない。
- DB へのアクセスは EF Core（`AppDbContext`）で行い、スキーマの変更はマイグレーションで管理する。
- 設定値は `appsettings*.json` に置く。本番の値（接続文字列）は環境変数 `ConnectionStrings__Default` で渡す。秘密情報はコミットしない。
- 認証は ASP.NET Core Identity の Cookie 方式。フロントとは同一オリジン（Vercel rewrites / Vite proxy）なので CORS は設定しない。
- **既定で全 API にログインが必要**（FallbackPolicy）。ログイン不要な API にだけ `[AllowAnonymous]` を付ける。ユーザー ID は `User.GetUserId()` で取得し、他のユーザーのデータは 404 として扱う。
- 時刻は `DateTime.Now` ではなく `TimeProvider` から取得する（テストしやすくするため）。
- HTTPS 化は Render 側で行われるので、`UseHttpsRedirection` は使わない。
- NuGet パッケージは net10.0 対応の 10.x 系を使う（最新版は .NET 11 専用の場合がある）。

### フロントエンド
- パッケージ管理は **pnpm** を使う（npm / yarn は使わない。`package-lock.json` を作らない）。
- import には `@/` エイリアス（= `src/`）を使う。
- API 呼び出しは `src/lib/api.ts` を経由し、常に相対パス `/api/...` で呼ぶ（ローカルでは Vite proxy、本番では vercel.json の rewrites が中継する）。
- デザインはレトロ携帯ゲーム機風のドット絵 RPG（docs/design.md 2.4）。色は直接書かず、`src/index.css` の CSS 変数（`--primary`、`--xp-fill` など）を使う。配色は 3 種類（night / field / gb）をユーザーが切り替えられるので、**新しい変数は 3 つすべてに定義し、3 配色すべてで見た目を確認する**。ウィンドウは `.pixel-window`、メニューの選択カーソルは `.pixel-cursor` を使う。角丸・擬似太字・グラデーションなど、ドット絵の雰囲気を壊す表現は避ける。
- 特定の既存ゲームの画面・キャラクター・素材は再現しない（オリジナルで作る）。
- アニメーションには `motion/react` を使う。使いすぎて動作が重くならないように注意する。
- サーバーのデータは TanStack Query で扱う（`useState` に API の結果をコピーしない）。ログイン・ログアウト時はキャッシュを消す。
- **shadcn の `add` を実行した後は、`import { cn } from "cn"` という壊れた import が生成されていないか確認し、`@/lib/utils` に直す**（現在の環境で発生する既知の問題）。

## デプロイ（未実施）

- フロント: Vercel（Root Directory を `frontend` にする。`vercel.json` の rewrites の中継先を Render の URL に合わせる）
- バック: Render（Docker、Root Directory を `backend` にする / 環境変数 `ConnectionStrings__Default` を設定）
- DB: Neon（PostgreSQL）
