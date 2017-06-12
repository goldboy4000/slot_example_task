define(['SOUNDJS', 'additional/EventManager'], function (SOUNDJS, eventManager) {

    /**
     *
     * @constructor
     */
    var SoundManager = function ()
    {
        this.reelSpinSoundID = 'ReelSpin';
        this.reelLandingSoundID = 'ReelLanding';

        this.reelSpinSoundIsReady = false;
        this.reelLandingSoundIsReady = false;

        this.reelSpinSound = {};

        this.init();
    };

    SoundManager.prototype =
        {
            /**
             * Inits sound manager
             */
            init: function ()
            {
                this.loadSounds();
                this.setupHandlers().subscribeHandlers();
            },

            /**
             * Setups handlers
             * @returns {SoundManager}
             */
            setupHandlers: function ()
            {
                this.spinButtonDownHandler = this.spinButtonDown.bind(this);
                this.reelsStoppedHandler = this.reelsStopped.bind(this);
                this.reelStoppedHandler = this.reelStopped.bind(this);

                createjs.Sound.on("fileload", this.loadCompleteHandler.bind(this));

                return this;
            },

            /**
             * Subscribes on events
             * @returns {SoundManager}
             */
            subscribeHandlers: function ()
            {
                eventManager.subscribe('spin_button_down', this.spinButtonDownHandler);
                eventManager.subscribe('reels_stopped', this.reelsStoppedHandler);
                eventManager.subscribe('reel_spin_end', this.reelStoppedHandler);

                return this;
            },

            /**
             * Loads sounds
             * @returns {SoundManager}
             */
            loadSounds: function ()
            {
                createjs.Sound.registerSound({src:"resources/sounds/Reel_Spin.mp3", id: this.reelSpinSoundID});
                createjs.Sound.registerSound({src:"resources/sounds/Landing_1.mp3", id: this.reelLandingSoundID});

                return this;
            },

            /**
             * Plays "Reel spin" sound
             */
            playReelSpinSound: function ()
            {
                if (this.reelSpinSoundIsReady)
                {
                    this.reelSpinSound = createjs.Sound.play(this.reelSpinSoundID);
                }
            },

            /**
             * Stops playing "Reel spin" sound
             */
            stopReelSpinSound: function ()
            {
                this.reelSpinSound.stop();
            },

            /**
             * Plays "Landing" sound
             */
            playLanding: function ()
            {
                if (this.reelLandingSoundIsReady)
                {
                    createjs.Sound.play(this.reelLandingSoundID);
                }
            },

            /**
             * Handler of sound loading
             * @param e
             */
            loadCompleteHandler: function (e)
            {
                if (e.id === 'ReelSpin')
                {
                    this.reelSpinSoundIsReady = true;
                }

                if (e.id === 'ReelLanding')
                {
                    this.reelLandingSoundIsReady = true;
                }
            },

            /**
             * Handler of spin button click event
             */
            spinButtonDown: function ()
            {
                this.playReelSpinSound();
            },

            /**
             * Handler of all reels stopped event
             */
            reelsStopped: function ()
            {
                this.stopReelSpinSound();
            },

            /**
             * Hndlers of every reel stopped event
             */
            reelStopped: function ()
            {
                this.playLanding();
            }
        };

    return SoundManager;
});