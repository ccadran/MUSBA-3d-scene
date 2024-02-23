import gsap from "gsap";

const loader = document.querySelector(".loader");
const htmlContainer = document.querySelector(".html-3d-scene");
const enterExperience = document.querySelector(".enter");
const cursor = document.querySelector(".cursor");
const cursor2 = document.querySelector(".cursor2");

enterExperience.addEventListener("click", () => {
  gsap.set(htmlContainer, {
    display: "flex",
  });
  gsap.to(htmlContainer, {
    opacity: "100%",
    delay: 1,
  });
  gsap.set(cursor, {
    display: "none",
  });
  gsap.set(cursor2, {
    display: "none",
  });
  gsap.to(loader, {
    maskImage:
      "radial-gradient(circle at center  bottom , transparent 0%, transparent 100%, black 100%)",
    ease: "power3.inOut",
    duration: 1,
  });
});

setTimeout(() => {
  gsap.set(enterExperience, {
    cursor: "pointer",
    pointerEvents: "auto",
  });
  enterExperience.innerHTML = "<h4>Enter</h4>";
}, [3000]);
console.log(enterExperience, loader, htmlContainer);

window.addEventListener("mousemove", (e) => {
  gsap.to(cursor, {
    left: e.x,
    top: e.y,
    duration: 0.3,
  });
  gsap.to(cursor2, {
    left: e.x,
    top: e.y,
    duration: 0.4,
  });
});

setTimeout(() => {}, [2000]);
