let CONST = {
    WIDTH_SIZE: 475.875,
    HEIGHT_SIZE: 846,

    BASKET: {
        DEPTH: 14,
        NET: {
            POSX: 0,
            POSY: 0,
            SCALE: 0.3,
        },
        RIM1: {
            POSX: 0,
            POSY: -25,
            SCALE: 0.3,
        },
        RIM2: {
            SIZEX: 375,
            SIZEY: 325,
            SCALE: 0.3,
            DEPTH: 2,
        },
        TOPLEFTCOLLIDER: {
            POSX: 50,
            POSY: -30,
            SIZEX: 10,
            SIZEY: 10,
        },
        TOPRIGHTCOLLIDER: {
            POSX: -50,
            POSY: -30,
            SIZEX: 10,
            SIZEY: 10,
        },
        CENTERCOLLIDER: {
            POSX: 0,
            POSY: 5,
            SIZEX: 30,
            SIZEY: 30,
        },
        CENTERCONTAINER: {
            POSX: 0,
            POSY: -10,
        },
        GENERALCOLLIDER: {
            SIZEX: 10,
            SIZEY: 10,
            BOUNCE: 0.5,
        },
        HITAREA: {
            POSX: -100,
            POSY: -100,
            WIDTH: 200,
            HEIGHT: 300,
        },
        ANGLE: {
            SHOOTDEGREE: 270,
        },
    },
    MOVABLEBASKET: {
        SPEED: 100,
        MAXDISTANCE: 100,
        MINDISTANCE: 100,
    },
    OBSTACLE: {
        DEPTH: 5,
        BOUNCE: 0.5,
        VERTICALANGLE: 90,
    },
    MOVABLEOBSTACLE: {
        SPEED: 100,
        MINDISTANCE: 100,
        MAXDISTANCE: 100,
    },

    BALL: {
        FORCEAMOUNT: 1200,
        ROTATIONSPEED: 15,
        DEPTH: 12,
        SCALE: 0.2,
    },
}

export default CONST
