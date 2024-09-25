import { Camera } from "./src/camera";
import { KeyboardMouseInput } from "./src/keyboardmouse-input";
import { TouchInput } from "./src/touch-input";

const canvas = document.querySelector("canvas") as HTMLCanvasElement;

canvas.addEventListener("pointerdown", (event)=>{
    const clicked = {x: event.clientX, y: event.clientY};
    const boundingBox = canvas.getBoundingClientRect();
    const topLeftCorner = {x: boundingBox.left, y: boundingBox.top};
    const viewPortCenter = {x: topLeftCorner.x + canvas.width / 2, y: topLeftCorner.y + canvas.height / 2};
    const clickedPointInViewPortSpace = {x: clicked.x - viewPortCenter.x, y: clicked.y - viewPortCenter.y};
    const clickedPointInWorldSpace = camera.transformViewPort2WorldSpace(clickedPointInViewPortSpace);

    console.log("clicked in view port", clickedPointInViewPortSpace);
    console.log("clicked in world", clickedPointInWorldSpace);
});


const context = canvas.getContext("2d");
const camera = new Camera();
const keyboardMouseInput = new KeyboardMouseInput(camera); // 加在這裡
const touchInput = new TouchInput(camera);

canvas.addEventListener("pointerdown", keyboardMouseInput.pointerdownHandler);
canvas.addEventListener("pointermove", keyboardMouseInput.pointermoveHandler);
canvas.addEventListener("pointerup", keyboardMouseInput.pointerupHandler);
canvas.addEventListener("pointerleave", keyboardMouseInput.pointerleaveHandler);
canvas.addEventListener("pointerdown", keyboardMouseInput.pointerdownHandler);
canvas.addEventListener("pointermove", keyboardMouseInput.pointermoveHandler);
canvas.addEventListener("pointerup", keyboardMouseInput.pointerupHandler);
window.addEventListener("keydown", keyboardMouseInput.keydownHandler);
window.addEventListener("keyup", keyboardMouseInput.keyupHandler);
canvas.addEventListener("wheel", keyboardMouseInput.wheelHandler);
canvas.addEventListener("touchstart", touchInput.touchstartHandler);
canvas.addEventListener("touchmove", touchInput.touchmoveHandler);
canvas.addEventListener("touchend", touchInput.touchendHandler);
canvas.addEventListener("touchcancel", touchInput.touchcancelHandler);



// timestamp 是 requestAnimationFrame 會帶進來的參數
function step(timestamp: number){
    if(!context){
        return;
    }
    context.reset(); // 這裏！
    context.translate(canvas.width / 2, canvas.height / 2); // 這裏！

    // 加在這裡
    context.scale(camera.zoomLevel, camera.zoomLevel);
    context.rotate(-camera.rotation);
    context.translate(-camera.position.x, -camera.position.y);

    context.beginPath(); // 要記得 beginPath 不然會都沒有東西！
    context.arc(0, 0, 50, 0, 2 * Math.PI);
    context.stroke();

    // 畫出 x 軸
    context.beginPath();
    context.moveTo(0, 0); // 移動畫筆到原點
    context.lineTo(250, 0); // 從 moveTo 的點開始畫直線到 lineTo 的點 (250 是因為 canvas 的寬度是 500 目前我們畫到 250 就可以涵蓋可是範圍內的 x 軸)
    context.strokeStyle = `rgba(220, 59, 59, 0.8)`; // 畫出的線是一點淡淡的紅色
    context.stroke();

    // 畫出 y 軸
    context.beginPath();
    context.moveTo(0, 0); // 移動畫筆到原點
    context.lineTo(0, 250); // 從 moveTo 的點開始畫直線到 lineTo 的點
    context.strokeStyle = `rgba(87, 173, 72, 0.8)`; // 畫出的線是一點淡淡的綠色
    context.stroke();

    window.requestAnimationFrame(step); // 要記得遞回呼叫 requestAnimationFrame 不然動畫就只會有第一幀。
}

// 可以把下面的註解解除掉，調整相機的位置、縮放倍率、以及旋轉角度去觀察相機對畫面產生的影響
// camera.setPosition({x: 100, y: 100});
// camera.setRotation(-45 * Math.PI / 180);
// camera.setZoomLevel(2);

window.requestAnimationFrame(step); // or step(0);
