import '../style.css'

let sectionContainer = document.querySelector("main");
let sections = Array.from(document.querySelectorAll("section"));
let controllersContainer = document.getElementById("controllers");
let currentSlide = 0;
let isAnimating = false;
let sectionsDimensions = sections.map((it, i) => {
    let offset = 0;
    sections.slice(0, i).forEach((el) => {
        offset += el.offsetHeight;
    });
    return offset;
});



const scrollToAnimation = ({conatiner, yPos, duration = 600,callback=null}) => {
    const startY = conatiner.scrollTop;
    const difference = yPos - startY;
    const startTime = performance.now();
    const step = () => {
      const progress = (performance.now() - startTime) / duration;
      const amount = easeOutCubic(progress);
      conatiner.scroll({ top: startY + amount * difference });
      if (progress < 0.99) 
        window.requestAnimationFrame(step);
      else
      callback()
    };
    step();
  }
  
  // Easing function from https://gist.github.com/gre/1650294
  const easeOutCubic =  t => t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1;


let scrollTo = (i) => {
    if (isAnimating) return null;
    if (i in sections === false) return null;
    controllers.forEach((it) => it.classList.remove("active"));
    isAnimating = true;
    currentSlide = i;
   
    sections.forEach(it=>it.style.transform = "scale(.95)")
    scrollToAnimation({
            conatiner:sectionContainer,
            yPos:sectionsDimensions[i],
            duration:1000,
            callback:()=>{
                sections[i].style.transform = null;
                controllers[currentSlide].classList.add("active");
                isAnimating = false;
            }
        })
   
};

let controllers = sections.map((section, i) => {
    let controll = document.createElement("div");
    controll.addEventListener("click", () => {
        scrollTo(i);
    });
    if (i === 0) controll.className = "active";
    controllersContainer.appendChild(controll);
    return controll;
});


function onMouseWheel(event) {
    let issetScreen = event.composedPath().filter(el => {
        if(el.classList && el.classList.length > 0)
            if(el.classList.contains('mobile-screen'))
            return true
    });
    if(issetScreen.length) return null;


    // if(event.target.nodeName === 'YMAPS') return null;
    var delta = event.wheelDelta / 30 || -event.detail;
    let end =
        sections[currentSlide].offsetHeight +
            sections[currentSlide].scrollTop +
            1 >=
        sections[currentSlide].scrollHeight;

    if (delta < -1 && end) scrollTo(currentSlide + 1);
    if(delta>1 && sections[currentSlide].scrollTop < 1) scrollTo(currentSlide-1, currentSlide);

    return null;
}

window.addEventListener("wheel", onMouseWheel);
window.addEventListener("resize", ()=>{
    sectionsDimensions = sections.map((it, i) => {
        let offset = 0;
        sections.slice(0, i).forEach((el) => {
            offset += el.offsetHeight;
        });
        return offset;
    });
});
