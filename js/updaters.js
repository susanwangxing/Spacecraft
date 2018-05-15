/*
 * In this file you can specify all sort of updaters
 *  We provide an example of simple updater that updates pixel positions based on initial velocity and gravity
 */

////////////////////////////////////////////////////////////////////////////////
// Collisions
////////////////////////////////////////////////////////////////////////////////

var Collisions = Collisions || {};


Collisions.BouncePlane = function ( particleAttributes, alive, delta_t, plane, damping ) {
    var positions    = particleAttributes.position;
    var velocities   = particleAttributes.velocity;

    for ( var i = 0 ; i < alive.length ; ++i ) {

        if ( !alive[i] ) continue;
        // ----------- STUDENT CODE BEGIN ------------
        var pos = getElement( i, positions );
        var vel = getElement( i, velocities ); 
        if (pos.x * plane.x + pos.y * plane.y + pos.z * plane.z + plane.w <= 0) {
            var normal = new THREE.Vector3(plane.x, plane.y, plane.z);
            normal.normalize();
            vel = vel.reflect(normal);
            vel.multiplyScalar(damping);
        }
        setElement( i, positions, pos );
        setElement( i, velocities, vel );
        // ----------- STUDENT CODE END ------------
    }
};

Collisions.SinkPlane = function ( particleAttributes, alive, delta_t, plane  ) {
    var positions   = particleAttributes.position;
    for ( var i = 0 ; i < alive.length ; ++i ) {

        if ( !alive[i] ) continue;
        // ----------- STUDENT CODE BEGIN ------------
        var pos = getElement( i, positions );
        if (pos.x * plane.x + pos.y * plane.y + pos.z * plane.z + plane.w <= 0) {
            killPartilce( i, particleAttributes, alive );
        }
        // ----------- STUDENT CODE END ------------
    }
};

Collisions.BounceSphere = function ( particleAttributes, alive, delta_t, sphere, damping ) {
    var positions    = particleAttributes.position;
    var velocities   = particleAttributes.velocity;
    var center = new THREE.Vector3(sphere.x, sphere.y, sphere.z);
    var radius = sphere.w;
    for ( var i = 0 ; i < alive.length ; ++i ) {

        if ( !alive[i] ) continue;
        // ----------- STUDENT CODE BEGIN ------------
        var pos = getElement( i, positions );
        var vel = getElement( i, velocities );
        // inside the sphere
        if (pos.distanceTo(center) < radius) {
            var normal = pos.clone().sub(center).normalize();
            vel = vel.reflect(normal);
            vel.multiplyScalar(damping);
            // project cloth back to surface of sphere
            pos = normal.clone().multiplyScalar(radius);
        }
        setElement( i, positions, pos );
        setElement( i, velocities, vel );
        // ----------- STUDENT CODE END ------------
    }
}

////////////////////////////////////////////////////////////////////////////////
// MyUpdater
////////////////////////////////////////////////////////////////////////////////

function MyUpdater ( opts ) {
    this._opts = opts;
    return this;
};

MyUpdater.prototype.updatePositions = function ( particleAttributes, alive, delta_t ) {
    var positions  = particleAttributes.position;
    var velocities = particleAttributes.velocity;

    for ( var i  = 0 ; i < alive.length ; ++i ) {
        if ( !alive[i] ) continue;
        var p = getElement( i, positions );
        var v = getElement( i, velocities );
        p.add( v.clone().multiplyScalar( delta_t ) );
        setElement( i, positions, p );
    }
};

MyUpdater.prototype.updateVelocities = function ( particleAttributes, alive, delta_t ) {
    var positions = particleAttributes.position;
    var velocities = particleAttributes.velocity;
    var gravity = this._opts.externalForces.gravity;

    for ( var i = 0 ; i < alive.length ; ++i ) {
        if ( !alive[i] ) continue;
        // ----------- STUDENT CODE BEGIN ------------
        var v = getElement( i, velocities );
        var force = gravity.clone();
        v.add(force.multiplyScalar(delta_t));
        setElement( i, velocities, v );
        // ----------- STUDENT CODE END ------------
    }

};

MyUpdater.prototype.updateColors = function ( particleAttributes, alive, delta_t ) {
    var colors    = particleAttributes.color;

    for ( var i = 0 ; i < alive.length ; ++i ) {

        if ( !alive[i] ) continue;
        // ----------- STUDENT CODE BEGIN ------------
        var c = getElement( i, colors );

        setElement( i, colors, c );
        // ----------- STUDENT CODE END ------------
    }
};

MyUpdater.prototype.updateLifetimes = function ( particleAttributes, alive, delta_t) {
    var positions     = particleAttributes.position;
    var lifetimes     = particleAttributes.lifetime;

    for ( var i = 0 ; i < alive.length ; ++i ) {

        if ( !alive[i] ) continue;

        var lifetime = getElement( i, lifetimes );

        if ( lifetime < 0 ) {
            killPartilce( i, particleAttributes, alive );
        } else {
            setElement( i, lifetimes, lifetime - delta_t );
        }
    }

};

MyUpdater.prototype.collisions = function ( particleAttributes, alive, delta_t ) {
    if ( !this._opts.collidables ) {
        return;
    }
    if ( this._opts.collidables.bouncePlanes ) {
        for (var i = 0 ; i < this._opts.collidables.bouncePlanes.length ; ++i ) {
            var plane = this._opts.collidables.bouncePlanes[i].plane;
            var damping = this._opts.collidables.bouncePlanes[i].damping;
            Collisions.BouncePlane( particleAttributes, alive, delta_t, plane, damping );
        }
    }

    if ( this._opts.collidables.sinkPlanes ) {
        for (var i = 0 ; i < this._opts.collidables.sinkPlanes.length ; ++i ) {
            var plane = this._opts.collidables.sinkPlanes[i].plane;
            Collisions.SinkPlane( particleAttributes, alive, delta_t, plane );
        }
    }

    if ( this._opts.collidables.bounceSpheres ) {
        for (var i = 0 ; i < this._opts.collidables.bounceSpheres.length ; ++i ) {
            var sphere = this._opts.collidables.bounceSpheres[i].sphere;
            var damping = this._opts.collidables.bounceSpheres[i].damping;
            Collisions.BounceSphere( particleAttributes, alive, delta_t, sphere, damping );
        }
    }
};


MyUpdater.prototype.update = function ( particleAttributes, alive, delta_t ) {
    this.updateVelocities( particleAttributes, alive, delta_t );
    this.updatePositions( particleAttributes, alive, delta_t );
    this.updateColors( particleAttributes, alive, delta_t );
    this.updateLifetimes( particleAttributes, alive, delta_t );
    this.collisions( particleAttributes, alive, delta_t );

    // tell webGL these were updated
    particleAttributes.color.needsUpdate = true;
    particleAttributes.position.needsUpdate = true;
    particleAttributes.velocity.needsUpdate = true;
    particleAttributes.lifetime.needsUpdate = true;

};

MyUpdater.prototype.updateAsteroids = function ( asteroids, asteroidAttributes, alive, delta_t ) {
    var velocities = asteroidAttributes.velocity;
    var rotations = asteroidAttributes.rotation;
    for ( var i = 0; i < alive.length; ++i ) {
        if (!alive[i]) continue;
        // update position
        var vel = getElement(i, velocities);
        asteroids[i].position.add(vel.clone().multiplyScalar(delta_t));

        // kill if behind spaceship
        if (asteroids[i].position.z > 20) {
            alive[i] = false;
            asteroids[i].position.set(1e9, 1e9, 1e9);
            continue;
        }

        // update rotation
        var rotVel = getElement(i, rotations);
        asteroids[i].rotation.y += rotVel * delta_t;
        asteroids[i].rotation.y %= 6.28;
    }

}
