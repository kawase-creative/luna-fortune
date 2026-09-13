# Gmailによる月の便り

Google Apps Scriptプロジェクト「LUNA 月の便り」を公開済み。
所有者の初回認証は2026-09-14に完了。フォーム入力→GASへのPOST→MailAppによるメール送信まで接続済み。

- プロジェクト：https://script.google.com/home/projects/1FZCLY2MqnVKGPEtjpjdF_zxZOTbbcUM47dDKFYk_giwvCugPPJH2NdoA/edit
- 本番の送信URLは `mail-config.js` の `appsScriptEndpoint` を参照。
- 実行者：所有者（USER_DEPLOYING）。アクセス：全員・未ログイン可（ANYONE_ANONYMOUS）。
- 権限は送信専用の script.send_mail。訪問者のOAuth認証やGoogleログインは不要。
- フォームの名前・生年月日・宛先・同意をPOSTし、Googleが返す送信結果をページ内フレームに表示する。
- 継続配信なし。1回の依頼で今後30日間のサンプル鑑定を1通送る。
- 全体で1日20通、同じ宛先は1日1通。送信のロックと宛先ハッシュ・日別件数で重複を抑止。
- 公開フォームのため上限が悪用で消費される可能性はある。本格運用時は用意済みのTurnstile付きバックエンドへの移行を検討。

## 確認
2026-09-14、Google未ログインの新規ブラウザーでフォームを送信。所有者アドレスへの実際のメール受信を確認済み。本文の個別名・期間・鑑定内容も確認。

## 更新
コード変更時はGAS側で新しいバージョンを既存デプロイへ反映する。URLを維持すればサイトの変更は不要。新規デプロイでURLが変わった場合は mail-config.js とその読み込みバージョンを更新する。

公式仕様：https://developers.google.com/apps-script/manifest/web-app-api-executable
