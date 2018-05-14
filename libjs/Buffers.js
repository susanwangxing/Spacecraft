THREE.Int8BufferAttribute = function ( array, itemSize, normalized ) {

	THREE.BufferAttribute.call( this, new Int8Array( array ), itemSize, normalized );

}

THREE.Int8BufferAttribute.prototype = Object.create( THREE.BufferAttribute.prototype );
THREE.Int8BufferAttribute.prototype.constructor = THREE.Int8BufferAttribute;


THREE.Uint8BufferAttribute = function ( array, itemSize, normalized ) {

	THREE.BufferAttribute.call( this, new Uint8Array( array ), itemSize, normalized );

}

THREE.Uint8BufferAttribute.prototype = Object.create( THREE.BufferAttribute.prototype );
THREE.Uint8BufferAttribute.prototype.constructor = THREE.Uint8BufferAttribute;


THREE.Uint8ClampedBufferAttribute = function ( array, itemSize, normalized ) {

	THREE.BufferAttribute.call( this, new Uint8ClampedArray( array ), itemSize, normalized );

}

THREE.Uint8ClampedBufferAttribute.prototype = Object.create( THREE.BufferAttribute.prototype );
THREE.Uint8ClampedBufferAttribute.prototype.constructor = THREE.Uint8ClampedBufferAttribute;


THREE.Int16BufferAttribute = function ( array, itemSize, normalized ) {

	THREE.BufferAttribute.call( this, new Int16Array( array ), itemSize, normalized );

}

THREE.Int16BufferAttribute.prototype = Object.create( THREE.BufferAttribute.prototype );
THREE.Int16BufferAttribute.prototype.constructor = THREE.Int16BufferAttribute;


THREE.Uint16BufferAttribute = function ( array, itemSize, normalized ) {

	THREE.BufferAttribute.call( this, new Uint16Array( array ), itemSize, normalized );

}

THREE.Uint16BufferAttribute.prototype = Object.create( THREE.BufferAttribute.prototype );
THREE.Uint16BufferAttribute.prototype.constructor = THREE.Uint16BufferAttribute;


THREE.Int32BufferAttribute = function ( array, itemSize, normalized ) {

	THREE.BufferAttribute.call( this, new Int32Array( array ), itemSize, normalized );

}

THREE.Int32BufferAttribute.prototype = Object.create( THREE.BufferAttribute.prototype );
THREE.Int32BufferAttribute.prototype.constructor = THREE.Int32BufferAttribute;


THREE.Uint32BufferAttribute = function ( array, itemSize, normalized ) {

	THREE.BufferAttribute.call( this, new Uint32Array( array ), itemSize, normalized );

}

THREE.Uint32BufferAttribute.prototype = Object.create( THREE.BufferAttribute.prototype );
THREE.Uint32BufferAttribute.prototype.constructor = THREE.Uint32BufferAttribute;


THREE.Float32BufferAttribute = function ( array, itemSize, normalized ) {

	THREE.BufferAttribute.call( this, new Float32Array( array ), itemSize, normalized );

}

THREE.Float32BufferAttribute.prototype = Object.create( THREE.BufferAttribute.prototype );
THREE.Float32BufferAttribute.prototype.constructor = THREE.Float32BufferAttribute;


THREE.Float64BufferAttribute = function ( array, itemSize, normalized ) {

	THREE.BufferAttribute.call( this, new Float64Array( array ), itemSize, normalized );

}

THREE.Float64BufferAttribute.prototype = Object.create( THREE.BufferAttribute.prototype );
THREE.Float64BufferAttribute.prototype.constructor = THREE.Float64BufferAttribute;
