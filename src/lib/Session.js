import Events from 'events';

const filter = check => callback => (...args) => check(...args) && callback(...args);

function isRequired(err) {
  throw new err;
}

function message(type, message = {}) {
  return { type: type.toUpperCase(), ...message };
}

function isType(type, callback) {
  return function({ type: messageType, ...data }, from) {
    if (messageType.toUpperCase() === type.toUpperCase()) {
      callback(data, from);
    }
  }
}

class Session extends Events {
  _stateChange(state, ...args) {
    const oldState = this.state;
    this.state = state;
    this.emit('statechange', this.state, oldState, ...args);
    this.emit(this.state, ...args);
  }
  constructor({ room = isRequired('Room is required') } = {}) {
    super();
    this.state = 'connecting';
    this.id = String(Math.random());

    this.streams = new Map();
    this.connections = new Map();
    this.remoteStreams = new Map();
    this.peerConnections = new Map();

    this.socket = new WebSocket(`wss://websockethub.herokuapp.com/${room}`);
    this.socket.addEventListener('open', () => this._stateChange('connected'));
    this.socket.addEventListener('error', (err) => this._stateChange('error', err));
    this.socket.addEventListener('close', () => this._stateChange('disconnected'));
    this.socket.addEventListener('message', ({ data: rawData }) => {
      const decodeData = _ => JSON.parse(_);

      try {
        // intentional use of var here to expose to, from, data outside try
        var { to, from, data} = decodeData(rawData)
      } catch(err) {
        console.log('Could not decode message', rawData);
        return;
      }

      if (to !== '*' && to !== this.id) {
        console.log('Ignore message not intended for this connection', rawData);
        return;
      }

      console.log('<', rawData);

      this.emit('message', data, from);
    });

    this.once('connected', () => this.send(message('HI')));

    this.onType('HI', (data, from) => {
      this.connections.set(from, {
        streams: [],
      });
      this.streams.forEach(stream => this.publish(stream, from));
    });

    this.onType('BYE', (data, from) => {
      this.connections.delete(from);
    });

    this.onType('PUBLISH', (data, from) => {
      const stream = {
        id: data.id,
        width: data.width,
        height: data.height,
        from,
      };
      this.remoteStreams.set(stream.id, stream);
      this.emit('stream', stream);
    });

    this.onType('SUBSCRIBE', async (data, from) => {
      const streamId = data.id;

      const stream = this.streams.get(streamId);

      if (!stream) {
        throw new Error('Remote connection attempted to subscribe to non-existent stream');
      }

      if (this.peerConnections.has(`${streamId}-${from}`)) {
        console.warn('Remote has already subscribed to this stream');
        return;
      }

      const pc = new RTCPeerConnection();

      pc.addEventListener('icecandidate', ({ candidate }) => {
        this.send(message('SCAND', { id: streamId, candidate }), from);
      });

      this.peerConnections.set(`${streamId}-${from}`, pc);

      stream.getTracks().forEach(track => pc.addTrack(track, stream));

      const offer = await pc.createOffer({
        offerToReceiveVideo: 1,
        offerToReceiveAudio: 1,
      });

      await pc.setLocalDescription(offer);

      this.send(message('OFFER', { id: streamId, offer }), from);
    });

    this.onType('PCAND', async (data, from) => {
      const streamId = data.id;

      const pc = this.peerConnections.get(`${streamId}-${from}`);

      pc.addIceCandidate(data.candidate);
    });

    this.onType('SCAND', async (data, from) => {
      const streamId = data.id;

      const pc = this.peerConnections.get(`${streamId}-${from}`);

      pc.addIceCandidate(data.candidate);
    });

    this.onType('OFFER', async (data, from) => {
      const pc = new RTCPeerConnection();
      this.emit('createPeerConnection', `${data.id}-${from}`, pc);
      this.peerConnections.set(`${data.id}-${from}`, pc);
      pc.addEventListener('icecandidate', ({ candidate }) => {
        this.send(message('RCAND', { id: data.id, candidate }), from);
      });
      await pc.setRemoteDescription(data.offer);
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      this.send(message('ANSWER', { id: data.id, answer }), from);
    });

    this.onType('ANSWER', async (data, from) => {
      const pc = this.peerConnections.get(`${data.id}-${from}`);
      pc.setRemoteDescription(data.answer);
    });
  }
  onType(type, callback) {
    const fn = isType(type, callback);
    this.on('message', fn);
    return () => this.off('message', fn);
  }
  onceType(type, callback) {
    const fn = isType(type, callback);
    this.once('message', fn);
    return () => this.off('message', fn);
  }
  getStream(constraints = {}) {
    return navigator.mediaDevices.getUserMedia(
      { audio: true, video: true, ...constraints }
    );
  }
  send(data, to = '*') {
    const rawData = JSON.stringify({ data, to, from: this.id });
    console.log('>', rawData);
    this.socket.send(rawData);
  }
  publish(stream, to) {
    const { width, height } = stream.getVideoTracks()[0].getSettings();
    this.streams.set(stream.id, stream);
    this.send(message('PUBLISH', {
      id: stream.id,
      width,
      height,
    }), to);
  }
  subscribe(streamId) {
    const stream = this.remoteStreams.get(streamId);
    if (!stream) {
      throw new Error('Stream does not exist');
    }

    this.send(message('SUBSCRIBE', { id: stream.id }), stream.from);

    return new Promise((resolve) => {
      this.on(
        'createPeerConnection',
        filter(id => id === `${stream.id}-${stream.from}`)((id, pc) => {
          pc.addEventListener('track', (track) => {
            resolve(track.streams[0]);
          });
        }),
      );
    });
  }
}

export default Session;

// const id = String(Math.random());
// const socket = new WebSocket('wss://websockethub.herokuapp.com/my-little-apple-test');

// const getStream = () =>
//   navigator.mediaDevices.getUserMedia({ audio: true, video: true });

// const futureStream = getStream();

// async function displayVideo(futureVideoStream) {
//   const stream = await futureVideoStream;
//   const videoEl = document.createElement('video');
//   videoEl.classList.add('publisher');
//   document.body.appendChild(videoEl);
//   videoEl.srcObject = stream;
//   videoEl.play();
// }

// displayVideo(futureStream);

// const publishPCs = {};
// const subscribePCs = {};

// function send(data, to = '*') {
//   const message = JSON.stringify({ data, to, from: id });
//   console.log('>', message);
//   socket.send(message);
// }

// socket.addEventListener('open', async () => {
//   socket.addEventListener('message', async ({ data: rawData }) => {
//     const { to, from, data } = JSON.parse(rawData);

//     console.log('<', rawData);

//     if (to !== '*' && to !== id) {
//       console.log('Ignore message');
//       // ignore message not intended for me
//       return;
//     }

//     if (data.type === 'PUBLISH') {
//       send({ type: 'SUBSCRIBE' }, from);
//     }


//     if (data.type === 'ANNOUNCE') {
//       const stream = await futureStream;
//       console.log('publish to new user');
//       send({ type: 'PUBLISH' }, from);
//       return;
//     }

//     if (data.type === 'SUBSCRIBE') {
//       const stream = await futureStream;
//       const pc = new RTCPeerConnection();

//       stream.getTracks().forEach(track => pc.addTrack(track, stream));

//       publishPCs[from] = pc;

//       pc.addEventListener('icecandidate', ({ candidate }) => {
//         send({ type: 'SCAND', candidate }, from);
//       });

//       const offer = await pc.createOffer({
//         offerToReceiveAudio: 1,
//         offerToReceiveVideo: 1
//       });

//       await pc.setLocalDescription(offer);

//       send({ type: 'OFFER', offer }, from);
//     }

//     if (data.type === 'BYE') {
//       const pc = subscribePCs[from];
//       if (!pc) {
//         return;
//       }
//       pc.__videoEl.parentNode.removeChild(pc.__videoEl);
//     }

//     if (data.type === 'RCAND') {
//       const pc = publishPCs[from];
//       pc.addIceCandidate(data.candidate);
//     }

//     if (data.type === 'SCAND') {
//       const pc = subscribePCs[from];
//       pc.addIceCandidate(data.candidate);
//     }

//     if (data.type === 'ANSWER') {
//       const pc = publishPCs[from];
//       await pc.setRemoteDescription(data.answer);
//     }

//     if (data.type === 'OFFER') {
//       const pc = new RTCPeerConnection();
//       const videoEl = document.createElement('video');
//       pc.__videoEl = videoEl;
//       videoEl.classList.add('subscriber');
//       document.body.appendChild(videoEl);

//       pc.addEventListener('track', (track) => {
//         if (videoEl.srcObject !== track.streams[0]) {
//           videoEl.srcObject = track.streams[0];
//           videoEl.play();
//         }
//       });

//       subscribePCs[from] = pc;

//       await pc.setRemoteDescription(data.offer);
//       const answer = await pc.createAnswer();
//       await pc.setLocalDescription(answer);
//       pc.addEventListener('icecandidate', ({ candidate }) => {
//         send({ type: 'RCAND', candidate }, from);
//       });

//       send({ type: 'ANSWER', answer }, from);
//     }
//   });

//   window.addEventListener('unload', () => {
//     send({ type: 'BYE' });
//   });

//   send({ type: 'PUBLISH' });
//   send({ type: 'ANNOUNCE' });
// });
