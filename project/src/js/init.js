(function (window)
{
    'use strict';

    /**
     *
     */
    var init = function ()
    {
        requirejs.config({
            baseUrl: 'js/app',
            paths: {
                app: 'app',
                PIXI: '../libs/pixi'
            }
        });

        requirejs(['app'], function (app)
        {
            app.init();
        });
    };

    if (window.document.readyState === 'complete')
    {
        init();
    }
    else
    {
        window.addEventListener('load', init);
    }

})(window);