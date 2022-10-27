import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useAspect } from '@react-three/drei';

import { WEAPON_TYPE_SWORD } from '../constants/constants';

import Background from '../theejs-components/background/background';
import Platform from "../theejs-components/platform/platform";
import Player from "../theejs-components/player/player";

import PlayerClass from '../theejs-components/player/playerClass';
import PlatformClass from '../theejs-components/platform/platformClass';
import MapClass from '../theejs-components/map/mapClass';
import { userStore } from '../store/store';


export default function CanvasComponents({ ws }) {

    const user = userStore()
    const gameAspect = useAspect(window.innerWidth, window.innerHeight, 1);
    const playerSwordRef = useRef();
    const playerRef = useRef();
    const player = new PlayerClass(playerRef, playerSwordRef, gameAspect, WEAPON_TYPE_SWORD, ws, user.walletAddress, true);
    const playerOpRef = useRef();
    const playerSwordOpRef = useRef();
    const playerOp = new PlayerClass(playerOpRef, playerSwordOpRef, gameAspect, WEAPON_TYPE_SWORD);

    const platformArray = [new PlatformClass({ x: -2, y: -1 })]
    // const map = new MapClass(platformArray);

    useEffect(() => {
        ws.addEventListener("message", receiveMessageGame);
        return () => {
            ws.removeEventListener("message", receiveMessageGame);
        }
    }, []);

    useFrame(() => {
        player.update();
        playerOp.update();
        // platformArray.forEach((platform) => intersectObj(platform));
    });

    // const intersectObj = (platform) => {
    //     playerOp.intersectObjects(platform);
    //     player.intersectObjects(platform)
    // }

    const receiveMessageGame = (data) => {
        const playerJSON = JSON.parse(data.data);
        if (playerJSON.position) {
            if (playerJSON.walletAddress !== user.walletAddress) {
                playerOp.updatePositionOpponent([...playerJSON.position], playerJSON.attackAction, playerJSON.keysPressed);
            }
        }
    }

    return (
        <React.Fragment>
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <Platform position={[0, 0]} platformArray={platformArray} gameAspect={gameAspect} />
            <Background position={[0, 0, -0.0001]} gameAspect={gameAspect} />
            <Player position={[-2, 0]} player={player} gameAspect={gameAspect} />
            <Player position={[-1, -1]} player={playerOp} gameAspect={gameAspect} noKeyEvents={true}/>
        </React.Fragment>
    )
}
