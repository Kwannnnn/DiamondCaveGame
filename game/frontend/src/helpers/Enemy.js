export function determineVelocity(position, target) {
    const speed = 16; // This is movement in pixels
    const { x, y } = position;

    let velocityX = 0;
    let velocityY = 0;

    if (x < target.x) {
        velocityX = speed;
    } else if (x > target.x) {
        velocityX = -speed;
    }


    if (y < target.y) {
        velocityY = speed;
    } else if (y > target.y) {
        velocityY = -speed;
    }

    return {
        'velocityX': velocityX,
        'velocityY': velocityY
    };
}

export function isAtOrPastTarget(position, target, velocity) {
    const { x, y } = position;

    const hasReachedX = velocity.x > 0 ? target.x - x <= 0 : target.x - x >= 0;
    const hasReachedY = velocity.y > 0 ? target.y - y <= 0 : target.y - y >= 0;

    return hasReachedX && hasReachedY;
}