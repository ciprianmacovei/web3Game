
export default class PlatformClass {

    width = 3;
    height = 0.3;
    position = {
        x: 0,
        y: 0,
    };

    constructor({x, y}) {
        this.position.x = x;
        this.position.y = y;
    }

}
