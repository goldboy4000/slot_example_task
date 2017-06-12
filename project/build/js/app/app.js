define(['additional/ConfigLoader', 'additional/Stage', 'additional/SoundManager'], function (ConfigLoader, Stage, SoundManager)
{
    return {

        /**
         * Inits application
         */
        init: function ()
        {
            var configLoader = new ConfigLoader('config.json');
            var stage = new Stage();
            var soundManager = new SoundManager();

            configLoader.load();
        }
    }
});
