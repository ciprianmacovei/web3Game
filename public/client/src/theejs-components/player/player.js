import { useState, useEffect } from 'react';
import { motion } from "framer-motion-3d";

export default function Player({ player, noKeyEvents }) {
  // This reference will give us direct access to the mesh
  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!noKeyEvents) {
      window.addEventListener('keydown', playerEventSubscriptionKeyDown);
      window.addEventListener('keyup', playerEventSubscriptionKeyUp);
    }

    return () => {
      if (!noKeyEvents) {
        window.removeEventListener('keydown', playerEventSubscriptionKeyDown);
        window.removeEventListener('keyup', playerEventSubscriptionKeyUp);
      }
    }
  }, []);


  const playerEventSubscriptionKeyDown = (ev) => {
    if (ev.code === "ArrowLeft") {
      player.move({ x: -0.02 });
      player.setPressedKeys({ left: true });
    }
    if (ev.code === "ArrowRight") {
      player.move({ x: +0.02 });
      player.setPressedKeys({ right: true });
    }
    if (ev.code === "ArrowUp") {
      player.move({ jump: true });
    }
    if (ev.code === "KeyA") {
      player.attackAction(true);
    }
  }
  const playerEventSubscriptionKeyUp = (ev) => {
    if (ev.code === "ArrowLeft") {
      player.velocity.x = 0;
      player.unsetPressedKeys({ left: true });
    }
    if (ev.code === "ArrowRight") {
      player.velocity.x = 0;
      player.unsetPressedKeys({ right: true });
    }
    if (ev.code === "ArrowUp") {
      player.unsetPressedKeys({ jump: true });
    }
    if (ev.code === "KeyA") {
      player.attackAction(false);
    }
  }

  return (
    <motion.group animate={true}>
      <mesh
        ref={player.playerMesh}
        scale={active ? 1.5 : 1}
        onClick={(event) => setActive(!active)}
        onPointerOver={(event) => setHover(true)}
        onPointerOut={(event) => setHover(false)}>
        <boxGeometry args={[player.width, player.height, 0]} />
        <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />

      </mesh>
      <mesh
        scale={0.2}
        ref={player.weaponMesh}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={'red'} />
      </mesh>
    </motion.group>
  )
}
