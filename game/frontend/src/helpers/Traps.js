let traps = [];

export function setTraps(entries) {
    traps = entries;
}

export function handlePressureDoors(layer, players) {
    resetDoors(layer, players);

    for (const player of players.values()) {
        const plate = triggeredPressurePlate({ x: player.x, y: player.y });
        if (plate != null) {
            const trap = getTrapForPlate(plate);
    
            let doorTile = layer.getTileAtWorldXY(trap.door.x, trap.door.y, true);
            doorTile.index = 1;
        }
    }
}

function resetDoors(layer, players) {
    for (const trap of traps) {
        // Check if any players are on the plate
        const plate = trap.plate;

        let shouldSkip = false;
        for (const player of players.values()) {
            if (isSamePosition(plate, player)) {
                shouldSkip = true;    
            }
        }

        if (shouldSkip) {
            continue;
        }

        const door = trap.door;
        const doorTile = layer.getTileAtWorldXY(door.x, door.y, true);
        //doorTile.index = 2;
    }
}

function triggeredPressurePlate(position) {
    for (const trap of traps) {
        const plate = trap.plate;

        if (isSamePosition(plate, position)) {
            return plate;
        }
    }

    return null;
}

function getTrapForPlate(plate) {
    return traps.find(t => isSamePosition(t.plate, plate));
}

function isSamePosition(pos1, pos2) {
    const pos1X = Math.floor(pos1.x / 32);
    const pos1Y = Math.floor(pos1.y / 32);

    const pos2X = Math.floor(pos2.x / 32);
    const pos2Y = Math.floor(pos2.y / 32);

    return pos1X === pos2X && pos1Y === pos2Y;
}