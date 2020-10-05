# browser-recoding
### 概要
mediaDevices.getUserMediaを使用して開発したパターン
ブラウザにてユーザーのカメラを起動し、録画

### 懸念点
- iOS safariの場合、設定>safariから'MediaRecorder'を有効にする必要あり（iOS14.0）
  - PC safariの場合、MediaRecorderが有効にできず、録画が動作しない（safari 12.1.2）
- iOS safariの場合、stream領域がブラックアウトしたまま（録画は可能）
- iOS safariにおける録画データの画面の向きが横になる
- iOS ChromeではgetUserMediaエラーでアクティベート不可（未調査）