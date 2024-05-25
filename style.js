const starColors = ['yellow', 'cyan', 'red'];
const maxAcceleration = 3;
const maxSpeed = 2;

let stars = [];
let starSpeeds = [];

let mousePos = [0, 0];
let attract = false;
let repel = false;

function mouseMoved(x, y) {
    mousePos = [x, y];
}

function deleteStars() {
    for (const star of stars) {
        document.body.removeChild(star);
    }

    stars = [];
    starSpeeds = [];
}

function createStars() {
    for (let i = 0; i < (window.innerWidth * window.innerHeight) / 20000; i++) {
        const x = Math.floor(Math.random() * window.innerWidth);
        const y = Math.floor(Math.random() * window.innerHeight);

        const star = document.createElement('div');
        star.classList.add('star');

        star.style.left = x + 'px';
        star.style.top = y + 'px';

        star.style.backgroundColor = starColors[Math.floor(Math.random() * 3)];

        const size = 3 + Math.ceil(Math.random() * 7);
        star.style.width = size + 'px';
        star.style.height = size + 'px';

        document.body.appendChild(star);
        stars.push(star);

        const xSpeed = Math.round((-1 + Math.random() * 2) * 10) / 10;
        const ySpeed = Math.round((-1 + Math.random() * 2) * 10) / 10;

        starSpeeds.push([xSpeed, ySpeed]);
    }
}

window.onmousemove = event => {
    mousePos = [event.clientX, event.clientY];
};

window.onmousedown = event => {
    attract = event.buttons === 1;
    repel = event.buttons === 2;
}

window.onmouseup = event => {
    attract = event.buttons === 1;
    repel = event.buttons === 2;
}

document.oncontextmenu = document.body.oncontextmenu = function() { return false; }

createStars();
window.addEventListener('resize', () => {
    deleteStars();
    createStars();
})

setInterval(() => {
    let index = 0;
    for (const star of stars) {
        let x = Number(star.style.left.slice(0, -2));
        let y = Number(star.style.top.slice(0, -2));
        x += starSpeeds[index][0];
        y += starSpeeds[index][1];

        if (x < -10) {
            starSpeeds[index][0] *= -1;
        } else if (x > window.innerWidth + 10) {
            starSpeeds[index][0] *= -1;
        }

        if (y < -10) {
            starSpeeds[index][1] *= -1;
        } else if (y > window.innerHeight + 10) {
            starSpeeds[index][1] *= -1;
        }

        star.style.left = x + 'px';
        star.style.top = y + 'px';

        if (attract !== repel) {
            let distance = Math.abs(mousePos[0] - x) + Math.abs(mousePos[1] - y);
            let xAccel = Math.min(Math.max(mousePos[0] - x, -maxAcceleration), maxAcceleration) / distance;
            let yAccel = Math.min(Math.max(mousePos[1] - y, -maxAcceleration), maxAcceleration) / distance;

            if (attract) {
                starSpeeds[index][0] += xAccel;
                starSpeeds[index][1] += yAccel;
            }
            else {
                starSpeeds[index][0] -= xAccel;
                starSpeeds[index][1] -= yAccel;
            }
        }

        starSpeeds[index][0] = Math.min(Math.max(starSpeeds[index][0], -maxSpeed), maxSpeed);
        starSpeeds[index][1] = Math.min(Math.max(starSpeeds[index][1], -maxSpeed), maxSpeed);

        index++;
    }
}, 10);
