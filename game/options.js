function initOptions(){
    //Constants
    GRV = {
        zero: 0,
        wisp: 0.00004,
        micro: 0.0001,
        low:0.0004,
        moon:0.0007,
        normal:0.0014,
        earth:0.0016,
        heavy:0.0018,
        lead:0.0024
    }
    colors = {
        white: '0xFFFFFF',
        black: '0x000000',
        red: '0xFE2506',
        orange: '0xFE9208',
        ltOrange: '0xFED59B',
        yellow: '0xFFC102',
        green: '0x009E2E',
        teal: '0xC8FDFE',
        blue: '0x268ECB',
        deepBlue: '0x114FFF',
        dkBlue: '0x14546f',
        indigo: '0x2F2F66',
        purple: '0x6B54A2'
    };

    brushColors = {
        yellow: '0xFFC102',
        orange: '0xFF9900',
        ltOrange: '0xFFCC99',

        red: '0xFF0000',
        pink: '0xFF00CC',
        mauve: '0xCC0066',

        blue: '0x00CCFF',
        dkBlue: '0x0000FF',
        purple: '0x6600CC',

        green: '0x33FF00',
        teal: '0x00CC99',
        dkGreen: '0x009933'
    }

    //Setup
    cursors = [];
    brushes = [];
    entities = [];
    numPlanets = 124; // 160 is about max with decent performance
    paused = false;
    useWind = false; // Applies controller delta (scaled) as a force to all entities
    drawRadial = false; // Adds radial symmetry to particle systems
    drawMode = false; // Draws pixi sprites
    kinectMap = false; // Map or project input onto screen
    useParallax = false; // Set up parallax scrolling background
    runSim = false; // Run physics sim on entities
    lightBodyCreated = false; // Has a user been spawned yet?
    lightBodyVisible = false; // Is the user visible?
    lightBody = null; // Main user (skeleton tracking);
    cells = []; // Array of cellphone users
    motes = []; // Array of energy particles
    frame = 0;

    restrictedColors = ['deepBlue','orange','ltOrange','yellow'];
    entityColors = [colors.ltOrange];// Rain [colors.blue,colors.dkBlue,colors.white];
    entitySprite = null;
    entitySize = {
        max: 28,
        min: 6
    }

    gravityStrength = GRV.zero;

    prevLML = prevLMR = null;

    //Load textures into cache for later use
    mountain1tex = PIXI.Texture.fromImage('/assets/backgrounds/mountain1.png');
    mountain2tex = PIXI.Texture.fromImage('/assets/backgrounds/mountain2.png');
    skytex = PIXI.Texture.fromImage('/assets/backgrounds/sky.png');

    PIXI.Texture.fromImage('/assets/leaves/leaf_01.png');
    PIXI.Texture.fromImage('/assets/leaves/leaf_02.png');
    PIXI.Texture.fromImage('/assets/leaves/leaf_03.png');
    PIXI.Texture.fromImage('/assets/leaves/leaf_04.png');
    PIXI.Texture.fromImage('/assets/leaves/leaf_05.png');
    PIXI.Texture.fromImage('/assets/leaves/leaf_06.png');

    PIXI.Texture.fromImage('/assets/watercolor/1.png');
    PIXI.Texture.fromImage('/assets/watercolor/2.png');
    PIXI.Texture.fromImage('/assets/watercolor/3.png');
    PIXI.Texture.fromImage('/assets/watercolor/4.png');
    PIXI.Texture.fromImage('/assets/sprites/planet.png');
    PIXI.Texture.fromImage('/assets/sprites/sphereMd.png');
    PIXI.Texture.fromImage('/assets/sprites/sphereDk.png');
    PIXI.Texture.fromImage('/assets/sprites/wispLt.png');
    PIXI.Texture.fromImage('/assets/sprites/bubbleLt.png');
    PIXI.Texture.fromImage('/assets/sprites/bubbleMd.png');
    PIXI.Texture.fromImage('/assets/sprites/bubbleDk.png');
    PIXI.Texture.fromImage('/assets/sprites/wisp.png');
}