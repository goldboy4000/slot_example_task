define(['PIXI', 'additional/EventManager', 'additional/SpinButton'], function (PIXI, eventManager, SpinButton) {

    var Stage = function ()
    {
        this.scene = {};

        this.init();
    };

    Stage.prototype =
        {
            /**
             * Inits stage
             */
            init: function ()
            {
                this.setupHandlers().subscribeHandlers();
            },

            /**
             * Setups handlers
             * @returns {Stage}
             */
            setupHandlers: function ()
            {
                this.configLoadedHandler = this.configLoaded.bind(this);

                return this;
            },

            /**
             * Subscribes on events
             * @returns {Stage}
             */
            subscribeHandlers: function ()
            {
                eventManager.subscribe('config_loaded', this.configLoadedHandler);

                return this;
            },

            /**
             * Handler of "config loaded" event
             * @param config
             */
            configLoaded: function (config)
            {
                this.fillScene(config)
            },

            /**
             * Fills the scene
             * @param config
             */
            fillScene: function (config)
            {
                this.scene = this.createScene(config.application);
                document.body.appendChild(this.scene.view);

                var background = this.createBackground(config.background);
                this.scene.stage.addChild(background);

                var foreground = this.createForeground(config.foreground);
                this.scene.stage.addChild(foreground);

                var slotAreaMask = this.createSlotAreaMask(config.mask);
                this.scene.stage.addChild(slotAreaMask);

                background.mask = slotAreaMask;

                var spinButton = new SpinButton(config.spinButton);
                this.scene.stage.addChild(spinButton);

                // var reels = [];

            },

            /**
             * Creates scene
             * @param config
             */
            createScene: function (config)
            {
                return new PIXI.Application(config.width, config.height, {backgroundColor : config.color});
            },

            /**
             * Creates background for slot
             * @param config
             */
            createBackground: function (config)
            {
                var backgroundTexture = PIXI.Texture.fromImage(config.tile);
                var background = new PIXI.extras.TilingSprite(
                    backgroundTexture,
                    this.scene.renderer.width,
                    this.scene.renderer.height
                );

                return background;
            },

            /**
             * Creates foreground for slot
             * @param config
             * @returns {PIXI.Texture|PIXI.Sprite|PIXI.BaseTexture|PIXI.extras.TilingSprite}
             */
            createForeground: function (config)
            {
                return PIXI.Sprite.fromImage(config.img);
            },

            /**
             * Creates mask for slot area
             * @param config
             * @returns {PIXI.Texture|PIXI.Sprite|PIXI.BaseTexture|PIXI.extras.TilingSprite}
             */
            createSlotAreaMask: function (config)
            {
                var slotAreaMask = PIXI.Sprite.fromImage(config.img);
                slotAreaMask.x = config.position.x;
                slotAreaMask.y = config.position.y;

                return slotAreaMask;
            }
        };

    return Stage;

});