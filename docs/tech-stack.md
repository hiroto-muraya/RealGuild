# RealGuild 技術構成・確定事項

最終更新: 2026-11-16

## プロジェクト概要

- **アプリ名**: RealGuild
- **コンセプト**: 「現実の努力を、冒険の成果に。」
- **内容**: 勉強・運動・仕事・趣味などの現実の行動を RPG のクエストとして管理する。クエストを達成すると経験値を獲得し、キャラクターが成長する。
- **世界観**: ファンタジー RPG
- **体制・規模**: 個人開発 / 開発期間 1〜2 か月 / 中規模。将来の機能追加を考慮するが、最初から過剰に複雑な設計にはしない。

## 方針

- 無料で使えるサービス・プランを優先する（有料サービスを前提にしない）
- C# のバックエンド開発をしっかり経験する
- Claude Code で効率よく実装できる構成にする
- 保守性・拡張性を確保する
- ゲームのルール（経験値・レベル計算など）は**バックエンドに置く**（改ざん防止のため）

## 確定した技術構成

| 領域 | 採用技術 | バージョン（構築時点） | 備考 |
|---|---|---|---|
| バックエンド言語 | C# | — | 当初からの確定事項 |
| バックエンド FW | ASP.NET Core Web API（Controller 方式） | .NET 10 (LTS) | LTS のサポートは 2028 年 11 月まで |
| ORM | Entity Framework Core + Npgsql | EF Core 10.0.x / Npgsql 10.0.x | マイグレーションは dotnet-ef（ローカルツール） |
| API 設計 | REST + OpenAPI | Microsoft.AspNetCore.OpenApi | 開発環境では `/openapi/v1.json` で仕様書を公開 |
| 認証 | ASP.NET Core Identity（**Cookie 方式**） | — | Vercel rewrites で `/api` を Render へ中継し、同一オリジン化して Cookie を使う |
| データベース | PostgreSQL | ローカル: postgres:17（Docker） | |
| フロントエンド | React + TypeScript + Vite | React 19 / TS 7 / Vite 8 | SPA 構成 |
| CSS | Tailwind CSS | v4 | |
| UI コンポーネント | shadcn/ui | — | コードをプロジェクト内にコピーする方式。ファンタジー風に改造する |
| アニメーション | Motion（旧 Framer Motion） | — | レベルアップ演出など |
| フォント | DotGothic16（@fontsource/dotgothic16） | — | 日本語ドット絵フォント（OFL ライセンス・無料） |
| ルーティング | React Router | v8 | |
| サーバーデータ管理 | TanStack Query | v5 | API の取得結果のキャッシュ・再取得 |
| パッケージ管理（フロント） | pnpm | 11.x | `package.json` の `packageManager` で固定 |
| Lint（フロント） | oxlint | — | Vite テンプレートの標準 |
| テスト（バック） | xUnit | — | |
| フロントのホスティング | **Vercel**（Hobby プラン） | — | |
| バックエンドのホスティング | Render（Free / Docker） | — | |
| 本番 DB | Neon（Free） | — | |
| コード管理・CI | GitHub / GitHub Actions | — | |
| ローカル開発 | Docker（PostgreSQL） | — | |

## 全体アーキテクチャ

```
[ブラウザ]
    │
    ▼
フロントエンド: React + TS + Vite / Tailwind / shadcn/ui / Motion   ← Vercel (Hobby)
    │  REST API (JSON)
    ▼
バックエンド: ASP.NET Core Web API (.NET 10)                        ← Render (Free, Docker)
  ・ASP.NET Core Identity（認証）
  ・ゲームのルール（経験値・レベル）
  ・EF Core
    │
    ▼
PostgreSQL                                                         ← Neon (Free)
```

### API 通信と認証の流れ（同一オリジン構成）

- フロントは API を常に相対パス `/api/...` で呼ぶ
- 本番: `frontend/vercel.json` の rewrites が `/api/*` を Render へ中継する
- ローカル: Vite の dev server proxy が `/api` を `http://localhost:5094` へ中継する
- ブラウザから見ると同じドメインなので、ログイン用の Cookie がそのまま使える。CORS の設定は不要
- **TODO**: Render のサービス URL が決まったら `vercel.json` の `destination` を実際の URL に書き換える
- **注意**: Render がスリープ中だと最初のリクエストが遅くなる。Vercel の中継にはタイムアウトがあるため、初回アクセスでエラーになる可能性がある。デプロイ時に確認する

## 無料プランの制限・注意点

※ 各サービスの制限は変わることがあるので、利用開始時に公式サイトで確認すること。

| サービス | 主な制限・注意点 |
|---|---|
| Vercel Hobby | **非商用利用に限られる**。収益化する場合は Pro プラン（有料）への移行か、別サービスへの移行が必要 |
| Render Free | **15 分アクセスがないとスリープ**し、次の起動に 30 秒〜1 分かかる。月 750 時間まで |
| Neon Free | ストレージ 0.5GB。アイドル時に自動停止し、次のアクセスで数秒かけて起動する |
| GitHub Actions | プライベートリポジトリでは月 2,000 分まで |

## 未決定事項（今後相談して決める）

優先度の高い順に並べています。

1. **OpenAPI から TypeScript の型を生成するツール**（openapi-typescript / orval など）
2. **バックエンドの DB を使う統合テストの方法**（Testcontainers など）
3. **後から追加するサービス**: エラー監視（Sentry など）、メール送信（Resend など）

## 決定ログ

| 日付 | 決定内容 |
|---|---|
| 2026-11-16 | 上記の構成で確定。フロントのホスティングは当初案の Cloudflare Pages から **Vercel** に変更 |
| 2026-11-16 | フロントエンドは React + TypeScript を採用（Blazor は不採用） |
| 2026-11-16 | API は Controller 方式で開始（推奨案を適用。必要になれば見直す） |
| 2026-11-16 | フロントのパッケージ管理は npm から **pnpm** に変更 |
| 2026-11-16 | フロントのホスティングは Vercel で再確認・確定 |
| 2026-11-16 | 認証は **Cookie 方式＋Vercel rewrites による同一オリジン化** に決定。CORS の設定は削除 |
| 2026-11-16 | 要件定義・設計は Claude Code が作成し、ユーザーが確認・承認する進め方に決定 |
| 2026-11-17 | 要件定義と基本設計を承認。React Router と TanStack Query を採用 |
| 2026-11-17 | デザインをレトロ携帯ゲーム機風のドット絵 RPG に変更。フォントを Geist から DotGothic16 に変更 |
| 2026-11-17 | Cookie の暗号化鍵を DB に保存する（Data Protection + EF Core）。Render の再起動やスリープでログインが切れるのを防ぐため |
