// ------------------------------------------------//
//             http://qake.se/demo                 //
//                                                 //
//        Voxels Demo by Magnus Persson            //
//                                                 //
//  (still tidying, buggy, gravity doesn't work)   //
// (sometimes have to re-run; async loading issue) //
//                                                 //
//    (WASD to move. right-click for grenade)      //
//   (SPACE for jetpack. Key 1 or 2 for weapon)    //
//                                                 //
// ------------------- VOXELS ---------------------//

function VoxelData() {
	
	this.x;
	this.y;
	this.z;
	this.color;

	VoxelData.prototype.Create = function(_data,_onLoad,_context) {
		this.x = (_context?_data[_onLoad]&255/2:_data[_onLoad++]&255);
		this.y = (_context?_data[_onLoad]&255/2:_data[_onLoad++]&255);
		this.z = (_context?_data[_onLoad]&255/2:_data[_onLoad++]&255);
		this.color = _data[_onLoad]&255;
	};
};

VoxelData.prototype = new VoxelData();
VoxelData.prototype.constructor = VoxelData;

function Vox() {
	var _colors=[0,4294967295,4291624959,4288282623,4284940287,4281597951,4278255615,4294954239,4291611903,4288269567,4284927231,4281584895,
		4278242559,4294941183,4291598847,4288256511,4284914175,4281571839,4278229503,4294928127,4291585791,4288243455,4284901119,4281558783,
		4278216447,4294915071,4291572735,4288230399,4284888063,4281545727,4278203391,4294902015,4291559679,4288217343,4284875007,4281532671,
		4278190335,4294967244,4291624908,4288282572,4284940236,4281597900,4278255564,4294954188,4291611852,4288269516,4284927180,4281584844,
		4278242508,4294941132,4291598796,4288256460,4284914124,4281571788,4278229452,4294928076,4291585740,4288243404,4284901068,4281558732,
		4278216396,4294915020,4291572684,4288230348,4284888012,4281545676,4278203340,4294901964,4291559628,4288217292,4284874956,4281532620,
		4278190284,4294967193,4291624857,4288282521,4284940185,4281597849,4278255513,4294954137,4291611801,4288269465,4284927129,4281584793,
		4278242457,4294941081,4291598745,4288256409,4284914073,4281571737,4278229401,4294928025,4291585689,4288243353,4284901017,4281558681,
		4278216345,4294914969,4291572633,4288230297,4284887961,4281545625,4278203289,4294901913,4291559577,4288217241,4284874905,4281532569,
		4278190233,4294967142,4291624806,4288282470,4284940134,4281597798,4278255462,4294954086,4291611750,4288269414,4284927078,4281584742,
		4278242406,4294941030,4291598694,4288256358,4284914022,4281571686,4278229350,4294927974,4291585638,4288243302,4284900966,4281558630,
		4278216294,4294914918,4291572582,4288230246,4284887910,4281545574,4278203238,4294901862,4291559526,4288217190,4284874854,4281532518,
		4278190182,4294967091,4291624755,4288282419,4284940083,4281597747,4278255411,4294954035,4291611699,4288269363,4284927027,4281584691,
		4278242355,4294940979,4291598643,4288256307,4284913971,4281571635,4278229299,4294927923,4291585587,4288243251,4284900915,4281558579,
		4278216243,4294914867,4291572531,4288230195,4284887859,4281545523,4278203187,4294901811,4291559475,4288217139,4284874803,4281532467,
		4278190131,4294967040,4291624704,4288282368,4284940032,4281597696,4278255360,4294953984,4291611648,4288269312,4284926976,4281584640,
		4278242304,4294940928,4291598592,4288256256,4284913920,4281571584,4278229248,4294927872,4291585536,4288243200,4284900864,4281558528,
		4278216192,4294914816,4291572480,4288230144,4284887808,4281545472,4278203136,4294901760,4291559424,4288217088,4284874752,4281532416,
		4278190318,4278190301,4278190267,4278190250,4278190216,4278190199,4278190165,4278190148,4278190114,4278190097,4278251008,4278246656,
		4278237952,4278233600,4278224896,4278220544,4278211840,4278207488,4278198784,4278194432,4293787648,4292673536,4290445312,4289331200,
		4287102976,4285988864,4283760640,4282646528,4280418304,4279304192,4293848814,4292730333,4290493371,4289374890,4287137928,4286019447,
		4283782485,4282664004,4280427042,4279308561];
	
	// var kolors = [0,FFFFFFFF,FFCCFFFF,FF99FFFF,FF66FFFF,FF33FFFF,FF00FFFF,FFFFCCFF,FFFF99FF,FFFF66FF,FFFF33FF,FFFF00FF,FF00CCFF...];
	
	Vox.prototype.readInt = function(_context,_onLoad) {
		return _context[_onLoad]|(_context[_onLoad+1]<<8)|(_context[_onLoad+2]<<16)|(_context[_onLoad+3]<<24);
	};
	
	Vox.prototype.LoadModel = function(_context,_filename,_arraybuffer,_0x1673xa) {
		var _request = new XMLHttpRequest();
		_request.overrideMimeType("text/plain; charset=x-user-defined");
		_request.open("GET",_context);
		_request.responseType = "arraybuffer";
		var _onLoad = 0;
		if (_0x1673xa==TYPE_OBJECT) {
			_onLoad= new Chunk();
			_onLoad.type=1;
			_onLoad.blockList= new Array();
		}
		var _model = this;
		
		_request.onload = function(_e) {
			
			var _0x1673xe = [];
			var _colors = undefined;
			var _blocks = [];
			
			console.log("Loaded model: "+_request.responseURL);
			
			var _response = _request.response;
			if (_response) {
				var _blockdata = new Uint8Array(_response);
				var _0x1673x13 =_model.readInt(_blockdata,0);
				var _0x1673x14 =_model.readInt(_blockdata,4);
				var _0x1673x15 = 8;
				
				while (_0x1673x15<_blockdata.length) {
					var _mesh = false;
					var _0x1673x17=0;
					var _0x1673x18=0;
					var _0x1673x19=0;
					var _0x1673x1a=String.fromCharCode(parseInt(_blockdata[_0x1673x15++]))+String.fromCharCode(parseInt(_blockdata[_0x1673x15++]))+String.fromCharCode(parseInt(_blockdata[_0x1673x15++]))+String.fromCharCode(parseInt(_blockdata[_0x1673x15++]));
					var _0x1673x1b=_model.readInt(_blockdata,_0x1673x15)&255;_0x1673x15+=4;
					var _0x1673x1c=_model.readInt(_blockdata,_0x1673x15)&255;_0x1673x15+=4;
					
					if (_0x1673x1a=="SIZE") {
						_0x1673x17=_model.readInt(_blockdata,_0x1673x15)&255;
						_0x1673x15+=4;
						_0x1673x18=_model.readInt(_blockdata,_0x1673x15)&255;
						_0x1673x15+=4;_0x1673x19=_model.readInt(_blockdata,_0x1673x15)&255;
						_0x1673x15+=4;
						if (_0x1673x17>32||_0x1673x18>32) {
							_mesh=true;
						}
						_0x1673x15+=_0x1673x1b-4*3;
					} else {
						if (_0x1673x1a=="XYZI") {
							var _0x1673x1d=Math.abs(_model.readInt(_blockdata,_0x1673x15));
							_0x1673x15+=4;
							_blocks= new Array(_0x1673x1d);
							for (var _n=0;_n<_blocks.length;_n++) {
								_blocks[_n]= new VoxelData();
								_blocks[_n].Create(_blockdata,_0x1673x15,_mesh);
								_0x1673x15+=4
							}
						} else {
							if (_0x1673x1a=="RGBA") {
								_colors= new Array(256);
								for (var _n = 0;_n < 256; _n++){
									var _0x1673x1f = _blockdata[_0x1673x15++]&255;
									var _0x1673x20 = _blockdata[_0x1673x15++]&255;
									var _0x1673x21 = _blockdata[_0x1673x15++]&255;
									var _0x1673x22 = _blockdata[_0x1673x15++]&255;
									_colors[_n] = { r:_0x1673x1f,g:_0x1673x20,b:_0x1673x21,a:_0x1673x22 }
								}
							} else {_0x1673x15+=_0x1673x1b; }
						}
					}
				}
				
				if (_blocks==null||_blocks.length==0) { return null }
				
				var totalBlocks = 0;
				
				for (var _n = 0; _n < _blocks.length; _n++) {
					if (_colors==undefined) {
						var _color = _colors[Math.abs(_blocks[_n].color-1)];
						var _rgb = { b:(_color & 16711680) >> 16, g:(_color & 65280) >> 8, r:(_color & 255), a:1 }
					} else {
						var _color = _colors[Math.abs(_blocks[_n].color-1)];
						var _lengthx = _blocks[_n].x;
						var _lengthy = _blocks[_n].y;
						var _lengthz = _blocks[_n].z;
						if (_0x1673xa==TYPE_MAP) {
							for (var _x = _lengthx*2+1; _x < _lengthx*2+3; _x++) {
								for (var _y = _lengthz*2+1;_y < _lengthz*2+3; _y++) {
									for (var _z=_lengthy*2+1;_z < _lengthy*2+3;_z++) {
										game.world.AddBlock(_x,_y,195-_z,[_color.r,_color.g,_color.b]);
										totalBlocks++;
									}
								}
							}
						} else {
							if (_0x1673xa==TYPE_OBJECT) {
								var _object= new Object();
								_object.x=_lengthx+5;
								_object.y=_lengthy+10;
								_object.z=_lengthz+7;
								_object.color=[_color.r,_color.g,_color.b];
								game.world.AddBlock(_lengthx+5,_lengthz+5,_lengthy+10,[_color.r,_color.g,_color.b]);
								_onLoad.blockList.push(_object);
							}
						}
					}
				}
				
				// totalBlocks = _0x1673x23
				console.log("TOTAL BLOCKS: ",totalBlocks);
				
				if (_0x1673xa==TYPE_OBJECT) {
					_onLoad.dirty=true;
					_onLoad.fromX=1000;
					_onLoad.fromY=1000;
					_onLoad.fromZ=1000;
					_onLoad.type=CHUNK_OBJECT;
					for(var _0x1673x2d=0; _0x1673x2d<_onLoad.blockList.length; _0x1673x2d++) {
						var _block=_onLoad.blockList[_0x1673x2d];
						_block.val = game.world.blocks[_block.x][_block.y][_block.z];
						if (_block.x<_onLoad.fromX) {
							_onLoad.fromX=_block.x;
						}
						if (_block.x>_onLoad.toX) {
							_onLoad.toX=_block.x;
						}
						if (_block.y>_onLoad.toY) {
							_onLoad.toY=_block.y;
						}
						if (_block.y<_onLoad.fromZ) {
							_onLoad.fromZ=_block.y;
						}
						if (_block.z<_onLoad.fromY) {
							_onLoad.fromY=_block.z; 
						}
						if (_block.z>_onLoad.toZ) {
							_onLoad.toZ=_block.z;
						}
								
					}
							
					_onLoad.fromX-=2;
					_onLoad.fromZ-=6;_onLoad.fromY -= 2;
					_onLoad.toX+=2;_onLoad.toY += 4;
					_onLoad.toZ+=8;game.world.RebuildChunk(_onLoad);
					_onLoad.mesh.visible = false;
					_filename(_model,_response,_onLoad);
				} else {
					game.world.RebuildDirtyChunks(1);
					_filename(_model,_response);
				}
			} else {
				_request.onerror = function() { alert("BufferLoader: XHR error") }
			}
		}
		
		_request.send();
	}
};

Vox.prototype = new Vox();
Vox.prototype.constructor = Vox;


/////* _________________________________ Sound ______________________________________ */////


function SoundLoader() {
	this.sounds = new Array();
	this.context;
	this.muted = false;
	
	SoundLoader.prototype.StopSound = function(_file) {
		var _context = this.sounds[_file].context;
		_context.stop=_context.noteOff;
		_context.stop(0)
	};
	
	SoundLoader.prototype.PlaySound = function(_arraybuffer,_context,_distance) {
		var _sound = this.sounds[_arraybuffer].context.createBufferSource();
		_sound.buffer = this.sounds[_arraybuffer].buffer;
		var _soundbuffer = this.sounds[_arraybuffer].context.createGain();
		_sound.connect(_soundbuffer);
		_soundbuffer.connect(this.sounds[_arraybuffer].context.destination);
		if (_context != undefined) {
			var _onLoad = game.camera.localToWorld( new THREE.Vector3(0,0,0));
			var _range=_context.distanceTo(_onLoad);
			if (_range<=_distance) {
				var _volume=1*(1-_range/_distance);
				_soundbuffer.gain.value=_volume;
				_sound.start(0);
			} else {
				_soundbuffer.gain.value=0;
			}
		} else {
			_soundbuffer.gain.value=1;
			_sound.start(0);
		}
	};
	
	SoundLoader.prototype.Add = function(_context) {
		this.sounds[_context.name]= new Object();
		window.AudioContext=window.AudioContext || window.webkitAudioContext;
		if (this.context==undefined) {
			this.context= new AudioContext();
		}
		var _sound= new BufferLoader(this.context,[_context.file],this.Load.bind(this,_context.name));
		this.sounds[_context.name].context = this.context;
		_sound.load();
	};
	
	SoundLoader.prototype.Load = function(_context,_sound) {
		this.sounds[_context].buffer=_sound[0];
	};
};

/////* _________________________________ Buffer ______________________________________ */////


function BufferLoader(_context,_urlList,_onLoad) {
	// _context = _0x1673x6
	this.context = _context;
	// _urlList = _0x1673x4
	this.urlList = _urlList;
	// _onLoad = _0x1673x5
	this.onload = _onLoad;
	this.bufferList= new Array();
	this.loadCount=0;
	
	BufferLoader.prototype.loadBuffer = function(_filename,_0x1673xa) {
		console.log("URL: " + _filename);
		// _request = _0x1673xc
		var _request = new XMLHttpRequest();
		_request.overrideMimeType("text/plain; charset=x-user-defined");
		
		_request.open("GET",_filename);
		
		// _request.addEventListener("load", this);
		
		_request.responseType = "arraybuffer";
		
		// _arraybuffer = _0x1673x9
		var _arraybuffer = this;
		
		_request.onload = function(_e) {
			// alert(_request);
			_arraybuffer.context.decodeAudioData(_request.response,function(_request) {
				if (!_request) {
					alert("error decoding file data: "+_filename);
					return;
				};
				_arraybuffer.bufferList[_0x1673xa]=_request;
				if (++_arraybuffer.loadCount==_arraybuffer.urlList.length) {
					_arraybuffer.onload(_arraybuffer.bufferList);
				}
			},function(_request) {
				console.log("ERROR FOR URL: "+_filename);
				console.log("decodeAudioData error",_request);
			});
		};
		
		_request.onerror = function() { alert("BufferLoader: XHR error") }
		
		_request.send();
	};
	
	// two?
	BufferLoader.prototype.load = function() {
		for (var _arraybuffer=0; _arraybuffer<this.urlList.length; ++_arraybuffer) {
			this.loadBuffer(this.urlList[_arraybuffer],_arraybuffer);
		}
	};
};


var lfsr = (function() {
	
	var _urlList=Math.pow(2,16),_arraybuffer=0,_context,_onLoad;
	
	return { setSeed:function(_0x1673xa) {
		
		_onLoad = _context = _0x1673xa||Math.round(Math.random()*_urlList)},rand:function() {
			var _0x1673xa;
			_0x1673xa=((_onLoad>>0)^(_onLoad>>2)^(_onLoad>>3)^(_onLoad>>5))&1;
			_onLoad=(_onLoad>>1)|(_0x1673xa<<15);
			_arraybuffer++;
			return _onLoad/_urlList;	
		}
	}
}());

lfsr.setSeed();


/////* _________________________________ Player ______________________________________ */////


function Player() {
	this.name = "John Doe";
	this.hp = 0;
	this.weapon = WEAPON_NONE;
	this.rotateAngle = 0;
	this.moveDistance = 0;
	
	// chunks
	this.run1Chunk = undefined;
	this.run2Chunk = undefined;
	this.run1RocketChunk = undefined;
	this.run2RocketChunk = undefined;
	this.run1ShotgunChunk = undefined;
	this.run2ShotgunChunk = undefined;
	this.jumpChunk = undefined;
	this.jumpRocketChunk = undefined;
	this.jumpShotgunChunk = undefined;
	this.standChunk = undefined;
	this.standRocketChunk = undefined;
	this.standShotgunChunk = undefined;
	this.fallChunk = undefined;
	this.fallRocketChunk = undefined;
	this.fallShotgunChunk = undefined;
	this.shootChunk = undefined;
	this.shootRocketChunk = undefined;
	this.shootShotgunChunk = undefined;
	this.chunk = undefined;
	
	this.currentModel = MODEL_STAND;
	this.runTime = 0;
	this.jumpTime = 0;
	this.cameraAttached = false;
	this.camera = new THREE.Object3D();
	this.mass = 4;
	this.area = 1;
	this.vy = 1;
	this.avg_ay = 1;
	this.gravity = 9.82;
	this.airDensity = 1.2;
	this.jumping = false;
	this.keyboard = new THREEx.KeyboardState();
	this.shooting = false;
	this.attachedCamera = false;
	this.cameraObj = undefined;
	this.canWalkLeft = true;
	this.canWalkRight = true;
	this.canWalkForward = true;
	this.canWalkBackward = true;
	this.canJump = true;
	this.canFall = true;
	
	// this.player = undefined;
	this.mesh = undefined;
	
	Player.prototype.Init = function(_name) {
		
		this.AddBindings();
		this.name = _name;
		this.hp = MAX_HP;
		
		var _chunkArray = [this.run1Chunk,this.run2Chunk,this.run1RocketChunk,this.run2RocketChunk,this.run1ShotgunChunk,this.run2ShotgunChunk,this.jumpChunk,this.jumpRocketChunk,this.jumpShotgunChunk,this.standChunk,this.standRocketChunk,this.standShotgunChunk,this.fallChunk,this.fallRocketChunk,this.fallShotgunChunk,this.shootChunk,this.shootRocketChunk,this.shootShotgunChunk];
		
		for (var _n = 0; _n < _chunkArray.length; _n++) {
			
			// reset all chunks
			var _player = _chunkArray[_n].mesh;
			_player.position.set(0,0,0);
			_player.rotation.set(0,0,0);
			_player.geometry.center();
			_player.geometry.verticesNeedUpdate = true;
		}
		
		this.SwitchModel(MODEL_STAND);
		this.mesh.position.set(153,21,55);
		this.cameraObj = new THREE.Object3D();
		this.cameraObj.add(game.camera);
		this.attachedCamera = true;
		game.camera.position.set(0,400,0);
		game.camera.lookAt(this.cameraObj);
		game.camera.rotation.set(-1.57,0,0),game.camera.quaternion.set(-0.7,0,0,0.7);
		this.cameraObj.rotation.set(Math.PI/1.5,0,-Math.PI);
		this.weapon = WEAPON_NONE;
		var _playerX = this.mesh.position.x+6|0;
		var _playerY = this.mesh.position.y+3|0;
		var _playerZ = this.mesh.position.z+6|0;
		var _vector = new THREE.Vector3(-1,-3,-3);
		var _player =_vector.applyMatrix4(this.mesh.matrix);
		var _onLoad = new THREE.PointLight(16763904,1,10);
		_onLoad.position.set(_player.x,_player.y+1,_player.z);
		this.jumpChunk.mesh.add(_onLoad.clone());
		this.jumpRocketChunk.mesh.add(_onLoad.clone());
		this.jumpShotgunChunk.mesh.add(_onLoad.clone());
		var _context = _onLoad.clone();
		_context.position.set(_player.x,_player.y,_player.z + 4);
		this.shootShotgunChunk.mesh.add(_onLoad.clone());
		
	};
		
	Player.prototype.SwitchWeapon = function(_urlList) {
		this.weapon=_urlList;
		this.SwitchModel(MODEL_STAND);
	};
	
	Player.prototype.SwitchModel = function(_context) {
		if (this.shooting){ return }
		if (this.currentModel==_context&&this.mesh!=undefined){ return }
		var _onLoad,_urlList;
		if (this.mesh!=undefined) {
			this.mesh.remove(this.cameraObj);
			this.mesh.visible = false;
			_onLoad = this.mesh.position;
			_urlList = this.mesh.rotation;
		} else {
			_onLoad= new THREE.Vector3(0,0,0);
			_urlList= new THREE.Vector3(0,0,0);
		}
		
		switch (_context) {
			case MODEL_JUMP:switch(this.weapon) {
				case WEAPON_SHOTGUN:this.mesh=this.jumpShotgunChunk.mesh;
					this.chunk=this.jumpShotgunChunk; break;
				case WEAPON_ROCKET:this.mesh=this.jumpRocketChunk.mesh;
					this.chunk=this.jumpRocketChunk; break;
				case WEAPON_NONE:this.mesh=this.jumpChunk.mesh;
					this.chunk=this.jumpChunk; break
			}; break;
			
			case MODEL_STAND:switch(this.weapon) {
				case WEAPON_SHOTGUN:this.mesh=this.standShotgunChunk.mesh;
					this.chunk=this.standShotgunChunk; break;
				case WEAPON_ROCKET:this.mesh=this.standRocketChunk.mesh;
					this.chunk=this.standRocketChunk; break;
				case WEAPON_NONE:this.mesh=this.standChunk.mesh;
					this.chunk=this.standChunk; break
				}; break;
				
			case MODEL_RUN1:switch(this.weapon) {
				case WEAPON_SHOTGUN:this.mesh=this.run1ShotgunChunk.mesh;
					this.chunk=this.run1ShotgunChunk; break;
				case WEAPON_ROCKET:this.mesh=this.run1RocketChunk.mesh;
					this.chunk=this.run1RocketChunk; break;
				case WEAPON_NONE:this.mesh=this.run1Chunk.mesh;
					this.chunk=this.run1Chunk; break
				}; break;
			
			case MODEL_RUN2:switch(this.weapon) {
				case WEAPON_SHOTGUN:this.mesh=this.run2ShotgunChunk.mesh;
					this.chunk=this.run2ShotgunChunk; break;
				case WEAPON_ROCKET:this.mesh=this.run2RocketChunk.mesh;
					this.chunk=this.run2RocketChunk; break;
				case WEAPON_NONE:this.mesh=this.run2Chunk.mesh;
					this.chunk=this.run2Chunk; break;
				}; break;
				
			case MODEL_SHOOT:switch(this.weapon) {
				case WEAPON_SHOTGUN:this.mesh=this.shootShotgunChunk.mesh;
					this.chunk=this.shootShotgunChunk; break;
				case WEAPON_ROCKET:this.mesh=this.shootRocketChunk.mesh;
					this.chunk=this.shootRocketChunk; break;
				case WEAPON_NONE:this.mesh=this.shootChunk.mesh;
					this.chunk=this.shootChunk; break;
			}; break;
			
			case MODEL_FALL:switch(this.weapon) {
				case WEAPON_SHOTGUN:this.mesh=this.fallShotgunChunk.mesh;
					this.chunk=this.fallShotgunChunk; break;
				case WEAPON_ROCKET:this.mesh=this.fallRocketChunk.mesh;
					this.chunk=this.fallRocketChunk; break;
				case WEAPON_NONE:this.mesh=this.fallChunk.mesh;
					this.chunk=this.fallChunk; break;
			}; break;
		
		default:this.mesh = this.standChunk.mesh;
		this.chunk = this.standChunk};
		this.mesh.position.set(_onLoad.x,_onLoad.y,_onLoad.z);
		this.mesh.rotation.set(_urlList.x,_urlList.y,_urlList.z);
		this.currentModel = _context;
		this.mesh.updateMatrixWorld();
		this.mesh.add(this.cameraObj);
		this.mesh.visible = true;
	};
	
	Player.prototype.AddBindings = function() {
		$(document).mouseup(this.OnMouseUp.bind(this));
		$(document).mousemove(this.OnMouseMove.bind(this));
		$(document).mousedown(this.OnMouseDown.bind(this));
	};
	
	Player.prototype.RemoveBindings = function() {
		$(document).unbind(mouseup);
		$(document).unbind(mousemove);
		$(document).unbind(mousedown);
	};
	
	Player.prototype.OnMouseMove = function(_context) {
		// _mouseMove = _0x1673x8
		var _mouseMove = _context.originalEvent;
		var _mx = _mouseMove.movementX || _mouseMove.mozMovementX || 0;
		var _mz = _mouseMove.movementZ || _mouseMove.mozMovementZ || 0;
		var _rotate = _mx * 0.0075;
		var _my = _mz * 0.001;
		if (this.mesh != undefined) {
			var _vector = new THREE.Vector3(0,1,0);
			var _onLoad = new THREE.Matrix4();
			_onLoad.makeRotationAxis(_vector.normalize(),-(Math.PI/2)*_rotate);
			this.mesh.matrix.multiply(_onLoad);
			this.mesh.rotation.setFromRotationMatrix(this.mesh.matrix);
		}
	};
	
	Player.prototype.OnMouseDown = function(_e){
		if (this.dead) { return }
		var _button =_e.keyCode||_e.which;
		if (_button!=1) { return }
		this.SwitchModel(MODEL_SHOOT);
		this.shooting = true;
	};
	
	Player.prototype.OnMouseUp = function(_e) {
		if (this.dead) { return }
		var _button = _e.keyCode || _e.which;
		if (_button==1) {
			switch(this.weapon) {
				case WEAPON_ROCKET:this.CreateMissile(); break;
				case WEAPON_SHOTGUN:this.CreateShot(); break;
			}
			this.shooting=false;
		} else {
			if (_button==3) { this.CreateGrenade(); }
		}
	};
	
	Player.prototype.CreateGrenade = function() {
		
		var _onLoad = game.phys.Get();
		var _vector = new THREE.Vector3(3,2,5);
		
		// matrix undefined
		var _context = _vector.applyMatrix4(this.mesh.matrix);
		
		if (_onLoad!=undefined) {
			_onLoad.Create(_context.x,_context.y,_context.z,0,66,0,5,4,PHYS_GRENADE,5,0.1);
			_onLoad.mesh.scale.set(1.5,1.5,1.5);
			game.sound.PlaySound("threw",this.mesh.position,500);
			var _urlList= new THREE.PointLight(16763904,1,50);
			_urlList.position.set(0,0,0);
			_onLoad.mesh.light=_urlList;
			_onLoad.mesh.add(_urlList);
		}
	};
	
	Player.prototype.CreateShot=function() {
		
		var _vect1= new THREE.Vector3(3,0,3);
		var _vec1=_vect1.applyMatrix4(this.mesh.matrix);
		
		var _vect2= new THREE.Vector3(-3,0,3);
		var _vec2=_vect2.applyMatrix4(this.mesh.matrix);
		
		for (var _n = 0; _n < 5; _n++) {
			// 
			var _urlList=game.phys.Get();
			var _onLoad=150+lfsr.rand()*105|0;
			if (_urlList!=undefined) {
				_urlList.gravity= -1;
				_urlList.Create(_vec1.x,_vec1.y+1,_vec1.z,_onLoad,_onLoad,_onLoad,lfsr.rand()*1,1,PHYS_SMOKE);
			}
			//
			var _mouseMove = game.phys.Get();
			var _onLoad=150+lfsr.rand()*105|0;
			if (_mouseMove!=undefined) {
				_mouseMove.gravity= -1;
				_mouseMove.Create(_vec2.x,_vec2.y+1,_vec2.z,_onLoad,_onLoad,_onLoad,lfsr.rand()*1,1,PHYS_SMOKE);
			}
		}
		
		for (var _n = 0; _n < 5; _n++) {
			//
			var _0x1673x2c=game.phys.Get();
			if (_0x1673x2c!=undefined) {
				_0x1673x2c.Create(_vec1.x+(2-lfsr.rand()*4),_vec1.y+(2-lfsr.rand()*4),_vec1.z+(2-lfsr.rand()*4),0,0,0,20,0.4,PHYS_SHOT,1);
				_0x1673x2c.mesh.scale.set(0.5,0.5,0.5);
			}
			//
			var _context=game.phys.Get();
			if (_context!=undefined){
				_context.Create(_vec2.x+(2-lfsr.rand()*4),_vec2.y+(2-lfsr.rand()*4),_vec2.z+(2-lfsr.rand()*4),0,0,0,20,0.4,PHYS_SHOT,1);
				_context.mesh.scale.set(0.5,0.5,0.5);
			}
		}
		game.sound.PlaySound("shotgun_shoot",this.mesh.position,500);
	};
						
	Player.prototype.CreateMissile = function() {
		var _mouseMove=game.phys.Get();
		var _request= new THREE.Vector3(3,2,5);
		var _0x1673xa=_request.applyMatrix4(this.mesh.matrix);
		
		if (_mouseMove!=undefined) {
			for (var _onLoad=0;_onLoad<20;_onLoad++) {
				var _arraybuffer=game.phys.Get();
				var _context=150+lfsr.rand()*105|0;
				if (_arraybuffer!=undefined) {
					_arraybuffer.gravity= -1;
					_arraybuffer.Create(_0x1673xa.x,_0x1673xa.y+1,_0x1673xa.z,_context,_context,_context,lfsr.rand()*1,1,PHYS_SMOKE);
				}
			}
			
			_mouseMove.Create(_0x1673xa.x,_0x1673xa.y,_0x1673xa.z,255,140,0,20,1,PHYS_MISSILE,1);
			var _urlList= new THREE.PointLight(16763904,0.5,50);
			_urlList.position.set(0,10,0);
			_mouseMove.mesh.light=_urlList;
			_mouseMove.mesh.add(_urlList);
		}
		
		game.sound.PlaySound("rocket_shoot",this.mesh.position,550);
	};
		
	Player.prototype.ChangeWeapon = function(_urlList){
		this.weapon=_urlList;
	};
		
	Player.prototype.CanMove = function(_mouseMove) {
		for (var _0x1673xa=0;_0x1673xa<this.chunk.blockList.length;_0x1673xa+=2) {
			var _urlList=this.chunk.blockList[_0x1673xa];
			if (_mouseMove==MOVE_FORWARD&&_urlList.z<11) { continue;
			} else {
				if (_mouseMove==MOVE_BACKWARD&&_urlList.z>7) { continue;
				}else {
					if (_mouseMove==MOVE_LEFT&&_urlList.x<10) { continue;
					}else {
						if (_mouseMove==MOVE_RIGHT&&_urlList.x>5) { continue;
						} else {
							if (_mouseMove==MOVE_UP&&(_urlList.x<6||_urlList.x>7||_urlList.z>9)) { continue;
							} else {
								if (_mouseMove==MOVE_DOWN&&_urlList.y-3>2){ continue; }
							}
						}
					}
				}
			}
			
			var _vector= new THREE.Vector3(_urlList.x-7,_urlList.y-10,_urlList.z-10);
			var _context=_vector.applyMatrix4(this.mesh.matrix);
			var _onLoad=_context.x|0;var _arraybuffer=_context.y|0;
			var _request=_context.z|0;
			_onLoad+=7;
			_request+=10;
			if (_mouseMove==MOVE_UP) { _arraybuffer+=2 }
			if (game.world.IsWithinWorld(_onLoad,_arraybuffer,_request)) {
				if ((game.world.blocks[_onLoad][_arraybuffer][_request]>>8)!=0) { return false; }
			} else { return false; }
		};
		return true;
	};
	
	Player.prototype.KeyDown = function() {
		if (this.keyboard.pressed("1")) { this.weapon=WEAPON_ROCKET; }
		if (this.keyboard.pressed("2")) { this.weapon=WEAPON_SHOTGUN; }
		if (this.keyboard.pressed("3")) { this.weapon=WEAPON_NONE; }
		if (this.keyboard.pressed("K")) { this.Die(); }
		if (this.keyboard.pressed("n")) { this.mesh.position.x+=5; }
		if (this.keyboard.pressed("m")) { this.mesh.position.x-=5; }
		if (this.keyboard.pressed("p")) { console.log(this.mesh.position); }
		if (this.keyboard.pressed("W")&&this.canWalkForward) {
			this.mesh.translateZ(this.moveDistance);
			if (!this.CanMove(MOVE_FORWARD)) {
				this.mesh.translateZ(-this.moveDistance);
			}
			this.Run();
		}
		if (this.keyboard.pressed("S")&&this.canWalkBackward) {
			this.mesh.translateZ(-this.moveDistance);
			if (!this.CanMove(MOVE_BACKWARD)) {
				this.mesh.translateZ(this.moveDistance);
			}
			this.Run();
		}
		if (this.keyboard.pressed("A")&&this.canWalkLeft) {
			this.mesh.translateX(this.moveDistance);
			if (!this.CanMove(MOVE_LEFT)) {
				this.mesh.translateX(-this.moveDistance);
			}
			this.Run();
		}
		if (this.keyboard.pressed("D")&&this.canWalkRight) {
			this.mesh.translateX(-this.moveDistance);
			if (!this.CanMove(MOVE_RIGHT)){
				this.mesh.translateX(this.moveDistance);
			}
			this.Run();
		}
		if (this.keyboard.pressed("space")) {
			this.jumpTime = 0;
			this.mesh.translateY(this.moveDistance);
			var _0x1673xf=Math.round(this.mesh.position.x+6);
			var _onLoad=Math.round(this.mesh.position.y+3);
			var _context=Math.round(this.mesh.position.z+6);
			if (!this.CanMove(MOVE_UP)) {
				this.mesh.translateY(-this.moveDistance);
			}
			this.SwitchModel(MODEL_JUMP);
			this.jumping = true;
			this.canFall = true;
			var _request= new THREE.Vector3(-1,-3,-3);
			var _0x1673x2c=_request.applyMatrix4(this.mesh.matrix);
			var _arraybuffer= new THREE.Vector3(1,-3,-3);
			var _mouseMove=_arraybuffer.applyMatrix4(this.mesh.matrix);
			
			for (var _urlList=0;_urlList<5;_urlList++) {
				var _0x1673x1c=game.phys.Get();
				var _0x1673xa=game.phys.Get();
				if (_0x1673x1c!=undefined) {
					_0x1673x1c.gravity= -1;
					_0x1673x1c.Create(_0x1673x2c.x,_0x1673x2c.y+1,_0x1673x2c.z,255,255,255,-lfsr.rand()*10,0.2,PHYS_SMOKE);
				}
				if (_0x1673xa!=undefined) {
					_0x1673xa.gravity= -1;
					_0x1673xa.Create(_mouseMove.x,_mouseMove.y+1,_mouseMove.z,255,255,255,-lfsr.rand()*10,0.2,PHYS_SMOKE);
				}
			}
		}
	};
	
	Player.prototype.KeyUp = function() {
		if (this.keyboard.pressed("space")) {}
	};
		
	Player.prototype.Run = function() {
		if (this.runTime>0.2) {
			if(this.currentModel==MODEL_RUN2) {
				this.SwitchModel(MODEL_RUN1);
			} else {
				this.SwitchModel(MODEL_RUN2);
			}
			this.runTime=0;
		}
	};
	
	Player.prototype.Draw = function(_onLoad,_urlList3) {
		if (this.mesh==undefined) { return }
		this.KeyDown();
		this.KeyUp();
		if (this.mesh.position.x>game.world.worldSize-1) {
			this.mesh.translateX(-1);
		}
		if(this.mesh.position.x<0){ this.mesh.translateX(1); }
		if(this.mesh.position.z<0){ this.mesh.translateZ(1); }
		if(this.mesh.position.z>game.world.worldSize-1) {
			this.mesh.translateZ(-1);
		}
		if (this.mesh.position.y>game.world.chunkHeight-1) {
			this.mesh.translateY(-1);
		}
		if (this.currentModel==MODEL_FALL) {
			if (lfsr.rand()>0.8) {
				var _urlList2= new THREE.Vector3(-1,-2,-4);
				var _0x1673x10=_urlList2.applyMatrix4(this.mesh.matrix);
				var _player=game.phys.Get();
				if (_player!=undefined) {
					_player.gravity= -1;
					_player.Create(_0x1673x10.x,_0x1673x10.y+1,_0x1673x10.z,255,255,255,-lfsr.rand()*10,0.2,PHYS_SMOKE);
				}
			}
			if (lfsr.rand()>0.8) {
				var _0x1673x1c=game.phys.Get();
				var _request= new THREE.Vector3(1,-2,-4);
				var _0x1673x2c=_request.applyMatrix4(this.mesh.matrix);
				if (_0x1673x1c!=undefined) {
					_0x1673x1c.gravity= -1;
					_0x1673x1c.Create(_0x1673x2c.x,_0x1673x2c.y+1,_0x1673x2c.z,255,255,255,-lfsr.rand()*10,0.2,PHYS_SMOKE);
				}
			}
		}
		
		this.rotateAngle=(Math.PI/1.5)*_urlList3;
		this.moveDistance=70*_urlList3;
		this.runTime+=_urlList3;
		this.jumpTime+=_urlList3;
		
		if (this.runTime>0.25&&this.currentModel!=MODEL_JUMP&&this.currentModel!=MODEL_FALL) {
			this.SwitchModel(MODEL_STAND);
		}
		if (this.jumpTime>0.1) { this.jumping = false; }
		var _0x1673xf=Math.round(this.mesh.position.x+6+2);
		var _request=Math.round(this.mesh.position.y-7);
		var _mouseMove=Math.round(this.mesh.position.z+6+2);
		for (var _urlList=_0x1673xf;_urlList<_0x1673xf+4;_urlList++) {
			for (var _arraybuffer=_mouseMove; _arraybuffer<_mouseMove+4; _arraybuffer++) {
				if (game.world.IsWithinWorld(_urlList,_request,_arraybuffer)) {
					if (game.world.blocks[_urlList][_request][_arraybuffer]==0) {
						this.canFall=true;
					}
				}
			}
		}
		if (this.mesh!=undefined&&this.jumping!=true&&this.canFall) {
			var _context=this.mass*this.gravity;_context+=-1*0.5*this.airDensity*this.area*this.vy*this.vy;
			var _0x1673x14=this.vy*_urlList3+(0.5*this.avg_ay*_urlList3*_urlList3);
			this.mesh.translateY(-_0x1673x14*100);
			var _0x1673xa=_context/this.mass;
			this.avg_ay=0.5*(_0x1673xa+this.avg_ay);
			for (var _urlList=_0x1673xf;_urlList<_0x1673xf+4;_urlList++) {
				for (var _arraybuffer=_mouseMove;_arraybuffer<_mouseMove+4;_arraybuffer++) {
					if (game.world.IsWithinWorld(_urlList,_request,_arraybuffer)) {
						if (game.world.blocks[_urlList][_request][_arraybuffer]!=0) {
							if (this.currentModel==MODEL_FALL) {
								this.SwitchModel(MODEL_STAND)
							}
							this.mesh.translateY(_0x1673x14*100);
							this.canFall = false;
							return;
						}
					} else {
						this.canFall=false;
						this.SwitchModel(MODEL_STAND);
						this.vy-=this.avg_ay*_urlList3;
						return;
					}
				}
			}
			this.SwitchModel(MODEL_FALL);
		} else {
			if(this.currentModel==MODEL_FALL){
				this.SwitchModel(MODEL_STAND);
			}
		}
	};
	
	Player.prototype.Die = function() {
		game.sound.PlaySound("die2",this.mesh.position,500);
		for (var _arraybuffer=0;_arraybuffer<this.chunk.blockList.length;_arraybuffer+=3) {
			var _0x1673xf=this.chunk.blockList[_arraybuffer];
			var _request= new THREE.Vector3(_0x1673xf.x-7,_0x1673xf.y-10,_0x1673xf.z-10);
			var _urlList=_request.applyMatrix4(this.mesh.matrix);
			var _context=_urlList.x|0;var _onLoad=_urlList.y|0;
			var _0x1673xa=_urlList.z|0;_context+=7;_0x1673xa+=10;
			var _mouseMove=game.phys.Get();
			if (_mouseMove!=undefined) {
				r=_0x1673xf.color[0];g=_0x1673xf.color[1];
				b=_0x1673xf.color[2];
				_mouseMove.Create(_urlList.x,_urlList.y,_urlList.z,r,g,b,lfsr.rand()*5,3,PHYS_DIE);
			}
		}
		this.mesh.visible = false;
	};
	
	Player.prototype.Spawn = function(_urlList,_onLoad,_context) { }
};


/////* _________________________________ World ____________________________________ */////


String.prototype.bin = function() { return parseInt(this,2); }

Number.prototype.bin = function() {
	var _context = (this < 0 ? "-" : "");
	var _urlList = Math.abs(this).toString(2);
	while(_urlList.length<32){ _urlList="0"+_urlList; }
	return _context+_urlList;
};

function Chunk() {
	this.mesh = undefined;
	this.blocks = 0;
	this.triangles = 0;
	this.dirty = false;
	this.fromX = 0;
	this.fromZ = 0;
	this.fromY = 0;
	this.toX = 0;
	this.toY = 0;
	this.toZ = 0;
	this.x = 0;
	this.y = 0;
	this.z = 0;
	this.type = 0;
	this.blockList = 0;
};

function World() {
	this.worldSize = 192;
	this.chunkBase = 16;
	this.worldDivBase = this.worldSize/this.chunkBase;
	this.chunkHeight = 160;
	this.blocks = 0;
	this.blockSize = 1;
	this.material = 0;
	this.chunks = undefined;
	this.plane = 0;
	this.ffTime = 0;
	this.last = 0;
	this.floodFill = new Array();
	this.wireframe = false;
	this.showChunks = false;
	
	
	World.prototype.Init = function() {
		
		this.blocks= new Array();
		for (var _n = 0; _n < this.worldSize; _n++) {
			this.blocks[_n] = new Array();
			for (var _x = 0; _x < this.chunkHeight; _x++) { 
				this.blocks[_n][_x] = new Array();
				for (var _y = 0;_y < this.worldSize; _y++) {
					this.blocks[_n][_x][_y] = 0;
				}
			}
		}
		
		console.log("DIVBASE: ",this.worldDivBase);
		this.chunks= new Array(this.worldDivBase);
		for (var _x=0;_x<this.worldDivBase;_x++) {
			this.chunks[_x]= new Array(this.worldDivBase);
			for (var _y=0;_y<this.worldDivBase;_y++) {
				
				this.chunks[_x][_y]= new Chunk();
				this.chunks[_x][_y].type=0;
				this.chunks[_x][_y].fromZ=0;
				this.chunks[_x][_y].toY=this.chunkHeight;
				this.chunks[_x][_y].fromX=_x*this.blockSize*this.chunkBase;
				this.chunks[_x][_y].toX=_x*this.blockSize*this.chunkBase+this.chunkBase;
				this.chunks[_x][_y].fromY=_y*this.blockSize*this.chunkBase;
				this.chunks[_x][_y].toZ=_y*this.blockSize*this.chunkBase+this.chunkBase;
				this.chunks[_x][_y].x=_x;this.chunks[_x][_y].z=_y;
			}
		}
		var _color = 4473924;
		var _arraybuffer = new THREE.BoxGeometry(this.blockSize*this.worldSize-2,1,this.blockSize*this.worldSize-7);
		var _material = new THREE.MeshLambertMaterial( { color: _color } );
		var _world = new THREE.Mesh(_arraybuffer,_material);
		_world.position.set((this.worldSize/2-this.chunkBase/2),-1/2+1,this.worldSize/2-this.chunkBase/2+2);
		_world.receiveShadow=true;
		game.scene.add(_world);
		var _arraybuffer = new THREE.BoxGeometry(this.blockSize*this.worldSize-2,1000,this.blockSize*this.worldSize-7);
		var _material = new THREE.MeshLambertMaterial({ color: _color });
		var _world = new THREE.Mesh(_arraybuffer,_material);
		_world.position.set((this.worldSize/2-this.chunkBase/2),-1000/2,this.worldSize/2-this.chunkBase/2+2);
		game.scene.add(_world);
		this.RebuildMaterial(false);
	};
	
	World.prototype.RebuildMaterial = function(_e) {
		this.wireframe=_e;
		this.material= new THREE.MeshLambertMaterial( { vertexColors:THREE.VertexColors,wireframe:this.wireframe } )
	};
	
	World.prototype.PlaceObject = function(_urlList2,_request,_arraybuffer,_model) {
		for (var _n=0; _n < _model.blockList.length; _n++) {
			_model.mesh.updateMatrixWorld();
			var _0x1673xf = _model.blockList[_n];
			var _object = new THREE.Vector3(_0x1673xf.x,_0x1673xf.y,_0x1673xf.z);
			_object.applyMatrix4(_model.mesh.matrixWorld);
			var _0x1673xa = _object.x + game.world.blockSize*8|0;
			var _context = _object.y|0;
			var _0x1673x10 = _object.z + game.world.blockSize*8|0;
			if (_context <= 0) { _context = 1; }
			if (this.IsWithinWorld(_0x1673xa,_context,_0x1673x10)) {
				this.blocks[_0x1673xa][_context][_0x1673x10]=_0x1673xf.val;
				if (_model.blockList.length > 200) {
					var _playerX=(game.player.mesh.position.x+this.blockSize*8)|0;
					var _playerY=(game.player.mesh.position.y+this.blockSize*8)|0;
					var _playerZ=(game.player.mesh.position.z+this.blockSize*8)|0;
					if (_playerX==_0x1673xa&&_playerY==_context&&_playerZ==_0x1673x10) { game.player.Die(); }
				}
				this.GetChunk(_0x1673xa,_0x1673x10).dirty = true;
			}
		}
		this.RebuildDirtyChunks();
	};
	
	World.prototype.IsWithinWorld = function(_urlList,_onLoad,_context) {
		if (_urlList>0&&_urlList<game.world.worldSize-1&&_onLoad>0&&_onLoad<game.world.chunkHeight-1&&_context>4&&_context<game.world.worldSize-1) {return true;}
		return false;
	};
	
	World.prototype.Explode = function(_0x1673x14,_0x1673x10,_0x1673x2c,_arraybuffer,_request) {
		this.exploded = 1;
		var _0x1673x1c=_arraybuffer*_arraybuffer;
		var _mouseMove= new Array();
		for (var _0x1673xa=_0x1673x14+_arraybuffer;_0x1673xa>=_0x1673x14-_arraybuffer;_0x1673xa--) {
			for (var _context=_0x1673x2c+_arraybuffer;_context>=_0x1673x2c-_arraybuffer;_context--) {
				for (var _onLoad=_0x1673x10+_arraybuffer;_onLoad>=_0x1673x10-_arraybuffer;_onLoad--) {
					val=(_0x1673xa-_0x1673x14)*(_0x1673xa-_0x1673x14)+(_onLoad-_0x1673x10)*(_onLoad-_0x1673x10)+(_context-_0x1673x2c)*(_context-_0x1673x2c);
					if (val<=_0x1673x1c) {
						this.RemoveBlock(_0x1673xa,_onLoad,_context);
						var _0x1673x1d=(game.player.mesh.position.x+this.blockSize*8)|0;
						var _urlList3=(game.player.mesh.position.y-this.blockSize*8)|0;
						var _mesh=(game.player.mesh.position.z+this.blockSize*8)|0;
						if (_0x1673x1d==_0x1673xa&&_urlList3==_onLoad&&_mesh==_context) {game.player.Die(); }
					} else {
						if (val<_0x1673x1c+4) {
							if (this.IsWithinWorld(_0x1673xa,_onLoad,_context)) {
								if ((this.blocks[_0x1673xa][_onLoad][_context]>>8)!=0) {
									var _urlList=(this.blocks[_0x1673xa][_onLoad][_context]>>24)&255;
									var _0x1673xf=(this.blocks[_0x1673xa][_onLoad][_context]>>16)&255;
									var _urlList2=(this.blocks[_0x1673xa][_onLoad][_context]>>8)&255;
									var _request=10;
									if (_arraybuffer>5) { _request=20; }
									if (_urlList>20) { _urlList-=_request; }
									if (_0x1673xf>20) { _0x1673xf-=_request; }
									if (_urlList2>20){ _urlList2-=_request; }
									this.blocks[_0x1673xa][_onLoad][_context]=(_urlList&255)<<24|(_0x1673xf&255)<<16|(_urlList2&255)<<8;
									this.GetChunk(_0x1673xa,_context).dirty = true;
								}
							}
						} else {
							if (val>_0x1673x1c) {
								if (this.IsWithinWorld(_0x1673xa,_onLoad,_context)) {
									if ((this.blocks[_0x1673xa][_onLoad][_context]>>8)!=0) {
										_mouseMove.push( new THREE.Vector3(_0x1673xa,_onLoad,_context));
									}
								}
							}
						}
					}
					
					if (val<=_0x1673x1c/10) {
						this.ExplosionBlock(_0x1673xa,_onLoad,_context);
						if(lfsr.rand()>0.8) {
							this.SmokeBlock(_0x1673xa,_onLoad,_context);
						}
					}
				}
			}
		}
		
		this.RebuildDirtyChunks();
		if(!_request){ this.floodFill.push(_mouseMove); }
	};
	
	World.prototype.DrawStats = function() {
		var _context=0;
		var _urlList=0;
		var _request2=0;
		var _onLoad=0;
		var _0x1673xa=0
		var _arraybuffer=0;
		
		for (var _request=0;_request<this.chunks.length;_request++) {
			for (var _mouseMove=0;_mouseMove<this.chunks.length;_mouseMove++) {
				if (this.chunks[_request][_mouseMove].mesh!=undefined) {
					if (this.chunks[_request][_mouseMove].mesh.visible) {
						_context+=this.chunks[_request][_mouseMove].blocks;_request2+=this.chunks[_request][_mouseMove].triangles;
						_0x1673xa++;
					}
					_urlList+=this.chunks[_request][_mouseMove].blocks;
					_onLoad+=this.chunks[_request][_mouseMove].triangles;
					_arraybuffer++;
				}
			}
		}
		var _0x1673xf=game.phys.Stats();
		$("#blockstats").html("[Total] Blocks: "+_urlList+" Triangles: "+_onLoad+" Chunks: "+_arraybuffer+"<br>[Visible] Blocks: "+_context+" Triangles: "+_request2+" Chunks: "+_0x1673xa+"<br>[Particle Engine] Free: "+_0x1673xf.free+"/"+_0x1673xf.total);
	};
	
	World.prototype.RebuildDirtyChunks = function(_context) {
		for (var _urlList=0;_urlList<this.chunks.length;_urlList++) {
			for (var _onLoad=0;_onLoad<this.chunks.length;_onLoad++) {
				if (_context==1||this.chunks[_urlList][_onLoad].dirty==true) {
					this.RebuildChunk(this.chunks[_urlList][_onLoad]);
				}
			}
		}
	};
	
	World.prototype.Draw = function(_urlList,_context) {
		if ((this.ffTime+=_context)>0.1) {
			if (this.floodFill.length>0&&this.exploded!=1) {
				this.RemoveHangingBlocks(this.floodFill.pop());
			}
			this.ffTime=0;
		}
		this.exploded=0;
	};
	
	World.prototype.componentToHex = function(_onLoad) {
		var _urlList=_onLoad.toString(16);
		return _urlList.length==1?"0"+_urlList:_urlList;
	};
	
	World.prototype.rgbToHex = function(_arraybuffer,_onLoad,_urlList) {
		if (_arraybuffer<0) {_arraybuffer=0; }
		if (_onLoad<0) { _onLoad=0; }
		var _context=this.componentToHex(_arraybuffer)+this.componentToHex(_onLoad)+this.componentToHex(_urlList);
		return parseInt("0x"+_context.substring(0,6));
	};
	
	World.prototype.GetChunk = function(_context,_arraybuffer){
		var _urlList=parseInt(_context/(this.chunkBase));
		var _onLoad=parseInt(_arraybuffer/(this.chunkBase));
		if(_urlList<0||_onLoad<0){return undefined};
		return this.chunks[_urlList][_onLoad];
	};
	
	World.prototype.RemoveHangingBlocks = function(_urlList) {
		var _0x1673x1c= new Array();
		var _arraybuffer= new Array();
		var _0x1673x1d= new Array();
		for (var _0x1673xf=0;_0x1673xf<_urlList.length;_0x1673xf++) {
			var _0x1673xa=_urlList[_0x1673xf];
			var _onLoad=this.FloodFill(_0x1673xa);_0x1673x1d.push(_onLoad.all);
			if(_onLoad.result!=true) {
				if(_onLoad.vals.length==0){ continue; }
				_0x1673x1c.push(_onLoad);
			}
		}
		for (var _request=0; _request<_0x1673x1c.length; _request++) {
			var _onLoad=_0x1673x1c[_request];
			var _0x1673x14= new Chunk();
			_0x1673x14.dirty=true;
			_0x1673x14.fromX=5000;
			_0x1673x14.fromY=5000;
			_0x1673x14.fromZ=5000;
			_0x1673x14.type=CHUNK_FF;
			_0x1673x14.blockList= new Array();
			for (var _context=0;_context<_onLoad.vals.length;_context++) {
				var _mesh=_onLoad.vals[_context];
				this.blocks[_mesh.x][_mesh.y][_mesh.z]&= ~(1<<5);
				this.blocks[_mesh.x][_mesh.y][_mesh.z]&= ~(1<<6);
				_mesh.val=this.blocks[_mesh.x][_mesh.y][_mesh.z];
				this.blocks[_mesh.x][_mesh.y][_mesh.z]|=32;
				_0x1673x14.blockList.push(_mesh);
				this.GetChunk(_mesh.x,_mesh.z).dirty=true;
				if(_mesh.x<_0x1673x14.fromX) { _0x1673x14.fromX=_mesh.x; }
				if(_mesh.x>_0x1673x14.toX) { _0x1673x14.toX=_mesh.x; }
				if(_mesh.y>_0x1673x14.toY) { _0x1673x14.toY=_mesh.y; }
				if(_mesh.y<_0x1673x14.fromZ) { _0x1673x14.fromZ=_mesh.y; }
				if(_mesh.z<_0x1673x14.fromY) { _0x1673x14.fromY=_mesh.z; }
				if(_mesh.z>_0x1673x14.toZ) { _0x1673x14.toZ=_mesh.z; }
			}
			_0x1673x14.fromX--;
			_0x1673x14.fromZ--;
			_0x1673x14.fromY--;
			_0x1673x14.toX++;
			_0x1673x14.toY++;
			_0x1673x14.toZ++;
			this.RebuildChunk(_0x1673x14);
			game.phys.CreateMeshBlock(_0x1673x14);
		}
		for (var _request=0; _request<_arraybuffer.length; _request++) {
			var _onLoad=_arraybuffer[_request];
			for (var _context=0; _context<_onLoad.vals.length; _context++) {
				var _mesh=_onLoad.vals[_context];
				this.RemoveBlock(_mesh.x,_mesh.y,_mesh.z);
			}
		}
		for (var _0x1673xf=0; _0x1673xf<_0x1673x1d.length; _0x1673xf++) {
			for (var _mouseMove=0;_mouseMove<_0x1673x1d[_0x1673xf].length; _mouseMove++) {
				var _mesh=_0x1673x1d[_0x1673xf][_mouseMove];
				this.blocks[_mesh.x][_mesh.y][_mesh.z]&= ~(1<<5);
				this.blocks[_mesh.x][_mesh.y][_mesh.z]&= ~(1<<6);
			}
		}
		this.RebuildDirtyChunks()
	};
	
	World.prototype.IsBlockHidden = function(_request2,_mouseMove,_arraybuffer){
		if ((this.blocks[_request2][_mouseMove][_arraybuffer]>>8)==0) { return true; }
		var _context=0,_0x1673xf=0,_0x1673xa=0,_urlList=0,_onLoad=0,_request=0;
		if (_mouseMove>0) {
			if ((this.blocks[_request2][_mouseMove-1][_arraybuffer]>>8)!=0) { _request2=1; }
		}
		if (_arraybuffer>0) {
			if ((this.blocks[_request2][_mouseMove][_arraybuffer-1]>>8)!=0) { _onLoad=1; }
		}
		if (_request2>0) {
			if ((this.blocks[_request2-1][_mouseMove][_arraybuffer]>>8)!=0) { _context=1; }
		}
		if (_request2<this.worldSize-1) {
			if ((this.blocks[_request2+1][_mouseMove][_arraybuffer]>>8)!=0) { _0x1673xf=1; }
		}
		if(_mouseMove<this.chunkHeight-1){
			if ((this.blocks[_request2][_mouseMove+1][_arraybuffer]>>8)!=0) { _0x1673xa=1; }
		}
		if (_arraybuffer<this.worldSize-1) {
			if((this.blocks[_request2][_mouseMove][_arraybuffer+1]>>8)!=0) { _urlList=1; }
		}
		if (_urlList==1&&_context==1&&_0x1673xf==1&&_0x1673xa==1&&_onLoad==1&&_request==1) { return true; }
		return false;
	};
	
	World.prototype.FloodFill = function(_mouseMove) {
		var _0x1673xa = 32;
		var _onLoad = new Array();
		var _context = new Array();
		_onLoad.push(_mouseMove);
		var _arraybuffer = new Array();
		if ((_mouseMove&_0x1673xa)!=0) {
			return {result:true,vals:_context,all:_arraybuffer}
		}
		while (_onLoad.length!=0) {
			var _urlList=_onLoad.pop();
			_arraybuffer.push(_urlList);
			if (!this.IsWithinWorld(_urlList.x,_urlList.y,_urlList.z)) { continue; }
			if ((this.blocks[_urlList.x][_urlList.y][_urlList.z]>>8)==0) { continue; }
			if ((this.blocks[_urlList.x][_urlList.y][_urlList.z]&64)!=0) { return {result:true,vals:_context,all:_arraybuffer} }
			if ((this.blocks[_urlList.x][_urlList.y][_urlList.z]&_0x1673xa)!=0) { continue; }
			if (_urlList.y<=4) {
				this.blocks[_urlList.x][_urlList.y][_urlList.z]|=_0x1673xa;
				this.blocks[_mouseMove.x][_mouseMove.y][_mouseMove.z]|=64;				
				return { result:true, vals:_context, all:_arraybuffer }
			}
			_context.push(_urlList);
			this.blocks[_urlList.x][_urlList.y][_urlList.z]|=_0x1673xa;_onLoad.push( new THREE.Vector3(_urlList.x,_urlList.y+1,_urlList.z));_onLoad.push( new THREE.Vector3(_urlList.x,_urlList.y,_urlList.z+1));_onLoad.push( new THREE.Vector3(_urlList.x+1,_urlList.y,_urlList.z));
			_onLoad.push( new THREE.Vector3(_urlList.x,_urlList.y,_urlList.z-1));
			_onLoad.push( new THREE.Vector3(_urlList.x-1,_urlList.y,_urlList.z));
			_onLoad.push( new THREE.Vector3(_urlList.x,_urlList.y-1,_urlList.z));
		}
		this.blocks[_mouseMove.x][_mouseMove.y][_mouseMove.z]|=64;
		return { result:false,vals:_context,all:_arraybuffer }
	};
	
	World.prototype.SmokeBlock = function(_context,_request,_request2) {
		var _mouseMove=game.phys.Get();
		if (_mouseMove!=undefined) {
			var _onLoad=lfsr.rand()*155|0;
			var _0x1673xa=_onLoad;
			var _arraybuffer=_onLoad;
			var _urlList=_onLoad;
			_mouseMove.gravity= -2;
			_mouseMove.Create(_context-this.blockSize*8,_request+this.blockSize,_request2-this.blockSize*8,_0x1673xa,_arraybuffer,_urlList,lfsr.rand()*1,2,PHYS_SMOKE);
		}
	};
	
	World.prototype.ExplosionBlock = function(_context,_request,_mouseMove) {
		var _0x1673xa=game.phys.Get();
		if (_0x1673xa!=undefined) {
			var _arraybuffer=255;
			var _onLoad=100+(lfsr.rand()*155|0);
			var _urlList=0;_0x1673xa.Create(_context-this.blockSize*8,_request+this.blockSize,_mouseMove-this.blockSize*8,_arraybuffer,_onLoad,_urlList,lfsr.rand()*4,0.3);
		}
	};
	
	World.prototype.RemoveBlock = function(_context,_request,_request2) {
		if (_context<0||_request<0||_request2<0||_context>this.worldSize-1||_request>this.chunkHeight-1||_request2>this.worldSize-1){ return; }
		if (this.blocks[_context][_request][_request2]==0) { return; };
		var _onLoad=this.GetChunk(_context,_request2);
		if (_onLoad!=undefined) {
			_onLoad.blocks--;
			_onLoad.dirty = true;
			var _mouseMove=game.phys.Get();
			if (_mouseMove!=undefined) {
				if (lfsr.rand()<0.25) {
					var _0x1673xa=(this.blocks[_context][_request][_request2]>>24)&255;
					var _arraybuffer=(this.blocks[_context][_request][_request2]>>16)&255;
					var _urlList=(this.blocks[_context][_request][_request2]>>8)&255;
					_mouseMove.Create(_context-this.blockSize*8,_request+this.blockSize,_request2-this.blockSize*8,_0x1673xa,_arraybuffer,_urlList,3);
				}
			}
			this.blocks[_context][_request][_request2]=0;
		}
	};
			
	World.prototype.AddBlock = function(_urlList,_mouseMove,_0x1673xa,_context) {
				var _arraybuffer=1/this.blockSize;
				if(_urlList<0||_mouseMove<0||_0x1673xa<0||_urlList>this.worldSize-1||_mouseMove>this.chunkHeight-1||_0x1673xa>this.worldSize-1){ return; }
				var _onLoad=this.GetChunk(_urlList,_0x1673xa);
				if (this.blocks[_urlList][_mouseMove][_0x1673xa]==0) {
					_onLoad.blocks+=_arraybuffer;
					this.blocks[_urlList][_mouseMove][_0x1673xa]=(_context[0]&255)<<24|(_context[1]&255)<<16|(_context[2]&255)<<8|0&255;
					_onLoad.dirty = true;
				}
	};
	
	World.prototype.SameColor = function(_context,_urlList){if(((_context>>8)&16777215)==((_urlList>>8)&16777215)&&_context!=0&&_urlList!=0){return true};return false};
	
	World.prototype.RebuildChunk = function(_0x1673x10) {
		var _0x1673x2d=0;var _mouseMove=[];
		var _0x1673x2c=[];
		
		for (var _mesh=_0x1673x10.fromX; _mesh<_0x1673x10.toX; _mesh++) {
			for (var _0x1673x1c=_0x1673x10.fromZ;_0x1673x1c<_0x1673x10.toY;_0x1673x1c++) {
				for (var _0x1673xf=_0x1673x10.fromY;_0x1673xf<_0x1673x10.toZ;_0x1673xf++) {
					if (this.blocks[_mesh][_0x1673x1c][_0x1673xf]!=0) {
						this.blocks[_mesh][_0x1673x1c][_0x1673xf]&= ~(1<<0);
						this.blocks[_mesh][_0x1673x1c][_0x1673xf]&= ~(1<<1);
						this.blocks[_mesh][_0x1673x1c][_0x1673xf]&= ~(1<<2);
						this.blocks[_mesh][_0x1673x1c][_0x1673xf]&= ~(1<<3);
						this.blocks[_mesh][_0x1673x1c][_0x1673xf]&= ~(1<<4);
					}
				}
			}
		}
		
		for (var _mesh=_0x1673x10.fromX;_mesh<_0x1673x10.toX;_mesh++) {
			for (var _0x1673x1c=_0x1673x10.fromZ;_0x1673x1c<_0x1673x10.toY;_0x1673x1c++) {
				for (var _0x1673xf=_0x1673x10.fromY;_0x1673xf<_0x1673x10.toZ;_0x1673xf++) {
					if (_0x1673x10.type==CHUNK_FF) {
						if ((this.blocks[_mesh][_0x1673x1c][_0x1673xf]&32)==0&&(this.blocks[_mesh][_0x1673x1c][_0x1673xf]&64)==0){continue; }
					}
					if (this.blocks[_mesh][_0x1673x1c][_0x1673xf]==0) { continue; }
					var _arraybuffer=0,_0x1673x1e=0,_e=0,_request=0,_0x1673x1b=0;
					if (_0x1673xf>0){if(this.blocks[_mesh][_0x1673x1c][_0x1673xf-1]!=0){_0x1673x1b=1;
					this.blocks[_mesh][_0x1673x1c][_0x1673xf]=this.blocks[_mesh][_0x1673x1c][_0x1673xf]|16}};
					if (_mesh>0) {
						if (this.blocks[_mesh-1][_0x1673x1c][_0x1673xf]!=0) {
							_arraybuffer=1;
							this.blocks[_mesh][_0x1673x1c][_0x1673xf]=this.blocks[_mesh][_0x1673x1c][_0x1673xf]|8;
						}
					}
					if (_mesh<this.worldSize-1) {
						if(this.blocks[_mesh+1][_0x1673x1c][_0x1673xf]!=0) {
							_0x1673x1e=1;
							this.blocks[_mesh][_0x1673x1c][_0x1673xf]=this.blocks[_mesh][_0x1673x1c][_0x1673xf]|4;
						}
					}
					
					if (_0x1673x1c<_0x1673x10.toY-1) {
						if (this.blocks[_mesh][_0x1673x1c+1][_0x1673xf]!=0) {
							_e=1;
							this.blocks[_mesh][_0x1673x1c][_0x1673xf]=this.blocks[_mesh][_0x1673x1c][_0x1673xf]|2;
						}
					}
					if (_0x1673xf<this.worldSize-1) {
						if (this.blocks[_mesh][_0x1673x1c][_0x1673xf+1]!=0) {
							_request=1;
							this.blocks[_mesh][_0x1673x1c][_0x1673xf]=this.blocks[_mesh][_0x1673x1c][_0x1673xf]|1;
						}
					}
					if (_request==1&&_arraybuffer==1&&_0x1673x1e==1&&_e==1&&_0x1673x1b==1) {
						if (_0x1673x10.type==CHUNK_OBJECT||_0x1673x10.type==CHUNK_FF) {
							this.blocks[_mesh][_0x1673x1c][_0x1673xf]=0;
						}
						continue;
					}
					if (!_e) {
						if ((this.blocks[_mesh][_0x1673x1c][_0x1673xf]&2)==0) {
							var _0x1673x1a=0;
							var _0x1673x13=0;
							var _onLoad=0;
							for (var _0x1673x2b=_mesh;_0x1673x2b<_0x1673x10.toX;_0x1673x2b++) {
								if ((this.blocks[_0x1673x2b][_0x1673x1c][_0x1673xf]&2)==0&&this.SameColor(this.blocks[_0x1673x2b][_0x1673x1c][_0x1673xf],this.blocks[_mesh][_0x1673x1c][_0x1673xf])) {
									_0x1673x1a++;
								} else { break; }
								var _0x1673xe=0;
								for (var _0x1673x14=_0x1673xf;_0x1673x14<_0x1673x10.toZ; _0x1673x14++) {
									if ((this.blocks[_0x1673x2b][_0x1673x1c][_0x1673x14]&2)==0&&this.SameColor(this.blocks[_0x1673x2b][_0x1673x1c][_0x1673x14],this.blocks[_mesh][_0x1673x1c][_0x1673xf])) {
										_0x1673xe++;
									} else { break; }
								}
										if (_0x1673xe<_0x1673x13||_0x1673x13==0) { _0x1673x13=_0x1673xe; }
							}
							for (var _0x1673x2b=_mesh;_0x1673x2b<_mesh+_0x1673x1a;_0x1673x2b++) {
								for (var _0x1673x14=_0x1673xf;_0x1673x14<_0x1673xf+_0x1673x13;_0x1673x14++) {
									this.blocks[_0x1673x2b][_0x1673x1c][_0x1673x14]=this.blocks[_0x1673x2b][_0x1673x1c][_0x1673x14]|2;
								}
							}
							_0x1673x1a--;
							_0x1673x13--;
							_mouseMove.push([_mesh*this.blockSize+(this.blockSize*_0x1673x1a),_0x1673x1c*this.blockSize,_0x1673xf*this.blockSize+(this.blockSize*_0x1673x13)]);_mouseMove.push([_mesh*this.blockSize-this.blockSize,_0x1673x1c*this.blockSize,_0x1673xf*this.blockSize-this.blockSize]);
							_mouseMove.push([_mesh*this.blockSize-this.blockSize,_0x1673x1c*this.blockSize,_0x1673xf*this.blockSize+(this.blockSize*_0x1673x13)]);_mouseMove.push([_mesh*this.blockSize+(this.blockSize*_0x1673x1a),_0x1673x1c*this.blockSize,_0x1673xf*this.blockSize+(this.blockSize*_0x1673x13)]);_mouseMove.push([_mesh*this.blockSize+(this.blockSize*_0x1673x1a),_0x1673x1c*this.blockSize,_0x1673xf*this.blockSize-this.blockSize]);_mouseMove.push([_mesh*this.blockSize-this.blockSize,_0x1673x1c*this.blockSize,_0x1673xf*this.blockSize-this.blockSize]);_0x1673x2d+=6;for(var _0x1673x1d=0;_0x1673x1d<6;_0x1673x1d++){_0x1673x2c.push([((this.blocks[_mesh][_0x1673x1c][_0x1673xf]>>24)&255),((this.blocks[_mesh][_0x1673x1c][_0x1673xf]>>16)&255),((this.blocks[_mesh][_0x1673x1c][_0x1673xf]>>8)&255)]);
							}
						}
					}
					if (!_0x1673x1b) {
						if ((this.blocks[_mesh][_0x1673x1c][_0x1673xf]&16)==0) {
							var _0x1673x1a=0;
							var _0x1673x1f=0;
							for (var _0x1673x2b=_mesh;_0x1673x2b<_0x1673x10.toX;_0x1673x2b++) {
								if ((this.blocks[_0x1673x2b][_0x1673x1c][_0x1673xf]&16)==0&&this.SameColor(this.blocks[_0x1673x2b][_0x1673x1c][_0x1673xf],this.blocks[_mesh][_0x1673x1c][_0x1673xf])) {
									_0x1673x1a++;
								} else { break; }
								var _0x1673x27=0;
								for (var _urlList=_0x1673x1c;_urlList<_0x1673x10.toY;_urlList++) {
									if ((this.blocks[_0x1673x2b][_urlList][_0x1673xf]&16)==0&&this.SameColor(this.blocks[_0x1673x2b][_urlList][_0x1673xf],this.blocks[_mesh][_0x1673x1c][_0x1673xf])) { _0x1673x27++; } else { break; }
								}
								if (_0x1673x27<_0x1673x1f||_0x1673x1f==0) { _0x1673x1f=_0x1673x27 }
							}
							for (var _0x1673x2b=_mesh;_0x1673x2b<_mesh+_0x1673x1a;_0x1673x2b++) {
							for (var _urlList=_0x1673x1c;_urlList<_0x1673x1c+_0x1673x1f;_urlList++) {
							this.blocks[_0x1673x2b][_urlList][_0x1673xf]=this.blocks[_0x1673x2b][_urlList][_0x1673xf]|16}};
							_0x1673x1a--;
							_0x1673x1f--;
							_mouseMove.push([_mesh*this.blockSize+(this.blockSize*_0x1673x1a),_0x1673x1c*this.blockSize+(this.blockSize*_0x1673x1f),_0x1673xf*this.blockSize-this.blockSize]);
							_mouseMove.push([_mesh*this.blockSize+(this.blockSize*_0x1673x1a),_0x1673x1c*this.blockSize-this.blockSize,_0x1673xf*this.blockSize-this.blockSize]);
							_mouseMove.push([_mesh*this.blockSize-this.blockSize,_0x1673x1c*this.blockSize-this.blockSize,_0x1673xf*this.blockSize-this.blockSize]);
							_mouseMove.push([_mesh*this.blockSize+(this.blockSize*_0x1673x1a),_0x1673x1c*this.blockSize+(this.blockSize*_0x1673x1f),_0x1673xf*this.blockSize-this.blockSize]);
							_mouseMove.push([_mesh*this.blockSize-this.blockSize,_0x1673x1c*this.blockSize-this.blockSize,_0x1673xf*this.blockSize-this.blockSize]);
							_mouseMove.push([_mesh*this.blockSize-this.blockSize,_0x1673x1c*this.blockSize+(this.blockSize*_0x1673x1f),_0x1673xf*this.blockSize-this.blockSize]);
							_0x1673x2d+=6;
							for (var _0x1673x1d=0;_0x1673x1d<6;_0x1673x1d++) {
								_0x1673x2c.push([((this.blocks[_mesh][_0x1673x1c][_0x1673xf]>>24)&255),((this.blocks[_mesh][_0x1673x1c][_0x1673xf]>>16)&255),((this.blocks[_mesh][_0x1673x1c][_0x1673xf]>>8)&255)]);
							}
						}
					}
					if (!_request) {
						if ((this.blocks[_mesh][_0x1673x1c][_0x1673xf]&1)==0) {
							var _0x1673x1a=0;
							var _0x1673x1f=0;
							for (var _0x1673x2b=_mesh; _0x1673x2b<_0x1673x10.toX; _0x1673x2b++) {
								if ((this.blocks[_0x1673x2b][_0x1673x1c][_0x1673xf]&1)==0&&this.SameColor(this.blocks[_0x1673x2b][_0x1673x1c][_0x1673xf],this.blocks[_mesh][_0x1673x1c][_0x1673xf])) {
									_0x1673x1a++;
								} else { break; }
								var _0x1673x27=0;
								for (var _urlList=_0x1673x1c; _urlList<_0x1673x10.toY; _urlList++) {
									if ((this.blocks[_0x1673x2b][_urlList][_0x1673xf]&1)==0&&this.SameColor(this.blocks[_0x1673x2b][_urlList][_0x1673xf],this.blocks[_mesh][_0x1673x1c][_0x1673xf])){
										_0x1673x27++;
									} else { break; }
								}
								if (_0x1673x27<_0x1673x1f||_0x1673x1f==0) { _0x1673x1f=_0x1673x27; }
							}
							for (var _0x1673x2b=_mesh;_0x1673x2b<_mesh+_0x1673x1a;_0x1673x2b++) {
								for (var _urlList=_0x1673x1c;_urlList<_0x1673x1c+_0x1673x1f;_urlList++) {
									this.blocks[_0x1673x2b][_urlList][_0x1673xf]=this.blocks[_0x1673x2b][_urlList][_0x1673xf]|1;
								}
							}
							_0x1673x1a--;
							_0x1673x1f--;
							_mouseMove.push([_mesh*this.blockSize+(this.blockSize*_0x1673x1a),_0x1673x1c*this.blockSize+(this.blockSize*_0x1673x1f),_0x1673xf*this.blockSize]);
							_mouseMove.push([_mesh*this.blockSize-this.blockSize,_0x1673x1c*this.blockSize+(this.blockSize*_0x1673x1f),_0x1673xf*this.blockSize]);
							_mouseMove.push([_mesh*this.blockSize+(this.blockSize*_0x1673x1a),_0x1673x1c*this.blockSize-this.blockSize,_0x1673xf*this.blockSize]);
							_mouseMove.push([_mesh*this.blockSize-this.blockSize,_0x1673x1c*this.blockSize+(this.blockSize*_0x1673x1f),_0x1673xf*this.blockSize]);_mouseMove.push([_mesh*this.blockSize-this.blockSize,_0x1673x1c*this.blockSize-this.blockSize,_0x1673xf*this.blockSize]);
							_mouseMove.push([_mesh*this.blockSize+(this.blockSize*_0x1673x1a),_0x1673x1c*this.blockSize-this.blockSize,_0x1673xf*this.blockSize]);
							_0x1673x2d+=6;
							for (var _0x1673x1d=0;_0x1673x1d<6;_0x1673x1d++) {
								_0x1673x2c.push([((this.blocks[_mesh][_0x1673x1c][_0x1673xf]>>24)&255),((this.blocks[_mesh][_0x1673x1c][_0x1673xf]>>16)&255),((this.blocks[_mesh][_0x1673x1c][_0x1673xf]>>8)&255)]);
							}
						}
					}
					if (!_arraybuffer) {
						if ((this.blocks[_mesh][_0x1673x1c][_0x1673xf]&8)==0) {
							var _0x1673x13=0;
							var _0x1673x1f=0;
							for (var _0x1673x14=_0x1673xf;_0x1673x14<_0x1673x10.toZ;_0x1673x14++) {
								if ((this.blocks[_mesh][_0x1673x1c][_0x1673x14]&8)==0&&this.SameColor(this.blocks[_mesh][_0x1673x1c][_0x1673x14],this.blocks[_mesh][_0x1673x1c][_0x1673xf])) {
									_0x1673x13++;
								} else { break; }
								var _0x1673x27=0;
								for (var _urlList=_0x1673x1c;_urlList<_0x1673x10.toY;_urlList++) {
									if ((this.blocks[_mesh][_urlList][_0x1673x14]&8)==0&&this.SameColor(this.blocks[_mesh][_urlList][_0x1673x14],this.blocks[_mesh][_0x1673x1c][_0x1673xf])){
										_0x1673x27++;
									} else { break; }
								}
								if (_0x1673x27<_0x1673x1f||_0x1673x1f==0) { _0x1673x1f=_0x1673x27; }
							}
							for (var _0x1673x14=_0x1673xf;_0x1673x14<_0x1673xf+_0x1673x13;_0x1673x14++) {
								for (var _urlList=_0x1673x1c;_urlList<_0x1673x1c+_0x1673x1f;_urlList++) {
									this.blocks[_mesh][_urlList][_0x1673x14]=this.blocks[_mesh][_urlList][_0x1673x14]|8;
								}
							}
							_0x1673x13--;
							_0x1673x1f--;
							_mouseMove.push([_mesh*this.blockSize-this.blockSize,_0x1673x1c*this.blockSize-this.blockSize,_0x1673xf*this.blockSize-this.blockSize]);_mouseMove.push([_mesh*this.blockSize-this.blockSize,_0x1673x1c*this.blockSize-this.blockSize,_0x1673xf*this.blockSize+(this.blockSize*_0x1673x13)]);_mouseMove.push([_mesh*this.blockSize-this.blockSize,_0x1673x1c*this.blockSize+(this.blockSize*_0x1673x1f),_0x1673xf*this.blockSize+(this.blockSize*_0x1673x13)]);
							_mouseMove.push([_mesh*this.blockSize-this.blockSize,_0x1673x1c*this.blockSize-this.blockSize,_0x1673xf*this.blockSize-this.blockSize]);_mouseMove.push([_mesh*this.blockSize-this.blockSize,_0x1673x1c*this.blockSize+(this.blockSize*_0x1673x1f),_0x1673xf*this.blockSize+(this.blockSize*_0x1673x13)]);
							_mouseMove.push([_mesh*this.blockSize-this.blockSize,_0x1673x1c*this.blockSize+(this.blockSize*_0x1673x1f),_0x1673xf*this.blockSize-this.blockSize]);
							_0x1673x2d+=6;
							for (var _0x1673x1d=0; _0x1673x1d<6; _0x1673x1d++) {
								_0x1673x2c.push([((this.blocks[_mesh][_0x1673x1c][_0x1673xf]>>24)&255),((this.blocks[_mesh][_0x1673x1c][_0x1673xf]>>16)&255),((this.blocks[_mesh][_0x1673x1c][_0x1673xf]>>8)&255)]);
							}
						}
					}
					if (!_0x1673x1e) {
						if ((this.blocks[_mesh][_0x1673x1c][_0x1673xf]&4)==0) {
							var _0x1673x13=0;var _0x1673x1f=0;
							for (var _0x1673x14=_0x1673xf; _0x1673x14<_0x1673x10.toZ; _0x1673x14++) {
								if ((this.blocks[_mesh][_0x1673x1c][_0x1673x14]&4)==0&&this.SameColor(this.blocks[_mesh][_0x1673x1c][_0x1673x14],this.blocks[_mesh][_0x1673x1c][_0x1673xf])) {
									_0x1673x13++;
								} else { break; }
								var _0x1673x27=0;
								for (var _urlList=_0x1673x1c;_urlList<_0x1673x10.toY;_urlList++) {
									if ((this.blocks[_mesh][_urlList][_0x1673x14]&4)==0&&this.SameColor(this.blocks[_mesh][_urlList][_0x1673x14],this.blocks[_mesh][_0x1673x1c][_0x1673xf])) {
										_0x1673x27++;
									} else { break; }
								}
								if (_0x1673x27<_0x1673x1f||_0x1673x1f==0) { _0x1673x1f=_0x1673x27; }
							}
							for (var _0x1673x14=_0x1673xf;_0x1673x14<_0x1673xf+_0x1673x13;_0x1673x14++) {
								for (var _urlList=_0x1673x1c;_urlList<_0x1673x1c+_0x1673x1f;_urlList++) {
									this.blocks[_mesh][_urlList][_0x1673x14]=this.blocks[_mesh][_urlList][_0x1673x14]|4;
								}
							}
							_0x1673x13--;
							_0x1673x1f--;
							_mouseMove.push([_mesh*this.blockSize,_0x1673x1c*this.blockSize-this.blockSize,_0x1673xf*this.blockSize-this.blockSize]);
							_mouseMove.push([_mesh*this.blockSize,_0x1673x1c*this.blockSize+(this.blockSize*_0x1673x1f),_0x1673xf*this.blockSize+(this.blockSize*_0x1673x13)]);
							_mouseMove.push([_mesh*this.blockSize,_0x1673x1c*this.blockSize-this.blockSize,_0x1673xf*this.blockSize+(this.blockSize*_0x1673x13)]);_mouseMove.push([_mesh*this.blockSize,_0x1673x1c*this.blockSize+(this.blockSize*_0x1673x1f),_0x1673xf*this.blockSize+(this.blockSize*_0x1673x13)]);
							_mouseMove.push([_mesh*this.blockSize,_0x1673x1c*this.blockSize-this.blockSize,_0x1673xf*this.blockSize-this.blockSize]);
							_mouseMove.push([_mesh*this.blockSize,_0x1673x1c*this.blockSize+(this.blockSize*_0x1673x1f),_0x1673xf*this.blockSize-this.blockSize]);_0x1673x2d+=6;
							for (var _0x1673x1d=0;_0x1673x1d<6;_0x1673x1d++) {
								_0x1673x2c.push([((this.blocks[_mesh][_0x1673x1c][_0x1673xf]>>24)&255),((this.blocks[_mesh][_0x1673x1c][_0x1673xf]>>16)&255),((this.blocks[_mesh][_0x1673x1c][_0x1673xf]>>8)&255)]);
							}
						}
					}
						
					if (_0x1673x10.type==CHUNK_OBJECT||_0x1673x10.type==CHUNK_FF) {
						this.blocks[_mesh][_0x1673x1c][_0x1673xf]=0;
					}
				}
			}
		}
		
		_0x1673x10.triangles =_mouseMove.length / 3;
		var _geometry = new THREE.BufferGeometry();
		var _urlList3 = new THREE.BufferAttribute( new Float32Array(_mouseMove.length*3),3);
		for (var _n = 0; _n < _mouseMove.length; _n++) {
			_urlList3.setXYZ(_n,_mouseMove[_n][0],_mouseMove[_n][1],_mouseMove[_n][2]);
		}
		_geometry.addAttribute("position",_urlList3);
		var _rgb= new THREE.BufferAttribute( new Float32Array(_0x1673x2c.length*3),3);
		for (var _n = 0; _n < _0x1673x2c.length; _n++) {
			_rgb.setXYZW(_n,_0x1673x2c[_n][0]/255,_0x1673x2c[_n][1]/255,_0x1673x2c[_n][2]/255,1);
		}
		_geometry.addAttribute("color",_rgb);
		_geometry.computeVertexNormals();
		_geometry.computeFaceNormals();
		_geometry.computeBoundingBox();
		
		game.scene.remove(_0x1673x10.mesh);
		_0x1673x10.mesh= new THREE.Mesh(_geometry,this.material);
		_0x1673x10.mesh.position.set((_0x1673x10.fromX/this.chunkBase)-this.chunkBase/2-this.blockSize*(_0x1673x10.fromX/this.chunkBase),this.blockSize,(_0x1673x10.fromY/this.chunkBase)-this.chunkBase/2-this.blockSize*(_0x1673x10.fromY/this.chunkBase));
		_0x1673x10.mesh.receiveShadow = true;
		_0x1673x10.mesh.castShadow = true;
		_0x1673x10.dirty = false;
		game.scene.add(_0x1673x10.mesh);
		_0x1673x10.mesh.visible = true;
	};
};


/////* _________________________________ Proc ____________________________________ */////

	
function Proc() {
		
	this.worldSize = 0;
	this.worldSpace = 0;
	this.landHeight = 4;
	this.currentType = 0;
	this.addBuffer = [];
	this.lastBuffer = [];
	this.freeDraw = [];
	
	Proc.prototype.DrawType = function(_urlList,_onLoad,_context) {
		switch(this.currentType) {
			case 2:this.Block(_urlList,_onLoad,_context,0); break;
			case 3:this.Block(_urlList,_onLoad,_context,1); break;
			case 4:this.FreeDrawBlock(); break;
			case 5:game.world.Explode(_urlList,_onLoad,_context,10,false); break;
			case 6:game.world.Explode(_urlList,_onLoad,_context,10,true); break
		}
	};
	
	Proc.prototype.FreeDrawBlock = function() {
		var _0x1673xf = this.freeaw.pop();
		var _0x1673x1c = this.freeDr.pop();
		var _0x1673x2c = $("#heit").text();
		var _arraybuffer = $("#colo").text();
		
		var _context;
		var _0x1673xa;
		var _urlList;
		var _onLoad;
		
		if (_0x1673xf.x < _0x1673x1c.x) {
			_context = _0x1673x1c.x;
			_0x1673xa = _0x1673xf.x
		} else {
			_context = _0x1673xf.x;
			_0x1673xa = _0x1673x1c.x;
		}
		if (_0x1673xf.z < _0x1673x1c.z) {
			_urlList = _0x1673x1c.z;
			_onLoad = _0x1673xf.z;
		} else {
			_urlList = _0x1673xf.z;
			_onLoad = _0x1673x1c.z;
		}
		for (var _request2 = _0x1673xa; _request2 < _context; _request2++) {
			for (var _mouseMove = _onLoad; _mouseMove < _urlList; _mouseMove++) {
				for (var _request=0;_request<_0x1673x2c;_request++) {
					this.Add(_request2,_request,_mouseMove,_arraybuffer);
					this.lastBuffer.push( new THREE.Vector3(_request2,_request,_mouseMove));
				}
			}
		}
	};
		
	Proc.prototype.Add = function(_urlList,_arraybuffer,_onLoad,_context) {
		game.world.AddBlock(_urlList,_arraybuffer,_onLoad,_context);
		this.addBuffer.push( new THREE.Vector3(_urlList,_arraybuffer,_onLoad));
	};
	
	Proc.prototype.UndoLast = function() {
		var _urlList;
		while ((_urlList=this.lastBuffer.pop())!=undefined) {
			game.world.RemoveBlock(_urlList.x,_urlList.y,_urlList.z);
			this.addBuffer.pop();
		}
		game.world.RebuildDirtyChunks();
	};
	
	Proc.prototype.Undo = function() {
		var _urlList=this.addBuffer.pop();
		if (_urlList!=undefined) {
			game.world.RemoveBlock(_urlList.x,_urlList.y,_urlList.z);
			this.lastBuffer.pop();
			game.world.RebuildDirtyChunks();
		}
	};
	
	Proc.prototype.Remove = function(_urlList,_onLoad,_context) {
		game.world.RemoveBlock(_urlList,_onLoad,_context);
	};
	
	Proc.prototype.Block = function(_context,_urlList,_0x1673x1c,_mouseMove) {
		var _width=$("#width").text();
		var _height=$("#height").text();
		var _arraybuffer=$("#color2").text();
		this.lastBuffer=[];
		if (_width==1) {
			for (var _request=0;_request<_height;_request++) {
				if (_mouseMove==0) {
					this.Add(_context,_urlList+_request,_0x1673x1c,_arraybuffer);
					this.lastBuffer.push( new THREE.Vector3(_context,_urlList+_request,_0x1673x1c));
				} else {
					this.Remove(_context,_urlList+_request,_0x1673x1c);
				}
			}
		} else {
			for (var _request=_context-_width/2;_request<_context+_width/2;_request++) {
				for (var _0x1673xa=_0x1673x1c-_width/2;_0x1673xa<_0x1673x1c+_width/2;_0x1673xa++) {
					for(var _request2=0;_request2<_height;_request2++) {
						if (_mouseMove==0) {
							this.Add(_request,_urlList+_request2,_0x1673xa,_arraybuffer);
							this.lastBuffer.push( new THREE.Vector3(_request,_urlList+_request2,_0x1673xa));
						} else {
							this.Remove(_request,_urlList+_request2,_0x1673xa);
						}
					}
				}
			}
		}
	};
	
	Proc.prototype.Mushroom = function() {
		var _point=this.GetRandomPoint();
		var _0x1673xa=this.landHeight;
		var _arraybuffer=_0x1673xa+8;
		for (var _mouseMove=0;_mouseMove<_arraybuffer;_mouseMove++) {
			for (var _request=_arraybuffer-1;_request>_arraybuffer/2;_request--) {
				for (var _urlList=0;_urlList<_arraybuffer;_urlList++) {
					if (Math.sqrt((_urlList-_arraybuffer/2)*(_urlList-_arraybuffer/2)+(_request-_arraybuffer/2)*(_request-_arraybuffer/2)+(_mouseMove-_arraybuffer/2)*(_mouseMove-_arraybuffer/2))<=_arraybuffer/2) {
						game.world.AddBlock(_point.x+_urlList,_request,_point.z+_mouseMove,Math.random()>0.9?8:10);
					}
				}
			}
		}
		var _onLoad=2;
		var _context=6;
		for (var _request=0;_request<_0x1673xa;_request++) {
			if (_context>_onLoad) { _context--; }
			for (var _urlList=0;_urlList<_context;_urlList++) {
				for (var _mouseMove=0;_mouseMove<_context;_mouseMove++) {
					game.world.AddBlock(_point.x+_urlList+(_arraybuffer/_context),_0x1673xa+_request,_point.z+_mouseMove+(_arraybuffer/_context),8);
				}
			}
		}
	};
	
	Proc.prototype.GetRandomPoint = function() {
		return  new THREE.Vector3(Math.round(Math.random()*game.world.worldSize),0,Math.round(Math.random()*game.world.worldSize));
	};
	
	Proc.prototype.Init = function(_context) {
		this.worldSize=_context;
		this.worldSpace= new Array(_context);
		for (var _urlList=0; _urlList<this.worldSpace.length; _urlList++) {
			this.worldSpace[_urlList]= new Array(_context);
			for (var _onLoad=0;_onLoad<this.worldSpace[_urlList].length;_onLoad++) {
				this.worldSpace[_urlList][_onLoad]=0;
			}
		}
	};
	
	Proc.prototype.CheckFreeSpace = function(_context,_arraybuffer,_onLoad) {
		for (var _urlList=_context-_onLoad/2; _urlList<_context+_onLoad/2; _urlList++) {
			for (var _0x1673xa=_arraybuffer-_onLoad/2; _0x1673xa<_arraybuffer+_onLoad/2; _0x1673xa++) {
				if (this.worldSpace[_urlList][_0x1673xa]!=0){ return 0; }
			}
			if (fail) { return 0; }
		}
		return 1;
	};
	
	Proc.prototype.Tree = function() {
		var _context=Math.round(Math.random()*game.world.chunkHeight);
		var _onLoad=3+Math.round(Math.random()*10);
		var _request=this.GetRandomPoint();
		for (var _mouseMove=this.landHeight; _mouseMove<this.landHeight+_context; _mouseMove++) {
			if (_onLoad>3) { _onLoad--; }
			for (var _urlList=0;_urlList<_onLoad;_urlList++) {
				for (var _0x1673xa=0; _0x1673xa<_onLoad; _0x1673xa++) {
					var _arraybuffer=Math.round(Math.sin(_mouseMove));
					game.world.AddBlock(_request.x+_urlList+_arraybuffer,_mouseMove,_request.z+_0x1673xa+_arraybuffer,7);
				}
			}
		}
	};
	
	Proc.prototype.GetRand = function(_context,_urlList) {
		return Math.round(_context+Math.random()*(_urlList-_context));
	};
	
	Proc.prototype.Rock = function() {
		var _point=this.GetRandomPoint();
		var _request2=this.GetRand(10,40);var _0x1673xa=this.GetRand(10,40);
		var _request=this.GetRand(this.landHeight+5,game.world.chunkHeight);
		var _onLoad=0;
		var _arraybuffer=this.GetRand(1,_request2/this.GetRand(3,6));
		var _context=this.GetRand(1,_0x1673xa/this.GetRand(3,6));
		var _urlList=5;
		for (var _x=-_urlList; _x<_request2+_urlList; _x++) {
			for (var _0x1673xf=-_urlList; _0x1673xf<_0x1673xa+_urlList; _0x1673xf++) {
				if (Math.random()>0.9) {
					game.world.AddBlock(_point.x+_x,this.landHeight,_point.z+_0x1673xf,Math.random()>0.5?0:1);
				}
			}
		}
		for (var _x=0; _x<_request2; _x++) {
			for (var _0x1673xf=0; _0x1673xf<_0x1673xa; _0x1673xf++) {
				_onLoad=0;
				if ((_x<_arraybuffer||_0x1673xf<_context||_x>_request2-_arraybuffer||_0x1673xf>_0x1673xa-_context)) {
					_onLoad=this.GetRand(2,_request);
				} else {
					_onLoad=_request;
				}
				for (var _0x1673x1c=this.landHeight; _0x1673x1c<_onLoad; _0x1673x1c++) {
					if (_0x1673x1c>_onLoad-2) {
						Math.random()>0.9?false:game.world.AddBlock(_point.x+_x,_0x1673x1c,_point.z+_0x1673xf,Math.random()>0.9?2:3);
					} else {
						if (_0x1673x1c<this.landHeight+4) {
							Math.random()<0.5?game.world.AddBlock(_point.x+_x,_0x1673x1c,_point.z+_0x1673xf,Math.random()>0.9?11:12):game.world.AddBlock(_point.x+_x,_0x1673x1c,_point.z+_0x1673xf,Math.random()>0.9?0:1);
						} else {
							Math.random()>0.1?game.world.AddBlock(_point.x+_x,_0x1673x1c,_point.z+_0x1673xf,Math.random()>0.9?11:12):false;
							if (Math.random()>0.95) {
								game.world.AddBlock(_point.x+_x,_0x1673x1c+2,_point.z+_0x1673xf,Math.random()>0.9?2:11);
							}
						}
					}	
				}
			}
		}
	};
	
	Proc.prototype.Flower3 = function() {
		var _point = this.GetRandomPoint();
		var _0x1673xa=1+Math.round(Math.random()*2);
		var _onLoad=0;
		for (var _context=0;_context<_0x1673xa+2;_context++) {
			for (var _request=0;_request<_onLoad;_request++) {
				game.world.AddBlock(_point.x+_context,this.landHeight+1,_point.z+_request,5);
				game.world.AddBlock(_point.x+_context,this.landHeight+1,_point.z-_request,5);
				game.world.AddBlock(_point.x+(_0x1673xa+1)*2-_context,this.landHeight+1,_point.z-_request,5);
				game.world.AddBlock(_point.x+(_0x1673xa+1)*2-_context,this.landHeight+1,_point.z+_request,5);
			}
			_onLoad++;
		}
		var _request2=this.landHeight;
		var _urlList=_request2+6+Math.round(Math.random()*4);
		for (var _arraybuffer=_request2;_arraybuffer<_urlList;_arraybuffer++) {
			game.world.AddBlock(_point.x+_0x1673xa+1,_arraybuffer,_point.z,5);
			if (_arraybuffer%2) {
				if (Math.random()>0.5) {
					game.world.AddBlock(_point.x+_0x1673xa+1,_arraybuffer,_point.z+1,6);
					game.world.AddBlock(_point.x+_0x1673xa+2,_arraybuffer,_point.z,10);
				} else {
					game.world.AddBlock(_point.x+_0x1673xa+1,_arraybuffer,_point.z-1,6);
					game.world.AddBlock(_point.x+_0x1673xa,_arraybuffer,_point.z,10);
				}
			}
		}
		game.world.AddBlock(_point.x+_0x1673xa+1,_urlList,_point.z,Math.random()>0.5?10:6);
	};
	
	Proc.prototype.Flower2 = function() {
		var _point=this.GetRandomPoint();
		var _0x1673xa=1+Math.round(Math.random()*2);
		var _onLoad=0;
		for (var _context=0;_context<_0x1673xa+2;_context++) {
			for (var _request=0;_request<_onLoad;_request++) {
				game.world.AddBlock(_point.x+_context,this.landHeight,_point.z+_request,5);
				game.world.AddBlock(_point.x+_context,this.landHeight,_point.z-_request,5);
				game.world.AddBlock(_point.x+(_0x1673xa+1)*2-_context,this.landHeight,_point.z-_request,5);
				game.world.AddBlock(_point.x+(_0x1673xa+1)*2-_context,this.landHeight,_point.z+_request,5);
			}
			_onLoad++;
		}
		var _request2=this.landHeight;
		var _urlList=_request2+1+Math.round(Math.random()*4);
		for (var _arraybuffer=_request2+1;_arraybuffer<_urlList;_arraybuffer++) {
			game.world.AddBlock(_point.x+_0x1673xa+1,_arraybuffer,_point.z,5)
		}
		game.world.AddBlock(_point.x+_0x1673xa+1,_urlList,_point.z+1,8);
		game.world.AddBlock(_point.x+_0x1673xa+1,_urlList,_point.z-1,8);
		game.world.AddBlock(_point.x+_0x1673xa+2,_urlList,_point.z,8);
		game.world.AddBlock(_point.x+_0x1673xa,_urlList,_point.z,8);
		game.world.AddBlock(_point.x+_0x1673xa+1,_urlList,_point.z,Math.random()>0.5?6:9);
	};
	
	Proc.prototype.Flower1 = function() {
		var _urlList=this.GetRand(2,4);var _onLoad=this.GetRandomPoint();
		for (var _context=this.landHeight;_context<this.landHeight+_urlList;_context++) {
			game.world.AddBlock(_onLoad.x,_context,_onLoad.z,4);
		}
		game.world.AddBlock(_onLoad.x,_context,_onLoad.z,6);
	};
	
	Proc.prototype.Grass = function() {
		var _0x1673xa=this.GetRandomPoint();
		var _onLoad=2+Math.round(Math.random()*2);var _context=0;
		for (var _urlList=0;_urlList<_onLoad+2;_urlList++) {
			for (var _arraybuffer=0;_arraybuffer<_context;_arraybuffer++) {
				game.world.AddBlock(_0x1673xa.x+_urlList,this.landHeight+_arraybuffer,_0x1673xa.z,5);
				game.world.AddBlock(_0x1673xa.x+(_onLoad+1)*2-_urlList,this.landHeight+_arraybuffer,_0x1673xa.z,5);
			}
			_context++;
		}
	};
	
	Proc.prototype.Land = function(_onLoad) {
		var _context=0;
		for (var _mouseMove=0;_mouseMove<this.landHeight;_mouseMove++) {
			for (var _urlList=0;_urlList<_onLoad;_urlList++) {
				for (var _0x1673xa=0;_0x1673xa<_onLoad;_0x1673xa++) {
					var _arraybuffer=Math.random()*10>9?true:false;
					if (_mouseMove==this.landHeight-1) {
						if (_arraybuffer) {
							_context=2;
						} else {
							_context=3;
						}
					} else {
						_context=0;
					}
					game.world.AddBlock(_urlList,_mouseMove,_0x1673xa,_context);
				}
			}
		}
	};
};

// ----------------------- GL MATRIX --------------------

// function glMatrix() {
	glMatrixArrayType=typeof Float32Array!="undefined"?Float32Array:typeof WebGLFloatArray!="undefined"?WebGLFloatArray:Array;var vec3={};vec3.create=function(a){var b=new glMatrixArrayType(3);if(a){b[0]=a[0];b[1]=a[1];b[2]=a[2]}return b};vec3.set=function(a,b){b[0]=a[0];b[1]=a[1];b[2]=a[2];return b};vec3.add=function(a,b,c){if(!c||a==c){a[0]+=b[0];a[1]+=b[1];a[2]+=b[2];return a}c[0]=a[0]+b[0];c[1]=a[1]+b[1];c[2]=a[2]+b[2];return c};
	vec3.subtract=function(a,b,c){if(!c||a==c){a[0]-=b[0];a[1]-=b[1];a[2]-=b[2];return a}c[0]=a[0]-b[0];c[1]=a[1]-b[1];c[2]=a[2]-b[2];return c};vec3.negate=function(a,b){b||(b=a);b[0]=-a[0];b[1]=-a[1];b[2]=-a[2];return b};vec3.scale=function(a,b,c){if(!c||a==c){a[0]*=b;a[1]*=b;a[2]*=b;return a}c[0]=a[0]*b;c[1]=a[1]*b;c[2]=a[2]*b;return c};
	vec3.normalize=function(a,b){b||(b=a);var c=a[0],d=a[1],e=a[2],g=Math.sqrt(c*c+d*d+e*e);if(g){if(g==1){b[0]=c;b[1]=d;b[2]=e;return b}}else{b[0]=0;b[1]=0;b[2]=0;return b}g=1/g;b[0]=c*g;b[1]=d*g;b[2]=e*g;return b};vec3.cross=function(a,b,c){c||(c=a);var d=a[0],e=a[1];a=a[2];var g=b[0],f=b[1];b=b[2];c[0]=e*b-a*f;c[1]=a*g-d*b;c[2]=d*f-e*g;return c};vec3.length=function(a){var b=a[0],c=a[1];a=a[2];return Math.sqrt(b*b+c*c+a*a)};vec3.dot=function(a,b){return a[0]*b[0]+a[1]*b[1]+a[2]*b[2]};
	vec3.direction=function(a,b,c){c||(c=a);var d=a[0]-b[0],e=a[1]-b[1];a=a[2]-b[2];b=Math.sqrt(d*d+e*e+a*a);if(!b){c[0]=0;c[1]=0;c[2]=0;return c}b=1/b;c[0]=d*b;c[1]=e*b;c[2]=a*b;return c};vec3.lerp=function(a,b,c,d){d||(d=a);d[0]=a[0]+c*(b[0]-a[0]);d[1]=a[1]+c*(b[1]-a[1]);d[2]=a[2]+c*(b[2]-a[2]);return d};vec3.str=function(a){return"["+a[0]+", "+a[1]+", "+a[2]+"]"};var mat3={};
	mat3.create=function(a){var b=new glMatrixArrayType(9);if(a){b[0]=a[0];b[1]=a[1];b[2]=a[2];b[3]=a[3];b[4]=a[4];b[5]=a[5];b[6]=a[6];b[7]=a[7];b[8]=a[8];b[9]=a[9]}return b};mat3.set=function(a,b){b[0]=a[0];b[1]=a[1];b[2]=a[2];b[3]=a[3];b[4]=a[4];b[5]=a[5];b[6]=a[6];b[7]=a[7];b[8]=a[8];return b};mat3.identity=function(a){a[0]=1;a[1]=0;a[2]=0;a[3]=0;a[4]=1;a[5]=0;a[6]=0;a[7]=0;a[8]=1;return a};
	mat3.transpose=function(a,b){if(!b||a==b){var c=a[1],d=a[2],e=a[5];a[1]=a[3];a[2]=a[6];a[3]=c;a[5]=a[7];a[6]=d;a[7]=e;return a}b[0]=a[0];b[1]=a[3];b[2]=a[6];b[3]=a[1];b[4]=a[4];b[5]=a[7];b[6]=a[2];b[7]=a[5];b[8]=a[8];return b};mat3.toMat4=function(a,b){b||(b=mat4.create());b[0]=a[0];b[1]=a[1];b[2]=a[2];b[3]=0;b[4]=a[3];b[5]=a[4];b[6]=a[5];b[7]=0;b[8]=a[6];b[9]=a[7];b[10]=a[8];b[11]=0;b[12]=0;b[13]=0;b[14]=0;b[15]=1;return b};
	mat3.str=function(a){return"["+a[0]+", "+a[1]+", "+a[2]+", "+a[3]+", "+a[4]+", "+a[5]+", "+a[6]+", "+a[7]+", "+a[8]+"]"};var mat4={};mat4.create=function(a){var b=new glMatrixArrayType(16);if(a){b[0]=a[0];b[1]=a[1];b[2]=a[2];b[3]=a[3];b[4]=a[4];b[5]=a[5];b[6]=a[6];b[7]=a[7];b[8]=a[8];b[9]=a[9];b[10]=a[10];b[11]=a[11];b[12]=a[12];b[13]=a[13];b[14]=a[14];b[15]=a[15]}return b};
	mat4.set=function(a,b){b[0]=a[0];b[1]=a[1];b[2]=a[2];b[3]=a[3];b[4]=a[4];b[5]=a[5];b[6]=a[6];b[7]=a[7];b[8]=a[8];b[9]=a[9];b[10]=a[10];b[11]=a[11];b[12]=a[12];b[13]=a[13];b[14]=a[14];b[15]=a[15];return b};mat4.identity=function(a){a[0]=1;a[1]=0;a[2]=0;a[3]=0;a[4]=0;a[5]=1;a[6]=0;a[7]=0;a[8]=0;a[9]=0;a[10]=1;a[11]=0;a[12]=0;a[13]=0;a[14]=0;a[15]=1;return a};
	mat4.transpose=function(a,b){if(!b||a==b){var c=a[1],d=a[2],e=a[3],g=a[6],f=a[7],h=a[11];a[1]=a[4];a[2]=a[8];a[3]=a[12];a[4]=c;a[6]=a[9];a[7]=a[13];a[8]=d;a[9]=g;a[11]=a[14];a[12]=e;a[13]=f;a[14]=h;return a}b[0]=a[0];b[1]=a[4];b[2]=a[8];b[3]=a[12];b[4]=a[1];b[5]=a[5];b[6]=a[9];b[7]=a[13];b[8]=a[2];b[9]=a[6];b[10]=a[10];b[11]=a[14];b[12]=a[3];b[13]=a[7];b[14]=a[11];b[15]=a[15];return b};
	mat4.determinant=function(a){var b=a[0],c=a[1],d=a[2],e=a[3],g=a[4],f=a[5],h=a[6],i=a[7],j=a[8],k=a[9],l=a[10],o=a[11],m=a[12],n=a[13],p=a[14];a=a[15];return m*k*h*e-j*n*h*e-m*f*l*e+g*n*l*e+j*f*p*e-g*k*p*e-m*k*d*i+j*n*d*i+m*c*l*i-b*n*l*i-j*c*p*i+b*k*p*i+m*f*d*o-g*n*d*o-m*c*h*o+b*n*h*o+g*c*p*o-b*f*p*o-j*f*d*a+g*k*d*a+j*c*h*a-b*k*h*a-g*c*l*a+b*f*l*a};
	mat4.inverse=function(a,b){b||(b=a);var c=a[0],d=a[1],e=a[2],g=a[3],f=a[4],h=a[5],i=a[6],j=a[7],k=a[8],l=a[9],o=a[10],m=a[11],n=a[12],p=a[13],r=a[14],s=a[15],A=c*h-d*f,B=c*i-e*f,t=c*j-g*f,u=d*i-e*h,v=d*j-g*h,w=e*j-g*i,x=k*p-l*n,y=k*r-o*n,z=k*s-m*n,C=l*r-o*p,D=l*s-m*p,E=o*s-m*r,q=1/(A*E-B*D+t*C+u*z-v*y+w*x);b[0]=(h*E-i*D+j*C)*q;b[1]=(-d*E+e*D-g*C)*q;b[2]=(p*w-r*v+s*u)*q;b[3]=(-l*w+o*v-m*u)*q;b[4]=(-f*E+i*z-j*y)*q;b[5]=(c*E-e*z+g*y)*q;b[6]=(-n*w+r*t-s*B)*q;b[7]=(k*w-o*t+m*B)*q;b[8]=(f*D-h*z+j*x)*q;
	b[9]=(-c*D+d*z-g*x)*q;b[10]=(n*v-p*t+s*A)*q;b[11]=(-k*v+l*t-m*A)*q;b[12]=(-f*C+h*y-i*x)*q;b[13]=(c*C-d*y+e*x)*q;b[14]=(-n*u+p*B-r*A)*q;b[15]=(k*u-l*B+o*A)*q;return b};mat4.toRotationMat=function(a,b){b||(b=mat4.create());b[0]=a[0];b[1]=a[1];b[2]=a[2];b[3]=a[3];b[4]=a[4];b[5]=a[5];b[6]=a[6];b[7]=a[7];b[8]=a[8];b[9]=a[9];b[10]=a[10];b[11]=a[11];b[12]=0;b[13]=0;b[14]=0;b[15]=1;return b};
	mat4.toMat3=function(a,b){b||(b=mat3.create());b[0]=a[0];b[1]=a[1];b[2]=a[2];b[3]=a[4];b[4]=a[5];b[5]=a[6];b[6]=a[8];b[7]=a[9];b[8]=a[10];return b};mat4.toInverseMat3=function(a,b){var c=a[0],d=a[1],e=a[2],g=a[4],f=a[5],h=a[6],i=a[8],j=a[9],k=a[10],l=k*f-h*j,o=-k*g+h*i,m=j*g-f*i,n=c*l+d*o+e*m;if(!n)return null;n=1/n;b||(b=mat3.create());b[0]=l*n;b[1]=(-k*d+e*j)*n;b[2]=(h*d-e*f)*n;b[3]=o*n;b[4]=(k*c-e*i)*n;b[5]=(-h*c+e*g)*n;b[6]=m*n;b[7]=(-j*c+d*i)*n;b[8]=(f*c-d*g)*n;return b};
	mat4.multiply=function(a,b,c){c||(c=a);var d=a[0],e=a[1],g=a[2],f=a[3],h=a[4],i=a[5],j=a[6],k=a[7],l=a[8],o=a[9],m=a[10],n=a[11],p=a[12],r=a[13],s=a[14];a=a[15];var A=b[0],B=b[1],t=b[2],u=b[3],v=b[4],w=b[5],x=b[6],y=b[7],z=b[8],C=b[9],D=b[10],E=b[11],q=b[12],F=b[13],G=b[14];b=b[15];c[0]=A*d+B*h+t*l+u*p;c[1]=A*e+B*i+t*o+u*r;c[2]=A*g+B*j+t*m+u*s;c[3]=A*f+B*k+t*n+u*a;c[4]=v*d+w*h+x*l+y*p;c[5]=v*e+w*i+x*o+y*r;c[6]=v*g+w*j+x*m+y*s;c[7]=v*f+w*k+x*n+y*a;c[8]=z*d+C*h+D*l+E*p;c[9]=z*e+C*i+D*o+E*r;c[10]=z*
	g+C*j+D*m+E*s;c[11]=z*f+C*k+D*n+E*a;c[12]=q*d+F*h+G*l+b*p;c[13]=q*e+F*i+G*o+b*r;c[14]=q*g+F*j+G*m+b*s;c[15]=q*f+F*k+G*n+b*a;return c};mat4.multiplyVec3=function(a,b,c){c||(c=b);var d=b[0],e=b[1];b=b[2];c[0]=a[0]*d+a[4]*e+a[8]*b+a[12];c[1]=a[1]*d+a[5]*e+a[9]*b+a[13];c[2]=a[2]*d+a[6]*e+a[10]*b+a[14];return c};
	mat4.multiplyVec4=function(a,b,c){c||(c=b);var d=b[0],e=b[1],g=b[2];b=b[3];c[0]=a[0]*d+a[4]*e+a[8]*g+a[12]*b;c[1]=a[1]*d+a[5]*e+a[9]*g+a[13]*b;c[2]=a[2]*d+a[6]*e+a[10]*g+a[14]*b;c[3]=a[3]*d+a[7]*e+a[11]*g+a[15]*b;return c};
	mat4.translate=function(a,b,c){var d=b[0],e=b[1];b=b[2];if(!c||a==c){a[12]=a[0]*d+a[4]*e+a[8]*b+a[12];a[13]=a[1]*d+a[5]*e+a[9]*b+a[13];a[14]=a[2]*d+a[6]*e+a[10]*b+a[14];a[15]=a[3]*d+a[7]*e+a[11]*b+a[15];return a}var g=a[0],f=a[1],h=a[2],i=a[3],j=a[4],k=a[5],l=a[6],o=a[7],m=a[8],n=a[9],p=a[10],r=a[11];c[0]=g;c[1]=f;c[2]=h;c[3]=i;c[4]=j;c[5]=k;c[6]=l;c[7]=o;c[8]=m;c[9]=n;c[10]=p;c[11]=r;c[12]=g*d+j*e+m*b+a[12];c[13]=f*d+k*e+n*b+a[13];c[14]=h*d+l*e+p*b+a[14];c[15]=i*d+o*e+r*b+a[15];return c};
	mat4.scale=function(a,b,c){var d=b[0],e=b[1];b=b[2];if(!c||a==c){a[0]*=d;a[1]*=d;a[2]*=d;a[3]*=d;a[4]*=e;a[5]*=e;a[6]*=e;a[7]*=e;a[8]*=b;a[9]*=b;a[10]*=b;a[11]*=b;return a}c[0]=a[0]*d;c[1]=a[1]*d;c[2]=a[2]*d;c[3]=a[3]*d;c[4]=a[4]*e;c[5]=a[5]*e;c[6]=a[6]*e;c[7]=a[7]*e;c[8]=a[8]*b;c[9]=a[9]*b;c[10]=a[10]*b;c[11]=a[11]*b;c[12]=a[12];c[13]=a[13];c[14]=a[14];c[15]=a[15];return c};
	mat4.rotate=function(a,b,c,d){var e=c[0],g=c[1];c=c[2];var f=Math.sqrt(e*e+g*g+c*c);if(!f)return null;if(f!=1){f=1/f;e*=f;g*=f;c*=f}var h=Math.sin(b),i=Math.cos(b),j=1-i;b=a[0];f=a[1];var k=a[2],l=a[3],o=a[4],m=a[5],n=a[6],p=a[7],r=a[8],s=a[9],A=a[10],B=a[11],t=e*e*j+i,u=g*e*j+c*h,v=c*e*j-g*h,w=e*g*j-c*h,x=g*g*j+i,y=c*g*j+e*h,z=e*c*j+g*h;e=g*c*j-e*h;g=c*c*j+i;if(d){if(a!=d){d[12]=a[12];d[13]=a[13];d[14]=a[14];d[15]=a[15]}}else d=a;d[0]=b*t+o*u+r*v;d[1]=f*t+m*u+s*v;d[2]=k*t+n*u+A*v;d[3]=l*t+p*u+B*
	v;d[4]=b*w+o*x+r*y;d[5]=f*w+m*x+s*y;d[6]=k*w+n*x+A*y;d[7]=l*w+p*x+B*y;d[8]=b*z+o*e+r*g;d[9]=f*z+m*e+s*g;d[10]=k*z+n*e+A*g;d[11]=l*z+p*e+B*g;return d};mat4.rotateX=function(a,b,c){var d=Math.sin(b);b=Math.cos(b);var e=a[4],g=a[5],f=a[6],h=a[7],i=a[8],j=a[9],k=a[10],l=a[11];if(c){if(a!=c){c[0]=a[0];c[1]=a[1];c[2]=a[2];c[3]=a[3];c[12]=a[12];c[13]=a[13];c[14]=a[14];c[15]=a[15]}}else c=a;c[4]=e*b+i*d;c[5]=g*b+j*d;c[6]=f*b+k*d;c[7]=h*b+l*d;c[8]=e*-d+i*b;c[9]=g*-d+j*b;c[10]=f*-d+k*b;c[11]=h*-d+l*b;return c};
	mat4.rotateY=function(a,b,c){var d=Math.sin(b);b=Math.cos(b);var e=a[0],g=a[1],f=a[2],h=a[3],i=a[8],j=a[9],k=a[10],l=a[11];if(c){if(a!=c){c[4]=a[4];c[5]=a[5];c[6]=a[6];c[7]=a[7];c[12]=a[12];c[13]=a[13];c[14]=a[14];c[15]=a[15]}}else c=a;c[0]=e*b+i*-d;c[1]=g*b+j*-d;c[2]=f*b+k*-d;c[3]=h*b+l*-d;c[8]=e*d+i*b;c[9]=g*d+j*b;c[10]=f*d+k*b;c[11]=h*d+l*b;return c};
	mat4.rotateZ=function(a,b,c){var d=Math.sin(b);b=Math.cos(b);var e=a[0],g=a[1],f=a[2],h=a[3],i=a[4],j=a[5],k=a[6],l=a[7];if(c){if(a!=c){c[8]=a[8];c[9]=a[9];c[10]=a[10];c[11]=a[11];c[12]=a[12];c[13]=a[13];c[14]=a[14];c[15]=a[15]}}else c=a;c[0]=e*b+i*d;c[1]=g*b+j*d;c[2]=f*b+k*d;c[3]=h*b+l*d;c[4]=e*-d+i*b;c[5]=g*-d+j*b;c[6]=f*-d+k*b;c[7]=h*-d+l*b;return c};
	mat4.frustum=function(a,b,c,d,e,g,f){f||(f=mat4.create());var h=b-a,i=d-c,j=g-e;f[0]=e*2/h;f[1]=0;f[2]=0;f[3]=0;f[4]=0;f[5]=e*2/i;f[6]=0;f[7]=0;f[8]=(b+a)/h;f[9]=(d+c)/i;f[10]=-(g+e)/j;f[11]=-1;f[12]=0;f[13]=0;f[14]=-(g*e*2)/j;f[15]=0;return f};mat4.perspective=function(a,b,c,d,e){a=c*Math.tan(a*Math.PI/360);b=a*b;return mat4.frustum(-b,b,-a,a,c,d,e)};
	mat4.ortho=function(a,b,c,d,e,g,f){f||(f=mat4.create());var h=b-a,i=d-c,j=g-e;f[0]=2/h;f[1]=0;f[2]=0;f[3]=0;f[4]=0;f[5]=2/i;f[6]=0;f[7]=0;f[8]=0;f[9]=0;f[10]=-2/j;f[11]=0;f[12]=-(a+b)/h;f[13]=-(d+c)/i;f[14]=-(g+e)/j;f[15]=1;return f};
	mat4.lookAt=function(a,b,c,d){d||(d=mat4.create());var e=a[0],g=a[1];a=a[2];var f=c[0],h=c[1],i=c[2];c=b[1];var j=b[2];if(e==b[0]&&g==c&&a==j)return mat4.identity(d);var k,l,o,m;c=e-b[0];j=g-b[1];b=a-b[2];m=1/Math.sqrt(c*c+j*j+b*b);c*=m;j*=m;b*=m;k=h*b-i*j;i=i*c-f*b;f=f*j-h*c;if(m=Math.sqrt(k*k+i*i+f*f)){m=1/m;k*=m;i*=m;f*=m}else f=i=k=0;h=j*f-b*i;l=b*k-c*f;o=c*i-j*k;if(m=Math.sqrt(h*h+l*l+o*o)){m=1/m;h*=m;l*=m;o*=m}else o=l=h=0;d[0]=k;d[1]=h;d[2]=c;d[3]=0;d[4]=i;d[5]=l;d[6]=j;d[7]=0;d[8]=f;d[9]=
	o;d[10]=b;d[11]=0;d[12]=-(k*e+i*g+f*a);d[13]=-(h*e+l*g+o*a);d[14]=-(c*e+j*g+b*a);d[15]=1;return d};mat4.str=function(a){return"["+a[0]+", "+a[1]+", "+a[2]+", "+a[3]+", "+a[4]+", "+a[5]+", "+a[6]+", "+a[7]+", "+a[8]+", "+a[9]+", "+a[10]+", "+a[11]+", "+a[12]+", "+a[13]+", "+a[14]+", "+a[15]+"]"};quat4={};quat4.create=function(a){var b=new glMatrixArrayType(4);if(a){b[0]=a[0];b[1]=a[1];b[2]=a[2];b[3]=a[3]}return b};quat4.set=function(a,b){b[0]=a[0];b[1]=a[1];b[2]=a[2];b[3]=a[3];return b};
	quat4.calculateW=function(a,b){var c=a[0],d=a[1],e=a[2];if(!b||a==b){a[3]=-Math.sqrt(Math.abs(1-c*c-d*d-e*e));return a}b[0]=c;b[1]=d;b[2]=e;b[3]=-Math.sqrt(Math.abs(1-c*c-d*d-e*e));return b};quat4.inverse=function(a,b){if(!b||a==b){a[0]*=1;a[1]*=1;a[2]*=1;return a}b[0]=-a[0];b[1]=-a[1];b[2]=-a[2];b[3]=a[3];return b};quat4.length=function(a){var b=a[0],c=a[1],d=a[2];a=a[3];return Math.sqrt(b*b+c*c+d*d+a*a)};
	quat4.normalize=function(a,b){b||(b=a);var c=a[0],d=a[1],e=a[2],g=a[3],f=Math.sqrt(c*c+d*d+e*e+g*g);if(f==0){b[0]=0;b[1]=0;b[2]=0;b[3]=0;return b}f=1/f;b[0]=c*f;b[1]=d*f;b[2]=e*f;b[3]=g*f;return b};quat4.multiply=function(a,b,c){c||(c=a);var d=a[0],e=a[1],g=a[2];a=a[3];var f=b[0],h=b[1],i=b[2];b=b[3];c[0]=d*b+a*f+e*i-g*h;c[1]=e*b+a*h+g*f-d*i;c[2]=g*b+a*i+d*h-e*f;c[3]=a*b-d*f-e*h-g*i;return c};
	quat4.multiplyVec3=function(a,b,c){c||(c=b);var d=b[0],e=b[1],g=b[2];b=a[0];var f=a[1],h=a[2];a=a[3];var i=a*d+f*g-h*e,j=a*e+h*d-b*g,k=a*g+b*e-f*d;d=-b*d-f*e-h*g;c[0]=i*a+d*-b+j*-h-k*-f;c[1]=j*a+d*-f+k*-b-i*-h;c[2]=k*a+d*-h+i*-f-j*-b;return c};quat4.toMat3=function(a,b){b||(b=mat3.create());var c=a[0],d=a[1],e=a[2],g=a[3],f=c+c,h=d+d,i=e+e,j=c*f,k=c*h;c=c*i;var l=d*h;d=d*i;e=e*i;f=g*f;h=g*h;g=g*i;b[0]=1-(l+e);b[1]=k-g;b[2]=c+h;b[3]=k+g;b[4]=1-(j+e);b[5]=d-f;b[6]=c-h;b[7]=d+f;b[8]=1-(j+l);return b};
	quat4.toMat4=function(a,b){b||(b=mat4.create());var c=a[0],d=a[1],e=a[2],g=a[3],f=c+c,h=d+d,i=e+e,j=c*f,k=c*h;c=c*i;var l=d*h;d=d*i;e=e*i;f=g*f;h=g*h;g=g*i;b[0]=1-(l+e);b[1]=k-g;b[2]=c+h;b[3]=0;b[4]=k+g;b[5]=1-(j+e);b[6]=d-f;b[7]=0;b[8]=c-h;b[9]=d+f;b[10]=1-(j+l);b[11]=0;b[12]=0;b[13]=0;b[14]=0;b[15]=1;return b};quat4.slerp=function(a,b,c,d){d||(d=a);var e=c;if(a[0]*b[0]+a[1]*b[1]+a[2]*b[2]+a[3]*b[3]<0)e=-1*c;d[0]=1-c*a[0]+e*b[0];d[1]=1-c*a[1]+e*b[1];d[2]=1-c*a[2]+e*b[2];d[3]=1-c*a[3]+e*b[3];return d};
	quat4.str=function(a){return"["+a[0]+", "+a[1]+", "+a[2]+", "+a[3]+"]"};
// }

// ----------------------- BUFFERS --------------------

function initBuffers() {
	triangleVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
	var vertices = [
	  0.0,  1.0,  0.0,
	 -1.0, -1.0,  0.0,
	  1.0, -1.0,  0.0
  ];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	triangleVertexPositionBuffer.itemSize = 3;
	triangleVertexPositionBuffer.numItems = 3;
	squareVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
	vertices = [
	  1.0,  1.0,  0.0,
	  -1.0,  1.0,  0.0,
	  1.0, -1.0,  0.0,
	  -1.0, -1.0,  0.0
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	squareVertexPositionBuffer.itemSize = 3;
	squareVertexPositionBuffer.numItems = 4;
}

// --------------------- DRAW SCENE ------------------

function drawScene() {
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	mat4.perspective(45 + Math.sin(Date.now() / 300) * 10, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
	mat4.identity(mvMatrix);
	mat4.translate(mvMatrix, [-1.5, 0.0, -7.0]);
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
	gl.vertexAttribPointer(program.vertexPositionAttribute, triangleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
	setMatrixUniforms();
	gl.drawArrays(gl.TRIANGLES, 0, triangleVertexPositionBuffer.numItems);
	mat4.translate(mvMatrix, [3.0, 0.0+ Math.sin(Date.now() / 400) * 2, 0.0+ Math.sin(Date.now() / 500) * 2]);
	gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
	gl.vertexAttribPointer(program.vertexPositionAttribute, squareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
	setMatrixUniforms();
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, squareVertexPositionBuffer.numItems);
}

// ------------------- RENDERER LOADER -----------------

function RendererLoader(canvas, vertexShaderPath, fragmentShaderPath) {
	this.canvas = canvas;
	this.textLoader = new TextLoader([vertexShaderPath, fragmentShaderPath]);
	this.renderer = null;
}

RendererLoader.prototype.load = function(callback) {
	var self = this; this.callback = callback; this.textLoader.load(function() {  self.invalidate(); });
};

RendererLoader.prototype.invalidate = function() {
  var vertexShader = this.textLoader.getTextByIndex(0);
  var fragmentShader = this.textLoader.getTextByIndex(1);
	
  if (!this.renderer && vertexShader && fragmentShader) {
	gl = this.canvas.getContext("webgl", { alpha: true, antialias: true } );
	if (!gl) { console.log("!gl. Could not initialise WebGL"); }
	gl.viewportWidth = this.canvas.width;
	gl.viewportHeight = this.canvas.height;
	var vs = compileShader(gl, vertexShader, gl.VERTEX_SHADER);
	var fs = compileShader(gl, fragmentShader, gl.FRAGMENT_SHADER);
	program = createProgram(gl, vs, fs);
	gl.enable(gl.DEPTH_TEST);
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.useProgram(program);
	program.vertexPositionAttribute = gl.getAttribLocation(program, "aVertexPosition");
	gl.enableVertexAttribArray(program.vertexPositionAttribute);
	program.pMatrixUniform = gl.getUniformLocation(program, "uPMatrix");
	program.mvMatrixUniform = gl.getUniformLocation(program, "uMVMatrix");
	this.renderer = new Renderer(this.canvas, gl, program);
	this.callback(this.renderer);
  }
};

// --------------------- TEXTLOADER ----------------------

function TextLoader(paths) { this.paths = paths; this.texts = {}; }

TextLoader.prototype.load = function(callback) {
	this.callback = callback;
	for (var _n = 0; _n < this.paths.length; _n++) { 
	  var path = this.paths[_n]; if (!this.texts[path]) { this.xhr(path, this.getOnTextLoadedFunc(_n)); }
	}
};

TextLoader.prototype.getOnTextLoadedFunc = function(_n) {
	var self = this;
	return function(text) {
	  var path = self.paths[_n];
	  self.texts[path] = text;
	  // alert(text);
	  self.callback && self.callback(_n);
  };
};

TextLoader.prototype.getTextByIndex = function(_n) { return this.getTextByPath(this.paths[_n]); };
TextLoader.prototype.getTextByPath = function(path) { return this.texts[path]; };

TextLoader.prototype.xhr = function(url, callback) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);
	xhr.responseType = 'text';
	xhr.onload = function() { callback(this.response); };
	xhr.send();
};

// ----------------------- WEBGL UTIL -----------------

function compileShader(gl, shaderSource, shaderType) {
	var shader = gl.createShader(shaderType);
	gl.shaderSource(shader, shaderSource);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) { alert("could not compile shader:" + gl.getShaderInfoLog(shader)); }
	return shader;
}

function createProgram(gl, vertexShader, fragmentShader) {
	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { alert("program filed to link:" + gl.getProgramInfoLog(program)); }
	return program;
}

function createStaticGlBuff(gl, values) {
	var buff = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buff);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(values), gl.STATIC_DRAW);
	return buff;
}

// ----------------------- RENDERER --------------------

function Renderer(canvas, gl, program) {
	this.canvas = canvas;
	this.gl = gl;
	this.program = program;
	this.initAttributesAndUniforms();
}
Renderer.prototype.initAttributesAndUniforms = function() {
	this.createVertexAttribute('aVertexPosition');
	this.createVertexAttribute('aVertexColor');
	this.createVertexAttribute('aVertexGroup');
	this.createUniform('uViewMatrix');
	this.createUniform('uModelMatrix');
	this.createUniform('uModelMatrix2');
	this.createUniform('uModelColor');
};
Renderer.prototype.createVertexAttribute = function(name) {
	this[name] = this.gl.getAttribLocation(this.program, name);
	this.gl.enableVertexAttribArray(this[name]);
};
Renderer.prototype.createUniform = function(name) { this[name] = this.gl.getUniformLocation(this.program, name); };
Renderer.prototype.resize = function() {
	if (this.canvas.width != this.canvas.clientWidth || this.canvas.height != this.canvas.clientHeight) {
      this.canvas.width = this.canvas.clientWidth;
      this.canvas.height = this.canvas.clientHeight;
      this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
	}
	return this;
};
Renderer.prototype.clear = function() { this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT); return this; };
Renderer.prototype.clearColor = function(r, g, b, a) { this.gl.clearColor(r, g, b, a); return this; };
Renderer.prototype.setColorVector = function(colorVector) { this.gl.uniform4fv(this.uModelColor, colorVector.v); return this; };
Renderer.prototype.setBlendingEnabled = function(blend) {
	if (blend) {
	  this.gl.enable(this.gl.BLEND);
	  this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE)
	} else { this.gl.disable(this.gl.BLEND) }
	return this;
};
Renderer.prototype.setViewMatrix = function(viewMatrix) {
	this.viewMatrix = viewMatrix;
	this.gl.uniformMatrix4fv(this.uViewMatrix, this.gl.FALSE, viewMatrix.m); return this;
};
Renderer.prototype.getViewMatrix = function() { return this.viewMatrix; };
Renderer.prototype.setModelMatrix = function(modelMatrix) {
	this.gl.uniformMatrix4fv(this.uModelMatrix, this.gl.FALSE, modelMatrix.m); return this;
};
Renderer.prototype.setModelMatrix2 = function(modelMatrix2) {
	this.gl.uniformMatrix4fv(this.uModelMatrix2, this.gl.FALSE, modelMatrix2.m); return this;
};
Renderer.prototype.setStamp = function(stamp) {
	this.modelStamp = stamp;
	stamp.prepareToDraw(this.gl, this.aVertexPosition, this.aVertexColor, this.aVertexGroup); return this;
};
Renderer.prototype.drawStamp = function() { this.modelStamp.draw(this.gl); return this; };


// ------------------------ MAIN ----------------------

"use strict";

const TYPE_OBJECT = 0;
const TYPE_MAP = 1;
const WEAPON_ROCKET = 0;
const WEAPON_SHOTGUN = 1;
const WEAPON_NONE = 2;
const MAX_HP = 100;
const MODEL_STAND = 0;
const MODEL_JUMP = 1;
const MODEL_RUN1 = 2;
const MODEL_RUN2 = 3;
const MODEL_SHOOT = 4;
const MODEL_FALL = 5;
const MOVE_FORWARD = 0;
const MOVE_BACKWARD = 1;
const MOVE_LEFT = 2;
const MOVE_RIGHT = 3;
const MOVE_UP = 4;
const MOVE_DOWN = 5;
const CHUNK_WORLD = 0;
const CHUNK_OBJECT = 1;
const CHUNK_FF = 2;
const PHYS_REGULAR=0;
const PHYS_SMOKE=1;
const PHYS_MISSILE=2;
const PHYS_SNOW=3;
const PHYS_GRENADE=4;
const PHYS_DIE=5;
const PHYS_SHOT=6;


var canvas = document.createElement('canvas');
canvas.id = 'canvas';
// resizeCanvas();
document.body.appendChild(canvas);
addEventListener("load", main);

var game, gl, program;
var mvMatrix = mat4.create();
var pMatrix = mat4.create();
var triangleVertexPositionBuffer;
var squareVertexPositionBuffer;
	
function resizeCanvas() {
	var w = window.innerWidth;
	var h = window.innerHeight;
	canvas.style.width = w + "px";
	canvas.style.height = h + "px";
	canvas.width = w;
	canvas.height = h;
}

function main() { canvas = this.canvas; game = new Game(); game.Init();
	// new RendererLoader(this.canvas, './app/shaders/vox-vertex-shader.txt', './app/shaders/vox-fragment-shader.txt').load(this.onRendererLoaded.bind(this));
}
function onRendererLoaded(r) { initBuffers(); this.renderer = r; this.loop(); }
function loop() { drawScene(); requestAnimationFrame(loop, canvas); }

function setMatrixUniforms() {
	gl.uniformMatrix4fv(program.pMatrixUniform, false, pMatrix);
	gl.uniformMatrix4fv(program.mvMatrixUniform, false, mvMatrix);
}

/////* _________________________________ Game 2 ___________________________________ */////

function Game() {
	
	this.mode = "edit";
	
	this.container, this.scene, this.camera, this.renderer, this.controls, this.stats, this.clock;
	this.world = this.phys = this.sound = this.player = this.weapons = this.proc = this.rollOverMesh = this.composer = undefined;
	this.isShiftDown = this.isADown = this.raycaster = this.mouse = this.keyboard = this.box = this.inputTime = 0;
	var screenWidth = window.innerWidth;
	var screenHeight = window.innerHeight;
	this.viewAngle = 10;
	this.aspect = screenWidth/screenHeight;
	this.near = 10;
	this.far = 3000;
	this.invMaxFps = 1/60;
	this.frameDelta = 0;
	this.objects = [];
	
	Game.prototype.initScene = function() {
		this.scene= new THREE.Scene();
		this.camera= new THREE.PerspectiveCamera(20,this.aspect,this.near,this.far);
		this.scene.add(this.camera);
	};
	
	Game.prototype.Init = function(_request) {
		// container
		this.contain = document.createElement('div');
		this.contain.id = 'container';
		this.contain.setAttribute('style', 'position: absolute; z-index: 1; top: 0px;');
		document.body.appendChild(this.contain);
		
		// stats
		this.clock = new THREE.Clock();
		this.stats = new Stats();
		this.stats.domElement.setAttribute('style', 'position: absolute; bottom: 5px; z-index: 120;');
		this.contain.appendChild(this.stats.domElement);
		
		// editor
		this.editor = document.createElement('div');
		this.editor.id = 'editor';
		this.editor.setAttribute('style', 'position: absolute; top: -16px; z-index: 120; color: #FF0000;');
		var str = "<br><span id='key1'>1: Rocket Launcher</span> | <span id='key2'>2: Shotgun</span> | <span id='key3'>3: None</span> | <span> Mouse2: Grenade </span> <br><br>";
		this.editor.insertAdjacentHTML( 'afterbegin' , str );
		document.body.appendChild(this.editor);
		
		// phys
		this.phyz = document.createElement('div');
		this.phyz.id = 'phys';
		this.phyz.setAttribute('style', 'position: absolute; z-index: 110;');
		this.contain.appendChild(this.phyz);
		
		this.initScene();
		
		// screen
		var _box = new THREE.BoxGeometry(1,1,1);
		var _material = new THREE.MeshBasicMaterial({ color:65280,opacity:0.5,transparent:true });
		this.rollOverMesh = new THREE.Mesh(_box,_material);
		this.scene.add(this.rollOverMesh);
	
		// render
		this.renderer = new THREE.WebGLRenderer({antialias:true});
		this.renderer.setSize(this.screenWidth,this.screenHeight);
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;
		this.container = document.getElementById("container");
		this.container.appendChild(this.renderer.domElement);
		this.scene.fog = new THREE.Fog(16751018,100,3000);
		this.renderer.setClearColor(16753089,1);
		THREEx.WindowResize(this.renderer,this.camera);
		
		
		// add lighting
		var _Alight = new THREE.AmbientLight(15643078);
		this.scene.add(_Alight);
		
		var _Hlight = new THREE.HemisphereLight(16777215,16777215,0.1);
		_Hlight.color.setHSL(0.6,1,0.6);
		_Hlight.groundColor.setHSL(0.095,1,0.75);
		_Hlight.position.set(0,500,0);
		game.scene.add(_Hlight);
		
		var _Dlight = new THREE.DirectionalLight(10066329,0.4);
		_Dlight.color.setHSL(0.1,1,0.95);
		_Dlight.position.set(23,23,10);
		_Dlight.position.multiplyScalar(10);
		game.scene.add(_Dlight);
		_Dlight.castShadow = true;
		_Dlight.shadowMapWidth = 512;
		_Dlight.shadowMapHeight = 512;
		
		var _shadow = 150;
		_Dlight.shadowCameraLeft = -_shadow;
		_Dlight.shadowCameraRight = _shadow;
		_Dlight.shadowCameraTop = _shadow;
		_Dlight.shadowCameraBottom = -_shadow;
		_Dlight.shadowCameraFar = 3500;
		_Dlight.shadowBias = -0.0001;
		_Dlight.shadowDarkness = 0.45;
		
		this.world = new World();
		console.log("World init...");
		this.world.Init();
		
		this.sound = new SoundLoader();
		this.sound.Add({ file:"sounds/rocket_explode.mp3",name: "rocket_explode" });
		this.sound.Add({ file:"sounds/rocket_shoot.mp3",name: "rocket_shoot" });
		this.sound.Add({ file:"sounds/shotgun_shoot.mp3",name: "shotgun_shoot" });
		this.sound.Add({ file:"sounds/brick1.mp3",name: "brick1" });
		this.sound.Add({ file:"sounds/brick2.mp3",name: "brick2" });
		this.sound.Add({ file:"sounds/grenade_explode.mp3",name: "grenade_explode" });
		this.sound.Add({ file:"sounds/pickup.mp3",name: "pickup" });
		this.sound.Add({ file:"sounds/throw.mp3",name: "threw" }); // js cmd?!!!
		this.sound.Add({ file:"sounds/die.mp3",name: "die2" });
		
		this.phys = new Phys();
		this.phys.Init();
		this.player = new Player();
		this.weapons = new Weapon();
		this.proc = new Proc();
		this.raycaster = new THREE.Raycaster();
		this.mouse = new THREE.Vector2();
		
		// load models
		var _vox = new Vox();
		_vox.LoadModel("objects/player_stand.vox",function(_x,_y,_c) { game.player.standChunk = _c, game.player.shootChunk = _c },Player,TYPE_OBJECT);
		_vox.LoadModel("objects/player_jump.vox",function(_x,_y,_c) { game.player.jumpChunk = _c },Player,TYPE_OBJECT);
		_vox.LoadModel("objects/player_run1.vox",function(_x,_y,_c) { game.player.run1Chunk = _c },Player,TYPE_OBJECT);
		_vox.LoadModel("objects/player_run2.vox",function(_x,_y,_c) { game.player.run2Chunk = _c },Player,TYPE_OBJECT);
		_vox.LoadModel("objects/player_fall.vox",function(_x,_y,_c) { game.player.fallChunk = _c },Player,TYPE_OBJECT);
		_vox.LoadModel("objects/player_stand_rocket.vox",function(_x,_y,_c) { game.player.standRocketChunk = _c },Player,TYPE_OBJECT);
		_vox.LoadModel("objects/player_jump_rocket.vox",function(_x,_y,_c) { game.player.jumpRocketChunk = _c },Player,TYPE_OBJECT);
		_vox.LoadModel("objects/player_run1_rocket.vox",function(_x,_y,_c) { game.player.run1RocketChunk = _c },Player,TYPE_OBJECT);
		_vox.LoadModel("objects/player_run2_rocket.vox",function(_x,_y,_c) { game.player.run2RocketChunk = _c },Player,TYPE_OBJECT);
		_vox.LoadModel("objects/player_shoot_rocket.vox",function(_x,_y,_c) { game.player.shootRocketChunk = _c },Player,TYPE_OBJECT);
		_vox.LoadModel("objects/player_fall_rocket.vox",function(_x,_y,_c) { game.player.fallRocketChunk = _c },Player,TYPE_OBJECT);
		_vox.LoadModel("objects/player_stand_shotgun.vox",function(_x,_y,_c) { game.player.standShotgunChunk = _c },Player,TYPE_OBJECT);
		_vox.LoadModel("objects/player_jump_shotgun.vox",function(_x,_y,_c) { game.player.jumpShotgunChunk = _c },Player,TYPE_OBJECT);
		_vox.LoadModel("objects/player_run1_shotgun.vox",function(_x,_y,_c) { game.player.run1ShotgunChunk = _c },Player,TYPE_OBJECT);
		_vox.LoadModel("objects/player_run2_shotgun.vox",function(_x,_y,_c) { game.player.run2ShotgunChunk = _c },Player,TYPE_OBJECT);
		_vox.LoadModel("objects/player_shoot_shotgun.vox",function(_x,_y,_c) { game.player.shootShotgunChunk = _c },Player,TYPE_OBJECT);
		_vox.LoadModel("objects/player_fall_shotgun.vox",function(_x,_y,_c) { game.player.fallShotgunChunk = _c },Player,TYPE_OBJECT);
		_vox.LoadModel("objects/shotgun.vox",function(_x,_y,_c) { game.weapons.shotgunChunk = _c },Weapon,TYPE_OBJECT);
		_vox.LoadModel("objects/rocket.vox",function(_x,_y,_c) { game.weapons.rocketChunk = _c },Weapon,TYPE_OBJECT);
		_vox.LoadModel("maps/map_test2.vox",function(_c) {
			game.player.Init("test");
			game.weapons.Init();
			game.weapons.Create(WEAPON_ROCKET, new THREE.Vector3(163,125,12));
			game.weapons.Create(WEAPON_SHOTGUN, new THREE.Vector3(9,124,169));
		},"Map3",TYPE_MAP);
		
		this.onWindowResize();
		this.animate();
	};
	
	Game.prototype.onWindowResize = function() {
		this.camera.aspect = window.innerWidth/window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth,window.innerHeight);
	};
	
	Game.prototype.getDistance = function(_vec1,_vec2) {
		var _xd = _vec1.x - _vec2.x;
		var _yd = _vec1.y - _vec2.y;
		var _zd = _vec1.z - _vec2.z;
		return Math.sqrt(_xd * _xd + _yd * _yd + _zd * _zd);
	};
	
	Game.prototype.render = function() { this.renderer.render(this.scene,this.camera); };
	
	Game.prototype.animate = function() {
		this.animId = requestAnimationFrame(this.animate.bind(this));
		this.render();
		this.update();
	};
	
	Game.prototype.update = function() {
		var _delta = this.clock.getDelta();
		var _arraybuffer = this.clock.getElapsedTime()*10;
		this.frameDelta += _delta;
		while (this.frameDelta >= this.invMaxFps) {
			this.player.Draw(_arraybuffer,this.invMaxFps);
			this.weapons.Draw(_arraybuffer,this.invMaxFps);
			this.phys.Draw(_arraybuffer,this.invMaxFps);
			this.frameDelta-=this.invMaxFps;
			this.world.Draw(_arraybuffer,_delta);
			if ((game.world.blocks[98][67][83]>>8)!=0) {
				if (Math.random()>0.8) {
					var _0x1673xa=game.phys.Get();
					if (_0x1673xa!=undefined) {
						_0x1673xa.gravity = 1;
						var _onLoad=15;
						var _context=169;
						var _urlList=189;
						if (lfsr.rand()>0.5) {
							_onLoad=36;
							_context=152;
							_urlList=229;
						}
						_0x1673xa.Create(86+lfsr.rand()*5,67,88,_onLoad,_context,_urlList,-1,10,PHYS_SMOKE,1);
					}
				}
				if (Math.random()>0.7) {
					var _0x1673xa=game.phys.Get();
					if (_0x1673xa!=undefined) {
						_0x1673xa.gravity = 1;
						var _onLoad=15;
						var _context=169;
						var _urlList=189;
						if (lfsr.rand()>0.5) {
							_onLoad=255;
							_context=255;
							_urlList=255;
						}
						_0x1673xa.Create(85+lfsr.rand()*7,36,87+lfsr.rand()*5,_onLoad,_context,_urlList,0.5,5,PHYS_SMOKE,1);
					}
				}
			}
		}
		this.stats.update();
	};

	Game.prototype.rand = function(_context,_urlList,_arraybuffer) {
		var _onLoad,_arraybuffer=_arraybuffer||0;
		if (_context<0) {
			_onLoad=_context+Math.random()*(Math.abs(_context)+_urlList);
		} else {
			_onLoad=_context+Math.random()*_urlList};
			return _onLoad.toFixed(_arraybuffer)*1;
	};
};


/////* _______________________________ MeshBlock ____________________________________ */////


function MeshBlock() {
	this.mesh = undefined;
	this.helper = undefined;
	this.gravity = 19.82;
	this.mass = 1;
	this.airDensity = 1.2;
	this.e = -0.2;
	this.area = 0.1;
	this.active = 1;
	this.chunk = undefined;
	this.bounces_orig = 2;
	this.bounces = this.bounces_orig;
	this.avg_ay = -2;
	this.vy = 0;
	this.remove = 0;
	
	MeshBlock.prototype.Draw = function(_onLoad,_0x1673x1c) {
		this.mesh.updateMatrixWorld();
		for (var _0x1673xa=0; _0x1673xa<this.chunk.blockList.length; _0x1673xa+=this.off) {
			var _chunk=this.chunk.blockList[_0x1673xa];
			var _urlList= new THREE.Vector3(_chunk.x,_chunk.y,_chunk.z);
			_urlList.applyMatrix4(this.mesh.matrixWorld);
			var _request=_urlList.x+game.world.blockSize*8|0;
			var _arraybuffer=_urlList.y|0;
			var _urlList2=_urlList.z+game.world.blockSize*8|0;
			if (game.world.IsWithinWorld(_request,_arraybuffer,_urlList2)) {
				if ((game.world.blocks[_request][_arraybuffer][_urlList2]>>8)!=0) {
					game.world.PlaceObject(_request,_arraybuffer,_urlList2,this.chunk);
					this.active=0;
					this.remove=1;
					return;
				}
			}
			if (_arraybuffer<=0) {
				game.world.PlaceObject(_request,0,_urlList2,this.chunk);
				this.remove=1;
				this.active=0;
				return;
			}
		}
		var _context=this.mass*this.gravity;
		_context+=-1*0.5*this.airDensity*this.area*this.vy*this.vy;
		var _0x1673x2c=this.vy*_0x1673x1c+(0.5*this.avg_ay*_0x1673x1c*_0x1673x1c);
		this.mesh.position.y+=_0x1673x2c*10;
		var _mouseMove=_context/this.mass;
		this.avg_ay=0.5*(_mouseMove+this.avg_ay);
		this.vy-=this.avg_ay*_0x1673x1c;
	};
	
	MeshBlock.prototype.Create = function(_urlList){
		this.mesh=_urlList.mesh;
		this.mesh.chunk=_urlList;
		this.chunk=_urlList;
		this.active=1;
		this.off=1;
		if (this.chunk.blockList.length>100) {
			this.off=this.chunk.blockList.length/500|0;
			if (this.off<1) { this.off=1; }
		}
	};
};


/////* _______________________________ PhysicsBlock ____________________________________ *///// 


function PhysBlock() {
	this.life = 0;
	this.mesh = undefined;
	this.color = "0xFFFFFF";
	this.active = 0;
	this.gravity = 9.82;
	this.e = -0.3;
	this.mass = 0.1;
	this.airDensity = 1.2;
	this.drag = -5.95;
	this.area = 1/1000;
	this.vy = 0;
	this.avg_ay = 0;
	this.vx = 0;
	this.vz = 0;
	this.avg_ax = 0;
	this.avg_az = 0;
	this.bounces = 0;
	this.bounces_orig = 0;
	this.fx_ = 0;
	this.fz_ = 0;
	this.type = PHYS_REGULAR;
	this.ray = undefined;
	
	PhysBlock.prototype.Init = function() {
		var _context = new THREE.BoxGeometry(game.world.blockSize,game.world.blockSize,game.world.blockSize);
		var _urlList = new THREE.MeshLambertMaterial();
		this.mesh = new THREE.Mesh(_context,_urlList);game.scene.add(this.mesh);
		this.mesh.visible = false;
		this.mesh.castShadow = true;
		this.bounces_orig=0; // (1+lfsr.rand()+2)|0;
		this.fx_=Math.random()-0.5;
		this.fz_=Math.random()-0.5;
	};
		
	PhysBlock.prototype.Create = function(_mesh,_0x1673x1c,_request2,_urlList,_0x1673xa,_0x1673x2c,_context,_urlList2,_request,_urlList3,_mouseMove) {
		this.type = _request?_request:PHYS_REGULAR;
		if (this.type!=PHYS_MISSILE&&this.type!=PHYS_SNOW&&this.type!=PHYS_GRENADE&&this.type!=PHYS_SHOT) {
			this.life=_urlList2?lfsr.rand()*_urlList2:lfsr.rand()*3
		} else {
			this.life = _urlList2
		}
		this.mass = _mouseMove?_mouseMove:0.1;
		this.bounces = _urlList3?_urlList3:this.bounces_orig;
		this.avg_ay = 0;
		this.avg_ax = 0;
		this.avg_az = 0;
		if (this.type==PHYS_MISSILE||this.type==PHYS_GRENADE||this.type==PHYS_SHOT) {
			var _0x1673xf= new THREE.Vector3(0,2,50);
			var _0x1673x10=_0x1673xf.applyMatrix4(game.player.mesh.matrix);
			var _arraybuffer=_0x1673xf.sub(game.player.mesh.position);
			this.ray = new THREE.Raycaster(_0x1673x10,_arraybuffer.clone().normalize());
			this.vx =_context+this.ray.ray.direction.x;
			this.vy=_context;
			this.vz=_context+this.ray.ray.direction.z}else {this.vx=_context;this.vy=_context;this.vz=_context};
			var _onLoad=game.world.rgbToHex(_urlList,_0x1673xa,_0x1673x2c);
			this.mesh.material.color.setHex(_onLoad);
			this.mesh.material.needsUpdate = true;
			this.mesh.position.set(_mesh,_0x1673x1c,_request2);
			this.mesh.visible = true;
			this.mesh.scale.set(1,1,1);
	};
			
	PhysBlock.prototype.Draw = function(_mouseMove,_0x1673x2b) {
		this.life-=_0x1673x2b;
		
		if (this.life <= 0 || this.bounces == 0) {
			if (this.mesh.children.length > 0) {
				for (var _0x1673x13=0; _0x1673x13<this.mesh.children.length; _0x1673x13++) {
					var _0x1673x29 = this.mesh.children[_0x1673x13];
					_0x1673x29.intensity = 2;
					_0x1673x29.hex=16724787;
					game.scene.add(_0x1673x29);
					_0x1673x29.position.set(this.mesh.position.x,this.mesh.position.y,this.mesh.position.z);
					this.mesh.remove(_0x1673x29);
					setTimeout(function() {
						game.scene.remove(_0x1673x29);
					},300);
				}
			}
			if (this.type==PHYS_MISSILE) {
				var _posx=this.mesh.position.x+game.world.blockSize*8|0;
				var _posy=this.mesh.position.y|0;
				var _posz=this.mesh.position.z+game.world.blockSize*8|0;
				game.world.Explode(_posx,_posy,_posz,8,0);
				game.sound.PlaySound("rocket_explode",this.mesh.position,600);
			} else {
				if (this.type==PHYS_GRENADE) {
					var _posx=this.mesh.position.x+game.world.blockSize*8|0;
					var _posy=this.mesh.position.y|0;
					var _posz=this.mesh.position.z+game.world.blockSize*8|0;
					if (game.world.IsWithinWorld(_posx,_posy,_posz)) {
						game.world.Explode(_posx,_posy,_posz,15,0);
						game.sound.PlaySound("grenade_explode",this.mesh.position,600);
					}
				} else {
					if (this.type==PHYS_SHOT) {
						var _posx=this.mesh.position.x+game.world.blockSize*8|0;
						var _posy=this.mesh.position.y|0;
						var _posz=this.mesh.position.z+game.world.blockSize*8|0;
						if (game.world.IsWithinWorld(_posx,_posy,_posz)) {
							game.world.Explode(_posx,_posy,_posz,2,0);
						}
					} else {
						if (this.type==PHYS_SNOW) {
							var _posx=this.mesh.position.x+game.world.blockSize*8|0;
							var _posy=this.mesh.position.y-3|0;
							var _posz=this.mesh.position.z+game.world.blockSize*8|0;
							if (game.world.IsWithinWorld(_posx,_posy,_posz)) {
								game.world.blocks[_posx][_posy][_posz]=255<<24|255<<16|255<<8;
								game.world.GetChunk(_posx,_posz).dirty = true;
								game.world.RebuildDirtyChunks();
							}
						} else {
							if (this.type==PHYS_REGULAR) { }
						}
					}
				}
			}
			this.mesh.visible = false;
			this.active = 0;
			this.life = 0;
			return;
		}
		
		var _posx = this.mesh.position.x + game.world.blockSize*8|0;
		var _posy = this.mesh.position.y|0;
		var _posz = this.mesh.position.z + game.world.blockSize*8|0;
		var _arraybuffer = this.mass*this.gravity;
		var _0x1673xa,_urlList;
		
		// missile
		if (this.type==PHYS_MISSILE) {
			_0x1673xa=this.mass*this.gravity;_urlList=this.mass*this.gravity;
		} else {
			_0x1673xa=this.mass*this.gravity*lfsr.rand()-0.5;
			_urlList=this.mass*this.gravity*lfsr.rand()-0.5;
		}
		
		_arraybuffer += -1*0.5*this.airDensity*this.area*this.vy*this.vy;
		_0x1673xa += -1*0.5*this.airDensity*this.area*this.vx*this.vx;
		_urlList += -1*0.5*this.airDensity*this.area*this.vz*this.vz;
		var _urlList2 = this.vy*_0x1673x2b+(0.5*this.avg_ay*_0x1673x2b*_0x1673x2b);
		var _0x1673x10 = this.vx*_0x1673x2b+(0.5*this.avg_ax*_0x1673x2b*_0x1673x2b);
		var _0x1673xf = this.vz*_0x1673x2b+(0.5*this.avg_az*_0x1673x2b*_0x1673x2b);
		
		// die
		if (this.type==PHYS_REGULAR||this.type==PHYS_DIE) {
			this.mesh.position.x+=_0x1673x10*10*this.fx_;
			this.mesh.position.z+=_0x1673xf*10*this.fz_;
			this.mesh.position.y+=_urlList2*10;
		} else {
			// smoke
			if ( this.type==PHYS_SMOKE) {
				this.mesh.position.y+=_urlList2*10;
				this.mesh.position.x+=Math.sin(_0x1673x10)*this.fx_;
				this.mesh.position.z+=Math.sin(_0x1673xf)*this.fz_;
			} else {
				// snow
				if (this.type==PHYS_SNOW) {
					this.mesh.position.y+=_urlList2*10;
					this.mesh.position.x+=Math.sin(_0x1673x10)*this.fx_;
					this.mesh.position.z+=Math.sin(_0x1673xf)*this.fz_;
				} else {
					// shot
					if (this.type==PHYS_SHOT) {
						this.mesh.position.x+=_0x1673x10*10*this.ray.ray.direction.x;
						this.mesh.position.z+=_0x1673xf*10*this.ray.ray.direction.z;
					} else {
						// missile
						if (this.type==PHYS_MISSILE) {
							this.mesh.position.x+=_0x1673x10*10*this.ray.ray.direction.x;
							this.mesh.position.z+=_0x1673xf*10*this.ray.ray.direction.z;
							var _0x1673x27=game.phys.Get();
							if (_0x1673x27!=undefined) {
								_0x1673x27.gravity= -2;
								_0x1673x27.Create(this.mesh.position.x,this.mesh.position.y,this.mesh.position.z,230,230,230,lfsr.rand()*1,1,PHYS_SMOKE);
							}
						} else {
							// grenade
							if (this.type==PHYS_GRENADE) {
								this.mesh.position.x+=_0x1673x10*10*this.ray.ray.direction.x;
								this.mesh.position.z+=_0x1673xf*10*this.ray.ray.direction.z;
								this.mesh.position.y+=_urlList2*20;
								if (lfsr.rand()>0.7) {
									var _0x1673x27=game.phys.Get();
									if (_0x1673x27!=undefined) {
										_0x1673x27.gravity= -2;
										var _0x1673x1b=200;
										var _0x1673xe=(100+lfsr.rand()*155)|0;
										var _0x1673x1f=0;
										_0x1673x27.Create(this.mesh.position.x,this.mesh.position.y,this.mesh.position.z,_0x1673x1b,_0x1673xe,_0x1673x1f,lfsr.rand()*1,0.5,PHYS_SMOKE);
									}
								}
							}
						}
					}
				}
			}
		}
		
		var _0x1673x14=_arraybuffer/this.mass;
		this.avg_ay=0.5*(_0x1673x14+this.avg_ay);
		this.vy-=this.avg_ay*_0x1673x2b;
		var _0x1673x1d=_0x1673xa/this.mass;
		this.avg_ax=0.5*(_0x1673x1d+this.avg_ax);
		this.vx-=this.avg_ax*_0x1673x2b;
		var _urlList3=_urlList/this.mass;
		this.avg_az=0.5*(_urlList3+this.avg_az);
		this.vz-=this.avg_az*_0x1673x2b;
		this.mesh.rotation.set(this.vx,this.vy,this.vz);
		
		if (this.type==PHYS_MISSILE) {
			if (game.world.IsWithinWorld(_posx,_posy,_posz)) {
				for (var _n=0;_n<2;_n++) {
					for (var _mesh=0;_mesh<2;_mesh++) {
						if (game.world.IsWithinWorld(_posx+_n,_posy,_posz+_mesh)) {
							if ((game.world.blocks[_posx+_n][_posy][_posz+_mesh]>>8)!=0) {
								this.life=0;
								return;
							}
						}
					}
				}
			}
		} else {
			if (this.type==PHYS_SHOT) {
				if (game.world.IsWithinWorld(_posx,_posy,_posz)) {
					for (var _n=-2;_n<4;_n++) { 
						for (var _mesh=-2;_mesh<4;_mesh++) {
							if (game.world.IsWithinWorld(_posx+_n,_posy,_posz+_mesh)) {
								if ((game.world.blocks[_posx+_n][_posy][_posz+_mesh]>>8)!=0) {
									this.life=0;
									return;
								}
							}
						}
					}
				}
			} else {
				if (this.type==PHYS_GRENADE) {
					var _posx = this.mesh.position.x+game.world.blockSize*8|0;
					var _posy = this.mesh.position.y|0;
					var _posz = this.mesh.position.z+game.world.blockSize*8|0;
					if (this.mesh.position.y<=0) {
						this.mesh.position.y=1;
						this.bounces--;
						this.vy*=this.e;
						return;
					}
					if (game.world.IsWithinWorld(_posx,_posy,_posz)) {
						for (var _n = 0; _n < 2; _n++) {
							for (var _mesh= 0; _mesh < 2; _mesh++) {
								for (var _onLoad = 0; _onLoad < 2; _onLoad++) {
									if (game.world.IsWithinWorld(_posx+_n,_posy+_onLoad,_posz+_mesh)) {
										if (this.mesh.position.y<=0&&this.vy<0) {
											this.bounces--;
											this.vy*=-this.e;
										}
										if ((game.world.blocks[_posx+_n][_posy+_onLoad][_posz+_mesh]>>8)!=0) {
											if (this.vy<0) {
												this.bounces--;
												this.vy*=this.e;
											}
											if (this.vx<0) {
												this.bounces--;
												this.vx*=0.9;
											} else {
												this.bounces--;
												this.vx*= -0.9;
											}
											if (this.vz<0){
												this.bounces--;
												this.vz*=0.9;
											} else {
												this.bounces--;
												this.vz*= -0.9;
											}
										}
									}
								}
							}
						}
					}
				} else {
					if (this.type==PHYS_DIE) {
						if (game.world.IsWithinWorld(_posx,_posy,_posz)) {
							if ((game.world.blocks[_posx][_posy][_posz]>>8)!=0&&this.vy<0) {
								this.mesh.position.y+=game.world.blockSize*4;
								this.mesh.rotation.set(0,0,0);
								this.vy*=this.e;
								this.bounces--;
							}
						}
					} else {
						if (game.world.IsWithinWorld(_posx,_posy,_posz)) {
							if ((game.world.blocks[_posx][_posy][_posz]>>8)!=0&&game.world.IsBlockHidden(_posx,_posy,_posz)) {
								this.mesh.visible = false;
								this.active = 0;
								this.life = 0;
								this.bounces--;
							} else {
								if ((game.world.blocks[_posx][_posy][_posz]>>8)!=0&&this.vx<0) {
									this.mesh.rotation.set(0,0,0);
									this.vx*=this.e;
									this.bounces--;
								} else {
									if ((game.world.blocks[_posx][_posy][_posz]>>8)!=0&&this.vz<0) {
										this.mesh.rotation.set(0,0,0);
										this.vz*=this.e;
										this.bounces--;
									} else {
										if ((game.world.blocks[_posx][_posy][_posz]>>8)!=0&&this.vy<0) {
											this.mesh.position.y=_posy+game.world.blockSize*4;
											this.mesh.rotation.set(0,0,0);
											this.vy*=this.e;
											this.bounces--;
										}
									}
								}
							}
						}
					}
				}
			}
		}
	};
};


/////* _________________________________ Physics ______________________________________ *///// 


function Phys() {
	
	this.blocks = new Array();
	this.meshes = new Array();
	this.size = 1500;
	this.pos = 0;
	this.neg = 0;

	Phys.prototype.Init = function() {
		var _urlList;
		for (var _context=0;_context<this.size;_context++) {
			_urlList= new PhysBlock();
			_urlList.Init();
			this.blocks.push(_urlList);
		}
	};
	
	Phys.prototype.Draw = function(_context,_onLoad) {
		for (var _urlList=0;_urlList<this.blocks.length;_urlList++) {
			if (this.blocks[_urlList].active==1){
				this.blocks[_urlList].Draw(_context,_onLoad);
			}
		}
		for (var _urlList=0;_urlList<this.meshes.length; _urlList++) {
			if (this.meshes[_urlList].remove==1) {
				game.scene.remove(this.meshes[_urlList].mesh);
				this.meshes.splice(_urlList,1);
			} else {
				if (this.meshes[_urlList].active==1) {
					this.meshes[_urlList].Draw(_context,_onLoad);
				} else {
					this.meshes.splice(_urlList,1);
				}
			}
		}
	};
	
	Phys.prototype.CreateMeshBlock = function(_urlList) {
		var _context= new MeshBlock();
		_context.Create(_urlList);
		this.meshes.push(_context);
	};
	
	Phys.prototype.Get = function() {
		for (var _urlList=0;_urlList<this.blocks.length;_urlList++) {
			if (this.blocks[_urlList].active==0) {
				this.blocks[_urlList].active=1;
				this.blocks[_urlList].gravity=9.82;
				return this.blocks[_urlList]}};
				return undefined;
	};
	
	Phys.prototype.Stats=function() {
		var _context=0;
		for (var _urlList=0;_urlList<this.blocks.length;_urlList++) {
			if (this.blocks[_urlList].active==0){
				_context++;
			}
		}
		return { free:_context,total:this.size }
	};
};

/////* _________________________________ Weapons ______________________________________ *///// 

function WeaponChunk() {
	
	this.chunk = undefined;
	this.mesh = undefined;
	this.type = WEAPON_NONE;
};
												
function Weapon() {
	
	this.type = WEAPON_NONE;
	this.rocketChunk = undefined;
	this.shotgunChunk = undefined;
	this.activeWeapons = [];
	
	Weapon.prototype.Init = function() {
		var _onLoad = [this.rocketChunk,this.shotgunChunk];
		for (var _urlList=0; _urlList<_onLoad.length; _urlList++) {
			var _context = _onLoad[_urlList].mesh;
			_context.position.set(0,0,0);
			_context.rotation.set(0,0,0);
			_context.geometry.center();_context.geometry.verticesNeedUpdate=true;
		}
	};
	
	Weapon.prototype.Create = function(_context,_urlList) {
		var _onLoad;
		switch(_context) {
			case WEAPON_ROCKET:_onLoad= new WeaponChunk();
				_onLoad.chunk=this.rocketChunk;
				_onLoad.mesh=this.rocketChunk.mesh.clone();_onLoad.type=WEAPON_ROCKET; break;
			case WEAPON_SHOTGUN:_onLoad= new WeaponChunk();_onLoad.chunk=this.shotgunChunk;
				_onLoad.mesh=this.shotgunChunk.mesh.clone();_onLoad.type=WEAPON_SHOTGUN;
				break;
			default:return;
		}
		
		var _arraybuffer = new THREE.SpotLight(16777215,2,50,190);
		_arraybuffer.position.set(_urlList.x,_urlList.y+20,_urlList.z);
		_arraybuffer.castShadow = true;
		_arraybuffer.shadowMapWidth = 1024;
		_arraybuffer.shadowMapHeight = 1024;
		_arraybuffer.shadowCameraNear = 500;
		_arraybuffer.shadowCameraFar = 4000;
		_arraybuffer.shadowCameraFov = 30;
		_arraybuffer.target = _onLoad.mesh;
		game.scene.add(_arraybuffer);
		_onLoad.mesh.position.set(_urlList.x,_urlList.y,_urlList.z);
		game.scene.add(_onLoad.mesh);
		_onLoad.mesh.updateMatrixWorld();
		_onLoad.mesh.visible=true;
		this.activeWeapons.push(_onLoad);
	};
	
	Weapon.prototype.Hit = function(_urlList) {
		game.sound.PlaySound("pickup",this.activeWeapons[_urlList].mesh.position,500);
		game.player.SwitchWeapon(this.activeWeapons[_urlList].type);
		game.scene.remove(this.activeWeapons[_urlList].mesh);
		this.activeWeapons.splice(_urlList,1);
	};
									
	Weapon.prototype.Draw=function(_mouseMove,_0x1673xf) {
		for (var _0x1673xa=0;_0x1673xa<this.activeWeapons.length;_0x1673xa++) {
			var _urlList=this.activeWeapons[_0x1673xa];
			_urlList.mesh.rotation.y+=_0x1673xf;
			var _arraybuffer=(game.player.mesh.position.x+game.world.blockSize*8)|0;
			var _onLoad=(game.player.mesh.position.y+game.world.blockSize*2)|0;
			var _context=(game.player.mesh.position.z+game.world.blockSize*8)|0;
			var _request=10;
			if (_arraybuffer>=(_urlList.mesh.position.x-_request)&&_arraybuffer<=(_urlList.mesh.position.x+_request)&&_onLoad>=(_urlList.mesh.position.y-_request)&&_onLoad<=(_urlList.mesh.position.y+_request)&&_context>=(_urlList.mesh.position.z-_request)&&_context<=(_urlList.mesh.position.z+_request)) {
				this.Hit(_0x1673xa)
			}
		}
	};
};

//* __________ JQUERY.JS __________ *//

var firstScript = document.getElementsByTagName('script')[0];
var js1 = document.createElement('script');
js1.src = 'libs/jquery.js';
// js1.onload = function () { alert("loaded"); };
firstScript.parentNode.insertBefore(js1, firstScript);

//* __________ STATS.JS ___________ *//

var secondScript = document.getElementsByTagName('script')[0];
var js2 = document.createElement('script');
js2.src = 'libs/stats.js';
secondScript.parentNode.insertBefore(js2, secondScript);

//* __________ THREE.JS ___________ *//

// threejs.org/license
var thirdScript = document.getElementsByTagName('script')[0];
var js3 = document.createElement('script');
js3.src = 'libs/threejs.js';
thirdScript.parentNode.insertBefore(js3, thirdScript);

//* ______ THREEx.WindowResize _______ *//

/** @namespace */
var THREEx = THREEx || {};

/**
 * Update renderer and camera when the window is resized
 * 
 * @param {Object} renderer the renderer to update
 * @param {Object} Camera the camera to update
*/
THREEx.WindowResize	= function(renderer, camera){
	var callback	= function(){
		// notify the renderer of the size change
		renderer.setSize( window.innerWidth, window.innerHeight );
		// update the camera
		camera.aspect	= window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
	}
	// bind the resize event
	window.addEventListener('resize', callback, false);
	// return .stop() the function to stop watching window resize
	return {
		/**
		 * Stop watching window resize
		*/
		stop	: function(){
			window.removeEventListener('resize', callback);
		}
	};
}

//* ______ THREEx.KeyboardState _______ *//


/** @namespace */
var THREEx = THREEx || {};

var keys_enabled = 1;

THREEx.KeyboardState = function()
{
	// to store the current state
	this.keyCodes	= {};
	this.modifiers	= {};
	
	// create callback to bind/unbind keyboard events
	var self	= this;
	this._onKeyDown	= function(event){ self._onKeyChange(event, true); };
	this._onKeyUp	= function(event){ self._onKeyChange(event, false);};

	// bind keyEvents
	document.addEventListener("keydown", this._onKeyDown, false);
	document.addEventListener("keyup", this._onKeyUp, false);
}

THREEx.KeyboardState.prototype.destroy	= function()
{
	// unbind keyEvents
	document.removeEventListener("keydown", this._onKeyDown, false);
	document.removeEventListener("keyup", this._onKeyUp, false);
}

THREEx.KeyboardState.MODIFIERS	= ['shift', 'ctrl', 'alt', 'meta'];
THREEx.KeyboardState.ALIAS	= {
	'left'		: 37,
	'up'		: 38,
	'right'		: 39,
	'down'		: 40,
	'space'		: 32,
	'pageup'	: 33,
	'pagedown'	: 34,
    'esc'           : 27,
	'tab'		: 9
};

THREEx.KeyboardState.prototype._onKeyChange	= function(event, pressed)
{
	// log to debug
	//console.log("onKeyChange", event, pressed, event.keyCode, event.shiftKey, event.ctrlKey, event.altKey, event.metaKey)

	// update this.keyCodes
	var keyCode	= event.keyCode;
	this.keyCodes[keyCode]	= pressed;

	// update this.modifiers
	this.modifiers['shift']= event.shiftKey;
	this.modifiers['ctrl']	= event.ctrlKey;
	this.modifiers['alt']	= event.altKey;
	this.modifiers['meta']	= event.metaKey;
}

THREEx.KeyboardState.prototype.pressed	= function(keyDesc)
{
    if(!keys_enabled)  {
	return;
    }
	var keys	= keyDesc.split("+");
	for(var i = 0; i < keys.length; i++){
		var key		= keys[i];
		var pressed;
		if( THREEx.KeyboardState.MODIFIERS.indexOf( key ) !== -1 ){
			pressed	= this.modifiers[key];
		}else if( Object.keys(THREEx.KeyboardState.ALIAS).indexOf( key ) != -1 ){
			pressed	= this.keyCodes[ THREEx.KeyboardState.ALIAS[key] ];
		}else {
			pressed	= this.keyCodes[key.toUpperCase().charCodeAt(0)]
		}
		if( !pressed)	return false;
	};
	return true;
}

// -------------------- END OF FILE ---------------------
