import { GRAVITY, RUNNING_MOMENTUM } from '../../constants/constants';

export default class PlayerClass {

    //PLAYER ACTIONS
    position = {
        Ox: 0,
        Oy: 0,
    };
    keysPressed = {
        leftPressed: false,
        rightPressed: false,
    };
    attackBoolean = false;

    //PLAYER DETAILS
    socket;
    walletAddress;

    //PLAYER PHYSICS
    playerMesh;
    weaponMesh;
    gameAspect = [0, 0, 0];
    bottomGround;
    sendPlayerPosition;

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
                this.position.Ox = Number(x) + Number(this.velocity.x);

            } else {
                this.playerMesh.current.translateX(Number(x) - Number(this.velocity.x));
                this.position.Ox = Number(x) - Number(this.velocity.x);
            }
        }
        if (jump) {
            this.position.Oy = 2;
            this.playerMesh.current.translateY(2);
        }
        this.sendWsState();
    }

    setPressedKeys = ({ left, right }) => {
        if (left) {
            this.keysPressed.leftPressed = true;
        }
        if (right) {
            this.keysPressed.rightPressed = true;
        }
        this.sendWsState()
    }

    unsetPressedKeys = ({ left, right, jump }) => {
        if (left) {
            this.keysPressed.leftPressed = false;
            this.position.Ox = 0;
        }
        if (right) {
            this.keysPressed.rightPressed = false;
            this.position.Ox = 0;
        }
        if (jump) {
            this.position.Oy = 0;
        }
        this.velocity.x = 0;
        this.sendWsState();
    }

    attackAction = (bool) => {
        this.attackBoolean = bool;
        this.sendWsState();
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

    updatePositionOpponent = (poz, attackAction, keypress) => {
        if (poz[0] !== 0) {
            this.playerMesh.current.translateX(poz[0]);
        }
        if (poz[1] !== 0) {
            this.playerMesh.current.translateY(poz[1]);
        }
        if (keypress) {
            this.keysPressed = {
                ...keypress
            };
        }
        if (attackAction === true) {
            this.attackBoolean = true;
        }
        if (attackAction === false) {
            this.attackBoolean = false;
        }

        console.log("opponent position ", poz, "keypress", keypress, attackAction);

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

    sendWsState() {
        if (this.socket && this.sendPlayerPosition) {
            this.socket.send(
                JSON.stringify(
                    {
                        position: [this.position.Ox, this.position.Oy],
                        keysPressed: this.keysPressed,
                        type: "position",
                        walletAddress: this.walletAddress,
                        attackAction: this.attackBoolean
                    }
                )
            );
        }
    }
}
