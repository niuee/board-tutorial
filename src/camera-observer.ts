import { Point } from "./vector";

export type CameraState = {
    position: Point;
    zoomLevel: number;
    rotation: number;
}

export type PanEvent = {
    origin: Point;
    destination: Point;
}

export type ZoomEvent = {
    origin: number;
    destination: number;
}

export type RotateEvent = {
    origin: number;
    destination: number;
}

export type CameraEvent = {
    "pan": PanEvent;
    "zoom": ZoomEvent;
    "rotate": RotateEvent;
} 

export type CallBackList<K extends keyof CameraEvent> = ((event: CameraEvent[K], cameraState: CameraState)=>void)[];

export type Unsubscribe = () => void;

class CameraObserver {
    private panCallBacks: CallBackList<"pan">;
    private zoomCallBacks: CallBackList<"zoom">;
    private rotateCallBacks: CallBackList<"rotate">;

    constructor(){
        this.panCallBacks = [];
        this.zoomCallBacks = [];
        this.rotateCallBacks = [];
    }

    notifyPan(origin: Point, destination: Point, cameraState: CameraState){
        this.panCallBacks.forEach((panCallBack)=>{
            queueMicrotask(()=>{panCallBack({origin, destination}, cameraState)});
        });
    }

    notifyZoom(origin: number, destination: number, cameraState: CameraState){
        this.zoomCallBacks.forEach((zoomCallBack)=>{
            queueMicrotask(()=>{zoomCallBack({origin, destination}, cameraState);});
        });
    }

    notifyRotate(origin: number, destination: number, cameraState: CameraState){
        this.rotateCallBacks.forEach((rotateCallBack)=>{
            queueMicrotask(()=>{rotateCallBack({origin, destination}, cameraState)});
        });
    }

    on<K extends keyof CameraEvent>(eventName: K, callback: (event: CameraEvent[K], cameraState: CameraState)=>void): Unsubscribe {
        switch (eventName){
        case "pan":
            this.panCallBacks.push(callback as (event: CameraEvent["pan"], cameraState: CameraState)=>void);
            return ()=>{this.panCallBacks = this.panCallBacks.filter((cb) => cb !== callback)};
        case "zoom":
            this.zoomCallBacks.push(callback as (event: CameraEvent["zoom"], cameraState: CameraState)=>void);
            return ()=>{this.zoomCallBacks = this.zoomCallBacks.filter((cb) => cb !== callback)};
        case "rotate":
            this.rotateCallBacks.push(callback as (event: CameraEvent["rotate"], cameraState: CameraState)=>void);
            return ()=>{this.rotateCallBacks = this.rotateCallBacks.filter((cb) => cb !== callback)};
        }
        return ()=>{};
    }
}

export { CameraObserver };
