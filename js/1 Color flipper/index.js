const body = document.getElementsByTagName('body')[0];
function setColor(name) {
    body.style.backgroundColor = name;
}


let color = "";



setColorRandompre();

let randombuttonColors = document.getElementById('Random');
let red1 = document.getElementById('red');
let blue1 = document.getElementById('blue');
let green1 = document.getElementById('green');


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
    randombuttonColors.style.color = color;
    // red1.style.color = color;
    // green1.style.color = color;
    // blue1.style.color = color;
    setColorRandompre();
}
