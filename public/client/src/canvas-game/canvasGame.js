import { Canvas } from '@react-three/fiber';
import { MotionConfig } from 'framer-motion';
import React from 'react';

import CanvasComponents from "./canvasComponentsGame";

export default function CanvasGame({ ws }) {

    // const game = new StartGame();

    // const map = new MapClass(platformArray);

    return (
        <React.Fragment>
            <Canvas gl2="true">
                <MotionConfig transition={{
                    type: "Spring",
                    duration: 0.7,
                    bounce: 0.2
                }}>
                   <CanvasComponents ws={ws}/>
                </MotionConfig>
            </Canvas>
        </React.Fragment>
    )
}
