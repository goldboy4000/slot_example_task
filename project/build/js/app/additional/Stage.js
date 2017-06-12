define(['PIXI', 'additional/EventManager', 'additional/SpinButton', 'additional/ReelsContainer'], function (PIXI, eventManager, SpinButton, ReelsContainer) {

    var Stage = function ()
    {
        this.scene = {};
        this.reels = {};

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
                this.spinButtonDownHandler = this.spinButtonDown.bind(this);
                this.reelsStoppedHandler = this.reelsStopped.bind(this);

                return this;
            },

            /**
             * Subscribes on events
             * @returns {Stage}
             */
            subscribeHandlers: function ()
            {
                eventManager.subscribe('config_loaded', this.configLoadedHandler);
                eventManager.subscribe('spin_button_down', this.spinButtonDownHandler);
                eventManager.subscribe('reels_stopped', this.reelsStoppedHandler);

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
                var foreground = this.createForeground(config.foreground);
                var slotAreaMask = this.createSlotAreaMask(config.mask);
                var spinButton = new SpinButton(config.spinButton);
                this.reels = new ReelsContainer(config.reels);

                this.scene.stage.addChild(background);
                this.scene.stage.addChild(slotAreaMask);
                this.scene.stage.addChild(this.reels.getInstance());
                this.scene.stage.addChild(foreground);
                this.scene.stage.addChild(spinButton);

                background.mask = slotAreaMask;
                this.reels.getInstance().mask = slotAreaMask;
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
            },

            /**
             * Spin button was clicked
             */
            spinButtonDown: function ()
            {
                this.scene.ticker.add(this.spin, this);
            },

            /**
             * Handler of reels stop event
             */
            reelsStopped: function ()
            {
                this.endSpin();
            },

            /**
             * Remove update from ticker
             */
            endSpin: function ()
            {
                this.scene.ticker.remove(this.spin, this);
            },

            /**
             *
             */
            spin: function ()
            {
                this.reels.update();
            }

        };

    return Stage;

});