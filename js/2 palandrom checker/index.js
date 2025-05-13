const body = document.getElementsByTagName('body')[0];
function setColor(name) {
    body.style.backgroundColor = name;
}


let color = "";



setColorRandompre();

let randombuttonColors = document.getElementById('Random');


function setColorRandompre() {
    let randombuttonColors = document.getElementById('Random');
    const red = Math.round(Math.random() * 255);
    const green = Math.round(Math.random() * 255);
    randombuttonColors.style.color = color;
    const blue = Math.round(Math.random() * 255);
    color = `rgb(${red},${green},${blue})`;
    randombuttonColors.style.backgroundColor = color;

}

randombuttonColors.style.backgroundColor = color;



setColorRandom5();
function setColorRandom(color) {
    body.style.backgroundColor = color;
    setColorRandompre();
}





// function randomColor() {
//     const red = Math.round(Math.random() * 255)
//     const green = Math.round(Math.random() * 255)
//     const blue = Math.round(Math.random() * 255)
//     const color = `rgb(${red},${green},${blue})`
//     body.style.backgroundColor = color;
// }
