////////////////////////////////////////////////////////////////////////////////
// COS 426 Assignement 4 stub                                                 //
// Particle Systems                                                           //
// Many ideas here are taken from SPARKS.js                                   //
////////////////////////////////////////////////////////////////////////////////

// TODO :
// - shader requires more exploration / better interface
// - change moving particle to setting it invisible in shader
// - initializers and particle engine must work with all the sahder supported attributes
// - incorporate gui controls

// Singleton Engine - we will have one particle engine per application,
// driving the entire application.
var ParticleEngine = ParticleEngine || new ( function() {
    var _self      = this;

    // Instance variables - list of emitters, and global delta time
    _self._emitters   = [];
    _self._meshes     = [];
    _self._animations = [];
    _self._prev_t     = undefined;
    _self._cur_t      = undefined;
    _self._isRunning  = false;

    _self.addEmitter = function ( emitter ) {
        _self._emitters.push( emitter );
    };

    _self.removeEmitters = function() {
        _self._emitters = [];
    };

    _self.addMesh = function ( mesh ) {
        _self._meshes.push( mesh );
    };

    _self.removeMeshes = function() {
        _self._meshes = [];
    };

    _self.addAnimation = function ( animation ) {
        _self._animations.push( animation );
        animation.play()
    };

    _self.removeAnimations = function () {
        for ( var i = 0 ; i < _self._animations.length; ++i ) {
            _self._animations[i].isPlaying = false;
        }
        _self._animations = [];
    };

    _self.start = function () {
        _self._prev_t = Date.now();
        _self._cur_t  = Date.now();
        _self._isRunning = true;
    };

    _self.step = function () {
        // deal with time
        _self._cur_t  = Date.now();
        var elapsed  = (_self._cur_t - _self._prev_t) / 1000.0;
        _self._prev_t = _self._cur_t;
        if ( !_self._isRunning ) elapsed = 0.0;

        for ( var i = 0; i < _self._animations.length ; ++i ) {
            _self._animations[i].update( elapsed * 1000.0 );
        }

        for ( var i = 0 ; i < _self._emitters.length ; ++i ) {
            _self._emitters[i].update( elapsed );
        }

    };

    _self.stop = function () {
        _self._isRunning = false;
    },

    _self.pause = function () {
        if ( _self._isRunning ) {
            _self.stop();
        } else {
            _self.start();
        }
    };

    _self.restart = function () {
        _self.stop();
        for ( var i = 0 ; i < _self._emitters.length ; ++i ) {
            _self._emitters[i].restart();
        }
        _self.start();
    };

    _self.getDrawableParticles = function ( emitter_idx ) {
        return _self._emitters[emitter_idx].getDrawableParticles();
    }

    _self.getEmitters = function( ) {
        return _self._emitters;
    }

    _self.getAsteroids = function ( emitter_idx ) {
        return _self._emitters[emitter_idx].getAsteroids();
    }

    return _self;
})();

function Emitter ( opts ) {
    // console.log ( "Emiiter", this );
    // initialize some base variables needed by emitter, that we will extract from options
    this._maxParticleCount     = undefined;
    this._particlesPerSecond   = undefined;
    this._initializer          = undefined;
    this._updater              = undefined;
    this._cloth                = false;
    this._width                = undefined;
    this._height               = undefined;
    this._maxAsteroids         = undefined;
    this._asteroidFrequency    = undefined;
    this._asteroidsReady       = false;
    this._attributeInformation = {
        position:      3,
        velocity:      3,
        color:         4,
        size:          1,
        lifetime:      1,
        dampening:     3
    };
    this._asteroidInformation = {
        velocity: 3, 
        rotation: 1,
        lifetime: 1
    };

    // parse options
    for ( var option in opts ) {
        var value = opts[option];
        if ( option === "material" ) {
            this._material = value;
        } else if ( option === "maxParticles" ) {
            this._maxParticleCount = value;
        } else if ( option === "particlesFreq" ) {
            this._particlesPerSecond = value;
        } else if ( option === "initialize" ) {
            this._initializer = value;
        } else if ( option === "update" ) {
            this._updater = value;
        } else if ( option === "material" ) {
            this._material = value;
        } else if ( option === "cloth" ) {
            this._cloth = value;
        } else if ( option === "width" ) {
            this._width = value;
        } else if ( option === "height" ) {
            this._height = value;
        } else if ( option === "maxAsteroids" ) {
            this._maxAsteroids = value;
        } else if ( option === "asteroidFrequency" ) {
            this._asteroidFrequency = value;
        } else {
            console.log( "Unknown option " + option + "! Make sure to register it!" )
        }
    }

    if ( this._cloth == true ) {
        this._maxParticleCount = this._width * this._height;
        this._particlesPerSecond = 1e8 * this._maxParticleCount;
    }

    // These are more internal variables that will be initialized based on parsed arguments.
    // For example, attributes given to THREE.BufferGeometry will depend on attributeInformation
    // variable.
    this._particles          = new THREE.BufferGeometry();
    this._initialized        = []; // this is the alive array
    this._asteroids          = [];
    this._asteroidInit       = []; // this will be asteroids alive
    this._asteroidInfo       = new THREE.BufferGeometry();


    // Store indices of available particles - these are not initialized yet
    for ( var i = 0 ; i < this._maxParticleCount ; ++i ) {
        this._initialized[i] = false;
    }

    // Allocate memory for the particles
    for ( var attributeKey in this._attributeInformation ) {
        // get info from attributeInformation, required to initialize correctly sized arrays
        var attributeLength = this._attributeInformation[ attributeKey ];
        var attributeArray = new Float32Array( this._maxParticleCount * attributeLength );

        // Since these are zero - initialized, they will appear in the scene.
        // By setting all to be negative infinity we will effectively remove these from rendering.
        // This is also how you "remove" dead particles
        for ( var i = 0 ; i < this._maxParticleCount ; ++i ) {
            for ( var j = 0 ; j < attributeLength ; ++j ) {
                attributeArray[ attributeLength * i + j ] = 1e9;
            }
        }

        this._particles.addAttribute( attributeKey, new THREE.BufferAttribute( attributeArray, attributeLength ) );
    }

    for ( var attributeKey in this._asteroidInformation ) {
        var attributeLength = this._asteroidInformation[ attributeKey ];
        var attributeArray = new Float32Array( this._maxAsteroids * attributeLength );

        // Since these are zero - initialized, they will appear in the scene.
        // By setting all to be negative infinity we will effectively remove these from rendering.
        // This is also how you "remove" dead particles
        for ( var i = 0 ; i < this._maxAsteroids ; ++i ) {
            for ( var j = 0 ; j < attributeLength ; ++j ) {
                attributeArray[ attributeLength * i + j ] = 1e9;
            }
        }
        this._asteroidInfo.addAttribute( attributeKey, new THREE.BufferAttribute( attributeArray, attributeLength) );
    }

    this._particleAttributes = this._particles.attributes; // for convenience / less writing / not sure / #badprogramming

    this._sorting = false;
    this._distances = [];
    this._backupArray = new Float32Array( this._maxParticleCount * 4 );

    // Create the drawable particles - this is the object that three.js will use to draw stuff onto screen
    this._drawableParticles = new THREE.PointCloud( this._particles, this._material );

     // load asteroids all at once
    var scope = this;
    var mtlLoader = new THREE.MTLLoader()
    mtlLoader.setBaseUrl('objects/');
    mtlLoader.setPath('objects/');
    mtlLoader.load('asteroid.mtl', function ( materials ) {
        var objName = 'objects/asteroid.obj';
        materials.preload();
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials( materials );
        objLoader.load(objName, function ( mesh ) {
            var refMesh = mesh.children[0];
            refMesh.position.set(1e9, 1e9, 1e9); // currently unrendered.
            for (var i = 0; i < scope._maxAsteroids; ++i) {
                var newMesh = new THREE.Mesh(refMesh.geometry, refMesh.material);
                newMesh.__ourMeshId = i;
                scope._asteroids[i] = newMesh;
                scope._asteroidInit[i] = false;
                Scene.addObject(newMesh);
            }
            console.log('asteroids ready');
            scope._asteroidsReady = true;

        });
    });

    return this;
};

Emitter.prototype.restart = function() {

    for ( var i = 0 ; i < this._maxParticleCount ; ++i ) {

        this._initialized[i] = 0;

    }

    for ( var attributeKey in this._particleAttributes ) {

        var attribute       = this._particleAttributes[attributeKey];
        var attributeArray  = attribute.array;
        var attributeLength = attribute.itemSize;

        for ( var i = 0 ; i < this._maxParticleCount ; ++i ) {
            for ( var j = 0 ; j < attributeLength ; ++j ) {
                attributeArray[ attributeLength * i + j ] = 1e-9;
            }
        }

        attribute.needsUpdate = true;

    }
}

Emitter.prototype.update = function( delta_t ) {
    // how many particles should we add?
    //var toAdd = Math.floor( delta_t * this._particlesPerSecond );
    var asteroidsToAdd = Math.floor( delta_t * this._asteroidFrequency );
    /* if ( toAdd > 0 ) {
        this._initializer.initialize( this._particleAttributes, this.getSpawnable( toAdd ), this._width, this._height );
    } */

    if ( this._asteroidsReady && asteroidsToAdd > 0 ) {
        this._initializer.initializeAsteroids( this._asteroids, this._asteroidInfo.attributes, this.getSpawnableAsteroids( asteroidsToAdd ) );
    }


    // particle updates
    this._updater.update( this._particleAttributes, this._initialized, delta_t, this._width, this._height );
    if (this._asteroidsReady)
        this._updater.handleCollisions( this._asteroids, this._asteroidInfo.attributes, this._particleAttributes, this._initialized, this._asteroidInit);
        this._updater.updateAsteroids( this._asteroids, this._asteroidInfo.attributes, this._asteroidInit, delta_t );

    // sorting -> Move it to camera update / loop update so that it is updated each time even if time is paused?
    if ( this._sorting === true ) {
        this.sortParticles();
    }

    // for visibility culling
    this._drawableParticles.geometry.computeBoundingSphere();
}


Emitter.prototype.enableSorting = function( val ) {
    this._sorting = val;
};

Emitter.prototype.getDrawableParticles = function () {
    return this._drawableParticles;
};

Emitter.prototype.getAsteroids = function () {
    return this._asteroids;
}

Emitter.prototype.sortParticles = function () {
    var positions  = this._particleAttributes.position;
    var cameraPosition = Renderer._camera.position;

    for ( var i = 0 ; i < this._maxParticleCount ; ++i ) {
        var currentPosition =  getElement( i, positions );
        this._distances[i] = [cameraPosition.distanceToSquared( currentPosition ),i];
    }

    this._distances.sort( function( a, b ) { return a[0] < b[0] } );

    for ( var attributeKey in this._particleAttributes ) {

        var attributeLength = this._particleAttributes[ attributeKey ].itemSize;
        var attributeArray  = this._particleAttributes[ attributeKey ].array;

        for ( var i = 0 ; i < this._maxParticleCount ; ++i ) {
            for ( var j = 0 ; j < attributeLength ; ++j ) {
                this._backupArray[4 * i + j ] = attributeArray[ attributeLength * this._distances[i][1] + j ]
            }
        }

        for ( var i = 0 ; i < this._maxParticleCount ; ++i ) {
            for ( var j = 0 ; j < attributeLength ; ++j ) {
                attributeArray[ attributeLength * i + j ] = this._backupArray[4 * i + j ];
            }
        }
    }

    initialized_cpy = []
    for ( var i = 0 ; i < this._maxParticleCount ; ++i ) {
        initialized_cpy[ i ] = this._initialized[ this._distances[i][1] ];
    }

    for ( var i = 0 ; i < this._maxParticleCount ; ++i ) {
        this._initialized[ i ] = initialized_cpy[i];
    }
};

Emitter.prototype.getSpawnableAsteroids = function ( asteroidsToAdd ) {
    var asteroidsToSpawn = [];
    for ( var i = 0 ; i < this._maxAsteroids ; ++i ) {

        if ( this._asteroidInit[i] ) continue;
        if ( asteroidsToSpawn.length >= asteroidsToAdd ) break;
        this._asteroidInit[i] = true;
        asteroidsToSpawn.push(i);

    }

    return asteroidsToSpawn;
}

Emitter.prototype.getSpawnable = function ( toAdd ) {
    var toSpawn = [];
    for ( var i = 0 ; i < this._maxParticleCount ; ++i ) {

        if ( this._initialized[i] ) continue;
        if ( toSpawn.length >= toAdd ) break;
        this._initialized[i] = true;
        toSpawn.push(i);

    }

    return toSpawn;
};

window.addEventListener("keydown", onShootKeyDown, false);

// shoot two bullets
function onShootKeyDown( event ) {
    var key = event.key;
    if (key === ' ') {
        var toAdd = 2; // spawn 2 shots every time
        var emitters = ParticleEngine.getEmitters();
        for (var i = 0; i < emitters.length; i++) {
            var toSpawn = emitters[i].getSpawnable( toAdd );
            emitters[i]._initializer.initialize( emitters[i]._particleAttributes, toSpawn , emitters[i]._width, emitters[i]._height );

        }

    }
}

