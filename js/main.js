const editorAreas = document.querySelector('.editorAreas')
const linesForm = document.querySelectorAll('.lineToAddForm')
let currentComponentToTransfer;

//Open and Close Aba de Componentes
editorAreas.querySelector('.closeArea').addEventListener(
  "click",
  function () {
    editorAreas.querySelector('.content').classList.toggle('close')
    //editorAreas.querySelector('.content').classList.add('open')
  })

//Draggable Elements
document.addEventListener(
  "dragstart",
  (e) => {
    currentComponentToTransfer = e.target.children[0].cloneNode(true)
  e.target.classList.add("dragging");
})

document.addEventListener(
  "dragend",
  (e) => {
    e.target.classList.remove("dragging");
    currentComponentToTransfer = null
  })

linesForm.forEach((item) => {
  item.addEventListener("dragover", (e) => {
    item.prepend(currentComponentToTransfer)
  })

})
