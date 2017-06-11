define(['additional/ConfigLoader', 'additional/Stage'], function (ConfigLoader, Stage)
{
    return {

        /**
         * Inits application
         */
        init: function ()
        {
            var configLoader = new ConfigLoader('config.json');
            var stage = new Stage();

            configLoader.load();
        }
    }
});
