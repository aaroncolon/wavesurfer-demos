import WaveSurfer from 'wavesurfer.js';

class ShredGnar {
  constructor() {
    this.CLASS_PLAYING  = 'play-pause--playing';
    this.wavesurfers    = [];
    this.$songs         = null;
    this.$playPauseBtns = null;
  }

  init() {
    this.cacheDom();
    this.initWaveSurfer();
  }

  cacheDom() {
    this.$songs         = document.querySelectorAll('.song');
    this.$playPauseBtns = document.querySelectorAll('.play-pause');
  }

  initWaveSurfer() {
    for (let i = 0; i < this.$songs.length; i++) {
      const $playPause = this.$songs[i].querySelector('.play-pause');
      const src        = this.$songs[i].dataset.src;
      const wavesurfer = WaveSurfer.create({
        container: this.$songs[i].querySelector('.waveform'),
        barGap: 2,
        barWidth: 1,
        height: 80,
        responsive: 200,
        pixelRatio: 1,
        scrollParent: false
      });

      wavesurfer.load(src);

      wavesurfer.on('finish', () => this.handleWaveSurferFinish(wavesurfer, $playPause));

      $playPause.addEventListener('click', (e) => this.handlePlayPause(e, e.data = {index: i, wavesurfer: wavesurfer}));

      this.wavesurfers.push(wavesurfer);
    }
  }

  /**
   * Handle WaveSurfer `finish` event
   * 
   * @param {object} ws the WaveSurfer instance
   * @param {object} $btn play / pause button
   */
  handleWaveSurferFinish(ws, $btn) {
    ws.stop();
    $btn.classList.remove(this.CLASS_PLAYING)
    $btn.textContent = "Play";
  }

  /**
   * Handle Play Pause `click` event
   * 
   * @param {object} e the event
   */
  handlePlayPause(e) {
    const i  = e.data.index;
    const ws = e.data.wavesurfer;

    if (ws.isPlaying()) {
      ws.pause();
      e.currentTarget.classList.remove(this.CLASS_PLAYING);
      e.currentTarget.textContent = "Play";
    } else {
      this.resetAllPlayers(i);
      ws.play();
      e.currentTarget.classList.add(this.CLASS_PLAYING);
      e.currentTarget.textContent = "Pause";
    }
  }

  stopAllPlayers(index) {
    for (let i = 0; i < this.wavesurfers.length; i++) {
      if (i !== index) {
        this.wavesurfers[i].stop();  
      }
    }
  }

  resetAllPlayPauseButtons() {
    this.$playPauseBtns.forEach((el, index) => {
      el.classList.remove(this.CLASS_PLAYING);
      el.textContent = "Play";
    }, this);
  }

  resetAllPlayers(index) {
    this.resetAllPlayPauseButtons();
    this.stopAllPlayers(index);
  }

}

export default ShredGnar;
