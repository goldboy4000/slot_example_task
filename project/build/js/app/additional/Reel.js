define(['PIXI', 'additional/EventManager'], function (PIXI, eventManager)
{
    /**
     * Phases of reel animation
     * @type {{BEGIN_ROTATION: number, ROTATION: number, END_ROTATION: number, STOPPED: number}}
     */
    var REEL_ANIMATION_PHASES =
        {
            BEGIN_ROTATION: 0,
            ROTATION: 1,
            END_ROTATION: 2,
            STOPPED: 3
        };

    /**
     * Reel
     * @param config
     * @param textures
     * @constructor
     */
    var Reel = function (config, textures)
    {
        this.config = config;
        this.container = new PIXI.Container();

        this.cellsForSymbols = [];

        this.symbolSequence = config.sequence;
        this.textures = textures;
        this.symbols = [];

        this.symbolsInColumn = config.options.symbolsInColumn;
        this.verticalSpacingOfSymbol = config.options.verticalSpacingOfSymbol;

        this.phasesOfAnimation = config.options.phasesOfAnimation;
        this.currentSymbol = 0;
        this.currentState = 1;
        this.currentPhase = 0;

        this.blurFilter = new PIXI.filters.BlurFilter();
        this.blurFilter.blur = 3;

        this.init();
    };

    Reel.prototype =
        {
            /**
             * Inits reel
             */
            init: function ()
            {
                this.setPosition();
                this.createCellsForSymbols();
                this.createSymbols();

                this.displaySymbols(this.getCurrentSymbol());
            },

            /**
             * Returns instance
             * @returns {*}
             */
            getInstance:function()
            {
              return this.container;
            },

            /**
             * Sets position of reel
             */
            setPosition: function ()
            {
                this.container.x = this.config.position.x;
            },

            /**
             * Creates containers for every visible symbol
             */
            createCellsForSymbols: function ()
            {
                for (var i = 0; i < this.symbolsInColumn + 1; i++)
                {
                    this.cellsForSymbols[i] = new PIXI.Container();
                    this.container.addChild(this.cellsForSymbols[i]);
                    this.cellsForSymbols[i].x = 0;
                    this.cellsForSymbols[i].y = (this.symbolsInColumn - i - 1) * this.verticalSpacingOfSymbol;
                }
            },

            /**
             * Creates sprites of symbols according with sequence
             */
            createSymbols: function ()
            {
                this.symbolSequence.map(function(index)
                {
                    this.symbols.push(new PIXI.Sprite(this.textures[index - 1]));
                }.bind(this));
            },

            /**
             * Returns subarray, contains specified number of elements from specified position
             * @param srcArray
             * @param num
             * @param index
             * @returns {Array}
             */
            getNumOfElements: function (srcArray, num, index)
            {
                var resultArray = [];
                var rIndex = index;

                for (var i = 0; i < num; i++)
                {
                    if (rIndex >= srcArray.length)
                    {
                        rIndex = 0;
                    }
                    resultArray.push(srcArray[rIndex++]);
                }

                return resultArray;
            },

            /**
             * Displays symbols
             * @param firstIndex
             */
            displaySymbols: function (firstIndex)
            {
                var array = this.getNumOfElements(this.symbols, this.symbolsInColumn + 1, firstIndex);
                for (var i = 0; i < this.symbolsInColumn + 1; i++)
                {
                    this.cellsForSymbols[i].removeChildren();
                    this.cellsForSymbols[i].addChild(array[i]);
                }
            },

            /**
             * Returns current symbol (bottom symbol on reel)
             * @returns {number}
             */
            getCurrentSymbol: function ()
            {
                if (this.currentSymbol >= this.symbolSequence.length)
                {
                    this.currentSymbol = 0;
                }
                return this.currentSymbol++;
            },

            /**
             *
             * @param min
             * @param max
             * @returns {number}
             */
            randomSymbol: function (min, max)
            {
                var rand = min - 0.5 + Math.random() * (max - min + 1);
                rand = Math.round(rand);

                return rand;
            },

            /**
             *
             */
            reset: function ()
            {
                this.currentState = 1;
                this.currentPhase = 0;
            },

            /**
             *
             */
            update: function ()
            {
                if (this.currentState > this.phasesOfAnimation[this.currentPhase].duration && this.currentPhase < this.phasesOfAnimation.length)
                {
                    this.currentPhase++;
                    this.currentState = 1;
                }

                this.container.y += this.phasesOfAnimation[this.currentPhase].speed + this.phasesOfAnimation[this.currentPhase].acceleration * this.currentState;

                if (this.container.y > this.verticalSpacingOfSymbol)
                {
                    this.container.y = 0;

                    this.displaySymbols(this.getCurrentSymbol());

                    this.currentState++;
                    this.globalCurrentState++;
                }

                if (this.currentPhase === REEL_ANIMATION_PHASES.ROTATION && this.currentState === 1)
                {
                    eventManager.dispatch('reel_spin_rotating');
                    this.container.filters = [this.blurFilter];
                }

                if (this.currentPhase === REEL_ANIMATION_PHASES.END_ROTATION && this.currentState === 1)
                {
                    this.currentSymbol = this.randomSymbol(0, this.symbols.length - 1);
                    this.container.filters = [];
                }

                if (this.currentPhase === REEL_ANIMATION_PHASES.STOPPED && this.currentState === this.phasesOfAnimation[this.currentPhase].duration)
                {
                    eventManager.dispatch('reel_spin_end');

                    this.reset();
                }
            }
        };

    return Reel;
});