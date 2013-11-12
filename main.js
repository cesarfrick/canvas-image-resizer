/**
 * Image Resize
 * This module loads a local image and resizes it using canvas.
 * You can set the maxHeight, maxWidth or both.
 */

var imageResize = (function(){
    'use strict';

    var __self = this,
    defaults = {
        canvas      : {},
        fileSelector: {},
        maxWidth    : 100,
        maxHeight   : 100,
        imgNameField: 'img_name',
        imgDataField: 'img_data'
    },
    handleFileProgress = function( evt ){
        if( evt.lengthComputable ){
            var loaded = Math.round( evt.loaded / evt.total );
            __self.settings.canvas.style.opacity = loaded;
        }
    },
    handleFileComplete = function(){
        __self.settings.canvas.style.opacity = 1;
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
                    newImage.setAttribute( 'data-type', thisFile.type );
                };
            })( evt.target.files[0] );

            console.log(  __self.settings );

            newImage.addEventListener('load', function(){
                var canvas      = __self.settings.canvas,
                    context     = canvas.getContext( '2d' ),
                    hiddenName  = document.getElementsByName( __self.settings.imgNameField )[0],
                    hiddenFile  = document.getElementsByName( __self.settings.imgDataField )[0],
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


                canvas.height = scaleHeight;
                canvas.width  = scaleWidth;
                context.drawImage( this, 0, 0, scaleWidth, scaleHeight );

                if( !hiddenName ){
                    hiddenName       = document.createElement( 'input' );
                    hiddenName.type  = 'hidden';
                    hiddenName.name  = __self.settings.imgNameField;
                }
                hiddenName.value = newImage.getAttribute( 'data-name' );
                canvas.parentElement.appendChild( hiddenName );

                if( !hiddenFile ){
                    hiddenFile       = document.createElement( 'input' );
                    hiddenFile.type  = 'hidden';
                    hiddenFile.name  = __self.settings.imgDataField;
                }
                hiddenFile.value = canvas.toDataURL( newImage.getAttribute( 'data-type' ) );
                canvas.parentElement.appendChild( hiddenFile );

            });

            reader.readAsDataURL( evt.target.files[0] );
        }

    },
    set = function(){
        for( var prop in defaults ){
            if( __self.settings[prop] === undefined ){ __self.settings[prop] = defaults[prop]; }
        }
        __self.settings.canvas.addEventListener( 'click', function(){
            __self.settings.fileSelector.click();
        });

        __self.settings.fileSelector.style.display = 'none';
        __self.settings.fileSelector.onchange = loadFile;
    };

    this.settings = {};

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
