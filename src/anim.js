import gsap from "gsap";

const loader = document.querySelector(".loader");
const htmlContainer = document.querySelector(".html-3d-scene");

setTimeout(() => {
  gsap.to(loader, {
    y: "100%",
  });
  gsap.set(htmlContainer, {
    opacity: "100%",
  });
}, [2000]);
console.log(loader, htmlContainer);
