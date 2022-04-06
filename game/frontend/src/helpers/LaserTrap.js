export function withinBeam(player, laserTrap) {
    const [startX, endX] = [laserTrap.x, laserTrap.x + calculateBeamLengthX(laserTrap.direction, laserTrap.range)];
    const [startY, endY] = [laserTrap.y, laserTrap.y + calculateBeamLengthY(laserTrap.direction, laserTrap.range)];

    let withinX;
    if (startX < endX) {
        withinX = player.x >= startX && player.x <= endX;
    } else if (startX > endX) {
        withinX = player.x >= endX && player.x <= startX;
    }

    let withinY;
    if (startY < endY) {
        withinY = player.y >= startY && player.y <= endY;
    } else if (startX > endX) {
        withinY = player.y >= endY && player.y <= startY;
    }

    return withinX && withinY;
}

export function isLaserTrapTile(index) {
    return index == 3 || index == 7 || index == 8 || index == 9;
}

function calculateBeamLengthX(direction, range) {
    switch (direction) {
        case 0:
        case 2:
            return 0;
        case 1:
            return range * 32;
        case 3:
            return -range * 32;
    }
}

function calculateBeamLengthY(direction, range) {
    switch (direction) {
        case 0:
            return -range * 32;
        case 1:
        case 3:
            return 0;
        case 2:
            return range * 32;        
    }
}
