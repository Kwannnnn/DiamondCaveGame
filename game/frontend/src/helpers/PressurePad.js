let pressurePad = [];
let spikeTraps = [];

export function setTraps(entries, spikes) {
    pressurePad = entries;
    spikeTraps = spikes;
}

export function handlePressureDoors(layer, players) {
    resetLinkedElements(layer, players);

    for (const player of players.values()) {
        const plate = triggeredPressurePlate({ x: player.x, y: player.y });
        if (plate != null) {
            const trap = getTrapForPlate(plate);
    
            if (trap.type === 1) {
                const doorTile = layer.getTileAtWorldXY(trap.door.x, trap.door.y, true);
                doorTile.index = 1;
            } else if (trap.type === 2) {
                for (const id of trap.spikes) {
                    const spikeTrap = findSpikeWithId(id);
                    if (spikeTrap) {
                        spikeTrap.disableTrap();
                    }
                }
            }
        }
    }
}


function findSpikeWithId(id) {
    return spikeTraps.find(st => st.trapId === id);
}

function resetLinkedElements(layer, players) {
    for (const trap of pressurePad) {
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

        if (trap.type === 1) {
            const door = trap.door;
            const doorTile = layer.getTileAtWorldXY(door.x, door.y, true);
            doorTile.index = 2;
        } else if (trap.type === 2) {
            for (const id of trap.spikes) {
                const spikeTrap = findSpikeWithId(id);

                if (spikeTrap && !spikeTrap.enabled) {
                    console.log(`Trap ${spikeTrap.trapId} was disabled and should be activated`);
                    spikeTrap.enableTrap();
                }                
            }
        }
    }
}

function triggeredPressurePlate(position) {
    for (const trap of pressurePad) {
        const plate = trap.plate;

        if (isSamePosition(plate, position)) {
            return plate;
        }
    }

    return null;
}

function getTrapForPlate(plate) {
    return pressurePad.find(t => isSamePosition(t.plate, plate));
}

function isSamePosition(pos1, pos2) {
    const pos1X = Math.floor(pos1.x / 32);
    const pos1Y = Math.floor(pos1.y / 32);

    const pos2X = Math.floor(pos2.x / 32);
    const pos2Y = Math.floor(pos2.y / 32);

    return pos1X === pos2X && pos1Y === pos2Y;
}