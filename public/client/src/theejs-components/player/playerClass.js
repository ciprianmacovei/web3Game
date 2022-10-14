import { GRAVITY, RUNNING_MOMENTUM } from '../../constants/constants';

export default class PlayerClass {

    socket;
    walletAddress;
    sendPlayerPosition;
    playerMesh;
    weaponMesh;
    gameAspect = [0, 0, 0];
    bottomGround;
    keysPressed = {
        leftPressed: false,
        rightPressed: false,
    };
    attackBoolean = false;

    constructor(playerMeshReference, weaponMeshReference, gameAspect, weaponType, ws, walletAddress, sendPlayerPosition) {
        this.width = 1;
        this.height = 1;

        this.velocity = {
            x: 0,
            y: 0.02
        };

        if (ws) {
            this.socket = ws;
        }

        if (walletAddress) {
            this.walletAddress = walletAddress;
        }

        if (sendPlayerPosition) {
            this.sendPlayerPosition = sendPlayerPosition;
        }

        this.playerMesh = playerMeshReference;
        this.weaponMesh = weaponMeshReference;
        this.bottomGround = Math.round((gameAspect[1] / 2 * -1 + this.height / 2) * 10) / 10;
        this.weaponType = weaponType;
    }

    move = ({ x, jump }) => {
        if (x) {
            if (this.velocity.x < 0.02) {
                this.velocity.x += RUNNING_MOMENTUM;
            }
            if (x > 0) {
                this.playerMesh.current.translateX(Number(x) + Number(this.velocity.x));
                this.sendWsState(Number(x) + Number(this.velocity.x), 0);

            } else {
                this.playerMesh.current.translateX(Number(x) - Number(this.velocity.x));
                this.sendWsState(Number(x) - Number(this.velocity.x), 0);
            }

        }
        if (jump) {
            this.playerMesh.current.translateY(2);
            this.sendWsState(0, 2);
        }
    }

    setPressedKeys = ({ left, right }) => {
        if (left) {
            this.keysPressed.leftPressed = true;
        }
        if (right) {
            this.keysPressed.rightPressed = true;
        }
    }

    unsetPressedKeys = ({ left, right }) => {
        if (left) {
            this.keysPressed.leftPressed = false;
        }
        if (right) {
            this.keysPressed.rightPressed = false;
        }
        this.velocity.x = 0;
    }

    attackAction = () => {
        const self = this;
        this.attackBoolean = true;
        this.sendWsState(0, 0, true);
        setTimeout(() => {
            self.attackBoolean = false;
            self.sendWsState(0, 0, false);
        }, 400);
    }

    update = () => {
        if (this.keysPressed.leftPressed) {
            this.move({ x: -0.02 });
        }
        if (this.keysPressed.rightPressed) {
            this.move({ x: +0.02 });
        }

        //GRAVITY
        if (
            this.playerMesh.current.position.y > this.bottomGround
        ) {
            this.playerMesh.current.position.y -= this.velocity.y;
            this.velocity.y += GRAVITY;
        } else {
            this.playerMesh.current.position.y = this.bottomGround;
            this.velocity.y = 0;
        }
        //GRAVITY


        //ATTACK
        if (this.attackBoolean) {
            this.weaponMesh.current.visible = true;
            if (this.keysPressed.rightPressed) {
                this.weaponMesh.current.position.x = this.playerMesh.current.position.x + 0.6;
            } else {
                this.weaponMesh.current.position.x = this.playerMesh.current.position.x - 0.6;
            }
            this.weaponMesh.current.position.y = this.playerMesh.current.position.y;
        } else {
            this.weaponMesh.current.visible = false;
        }
        //ATTACK
    }

    updatePositionOpponent = (poz, attackAction) => {
        if (poz[0] !== 0) {
            this.playerMesh.current.translateX(poz[0])
        }
        if (poz[1] !== 0) {
            this.playerMesh.current.translateY(poz[1])
        }
        if (attackAction === "true") {
            this.attackBoolean = true;
            // if (Number(poz[0]) > 0) {
            //     this.keysPressed.leftPressed = true;
            // } else if (Number(poz[0]) < 0) {
            //     this.keysPressed.rightPressed = true;
            // } else {
            //     this.keysPressed.rightPressed = false;
            //     this.keysPressed.leftPressed = false;
            // }
        }
        if (attackAction === "false") {
            this.attackBoolean = false;
            // this.keysPressed.rightPressed = false;
            // this.keysPressed.leftPressed = false;
        }
        console.log("opponent position ", poz, "keypress", this.keysPressed);

    }

    intersectObjects = (platform) => {
        if (
            this.playerMesh.current.position.y + this.velocity.y >= platform.position.y + platform.height &&
            this.playerMesh.current.position.y - (this.height / 2) + this.velocity.y <= platform.position.y + platform.height &&
            this.playerMesh.current.position.x >= platform.position.x - (platform.width / 2) &&
            this.playerMesh.current.position.x <= platform.position.x + (platform.width / 2)
        ) {
            this.playerMesh.current.position.y = platform.position.y + platform.height * 2;
            this.velocity.y = 0;
        }
    }

    sendWsState(Ox, Oy, attack) {
        if (this.socket && this.sendPlayerPosition) {
            this.socket.send(
                JSON.stringify(
                    {
                        position: [Ox, Oy],
                        type: "position",
                        walletAddress: this.walletAddress,
                        attackAction: attack
                    }
                )
            );
        }
    }
}
