import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';

import { BOTTOM_LINE_GRAVITY } from '../../constants/constants';

import PlatformClass from './platformClass';

export default function Platform({platformArray}) {
    // This reference will give us direct access to the mesh
    // Set up state for the hovered and active state

    useEffect(() => {
        return () => {
        }
    }, []);

    useFrame(() => {
    })

    return (
        <React.Fragment>
            {platformArray.length > 0 &&
                platformArray.map((platform, index) => (
                    <mesh
                        key={index + "platform"}
                        position={[platform.position.x, platform.position.y, 0]}>
                        <boxGeometry args={[platform.width, platform.height, 0]}/>
                        <meshStandardMaterial color={'blue'} />
                    </mesh>
                ))

            }
        </React.Fragment>

    )
}
