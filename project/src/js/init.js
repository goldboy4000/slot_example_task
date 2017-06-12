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
                // PIXI: '../libs/pixi'
                PIXI: 'https://cdnjs.cloudflare.com/ajax/libs/pixi.js/4.4.3/pixi.min',
                // SOUNDJS: 'https://code.createjs.com/soundjs-0.6.2.min'
                SOUNDJS: '../libs/soundjs-0.6.2.min'
            }

            // shim: {
            //     'SOUNDJS': {
            //         exports: 'SOUNDJS'
            //     }
            // }
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