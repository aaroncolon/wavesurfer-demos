import $ from "jquery";
import WaveSurfer from 'wavesurfer.js';

const shredGnar = (function() {

  const CLASS_PLAYING = 'play-pause--playing',
        wavesurfers = [];

  let $songs, 
      $playPauseBtns;

  function init() {
    cacheDom();
    initWaveSurfer();
  }

  function cacheDom() {
    $songs = $('.song');
    $playPauseBtns = $songs.find('.play-pause');
  }

  function initWaveSurfer() {
    $songs.each(function(index, el) {
      const $this = $(this);
      const $playPause = $this.find('.play-pause');
      const src = this.dataset.src;

      let wavesurfer = WaveSurfer.create({
        container: $this.find('.waveform').get(0),
        barGap: 2,
        barWidth: 1,
        height: 80,
        responsive: 200,
        pixelRatio: 1,
        scrollParent: false
      });

      wavesurfer.load(src);

      wavesurfer.on('finish', () => handleWaveSurferFinish(wavesurfer, $playPause));

      $playPause.on('click', null, {index: index, wavesurfer: wavesurfer}, handlePlayPause);

      wavesurfers.push(wavesurfer);
    });
  }

  /**
   * Handle WaveSurfer `finish` event
   * 
   * @param {object} ws the WaveSurfer instance
   * @param {object} $btn jQuery play / pause button
   */
  function handleWaveSurferFinish(ws, $btn) {
    ws.stop();
    $btn.remove(CLASS_PLAYING).text('Play');
  }

  /**
   * Handle Play Pause `click` event
   * 
   * @param {object} e the event
   */
  function handlePlayPause(e) {
    const i = e.data.index;
    const ws = e.data.wavesurfer;

    if (ws.isPlaying()) {
      ws.pause();
      e.currentTarget.classList.remove(CLASS_PLAYING);
      e.currentTarget.textContent = "Play";
    } else {
      resetAllPlayers(i);
      ws.play();
      e.currentTarget.classList.add(CLASS_PLAYING);
      e.currentTarget.textContent = "Pause";
    }
  }

  function stopAllPlayers(index) {
    for (let i = 0; i < wavesurfers.length; i++) {
      if (i !== index) {
        wavesurfers[i].stop();  
      }
    }
  }

  function resetAllPlayPauseButtons() {
    $playPauseBtns.each(function(i, el) {
      this.classList.remove(CLASS_PLAYING);
      this.textContent = "Play";
    });
  }

  function resetAllPlayers(index) {
    resetAllPlayPauseButtons();
    stopAllPlayers(index);
  }

  return {
    init: init
  };

})();

export default shredGnar;

