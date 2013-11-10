/*
 * Auto-generated content from the Brackets New Project extension.  Enjoy!
 */
(function(win, doc){
    'use strict';
    var settings = {},
    /*loadAjax = function( src, callback ){
        var ajax = new XMLHttpRequest();

        ajax.onreadystatechange = function(){
            if( ajax.readyState === 4 && ajax.status === 200  ){
                if( callback ){
                    callback( ajax.status, ajax.responseText );
                }else{
                    return ajax.responseText;
                }
            }else{
                if( callback ){
                    callback( ajax.status, ajax.statusText );
                }else{
                    return ajax.statusText;
                }
            }
        };

        ajax.open( 'get', src, true );
        ajax.send();
    },*/
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
                var context    = settings.canvas.getContext( '2d' ),
                    scaleWidth = settings.maxWidth,
                    scaleHeight = settings.maxHeight,
                    ratio      = this.height / this.width;

                if( scaleWidth && scaleHeight ){
                    if( this.height > this.width ){
                        if( this.height < scaleHeight ){
                            scaleHeight = this.height;
                            scaleWidth  = scaleHeight * ratio;
                        }else if( this.width < scaleWidth ){
                            scaleWidth  = this.width;
                            scaleHeight = scaleWidth * ratio;
                        }
                    }
                }else if( scaleWidth ){
                    scaleHeight = scaleWidth * ratio;

                }else if( scaleHeight ){
                    scaleWidth = scaleHeight * ratio;
                }


                settings.canvas.height = scaleHeight;
                settings.canvas.width  = scaleWidth;
                context.drawImage( this, 0, 0, scaleWidth, scaleHeight );
            });

            reader.readAsDataURL( evt.target.files[0] );
        }

    },
    init = function(){
        settings.canvas.addEventListener( 'click', function(){
            settings.fileSelector.click();
        });

        settings.fileSelector.style.display = 'none';
        settings.fileSelector.onchange = loadFile;
    };

    win.onload = function(){
        settings = {
            canvas       : doc.getElementById( 'img-canvas' ),
            fileSelector : doc.getElementById( 'img-selector' ),
            maxWidth   : 400
        };
        init();
    };
})(window, document);
