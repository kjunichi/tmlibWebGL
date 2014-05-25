// forked from kjunichi's "Three.js�œ����e�N�X�`���[" http://jsdo.it/kjunichi/mu7o
// forked from kjunichi's "Three.js��Mathematica���̃��C�e�B���O" http://jsdo.it/kjunichi/2p0N
// forked from phi's "�����g - tmlib.js 0.3" http://jsdo.it/phi/vIm5
// forked from phi's "���p�`�̊O�p�̘a - tmlib.js 0.3" http://jsdo.it/phi/xEa6
// forked from phi's "template - tmlib.js 0.2.2" http://jsdo.it/phi/yRg0
// forked from phi's "template - tmlib.js 0.1.7" http://jsdo.it/phi/m68l
/*
 * tmlib.js 0.3
 */

/*
 * contant
 */
var SCREEN_WIDTH    = 458;              // �X�N���[����
var SCREEN_HEIGHT   = 458;              // �X�N���[������
var SCREEN_CENTER_X = SCREEN_WIDTH/2;   // �X�N���[�����̔���
var SCREEN_CENTER_Y = SCREEN_HEIGHT/2;  // �X�N���[�������̔���

/*
 * main
 */
tm.main(function() {
    var app = tm.display.CanvasApp("#world");
    app.background = "#222";
    app.resize(SCREEN_WIDTH, SCREEN_HEIGHT);
    //app.fitWindow();

    app.replaceScene(MainScene());

    app.run();
});

/*
 * main scene
 */
tm.define("MainScene", {
    superClass: "tm.app.Scene",

    init: function() {
        this.superInit();

        this.title = tm.display.Label("Cosine Wave")
            .setFillStyle("#eee")
            .setPosition(SCREEN_CENTER_X, 30)
            .addChildTo(this)
            ;

        this.cosineWave = user.CosineWave().addChildTo(this)
            .setPosition(SCREEN_CENTER_X, SCREEN_CENTER_Y);
    },

    update: function(app) {
        this.cosineWave.degree += 4;
        var p = app.pointing;
        if (p.getPointing()) {
            var v = tm.geom.Vector2(
                SCREEN_CENTER_X-p.position.x,
                SCREEN_CENTER_Y-p.position.y
            );

            var degree = -v.toAngle()*180/Math.PI+180;
            this.cosineWave.degree = degree;
        }
    }
});


tm.define("user.CosineWave", {
    superClass: "tm.app.CanvasElement",

    init: function() {
        this.superInit();

        this.v = tm.geom.Vector2(0, 0);

        this.degree = 0;
        this.radius = 160;
    },

    update: function(app) {
        if (app.frame%1===0) {
            var p = user.Particle({
                angle: this.degree
            }).addChildTo(this);
            p.x = 0;
            p.y = this.v.y*-this.radius;
            p.v.x = 2;
            p.tweener.moveBy(400, 0, 5000).call(function() {
                this.remove();
            }, p);
        }

        if (app.frame%1===0) {
            var p1 = user.Particle({
                angle: this.degree
            }).addChildTo(this);
            p1.x = this.v.x*this.radius;
            p1.y = this.v.y*-this.radius;
            p1.tweener.fadeOut(1100).call(function() {
                this.remove();
            }, p1);
        }
    },

    draw: function(c) {
        c.fillStyle = "white";
        this.ndegree = 360-this.degree;
        //console.log(degree);
        c.fillStyle = "hsla({ndegree}, 80%, 80%, 1.0)".format(this);
        c.fillCircle(this.v.x*this.radius, this.v.y*-this.radius, 4);
    }
});

user.CosineWave.prototype.accessor("degree", {
    set: function(v) {
        this._degree = v;

        var rad = this.degree*Math.PI/180;
        this.v.y = Math.cos(rad);
        this.v.x = Math.sin(rad);
    },
    get: function() {
        return this._degree;
    }
});


tm.define("user.Particle", {
    superClass: "tm.display.CircleShape",

    init: function(param) {
        this.superInit(12, 12, {
            fillStyle: "hsla({angle}, 80%, 50%, 1.0)".format(param),
            strokeStyle: "transparent"
        });

        this.v = tm.geom.Vector2(0, 0);

        this.blendMode ="lighter";
    }
});

// �����܂�tmlib.js

// �������炪�AWebGL(three.js)
(function () {
    var hideElm =document.getElementById("world");

    hideElm.style="display:none;visiblity:hidden;webkit-backface-visibility:hidden;";
    hideElm.hidden=true;
    var image2;
    var canvasScaled;

    var texture;

    function updateTexture() {
        context = canvasScaled.getContext('2d');
        genImage(image2);
        context.putImageData(image2, 0, 0);

    }
    var t = 0;
    var camera, scene, renderer;
    var geometry, material, mesh, mesh2;

    init();
    drawObj();
    animate();

    function drawObj() {
        canvasScaled = document.getElementById('world');
        canvasScaled.width = 100;
        canvasScaled.height = 100;
        context = canvasScaled.getContext('2d');
        //image2 = context.createImageData(100, 100);
        //genImage(image2);
        //context.putImageData(image2, 0, 0);

        texture = new THREE.Texture(canvasScaled, new THREE.UVMapping(), THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping);
        texture.needsUpdate = true;

        material = new THREE.MeshLambertMaterial({
            map: texture,
            color: 0xa0a0a0,
            wireframe: false
        });
        geometry = new THREE.BoxGeometry(20, 20, 20, 3, 3, 3);
        mesh = new THREE.Mesh(geometry, material);

        scene.add(mesh);
    }

    function init() {
        var cs = document.getElementById("cs");
        cs.width = 458;
        cs.height = 458;
        camera = new THREE.PerspectiveCamera(75, 400 / 400, 1, 10000);
        camera.position.z = 50;
        camera.position.y = 10;
        scene = new THREE.Scene();

        var light = new THREE.AmbientLight(0x4c4c4c); // �^������1�Ƃ���
        scene.add(light);

        var directionalLight = [];
        directionalLight[0] = new THREE.DirectionalLight(0xf0f0f0, 1);
        directionalLight[0].position.x = 2;
        directionalLight[0].position.y = 2;
        directionalLight[0].position.z = 0;
        directionalLight[0].position.normalize();
        scene.add(directionalLight[0]);

        renderer = new THREE.WebGLRenderer({
            "canvas": cs
        });
        //renderer = new THREE.CanvasRenderer({"canvas":cs});
        renderer.setSize(cs.width, cs.height);

    }


    function animate() {
        // note: three.js includes requestAnimationFrame shim
        requestAnimationFrame(animate);

        camera.position.y = 20;
        camera.position.x = 30 * Math.cos(t);
        camera.position.z = 30 * Math.sin(t);
        //camera.target.x=0;
        //camera.target.y=0;
        //camera.target.z=0;
        camera.lookAt(scene.position);
        //updateTexture();
        texture.needsUpdate = true;
        t = t + 0.01;
        renderer.render(scene, camera);
    }
})();
