export default class MapClass {

    width = 12;
    position = {
        x: -6,
        y: 0,
    }
    platformArray;

    constructor(arrayOfPlatforms) {
        this.platformArray = arrayOfPlatforms;
    }

    updateMap = (keyPress) => {
        if (keyPress.leftPressed) {
            this.platformArray = this.platformArray.map((platform) => {platform.position.x -= 0.02; return platform});
        } else if (keyPress.rightPressed) {
            this.platformArray = this.platformArray.map((platform) => {platform.position.x += 0.02; return platform});
        }
    }

}
