// Multiplayer Networking Module
// Handles WebSocket connection, lobby management, and game synchronization

export class Multiplayer {
  constructor() {
    this.ws = null;
    this.connected = false;
    this.lobbyName = null;
    this.role = null; // 'host' or 'guest'
    this.playerName = '';
    this.opponentName = '';
    this.seed = 0;
    this.opponentReady = false;
    this.myReady = false;
    this.round = 0;
    this.opponentLives = 20;

    // Callbacks
    this.onError = null;
    this.onLobbyCreated = null;
    this.onGameStart = null;
    this.onOpponentReady = null;
    this.onRoundStart = null;
    this.onIncomingAttack = null;
    this.onOpponentTower = null;
    this.onOpponentTowerSold = null;
    this.onYouWin = null;
    this.onYouLose = null;
    this.onPlayerLeft = null;
    this.onOpponentLives = null;
  }

  connect(serverUrl) {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(serverUrl);

        this.ws.onopen = () => {
          this.connected = true;
          console.log('Verbunden mit Server');
          resolve();
        };

        this.ws.onclose = () => {
          this.connected = false;
          console.log('Verbindung zum Server getrennt');
          if (this.onPlayerLeft) this.onPlayerLeft();
        };

        this.ws.onerror = (err) => {
          console.error('WebSocket Fehler:', err);
          reject(err);
        };

        this.ws.onmessage = (event) => {
          this.handleMessage(JSON.parse(event.data));
        };
      } catch (e) {
        reject(e);
      }
    });
  }

  handleMessage(msg) {
    switch (msg.type) {
      case 'error':
        if (this.onError) this.onError(msg.message);
        break;

      case 'lobby_created':
        this.lobbyName = msg.lobbyName;
        this.role = 'host';
        this.playerName = msg.playerName;
        if (this.onLobbyCreated) this.onLobbyCreated(msg);
        break;

      case 'lobby_joined':
        this.lobbyName = msg.lobbyName;
        this.role = 'guest';
        this.playerName = msg.playerName;
        this.opponentName = msg.opponentName;
        this.seed = msg.seed;
        break;

      case 'game_start':
        this.opponentName = msg.opponentName;
        this.seed = msg.seed;
        this.role = msg.role;
        if (this.onGameStart) this.onGameStart(msg);
        break;

      case 'opponent_ready':
        this.opponentReady = true;
        if (this.onOpponentReady) this.onOpponentReady();
        break;

      case 'round_start':
        this.round = msg.round;
        this.opponentReady = false;
        this.myReady = false;
        if (this.onRoundStart) this.onRoundStart(msg.round);
        break;

      case 'incoming_attack':
        if (this.onIncomingAttack) this.onIncomingAttack(msg.units, msg.senderName);
        break;

      case 'opponent_tower':
        if (this.onOpponentTower) this.onOpponentTower(msg);
        break;

      case 'opponent_tower_sold':
        if (this.onOpponentTowerSold) this.onOpponentTowerSold(msg);
        break;

      case 'you_win':
        if (this.onYouWin) this.onYouWin(msg.opponentName);
        break;

      case 'you_lose':
        if (this.onYouLose) this.onYouLose();
        break;

      case 'player_left':
        if (this.onPlayerLeft) this.onPlayerLeft();
        break;

      case 'opponent_lives':
        this.opponentLives = msg.lives;
        if (this.onOpponentLives) this.onOpponentLives(msg.lives);
        break;
    }
  }

  send(msg) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(msg));
    }
  }

  createLobby(lobbyName, playerName) {
    this.send({
      type: 'create_lobby',
      lobbyName: lobbyName,
      playerName: playerName
    });
  }

  joinLobby(lobbyName, playerName) {
    this.send({
      type: 'join_lobby',
      lobbyName: lobbyName,
      playerName: playerName
    });
  }

  readyNextRound() {
    this.myReady = true;
    this.send({ type: 'ready_next_round' });
  }

  sendAttack(units) {
    this.send({
      type: 'send_attack',
      units: units
    });
  }

  syncTowerPlaced(towerName, gridX, gridY, level) {
    this.send({
      type: 'tower_placed',
      towerName, gridX, gridY, level
    });
  }

  syncTowerSold(gridX, gridY) {
    this.send({
      type: 'tower_sold',
      gridX, gridY
    });
  }

  sendDefeated() {
    this.send({ type: 'player_defeated' });
  }

  syncLives(lives) {
    this.send({ type: 'sync_lives', lives });
  }

  // Seeded random number generator for synchronized map generation
  static seededRandom(seed) {
    let s = seed;
    return function () {
      s = (s * 1664525 + 1013904223) & 0xFFFFFFFF;
      return (s >>> 0) / 0xFFFFFFFF;
    };
  }

  isHost() {
    return this.role === 'host';
  }

  isGuest() {
    return this.role === 'guest';
  }

  // Host = left side, Guest = right side
  getPlayerSide() {
    return this.role === 'host' ? 'left' : 'right';
  }
}
