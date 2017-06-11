define(['PIXI', 'additional/EventManager'], function (PIXI, eventManager) {

    /**
     * Spin button for slot
     * @param config
     * @constructor
     */
    var SpinButton = function (config)
    {
        this.config = config;

        var normalSkin = PIXI.Texture.fromImage(config.skins.normal);
        var downSkin = PIXI.Texture.fromImage(config.skins.down);
        var overSkin = PIXI.Texture.fromImage(config.skins.over);
        var disabledSkin = PIXI.Texture.fromImage(config.skins.disabled);

        this.skin = {
            normal: normalSkin,
            down: downSkin,
            over: overSkin,
            disabled: disabledSkin
        };

        this.sprite = new PIXI.Sprite(this.skin.normal);

        this.init();

        return this.sprite;
    };

    SpinButton.prototype =
        {
            /**
             * Inits button
             */
            init: function ()
            {
                this.sprite.buttonMode = true;
                this.sprite.interactive = true;

                this.setPosition();

                this.setupHandlers();
            },

            setupHandlers: function ()
            {
                this.sprite
                    .on('pointerdown', this.onButtonDown.bind(this))
                    .on('pointerup', this.onButtonUp.bind(this))
                    .on('pointerupoutside',this.onButtonUp.bind(this))
                    .on('pointerover', this.onButtonOver.bind(this))
                    .on('pointerout', this.onButtonOut.bind(this));
            },

            /**
             * Sets position of button
             */
            setPosition:function ()
            {
                this.sprite.x = this.config.position.x;
                this.sprite.y = this.config.position.y;
            },

            /**
             * Changes skin for button
             * @param skin
             */
            changeSkin: function (skin)
            {
                this.sprite.texture = skin;
            },

            /**
             * Handler of "pointer down" event
             */
            onButtonDown: function ()
            {
                this.isDown = true;
                this.changeSkin(this.skin.down);
                this.alpha = 1;

                eventManager.dispatch('spin_button_down');
            },

            /**
             * Handler of "pointer up" event
             */
            onButtonUp: function ()
            {
                this.isDown = false;
                if (this.isOver)
                {
                    this.changeSkin(this.skin.over);
                }
                else
                {
                    this.changeSkin(this.skin.normal);
                }
            },

            /**
             * Handler of "pointer over" event
             */
            onButtonOver: function ()
            {
                this.isOver = true;
                if (this.isDown) {
                    return;
                }
                this.changeSkin(this.skin.over);
            },

            /**
             * Handler of "pointer out" event
             */
            onButtonOut: function ()
            {
                this.isOver = false;
                if (this.isDown)
                {
                    return;
                }
                this.changeSkin(this.skin.normal);
            }
        };

    return SpinButton;

});
