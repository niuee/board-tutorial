
const canvas = document.querySelector("canvas") as HTMLCanvasElement;
const context = canvas.getContext("2d");

// timestamp 是 requestAnimationFrame 會帶進來的參數
function step(timestamp: number){
    if(!context){
        return;
    }
    context.reset(); // 這裏！
    context.translate(canvas.width / 2, canvas.height / 2); // 這裏！
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

window.requestAnimationFrame(step); // or step(0);
