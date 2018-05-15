/*
 * In this file you can specify all sort of initializers
 *  We provide an example of simple initializer that generates points withing a cube.
 */


function VoidInitializer ( opts ) {
    this._opts = opts;
    return this;
};

VoidInitializer.prototype.initialize = function ( particleAttributes, toSpawn ) {

};
////////////////////////////////////////////////////////////////////////////////
// Basic Initializer
////////////////////////////////////////////////////////////////////////////////

function SphereInitializer ( opts ) {
    this._opts = opts;
    return this;
};

SphereInitializer.prototype.initializePositions = function ( positions, toSpawn) {
    var base = this._opts.sphere;
    var base_pos = new THREE.Vector3( base.x, base.y, base.z );
    var r   = base.w;
    for ( var i = 0 ; i < toSpawn.length ; ++i ) {
        var idx = toSpawn[i];
        // ----------- STUDENT CODE BEGIN ------------
        do {
            var x1 = Math.random() * 2 - 1;
            var x2 = Math.random() * 2 - 1;
        }
        while(x1 * x1 + x2 * x2 > 1);
        var x = 2 * x1 * Math.sqrt(1 - x1 ** 2 - x2 ** 2);
        var y = 2 * x2 * Math.sqrt(1 - x1 ** 2 - x2 ** 2);
        var z = 1 - 2 * (x1 ** 2 + x2 ** 2);
        rsq = x ** 2 + y ** 2 + z ** 2;
        var pos = new THREE.Vector3(x, y, z);
        pos.normalize();
        pos.multiplyScalar(r);
        pos.add(base_pos);
        // ----------- STUDENT CODE END ------------
        setElement( idx, positions, pos );

    }
    positions.needUpdate = true;
}

SphereInitializer.prototype.initializeVelocities = function ( velocities, dampenings, positions, toSpawn ) {
    var base_vel = this._opts.velocity;
    for ( var i = 0 ; i < toSpawn.length ; ++i ) {
        var idx = toSpawn[i];
        // ----------- STUDENT CODE BEGIN ------------
        // just to get started, make the velocity the same as the initial position
        var pos = getElement( idx, positions );
        var vel = pos.clone().multiplyScalar(5.0);
        vel.add(base_vel);

        // ----------- STUDENT CODE END ------------
        setElement( idx, velocities, vel );
        var damp = new THREE.Vector3(this._opts.damping.x,this._opts.damping.y,0);
        setElement( idx, dampenings, damp); 
    }
    velocities.needUpdate = true;
}

SphereInitializer.prototype.initializeColors = function ( colors, toSpawn ) {
    var base_col = this._opts.color;
    for ( var i = 0 ; i < toSpawn.length ; ++i ) {
        var idx = toSpawn[i];
        // ----------- STUDENT CODE BEGIN ------------
        var col = base_col;

        // ----------- STUDENT CODE END ------------
        setElement( idx, colors, col );
    }
    colors.needUpdate = true;
}

SphereInitializer.prototype.initializeSizes = function ( sizes, toSpawn ) {

    for ( var i = 0 ; i < toSpawn.length ; ++i ) {
        var idx = toSpawn[i];
        // ----------- STUDENT CODE BEGIN ------------
        var size = this._opts.size;

        // ----------- STUDENT CODE END ------------
        setElement( idx, sizes, size );
    }
    sizes.needUpdate = true;
}

SphereInitializer.prototype.initializeLifetimes = function ( lifetimes, toSpawn ) {

    for ( var i = 0 ; i < toSpawn.length ; ++i ) {
        var idx = toSpawn[i];
        // ----------- STUDENT CODE BEGIN ------------
        var lifetime = this._opts.lifetime;

        // ----------- STUDENT CODE END ------------
        setElement( idx, lifetimes, lifetime );
    }
    lifetimes.needUpdate = true;
}

// how to make this funciton nicer to work with. This one is kinda ok, as for initialization
// everything is independent
SphereInitializer.prototype.initialize = function ( particleAttributes, toSpawn ) {

    // update required values
    this.initializePositions( particleAttributes.position, toSpawn );

    this.initializeVelocities( particleAttributes.velocity,  particleAttributes.dampening, particleAttributes.position, toSpawn );

    this.initializeColors( particleAttributes.color, toSpawn );

    this.initializeLifetimes( particleAttributes.lifetime, toSpawn );

    this.initializeSizes( particleAttributes.size, toSpawn );
};



////////////////////////////////////////////////////////////////////////////////
// Basic Initializer 
////////////////////////////////////////////////////////////////////////////////

function FountainInitializer ( opts ) {
    this._opts = opts;
    return this;
};

FountainInitializer.prototype.initializePositions = function ( positions, toSpawn) {
    var base = this._opts.sphere;
    var base_pos = new THREE.Vector3( base.x, base.y, base.z );
    // console.log(base_pos); x = 0, y = 30, z = 0. so center is always (x, z) = (0, 0)
    var r   = base.w;
    for ( var i = 0 ; i < toSpawn.length ; ++i ) {
        var idx = toSpawn[i];
        // ----------- STUDENT CODE BEGIN ------------
       do {
            var x1 = Math.random() * 2 - 1;
            var x2 = Math.random() * 2 - 1;
        }
        while(x1 * x1 + x2 * x2 > 1);
        var x = 2 * x1 * Math.sqrt(1 - x1 ** 2 - x2 ** 2);
        var y = 2 * x2 * Math.sqrt(1 - x1 ** 2 - x2 ** 2);
        var z = 1 - 2 * (x1 ** 2 + x2 ** 2);
        rsq = x ** 2 + y ** 2 + z ** 2;
        var pos = new THREE.Vector3(x, y, z);
        pos.normalize();
        pos.multiplyScalar(r);
        pos.add(base_pos);
        // ----------- STUDENT CODE END ------------
        setElement( idx, positions, pos );
    }
    positions.needUpdate = true;
}

FountainInitializer.prototype.initializeVelocities = function ( velocities, dampenings, positions, toSpawn ) {
    var base_vel = this._opts.velocity;
    for ( var i = 0 ; i < toSpawn.length ; ++i ) {
        var idx = toSpawn[i];
        // ----------- STUDENT CODE BEGIN ------------
        var pos = getElement( idx, positions );
        vel = pos.clone().add(base_vel);
        vel.x *= 15.0;
        vel.z *= 15.0;
        // ----------- STUDENT CODE END ------------
        setElement( idx, velocities, vel );
        var damp = new THREE.Vector3(this._opts.damping.x,this._opts.damping.y,0);
        setElement( idx, dampenings, damp); 

    }
    velocities.needUpdate = true;
}

FountainInitializer.prototype.initializeColors = function ( colors, toSpawn ) {
    var base_col = this._opts.color;
    for ( var i = 0 ; i < toSpawn.length ; ++i ) {
        var idx = toSpawn[i];
        // ----------- STUDENT CODE BEGIN ------------
        var col = base_col;

        // ----------- STUDENT CODE END ------------
        setElement( idx, colors, col );
    }
    colors.needUpdate = true;
}

FountainInitializer.prototype.initializeSizes = function ( sizes, toSpawn ) {

    for ( var i = 0 ; i < toSpawn.length ; ++i ) {
        var idx = toSpawn[i];
        // ----------- STUDENT CODE BEGIN ------------
        var size = this._opts.size;

        // ----------- STUDENT CODE END ------------
        setElement( idx, sizes, size );
    }
    sizes.needUpdate = true;
}

FountainInitializer.prototype.initializeLifetimes = function ( lifetimes, toSpawn ) {

    for ( var i = 0 ; i < toSpawn.length ; ++i ) {
        var idx = toSpawn[i];

        var lifetime = this._opts.lifetime;

        setElement( idx, lifetimes, lifetime );
    }
    lifetimes.needUpdate = true;
}

// how to make this funciton nicer to work with. This one is kinda ok, as for initialization
// everything is independent
FountainInitializer.prototype.initialize = function ( particleAttributes, toSpawn ) {

    // update required values
    this.initializePositions( particleAttributes.position, toSpawn );

    this.initializeVelocities( particleAttributes.velocity,  particleAttributes.dampening, particleAttributes.position, toSpawn );

    this.initializeColors( particleAttributes.color, toSpawn );

    this.initializeLifetimes( particleAttributes.lifetime, toSpawn );

    this.initializeSizes( particleAttributes.size, toSpawn );
};

////////////////////////////////////////////////////////////////////////////////
// Animation Initializer
////////////////////////////////////////////////////////////////////////////////

function AnimationInitializer ( opts ) {
    this._opts = opts;
    return this;
};

// this function gets the morphed position of an animated mesh.
// we recommend that you do not look too closely in here ;-)
AnimationInitializer.prototype.getMorphedMesh = function () {

     if ( ParticleEngine._meshes[0] !== undefined  && ParticleEngine._animations[0] !== undefined){

        var mesh       = ParticleEngine._meshes[0];

        var vertices   = [];
        var n_vertices = mesh.geometry.vertices.length;

        var faces      = ParticleEngine._meshes[0].geometry.faces;

        var morphInfluences = ParticleEngine._meshes[0].morphTargetInfluences;
        var morphs          = ParticleEngine._meshes[0].geometry.morphTargets;

        if ( morphs === undefined ) {
            return undefined;
        }
        for ( var i = 0 ; i < morphs.length ; ++i ) {

            if ( morphInfluences[i] !== 0.0 ) {
                for ( var j = 0 ; j < n_vertices ; ++j ) {
                    vertices[j] = new THREE.Vector3( 0.0, 0.0, 0.0 );
                    vertices[j].add ( morphs[i].vertices[j] );
                }
            }
        }
        return { vertices : vertices, faces : faces, scale: mesh.scale, position: mesh.position };

    } else {

        return undefined;

    }
}

// calculate the area of a face given all vertices in the mesh and the face
function calculateFaceArea(verts, face) {
    var pointA = verts[face.a];
    var pointB = verts[face.b];
    var pointC = verts[face.c];
    var sideA = pointA.distanceTo(pointB);
    var sideB = pointB.distanceTo(pointC);
    var sideC = pointC.distanceTo(pointA);
    var S = (sideA + sideB + sideC) / 2;
    return Math.sqrt(S * (S - sideA) * (S - sideB) * (S - sideC));
}

// generate a random face weighted by face areas
function weightedRandomFace(cumArea) {
    var rand = Math.random() * cumArea[cumArea.length - 1];
    for (var i = 0; i < cumArea.length; i++) {
        if (cumArea[i] > rand) {
            return i;
        }
    }
}

AnimationInitializer.prototype.initializePositions = function ( positions, toSpawn, mesh ) {
    var base_pos = this._opts.position;
    var faces = mesh.faces;
    var verts = mesh.vertices;
    // array of cumulative face area
    var cumArea = [];
    cumArea.push(0);
    var faceVertices = [];
    faceVertices.push(0);
    for (var i = 1; i < faces.length; i++) {
        cumArea.push(cumArea[i - 1] + calculateFaceArea(verts, faces[i]));
        faceVertices.push([faces[i].a, faces[i].b, faces[i].c]);
    }
    var scale = mesh.scale;
    for ( var i = 0 ; i < toSpawn.length ; ++i ) {
        // ----------- STUDENT CODE BEGIN ------------
        var p = base_pos;
        // get a random face weighted by area
        var randomFace = weightedRandomFace(cumArea);
        var a = faceVertices[randomFace][0];
        var b = faceVertices[randomFace][1];
        var c = faceVertices[randomFace][2];
        // get a uniformly random point in the triangle
        // method citation: https://math.stackexchange.com/questions/18686/uniform-random-point-in-triangle
        var r1 = Math.random();
        var r2 = Math.random();
        p = verts[a].clone().multiplyScalar(1 - Math.sqrt(r1));
        p.add(verts[b].clone().multiplyScalar(Math.sqrt(r1) * (1 - r2)));
        p.add(verts[c].clone().multiplyScalar(r2 * Math.sqrt(r1)));
        p.x *= scale.x;
        p.y *= scale.y;
        p.z *= scale.z;
        setElement( i, positions, p );
        // ----------- STUDENT CODE END ------------

    }
    positions.needUpdate = true;
}

AnimationInitializer.prototype.initializeVelocities = function ( velocities, dampenings, toSpawn) {

    var base_vel = this._opts.velocity;
    for ( var i = 0 ; i < toSpawn.length ; ++i ) {
        var idx = toSpawn[i];
        // ----------- STUDENT CODE BEGIN ------------
        var vel = base_vel;

        setElement( idx, velocities, vel );
        var damp = new THREE.Vector3(this._opts.damping.x,this._opts.damping.y,0);
        setElement( idx, dampenings, damp); 

        // ----------- STUDENT CODE END ------------
    }
    velocities.needUpdate = true;
}

AnimationInitializer.prototype.initializeColors = function ( colors, toSpawn) {

    var base_col = this._opts.color;
    for ( var i = 0 ; i < toSpawn.length ; ++i ) {
        var idx = toSpawn[i];
        // ----------- STUDENT CODE BEGIN ------------

        setElement( idx, colors, base_col );
        // ----------- STUDENT CODE END ------------
    }
    colors.needUpdate = true;
}

AnimationInitializer.prototype.initializeSizes = function ( sizes, toSpawn) {

    for ( var i = 0 ; i < toSpawn.length ; ++i ) {
        var idx = toSpawn[i];
        // ----------- STUDENT CODE BEGIN ------------

        setElement( idx, sizes, this._opts.size );
        // ----------- STUDENT CODE END ------------
    }
    sizes.needUpdate = true;
}

AnimationInitializer.prototype.initializeLifetimes = function ( lifetimes, toSpawn) {

    for ( var i = 0 ; i < toSpawn.length ; ++i ) {
        var idx = toSpawn[i];
        setElement( idx, lifetimes, this._opts.lifetime );
    }
    lifetimes.needUpdate = true;
}

// how to make this funciton nicer to work with. This one is kinda ok, as for initialization
// everything is independent
AnimationInitializer.prototype.initialize = function ( particleAttributes, toSpawn ) {

    var mesh = this.getMorphedMesh();

    if ( mesh == undefined ){
        return;
    }

    // update required values
    this.initializePositions( particleAttributes.position, toSpawn, mesh );

    this.initializeVelocities( particleAttributes.velocity,  particleAttributes.dampening, toSpawn );

    this.initializeColors( particleAttributes.color, toSpawn );

    this.initializeLifetimes( particleAttributes.lifetime, toSpawn );

    this.initializeSizes( particleAttributes.size, toSpawn );

};

////////////////////////////////////////////////////////////////////////////////
// Cloth
////////////////////////////////////////////////////////////////////////////////

function ClothInitializer ( opts ) {
    this._opts = opts;
    return this;
};

ClothInitializer.prototype.initializePositions = function ( positions, toSpawn, width, height ) {
    var base_pos = this._opts.position;

    for ( var i = 0 ; i < toSpawn.length ; ++i ) {
        var idx = toSpawn[i];
        var w = idx % width;
        var h = idx / height;
        var grid_pos = new THREE.Vector3( 100.0 - w * 10, 0.0, 100.0 - h * 10 );
        var pos = grid_pos.add( base_pos );
        setElement( idx, positions, pos );
    }
    positions.needUpdate = true;
}

ClothInitializer.prototype.initializeVelocities = function ( velocities, toSpawn) {
    var base_vel = this._opts.velocity;
    for ( var i = 0 ; i < toSpawn.length ; ++i ) {
        var idx = toSpawn[i];
        setElement( idx, velocities, base_vel  );
    }
    velocities.needUpdate = true;
}

ClothInitializer.prototype.initializeColors = function ( colors, toSpawn) {
    var base_col = this._opts.color;
    for ( var i = 0 ; i < toSpawn.length ; ++i ) {
        var idx = toSpawn[i];
        var col = base_col;
        setElement( idx, colors, col );
    }
    colors.needUpdate = true;
}

ClothInitializer.prototype.initializeSizes = function ( sizes, toSpawn) {
    for ( var i = 0 ; i < toSpawn.length ; ++i ) {
        var idx = toSpawn[i];
        setElement( idx, sizes, 1 );
    }
    sizes.needUpdate = true;
}

ClothInitializer.prototype.initializeLifetimes = function ( lifetimes, toSpawn) {
    for ( var i = 0 ; i < toSpawn.length ; ++i ) {
        var idx = toSpawn[i];
        setElement( idx, lifetimes, Math.INFINITY );
    }
    lifetimes.needUpdate = true;
}


ClothInitializer.prototype.initialize = function ( particleAttributes, toSpawn, width, height ) {

    // update required values
    this.initializePositions( particleAttributes.position, toSpawn, width, height );

    this.initializeVelocities( particleAttributes.velocity, toSpawn );

    this.initializeColors( particleAttributes.color, toSpawn );

    this.initializeLifetimes( particleAttributes.lifetime, toSpawn );

    this.initializeSizes( particleAttributes.size, toSpawn );

    // mark normals to be updated
    particleAttributes["normal"].needsUpdate = true;

};


////////////////////////////////////////////////////////////////////////////////
// mySystem
////////////////////////////////////////////////////////////////////////////////

function MyInitializer ( opts ) {
    this._opts = opts;
    return this;
};

MyInitializer.prototype.initializePositions = function ( positions, toSpawn) {
    var base_pos = this._opts.position;
    for ( var i = 0 ; i < toSpawn.length ; ++i ) {
        var idx = toSpawn[i];
        var x = Math.random() * 100 - 50;
        var y = Math.random() * 100 - 50;
        var z = -50;
        var pos = new THREE.Vector3(x, y, z);
        pos.add(base_pos);
        setElement( idx, positions, pos );

    }
    positions.needUpdate = true;
}

MyInitializer.prototype.initializeVelocities = function ( velocities, positions, toSpawn ) {
    var base_vel = this._opts.velocity;
    for ( var i = 0 ; i < toSpawn.length ; ++i ) {
        var idx = toSpawn[i];
        // ----------- STUDENT CODE BEGIN ------------
        // just to get started, make the velocity the same as the initial position
        var vel = new THREE.Vector3(0, -10, 0);

        // ----------- STUDENT CODE END ------------
        setElement( idx, velocities, vel );
    }
    velocities.needUpdate = true;
}

MyInitializer.prototype.initializeColors = function ( colors, toSpawn ) {
    var base_col = this._opts.color;
    for ( var i = 0 ; i < toSpawn.length ; ++i ) {
        var idx = toSpawn[i];
        // ----------- STUDENT CODE BEGIN ------------
        var col = base_col;

        // ----------- STUDENT CODE END ------------
        setElement( idx, colors, col );
    }
    colors.needUpdate = true;
}

MyInitializer.prototype.initializeSizes = function ( sizes, toSpawn ) {

    for ( var i = 0 ; i < toSpawn.length ; ++i ) {
        var idx = toSpawn[i];
        // ----------- STUDENT CODE BEGIN ------------
        var size = this._opts.size;

        // ----------- STUDENT CODE END ------------
        setElement( idx, sizes, size );
    }
    sizes.needUpdate = true;
}

MyInitializer.prototype.initializeLifetimes = function ( lifetimes, toSpawn ) {

    for ( var i = 0 ; i < toSpawn.length ; ++i ) {
        var idx = toSpawn[i];
        // ----------- STUDENT CODE BEGIN ------------
        var lifetime = this._opts.lifetime;

        // ----------- STUDENT CODE END ------------
        setElement( idx, lifetimes, lifetime );
    }
    lifetimes.needUpdate = true;
}


MyInitializer.prototype.initialize = function ( particleAttributes, toSpawn ) {
    this.initializePositions( particleAttributes.position, toSpawn );
    this.initializeVelocities( particleAttributes.velocity, particleAttributes.position, toSpawn );
    this.initializeColors( particleAttributes.color, toSpawn );
    this.initializeLifetimes( particleAttributes.lifetime, toSpawn );
    this.initializeSizes( particleAttributes.size, toSpawn );

};

MyInitializer.prototype.initializeAsteroids = function ( asteroids, asteroidAttributes, asteroidsToSpawn ) {
    //this.initializeAsteroidEverything( asteroids, asteroidAttributes, asteroidsToSpawn );
    var velocities = asteroidAttributes.velocity;
    var rotation = asteroidAttributes.rotation; 
    for ( var i = 0; i < asteroidsToSpawn.length; ++i ) {
        var idx = asteroidsToSpawn[i];
        var mesh = asteroids[idx];

        // position
        var x = Math.random() * 2667 - 2667 / 2;
        var y = Math.random() * 1500 - 1500 / 2;
        var z = -1150;
        mesh.position.set(x, y, z);

        // size
        var scale = Math.random() * 8 + 1;
        mesh.scale.set(scale, scale, scale);

        // velocity
        var baseVel = new THREE.Vector3(0.0, 0.0, 100 / scale); // smaller things move faster
        setElement(idx, velocities, baseVel);

        // rotation
        var xRot = Math.random() * 6.28;
        var yRot = Math.random() * 6.28;
        var zRot = Math.random() * 6.28;
        mesh.rotation.x = xRot;
        mesh.rotation.y = yRot;
        mesh.rotation.z = zRot;
        var rotVel = Math.random() * 3.14;
        setElement(idx, rotation, rotVel);

    }
}


