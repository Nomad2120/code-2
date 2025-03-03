import { EventEmitter } from 'events';

class NCALayer {
  constructor(ws = new WebSocket(), ee = new EventEmitter()) {
    this.ws = ws;
    this.ee = ee;
    this.method = null;
    ws.onmessage = this.message.bind(this);
    ws.onopen = this.open.bind(this);
    ws.onclose = this.close.bind(this);
  }

  on(name, fn) {
    this.ee.on(name, fn);
  }

  off(name, fn) {
    this.ee.removeListener(name, fn);
  }

  emit(message) {
    const { method } = message;
    this.method = method;
    this.ws.send(JSON.stringify(message));
  }

  message(e) {
    try {
      const result = JSON.parse(e.data);

      if (result != null) {
        const type = this.method ? this.method : 'message';
        this.ee.emit(type, result);
      }
    } catch (err) {
      this.ee.emit('error', err);
    }
  }

  open() {
    this.ee.emit('connect');
  }

  close() {
    this.ee.emit('disconnect');
  }
}

export default NCALayer;
