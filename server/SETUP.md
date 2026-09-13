# 月の便り：送信の有効化

実装済みですが、配信元が未設定のため実際の送信はまだ有効になっていません。
GitHub Pagesのサイトはそのまま使用し、送信処理だけCloudflare Workersで動かします。

1. Resendアカウントで所有ドメインを認証し、LUNAの差出人アドレスを決める。
2. CloudflareでTurnstileウィジェットを作成する。許可ホストは `kawase-creative.github.io`。
3. このディレクトリでWranglerを使用し、`wrangler secret put RESEND_API_KEY`、`wrangler secret put TURNSTILE_SECRET`、`wrangler secret put MAIL_FROM` により値を登録する。公開リポジトリやチャットに秘密鍵を貼らない。
4. `wrangler deploy` で送信サーバーを公開する。`wrangler.toml`にはIPごとに毎分3回のレート制限が定義済み。
5. サイトの `mail-config.js` に公開された `/letter` URLとTurnstileの公開サイトキーのみを設定し、GitHubへ反映する。
6. 所有者の受信アドレスで1回テストし、実際の受信を確認する。この確認が済むまでは送信機能の完成とは扱わない。

## 内容と取り扱い
- 鑑定で使った名前・生年月日を引き継ぎ、今後30日間の週ごとのヒント、恋愛・仕事・金運、ラッキーアイテムを1通送る。
- 現状はAPIなしのサンプル文章。名前と日付によってテーマ・アイテムを選択するもので、本格的な占星術計算やAI生成ではない旨をメール内に明記。
- 継続購読・定期配信は行わない。メール本文はサーバー側で生成し、自由な本文や件名を外部から受け付けない。
- 入力データをLUNAのデータベースには保存しない。配信のためCloudflareおよびResendで処理され、サービス側の配信ログが残る場合がある。
- 配信受付APIの成功を確認した場合だけ受付完了と表示する。実際の受信保証ではない。
- ドメイン制限、Turnstileのサーバー検証、IPレート制限、入力検証、本文サイズ制限、冪等キーを実装済み。

公式資料：
- https://resend.com/docs/api-reference/emails/send-email
- https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
- https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/
