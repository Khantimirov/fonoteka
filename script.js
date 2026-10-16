window.addEventListener('DOMContentLoaded', () => {
    const element = document.getElementById('main-element-animated');

    if(element){
      requestAnimationFrame(()=>{
        element.classList.remove('opacity-20', 'translate-y-5');
        element.classList.add('opacity-100', 'translate-y-0');
      })
    }
  }
)

function play(file, title) {
  document.getElementById("title").textContent = title;
  var p = document.getElementById("player");
  p.src = file;
  p.play();
}

function togglePulse(){
  document.getElementById("pulsingImage").classList.toggle("pulse");
}