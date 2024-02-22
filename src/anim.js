import gsap from "gsap";

const loader = document.querySelector(".loader");
const htmlContainer = document.querySelector(".html-3d-scene");
const enterExperience = document.querySelector(".enter");
const cursor = document.querySelector(".cursor");

enterExperience.addEventListener("click", () => {
  gsap.to(loader, {
    y: "100%",
  });
  gsap.set(htmlContainer, {
    display: "flex",
  });
});
console.log(enterExperience, loader, htmlContainer);

window.addEventListener("mousemove", (e) => {
  gsap.to(cursor, {
    left: e.x,
    top: e.y,
  });
});

setTimeout(() => {}, [2000]);
