/**
 * Image Resize
 * This module loads a local image and resizes it using canvas.
 * You can set the maxHeight, maxWidth or both.
 */

var imageResize = (function(){
    'use strict';

    var __self = this,
    settings = {
        canvas      : {},
        fileSelector: {},
        maxWidth    : 100,
        maxHeight   : 100
    },
    handleFileProgress = function( evt ){
        if( evt.lengthComputable ){
            var percentLoaded = Math.round( ( evt.loaded / evt.total ) * 100 );
            console.info( percentLoaded + '%' );
        }
    },
    handleFileComplete = function(){
        console.log( 'Complete' );
    },
    loadFile = function( evt ){
        if( evt.target.files[0].type.match( 'image.*' ) ){
            var reader   = new FileReader(),
                newImage = new Image();

            reader.onprogress = handleFileProgress;
            reader.onloadend  = handleFileComplete;
            reader.onload = (function( thisFile ){
                return function( evt ){
                    newImage.src = evt.target.result;
                    newImage.setAttribute( 'data-name', thisFile.name );
                };
            })( evt.target.files[0] );

            newImage.addEventListener('load', function(){
                var context     = __self.settings.canvas.getContext( '2d' ),
                    scaleWidth  = __self.settings.maxWidth,
                    scaleHeight = __self.settings.maxHeight,
                    ratio       = this.height / this.width;

                if( this.height >= this.width ){
                    if( scaleHeight > this.height ){ scaleHeight = this.height; }
                    scaleWidth = scaleHeight / ratio;
                }else if( this.width > this.height ){
                    if( scaleWidth > this.width ){ scaleWidth = this.width; }
                    scaleHeight = scaleWidth * ratio;
                }

                __self.settings.canvas.height = scaleHeight;
                __self.settings.canvas.width  = scaleWidth;
                context.drawImage( this, 0, 0, scaleWidth, scaleHeight );
            });

            reader.readAsDataURL( evt.target.files[0] );
        }

    },
    set = function(){
        __self.settings.canvas.addEventListener( 'click', function(){
            __self.settings.fileSelector.click();
        });

        __self.settings.fileSelector.style.display = 'none';
        __self.settings.fileSelector.onchange = loadFile;
    };

    this.settings = settings;

    this.init = set;
});

(function(win, doc){
    'use strict';
    var ir = new imageResize();
    win.onload = function(){
        ir.settings = {
            canvas       : doc.getElementById( 'img-canvas' ),
            fileSelector : doc.getElementById( 'img-selector' ),
            maxWidth     : 400,
            maxHeight    : 400
        };
        ir.init();
    };
})(window, document);
