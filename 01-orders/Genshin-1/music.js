pauseAudio = (event) => {
 let audio = document.querySelector('#personal_track');
 audio.pause();
}
var isPlaying;
toggleAudio = (event) => {
 let audio = document.querySelector('#personal_track');
 var container = document.querySelector('.music-container');
 var playButton = document.querySelector('.play-button');
 if (isPlaying) {
  audio.pause()
  isPlaying = false
  playButton.classList.remove('playing')
 } else {
  audio.play()
  isPlaying = true
  playButton.classList.add('playing')
 }
}