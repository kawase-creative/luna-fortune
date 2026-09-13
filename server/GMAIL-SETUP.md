# Gmailによる月の便り

ユーザー指定のGmailを差出人として、Google Apps ScriptのMailApp（送信のみ）を使用します。

## 現在の状態
- 送信コードはユーザーのGoogleアカウントに保存済み。
- プロジェクト：https://script.google.com/home/projects/1FZCLY2MqnVKGPEtjpjdF_zxZOTbbcUM47dDKFYk_giwvCugPPJH2NdoA/edit
- プロジェクト名：LUNA 月の便り
- 公開と送信権限についてユーザー承認済み。
- Googleの「アクセスを承認」画面で認証ポップアップが開かず、OAuth認証・公開は未完了。
- `mail-config.js` の `appsScriptEndpoint` は意図的に未設定。現在は実際に送信しない。

## 完了まで
1. 上記のプロジェクトを通常のブラウザーで開き、指定したGoogleアカウントを選ぶ。
2. 新しいデプロイ→ウェブアプリ。実行者は自分、アクセスできるユーザーは全員。送信権限のGoogle認証を完了する。
3. 公開された `/exec` URLを `mail-config.js` の `appsScriptEndpoint` に設定。Resend用のendpointとturnstileSiteKeyは空のままとする。
4. サイトを公開し、所有者アドレスへの送信を1回行って実際の受信を確認する。

## Gmail版の動作
- 名前・生年月日・宛先・同意をPOSTし、Googleが返す送信結果をページ内の専用フレームに表示する。ブラウザー側で送信成功を推測しない。
- サンプル鑑定として今後30日間の週別ヒント、恋愛・仕事・金運、ラッキーアイテム、開運アクションを送る。
- 受信箱の閲覧権限は使用しない。継続配信も行わない。
- 全体で1日20通、同じ宛先は1日1通。送信処理をロックし、宛先ハッシュと日別件数で重複を抑止する。名前と生年月日はプロパティには保存しない。
- 不正な入力は送信しない。メールの本文・件名はサーバー内の定型文から作り、利用者が自由な文章を送る用途には使えない。
- 公開フォームのため上限が悪用で消費される可能性はある。本格運用で必要になったら、別途用意済みのTurnstile付き送信サーバーへ移行する。

Google公式：https://developers.google.com/apps-script/reference/mail/mail-app

## 一般ユーザーのGoogle認証を不要にする設定
`appsscript.json` をGoogle側にも保存済み。
- `webapp.executeAs`: `USER_DEPLOYING`（所有者として実行）
- `webapp.access`: `ANYONE_ANONYMOUS`（未ログインも利用可）
- OAuthスコープは `script.send_mail` のみ。
- サイトにOAuthライブラリ、認証リンク、アクセストークンは置かない。
- 公開URLは `/exec` を使う。編集者向け `/dev` やGoogle認証URLはフォームの送信先にしない。

所有者の初回送信認証は別途必要で、一般ユーザーの認証を不要にしても省略できない。
認証完了後は、Googleにログインしていないブラウザーでフォームを送信し、OAuthページへ遷移しないことと実際の受信を確認する。現時点でその実配信テストは未実施。

公式設定値：https://developers.google.com/apps-script/manifest/web-app-api-executable
