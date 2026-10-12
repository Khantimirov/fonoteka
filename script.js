
function play(file, title) {
  document.getElementById("title").textContent = title;
  var p = document.getElementById("player");
  p.src = file;
  p.play();
}

function togglePulse(){
  document.getElementById("pulsingImage").classList.toggle("pulse");
}