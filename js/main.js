const streamVideo = document.getElementById("streamVideo");
const getUserCameraBtn = document.getElementById("getUserCameraBtn");
const startRecBtn = document.getElementById("startRecBtn");
const stopRecBtn = document.getElementById("stopRecBtn");
const downloadBtn = document.getElementById("downloadBtn");
const stopStreamBtn = document.getElementById("stopStreamBtn");

let localStream = null;
let recorder = null;
let recordedData = [];
let width = 340;
let height = 0;

/**
 * ユーザーデバイスアクティベート
 */
getUserCameraBtn.onclick = async () => {
  if (localStream) {
    return;
  }

  try {
    // ユーザーのカメラとマイクの情報を取得
    localStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: {
        // バックカメラを使用
        facingMode: "environment"
      }
    });
  } catch (error) {
    alert(`エラーが発生しました \n ${error.message}`);
    return;
  }

  streamVideo.srcObject = localStream;
  // ハウリング防止のため音声をmute
  streamVideo.muted = true;
  streamVideo.play();

  height = streamVideo.videoHeight / (streamVideo.videoWidth / width);
  streamVideo.setAttribute("width", width);
  streamVideo.setAttribute("height", height);
};

/**
 * 録画開始
 * iphoneで実行するには、iOS>safariの設定から'MediaRecorder'を有効にする必要あり
 */
startRecBtn.addEventListener("click", () => {
  if (!localStream) {
    alert("カメラの使用を許可してください");
    return;
  }

  try {
    recorder = new MediaRecorder(localStream, { mimeType: "video/webm" });
  } catch (error) {
    alert(`エラーが発生しました\n ${error.message}`);
    return;
  }

  recorder.start();

  getUserCameraBtn.disabled = true;
  startRecBtn.disabled = true;
  downloadBtn.disabled = true;
  stopStreamBtn.disabled = true;
});

/**
 * 録画停止
 */
stopRecBtn.addEventListener("click", () => {
  if (!recorder || recorder.state == "inactive") {
    alert("録画が開始されていません");
    return;
  }

  recorder.stop();
  // recorder.stop()によりondataavailableイベント発生
  recorder.ondataavailable = handleVideoDataAvailable;

  getUserCameraBtn.disabled = false;
  startRecBtn.disabled = false;
  downloadBtn.disabled = false;
  stopStreamBtn.disabled = false;
});

/**
 * ダウンロード
 */
downloadBtn.addEventListener("click", () => {
  if (!recordedData.length) {
    alert("ダウンロード可能な録画データが存在しません");
    return;
  }

  let blob = new Blob(recordedData, { type: "video/mp4" });
  let url = window.URL.createObjectURL(blob);
  let a = document.createElement("a");

  a.setAttribute("href", url);
  a.setAttribute("download", "video.mp4");
  document.body.appendChild(a);
  a.click();

  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
});

/**
 * ユーザーデバイス無効化
 * ストリーミング（音声・ビデオ）の停止
 */
stopStreamBtn.addEventListener("click", () => {
  if (!localStream) {
    return;
  }

  // 音声とビデオの各トラックを無効化した上でlocalStreamを初期化する
  localStream.getAudioTracks()[0].stop();
  localStream.getVideoTracks()[0].stop();
  streamVideo.srcObject = null;
  localStream = null;
});

/**
 * 録画データ処理
 */
function handleVideoDataAvailable(event) {
  if (event.data.size < 0) {
    return;
  }

  let file = event.data

  // ダウンロード用にデータ格納
  recordedData.push(file);

  previewFile(file)
}

/**
 * 録画データのプレビュー
 */
function previewFile(file) {
  const previewVideo = document.getElementById("previewVideo");

  previewVideo.setAttribute("controls", "");
  previewVideo.setAttribute("width", width);
  previewVideo.setAttribute("height", height);

  previewVideo.src = window.URL.createObjectURL(file);
  previewVideo.muted = true;
}