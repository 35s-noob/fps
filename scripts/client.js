// サーバー接続
const socket = new WebSocket("wss://fps-multiplayer.vox-35sjp.workers.dev");

// 自分の状態
const myId = Math.random().toString(36).slice(2);
let players = {};  // 他人のキャラ保存

function sendState(position, rotation) {
  socket.send(JSON.stringify({
    id: myId,
    x: position.x,
    y: position.y,
    z: position.z,
    rotY: rotation.y
  }));
}

socket.onmessage = (e) => {
  const data = JSON.parse(e.data);
  if (data.id !== myId) {
    players[data.id] = data;
  }
};
