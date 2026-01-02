document.addEventListener("mousemove", (e) => {
    const aura = document.getElementById("cursor-aura");
    aura.style.top = `${e.clientY}px`;
    aura.style.left = `${e.clientX}px`;
});
