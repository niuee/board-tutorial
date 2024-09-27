import { Point, vectorSubtraction } from "./vector";
import { Camera } from "./camera";

class KeyboardMouseInput {

    private isPanning: boolean;
    private panStartPoint: Point;
    private camera: Camera;

    private spacebarPressed: boolean;


    constructor(camera: Camera){
        this.isPanning = false;
        this.spacebarPressed = false;
        this.panStartPoint = {x: 0, y: 0};
        this.camera = camera;
        this.pointerdownHandler = this.pointerdownHandler.bind(this);
        this.pointermoveHandler = this.pointermoveHandler.bind(this);
        this.pointerupHandler = this.pointerupHandler.bind(this);
        this.pointerleaveHandler = this.pointerleaveHandler.bind(this);
        this.keydownHandler = this.keydownHandler.bind(this); // 新增的兩個 listener
        this.keyupHandler = this.keyupHandler.bind(this); // 新增的兩個 listener
        this.wheelHandler = this.wheelHandler.bind(this);
    }

    pointerdownHandler(event: PointerEvent): void {
        if(event.pointerType !== "mouse"){
            return;
        }
        if(event.button !== 0 && event.button!== 1){
            return;
        }
        if(event.button === 0 && !this.spacebarPressed){
            return;
        }
        this.isPanning = true;
        this.panStartPoint = {x: event.clientX, y: event.clientY};
    }

    pointermoveHandler(event: PointerEvent): void {
        if(!this.isPanning){
            return;
        }

        const curPosition = {x: event.clientX, y: event.clientY};
        const diff = vectorSubtraction(this.panStartPoint, curPosition);
        const diffInWorld = this.camera.transformVector2WorldSpace(diff);

        this.camera.setPositionBy(diffInWorld);

        this.panStartPoint = {x: event.clientX, y: event.clientY};

    }

    pointerupHandler(event: PointerEvent): void {
        if(!this.isPanning){
            return;
        }
        if(event.pointerType !== "mouse"){
            return;
        }
        if(event.button !== 1 && event.button !== 0){
            return;
        }
        if(event.button === 0 && !this.spacebarPressed){
            return;
        }
        this.isPanning = false;
    }

    pointerleaveHandler(event: PointerEvent){
        this.isPanning = false;
    }

    keydownHandler(event: KeyboardEvent){
        if(event.key === " "){
            this.spacebarPressed = true;
        }
    }

    keyupHandler(event: KeyboardEvent){
        if(event.key === " "){
            this.spacebarPressed = false;
            this.isPanning = false; // 因為空白鍵是平移模式的必要條件，所以我們可以直接跳脫平移模式；不過這樣就會造成如果我們是按滑鼠滾輪與空白鍵進入平移模式的，如果我們把空白鍵放開，平移模式就會取消，就算滑鼠滾輪還是按著的，這邊就跟 figma 不太一樣，大家可以自己調整自己想要的邏輯！
        }
    }

    wheelHandler(event: WheelEvent){
        event.preventDefault();
        if(event.ctrlKey){
            // 縮放操作
            const deltaZoomLevel = -event.deltaY * this.camera.zoomLevel * 0.025;
            this.camera.setZoomLevelBy(deltaZoomLevel);
        } else {
            // 平移操作
            const diff = {x: event.deltaX, y: event.deltaY};
            const diffInWorld = this.camera.transformVector2WorldSpace(diff);
            this.camera.setPositionBy(diffInWorld);
        }
    }
}

export { KeyboardMouseInput };
