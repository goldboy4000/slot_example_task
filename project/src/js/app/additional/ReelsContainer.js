define(['PIXI', 'additional/EventManager', 'additional/Reel'], function (PIXI, eventManager, Reel)
{
    /**
     * Container of reels
     * @param config
     * @returns {*}
     * @constructor
     */
    var ReelsContainer = function (config)
    {
        this.config = config;
        this.container = new PIXI.Container();

        this.reels =[];
        this.reelsToUpdate = [];
        this.symbolSequences = [];

        this.namesOfSymbols = config.namesOfSymbols;
        this.symbolTextures = [];

        this.lastReelToUpdate = 0;

        this.init();

        // return this.container;
    };

    ReelsContainer.prototype =
        {

        /**
         * Inits reels container
         */
        init: function ()
        {
            this.setupHandlers().subscribeHandlers();

            this.setPosition();
            this.loadReelSymbols();
            this.setupReels();
        },

        getInstance: function ()
        {
            return this.container;
        },

        /**
         * Setups handlers
         * @returns {ReelsContainer}
         */
        setupHandlers: function()
        {
            this.reelRotatingHandler = this.reelRotating.bind(this);
            this.reelStoppedHandler = this.reelStopped.bind(this);

            return this;
        },

        /**
         * Subscribes on events
         */
        subscribeHandlers: function ()
        {
            eventManager.subscribe('reel_spin_rotating', this.reelRotatingHandler);
            eventManager.subscribe('reel_spin_end', this.reelStoppedHandler);
        },

        /**
         * Sets position of button
         */
        setPosition: function ()
        {
            this.container.x = this.config.position.x;
            this.container.y = this.config.position.y;
        },

        /**
         * Setups reels
         */
        setupReels: function ()
        {
            this.symbolSequences = this.config.symbolSequences;

            this.symbolSequences.map(function(sequence, index)
            {
                var reelConfig = {
                    sequence: sequence,
                    position: {
                        x: index * this.config.horizontalReelsSpacing
                    },
                    options: this.config.reel
                };

                var reel = new Reel(reelConfig, this.symbolTextures);

                this.reels.push(reel);
                this.container.addChild(reel.getInstance());

            }.bind(this));

            this.reelsToUpdate.push(this.reels[this.getLastReelToUpdate()]);
        },

        /**
         *  Loads textures of symbols
         */
        loadReelSymbols: function ()
        {
            this.namesOfSymbols.map(function(name)
            {
                var textureSymbol = PIXI.Texture.fromImage(this.config.symbolImagesPath + name + '.' + this.config.extOfSymbols);
                this.symbolTextures.push(textureSymbol);
            }.bind(this));
        },

        /**
         *
         * @returns {number}
         */
        getLastReelToUpdate: function ()
        {
            return this.lastReelToUpdate++;
        },

        /**
         * Handler of reel change phase to rolling event
         */
        reelRotating: function ()
        {
            if (this.lastReelToUpdate < this.reels.length)
            {
                this.reelsToUpdate.push(this.reels[this.getLastReelToUpdate()]);
            }
        },

        /**
         * Handler of reel stop event
         */
        reelStopped: function ()
        {
            this.reelsToUpdate.shift();
            if (!this.reelsToUpdate.length)
            {
                eventManager.dispatch('reels_stopped');
                this.lastReelToUpdate = 0;
                this.reelsToUpdate.push(this.reels[this.getLastReelToUpdate()]);
            }
        },

        /**
         *
         */
        update: function ()
        {
            if (this.reelsToUpdate.length)
            {
                this.reelsToUpdate.map(function (reel)
                {
                    reel.update();
                });
            }
        }
    };

    return ReelsContainer;
});