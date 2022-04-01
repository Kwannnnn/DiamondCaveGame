module.exports = {
    'tileMap': [

    ],
    'gems': [{
        'gemId': 1,
        'x': 400, // gem spawn x position
        'y': 144 // gem spawn y position
    }, {
        'gemId': 2,
        'x': 752, // gem spawn x position
        'y': 304 // gem spawn y position
    }, {
        'gemId': 3,
        'x': 144, // gem spawn x position
        'y': 336 // gem spawn y position
    }, {
        'gemId': 4,
        'x': 656, // gem spawn x position
        'y': 432 // gem spawn y position
    }, {
        'gemId': 5,
        'x': 272, // gem spawn x position
        'y': 528 // gem spawn y position
    }],
    'exit': {
        x: 624,
        y: 624
    },
    'players': [{
        'x': 112,
        'y': 80,
        'orientation': 0
    }, {
        'x': 1276,
        'y': 80,
        'orientation': 0
    }],
    'pressurePlateTraps': [
        {
            'trapId': 0,
            'type': 2,
            'plate': {
                'x': 1276,
                'y': 208
            },
            'spikes': [
                0,
                1,
                2,
                3,
                8
            ]
        }, {
            'trapId': 0,
            'type': 2,
            'plate': {
                'x': 400,
                'y': 400
            },
            'spikes': [
                4,
                5,
                6,
                7,
            ]
        }
    ],
    'enemies': [{
        'enemyId': 1,
        'start': {
            'x': 464,
            'y': 144,
        },
        'path': [{
            'x': 528,
            'y': 144,
        },
        {
            'x': 528,
            'y': 240,
        },
        {
            'x': 464,
            'y': 240,
        },
        {
            'x': 528,
            'y': 144,
        }],
    },
    {
        'enemyId': 2,
        'start': {
            'x': 528,
            'y': 240,
        },
        'path': [{
            'x': 464,
            'y': 240,
        },
        {
            'x': 464,
            'y': 144,
        },
        {
            'x': 528,
            'y': 144,
        },
        {
            'x': 528,
            'y': 240,
        }],
    },
    {
        'enemyId': 3,
        'start': {
            'x': 688,
            'y': 368,
        },
        'path': [{
            'x': 688,
            'y': 240,
        },
        {
            'x': 816,
            'y': 240,
        },
        {
            'x': 816,
            'y': 368,
        },
        {
            'x': 688,
            'y': 368,
        }],
    },
    {
        'enemyId': 4,
        'start': {
            'x': 816,
            'y': 240,
        },
        'path': [{
            'x': 816,
            'y': 368,
        },
        {
            'x': 688,
            'y': 368,
        },
        {
            'x': 688,
            'y': 240,
        },
        {
            'x': 816,
            'y': 240,
        }],
    }],
};