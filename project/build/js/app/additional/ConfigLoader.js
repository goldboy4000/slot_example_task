define(['additional/EventManager'], function (eventManager)
{
    /**
     * Configuration loader
     * @param srcConfig
     * @constructor
     */
    var ConfigLoader = function (srcConfig)
    {
        this.source = srcConfig;
    };

    ConfigLoader.prototype =
        {
            /**
             * Loads config from source file
             */
            load: function ()
            {
                var xhr = new XMLHttpRequest();
                xhr.addEventListener('readystatechange', this.readyStateChangeHandler.bind(this));
                xhr.open('GET', this.source, true);
                xhr.send();
            },

            /**
             * Parses config object from JSON
             * @param str
             * @returns {null}
             */
            parse: function (str)
            {
                try
                {
                    var config = JSON.parse(str);
                }
                catch(err)
                {
                    return null;
                }

                return config;
            },

            /**
             * Handler of states of loading
             * @param e
             */
            readyStateChangeHandler: function (e)
            {
                if (e.target.readyState !== 4)
                {
                    return;
                }

                if (e.target.status !== 200)
                {
                    console.log('status = ' + e.target.status);
                }
                else
                {
                    var config = this.parse(e.target.responseText);
                    if (config)
                    {
                        eventManager.dispatch('config_loaded', config);
                    }
                }
            }
        };

    return ConfigLoader;

});