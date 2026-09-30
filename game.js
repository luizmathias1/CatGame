// Cat Meme Evolution 3D - Main Game Engine
// Supercar Legends / Gate Runner style with 3D Cat Memes

class Game {
    constructor() {
        this.container = document.getElementById('game-container');
        this.score = 60;
        this.level = 1;
        this.currentTierIndex = 0;
        this.isPlaying = false;
        this.isGameOver = false;
        this.isVictory = false;
        this.isReachingFinish = false;
        
        // Track settings
        this.trackWidth = 8.5;
        this.trackLength = 360;
        this.forwardSpeed = 24.0;
        this.maxSpeed = 34.0;
        this.currentSpeed = 0;
        
        // Player position & physics
        this.playerX = 0;
        this.targetPlayerX = 0;
        this.playerZ = 0;
        this.playerY = 0;
        this.jumpVelocity = 0;
        this.isJumping = false;
        
        // Input tracking
        this.isPointerDown = false;
        this.lastPointerX = 0;
        this.keys = { ArrowLeft: false, ArrowRight: false, KeyA: false, KeyD: false };

        // Lists of dynamic objects in scene
        this.gates = [];
        this.collectibles = [];
        this.obstacles = [];
        this.particles = [];
        this.multiplierZones = [];
        this.finishLineZ = -this.trackLength;
        
        // Animation timers
        this.clock = new THREE.Clock();
        this.memeAnimTimer = 0;
        this.oiiaSoundTimer = 0;
        this.popSoundTimer = 0;
        this.muheheheTimer = 0;

        // Multiplier runway calculation
        this.feverStopZ = 0;
        this.finalMultiplier = 1.0;

        this.initThree();
        this.setupLights();
        this.setupEnvironment();
        this.buildLevel();
        this.setupPlayer();
        this.setupInputs();
        this.setupUI();

        // Start render loop
        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);
    }

    initThree() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0f172a);
        this.scene.fog = new THREE.FogExp2(0x0f172a, 0.012);

        this.camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 5, 8);

        this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.container.appendChild(this.renderer.domElement);

        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    setupLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
        this.scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
        dirLight.position.set(20, 40, 20);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = 2048;
        dirLight.shadow.mapSize.height = 2048;
        dirLight.shadow.camera.near = 0.5;
        dirLight.shadow.camera.far = 150;
        dirLight.shadow.camera.left = -15;
        dirLight.shadow.camera.right = 15;
        dirLight.shadow.camera.top = 25;
        dirLight.shadow.camera.bottom = -25;
        this.scene.add(dirLight);

        const hemiLight = new THREE.HemisphereLight(0x81ecec, 0x2d3436, 0.4);
        this.scene.add(hemiLight);
    }

    setupEnvironment() {
        // Floating clouds / neon synth stars in background
        const starGeo = new THREE.BufferGeometry();
        const starCount = 350;
        const starPositions = new Float32Array(starCount * 3);
        for (let i = 0; i < starCount * 3; i += 3) {
            starPositions[i] = (Math.random() - 0.5) * 200;
            starPositions[i + 1] = Math.random() * 60 + 5;
            starPositions[i + 2] = -Math.random() * 500;
        }
        starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
        const starMat = new THREE.PointsMaterial({ color: 0x81ecec, size: 0.8, transparent: true, opacity: 0.8 });
        const starField = new THREE.Points(starGeo, starMat);
        this.scene.add(starField);

        // Grid floor beneath the main track for aesthetic depth
        const gridHelper = new THREE.GridHelper(600, 60, 0x6c5ce7, 0x1e272e);
        gridHelper.position.y = -0.5;
        gridHelper.position.z = -200;
        this.scene.add(gridHelper);
    }

    buildLevel() {
        // Clear previous level elements if any
        if (this.levelGroup) {
            this.scene.remove(this.levelGroup);
        }
        this.levelGroup = new THREE.Group();
        this.scene.add(this.levelGroup);

        this.gates = [];
        this.collectibles = [];
        this.obstacles = [];
        this.multiplierZones = [];

        // 1. MAIN TRACK
        const trackGeo = new THREE.BoxGeometry(this.trackWidth, 0.6, this.trackLength);
        const trackMat = new THREE.MeshStandardMaterial({
            color: 0x1e293b,
            roughness: 0.4,
            metalness: 0.2
        });
        const track = new THREE.Mesh(trackGeo, trackMat);
        track.position.set(0, -0.3, -this.trackLength / 2);
        track.receiveShadow = true;
        this.levelGroup.add(track);

        // Neon side rails
        const railGeo = new THREE.CylinderGeometry(0.12, 0.12, this.trackLength, 8);
        const railMatL = new THREE.MeshStandardMaterial({ color: 0x00cec9, emissive: 0x00cec9, emissiveIntensity: 0.6 });
        const railMatR = new THREE.MeshStandardMaterial({ color: 0xff7675, emissive: 0xff7675, emissiveIntensity: 0.6 });
        
        const railL = new THREE.Mesh(railGeo, railMatL);
        railL.rotation.x = Math.PI / 2;
        railL.position.set(-this.trackWidth / 2, 0.1, -this.trackLength / 2);
        this.levelGroup.add(railL);

        const railR = new THREE.Mesh(railGeo, railMatR);
        railR.rotation.x = Math.PI / 2;
        railR.position.set(this.trackWidth / 2, 0.1, -this.trackLength / 2);
        this.levelGroup.add(railR);

        // Center line dashes
        const dashGeo = new THREE.BoxGeometry(0.2, 0.05, 3);
        const dashMat = new THREE.MeshBasicMaterial({ color: 0xf1c40f });
        for (let z = -10; z > -this.trackLength; z -= 8) {
            const dash = new THREE.Mesh(dashGeo, dashMat);
            dash.position.set(0, 0.02, z);
            this.levelGroup.add(dash);
        }

        // 2. GATES / PORTALS
        // Create 8 gate pairs along the track
        const gateDistances = [35, 75, 115, 155, 195, 235, 275, 315];
        const gateConfigs = [
            [{ op: '+', val: 50 }, { op: '+', val: 80 }],
            [{ op: 'x', val: 1.5 }, { op: '+', val: 40 }],
            [{ op: '-', val: 50 }, { op: '+', val: 120 }],
            [{ op: 'x', val: 2 }, { op: '÷', val: 2 }],
            [{ op: '+', val: 150 }, { op: '-', val: 80 }],
            [{ op: 'x', val: 1.8 }, { op: '+', val: 200 }],
            [{ op: '÷', val: 2 }, { op: 'x', val: 2.5 }],
            [{ op: '+', val: 350 }, { op: '-', val: 150 }]
        ];

        gateDistances.forEach((zDist, idx) => {
            const cfg = gateConfigs[idx % gateConfigs.length];
            const zPos = -zDist;
            
            // Left gate (x = -2.1), Right gate (x = 2.1)
            this.createGatePair(cfg[0], cfg[1], zPos);
        });

        // 3. COLLECTIBLES (Golden Fish & Tuna Cans)
        for (let z = -15; z > -this.trackLength + 15; z -= 14) {
            // Avoid spawning on top of gates
            if (gateDistances.some(gz => Math.abs(gz - (-z)) < 6)) continue;

            const laneX = (Math.random() - 0.5) * (this.trackWidth - 2.5);
            const isTuna = Math.random() > 0.65;
            this.createCollectible(laneX, z, isTuna);
        }

        // 4. OBSTACLES (Cucumbers & Roombas)
        const obstacleZ = [50, 95, 135, 175, 215, 255, 295];
        obstacleZ.forEach((zDist, i) => {
            const zPos = -zDist;
            if (i % 2 === 0) {
                // Cucumber on floor
                const xPos = (Math.random() - 0.5) * (this.trackWidth - 3);
                this.createCucumber(xPos, zPos);
            } else {
                // Roomba vacuum patrolling
                this.createRoomba(zPos);
            }
        });

        // 5. FINISH LINE & MULTIPLIER FEVER RUNWAY
        this.createFinishAndMultiplierRunway();
    }

    createGatePair(leftCfg, rightCfg, zPos) {
        const leftGate = this.createGateMesh(leftCfg, -2.1, zPos);
        const rightGate = this.createGateMesh(rightCfg, 2.1, zPos);

        leftGate.pairId = zPos;
        rightGate.pairId = zPos;

        this.gates.push(leftGate, rightGate);
        this.levelGroup.add(leftGate.group);
        this.levelGroup.add(rightGate.group);
    }

    createGateMesh(cfg, xPos, zPos) {
        const isPositive = (cfg.op === '+' || cfg.op === 'x');
        const color = isPositive ? 0x2ecc71 : 0xe74c3c;
        const emissiveColor = isPositive ? 0x27ae60 : 0xc0392b;

        const gateGroup = new THREE.Group();
        gateGroup.position.set(xPos, 0, zPos);

        // Frame
        const frameGeo = new THREE.TorusGeometry(1.6, 0.12, 12, 24);
        frameGeo.scale(1.1, 1.25, 1);
        const frameMat = new THREE.MeshStandardMaterial({
            color: color,
            emissive: emissiveColor,
            emissiveIntensity: 0.9,
            metalness: 0.5
        });
        const frame = new THREE.Mesh(frameGeo, frameMat);
        frame.position.y = 1.9;
        gateGroup.add(frame);

        // Translucent Energy Field
        const fieldGeo = new THREE.PlaneGeometry(3.2, 3.8);
        const fieldMat = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.45,
            side: THREE.DoubleSide
        });
        const field = new THREE.Mesh(fieldGeo, fieldMat);
        field.position.y = 1.9;
        gateGroup.add(field);

        // Floating Text Canvas Texture
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = isPositive ? '#2ecc71' : '#e74c3c';
        ctx.font = '900 68px "Fredoka One", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        let labelText = `${cfg.op}${cfg.val}`;
        if (cfg.op === 'x') labelText = `×${cfg.val}`;
        if (cfg.op === '÷') labelText = `÷${cfg.val}`;

        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 10;
        ctx.strokeText(labelText, 128, 64);
        ctx.fillStyle = '#ffffff';
        ctx.fillText(labelText, 128, 64);

        const textTex = new THREE.CanvasTexture(canvas);
        const textMat = new THREE.SpriteMaterial({ map: textTex, transparent: true });
        const textSprite = new THREE.Sprite(textMat);
        textSprite.position.set(0, 1.9, 0.1);
        textSprite.scale.set(2.4, 1.2, 1);
        gateGroup.add(textSprite);

        return {
            group: gateGroup,
            config: cfg,
            isPositive: isPositive,
            x: xPos,
            z: zPos,
            radius: 1.8,
            active: true
        };
    }

    createCollectible(x, z, isTuna) {
        const group = new THREE.Group();
        group.position.set(x, 0.8, z);

        if (isTuna) {
            // Tuna Can Mesh
            const canGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.25, 16);
            const canMat = new THREE.MeshStandardMaterial({
                color: 0x3498db,
                metalness: 0.8,
                roughness: 0.2,
                emissive: 0x2980b9,
                emissiveIntensity: 0.4
            });
            const can = new THREE.Mesh(canGeo, canMat);
            group.add(can);
        } else {
            // Golden Fish Treat Mesh
            const fishBodyGeo = new THREE.SphereGeometry(0.3, 10, 10);
            fishBodyGeo.scale(1.6, 0.8, 0.4);
            const fishMat = new THREE.MeshStandardMaterial({
                color: 0xf1c40f,
                metalness: 0.6,
                roughness: 0.2,
                emissive: 0xf39c12,
                emissiveIntensity: 0.6
            });
            const fishBody = new THREE.Mesh(fishBodyGeo, fishMat);
            group.add(fishBody);

            const tailGeo = new THREE.ConeGeometry(0.25, 0.4, 4);
            const tail = new THREE.Mesh(tailGeo, fishMat);
            tail.rotation.z = Math.PI / 2;
            tail.position.x = -0.45;
            group.add(tail);
        }

        this.collectibles.push({
            group: group,
            x: x,
            z: z,
            isTuna: isTuna,
            value: isTuna ? 30 : 15,
            active: true,
            rotSpeed: 2.5
        });

        this.levelGroup.add(group);
    }

    createCucumber(x, z) {
        const group = new THREE.Group();
        group.position.set(x, 0.2, z);

        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-0.4, 0, -0.2),
            new THREE.Vector3(0, 0.1, 0),
            new THREE.Vector3(0.4, 0, 0.2)
        ]);
        const cucumberGeo = new THREE.TubeGeometry(curve, 12, 0.16, 8, false);
        const cucumberMat = new THREE.MeshStandardMaterial({
            color: 0x27ae60,
            roughness: 0.3,
            metalness: 0.1
        });
        const cucumber = new THREE.Mesh(cucumberGeo, cucumberMat);
        cucumber.castShadow = true;
        group.add(cucumber);

        this.obstacles.push({
            type: 'cucumber',
            group: group,
            x: x,
            z: z,
            radius: 0.9,
            active: true
        });

        this.levelGroup.add(group);
    }

    createRoomba(z) {
        const group = new THREE.Group();
        group.position.set(0, 0.25, z);

        const roombaGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.25, 20);
        const roombaMat = new THREE.MeshStandardMaterial({
            color: 0x2d3436,
            metalness: 0.7,
            roughness: 0.3
        });
        const roomba = new THREE.Mesh(roombaGeo, roombaMat);
        roomba.castShadow = true;
        group.add(roomba);

        // Blinking red sensor light
        const lightGeo = new THREE.SphereGeometry(0.1, 8, 8);
        const lightMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const light = new THREE.Mesh(lightGeo, lightMat);
        light.position.set(0, 0.15, 0.4);
        group.add(light);

        this.obstacles.push({
            type: 'roomba',
            group: group,
            x: 0,
            z: z,
            radius: 1.0,
            active: true,
            patrolSpeed: 2.8,
            direction: 1
        });

        this.levelGroup.add(group);
    }

    createFinishAndMultiplierRunway() {
        const finishZ = this.finishLineZ;

        // Finish Gate Arch
        const archGeo = new THREE.BoxGeometry(this.trackWidth + 1.2, 5.5, 1);
        const archMat = new THREE.MeshStandardMaterial({ color: 0xf1c40f, metalness: 0.5 });
        const arch = new THREE.Mesh(archGeo, archMat);
        arch.position.set(0, 2.75, finishZ);
        this.levelGroup.add(arch);

        // Arch banner text
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, 512, 128);
        ctx.fillStyle = '#f1c40f';
        ctx.font = 'bold 70px "Fredoka One", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🏁 CHEGADA ÉPICA 🏁', 256, 64);

        const bannerTex = new THREE.CanvasTexture(canvas);
        const bannerMat = new THREE.MeshBasicMaterial({ map: bannerTex });
        const bannerGeo = new THREE.PlaneGeometry(8, 2);
        const banner = new THREE.Mesh(bannerGeo, bannerMat);
        banner.position.set(0, 4.2, finishZ + 0.55);
        this.levelGroup.add(banner);

        // Multiplier Runway Steps
        const multipliers = [
            { mult: 1.2, color: 0x3498db, len: 15 },
            { mult: 1.5, color: 0x2ecc71, len: 18 },
            { mult: 2.0, color: 0xf1c40f, len: 20 },
            { mult: 3.0, color: 0xe67e22, len: 22 },
            { mult: 5.0, color: 0xe74c3c, len: 25 },
            { mult: 10.0, color: 0x9b59b6, len: 30 }
        ];

        let currentZ = finishZ;
        multipliers.forEach((m, idx) => {
            const stepZ = currentZ - m.len / 2;
            const geo = new THREE.BoxGeometry(this.trackWidth, 0.7, m.len);
            const mat = new THREE.MeshStandardMaterial({
                color: m.color,
                roughness: 0.3,
                emissive: m.color,
                emissiveIntensity: 0.2
            });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.set(0, -0.3, stepZ);
            mesh.receiveShadow = true;
            this.levelGroup.add(mesh);

            // Multiplier text on ground
            const multCanvas = document.createElement('canvas');
            multCanvas.width = 256;
            multCanvas.height = 128;
            const mCtx = multCanvas.getContext('2d');
            mCtx.font = 'bold 85px "Fredoka One", sans-serif';
            mCtx.fillStyle = '#ffffff';
            mCtx.textAlign = 'center';
            mCtx.textBaseline = 'middle';
            mCtx.fillText(`×${m.mult}`, 128, 64);

            const mTex = new THREE.CanvasTexture(multCanvas);
            const mMat = new THREE.MeshBasicMaterial({ map: mTex, transparent: true });
            const mPlane = new THREE.Mesh(new THREE.PlaneGeometry(4, 2), mMat);
            mPlane.rotation.x = -Math.PI / 2;
            mPlane.position.set(0, 0.08, stepZ);
            this.levelGroup.add(mPlane);

            this.multiplierZones.push({
                multiplier: m.mult,
                startZ: currentZ,
                endZ: currentZ - m.len
            });

            currentZ -= m.len;
        });

        this.runwayEndZ = currentZ;
    }

    setupPlayer() {
        if (this.playerGroup) {
            this.scene.remove(this.playerGroup);
        }

        this.playerGroup = new THREE.Group();
        this.playerGroup.position.set(0, 0, 0);
        this.scene.add(this.playerGroup);

        this.updatePlayerModel();
    }

    updatePlayerModel() {
        // Remove existing model children from playerGroup
        while (this.playerGroup.children.length > 0) {
            this.playerGroup.remove(this.playerGroup.children[0]);
        }

        const model = CatModels.buildCatGroup(this.currentTierIndex);
        this.playerGroup.add(model);
        this.currentCatModel = model;

        // Update HUD
        const tier = MEME_TIERS[this.currentTierIndex];
        const nextTier = MEME_TIERS[Math.min(this.currentTierIndex + 1, MEME_TIERS.length - 1)];

        document.getElementById('hud-avatar').textContent = tier.avatar;
        document.getElementById('hud-meme-name').textContent = tier.name;
        document.getElementById('hud-meme-tier').textContent = `TIER ${this.currentTierIndex + 1}`;
        
        if (this.currentTierIndex >= MEME_TIERS.length - 1) {
            document.getElementById('next-meme-name').textContent = "TIER MÁXIMO!";
            document.getElementById('evolution-progress').style.width = "100%";
        } else {
            document.getElementById('next-meme-name').textContent = `PRÓXIMO: ${nextTier.name}`;
            this.updateEvolutionProgressBar();
        }
    }

    updateEvolutionProgressBar() {
        if (this.currentTierIndex >= MEME_TIERS.length - 1) {
            document.getElementById('evolution-progress').style.width = "100%";
            return;
        }

        const currentThreshold = MEME_TIERS[this.currentTierIndex].threshold;
        const nextThreshold = MEME_TIERS[this.currentTierIndex + 1].threshold;
        const progress = Math.max(0, Math.min(1, (this.score - currentThreshold) / (nextThreshold - currentThreshold)));
        
        document.getElementById('evolution-progress').style.width = `${Math.floor(progress * 100)}%`;
    }

    setupInputs() {
        // Mouse and Touch controls
        window.addEventListener('pointerdown', (e) => {
            if (!this.isPlaying) return;
            this.isPointerDown = true;
            this.lastPointerX = e.clientX;
        });

        window.addEventListener('pointermove', (e) => {
            if (!this.isPlaying || !this.isPointerDown) return;
            const deltaX = (e.clientX - this.lastPointerX) * 0.015;
            this.targetPlayerX += deltaX;
            this.lastPointerX = e.clientX;

            const halfWidth = (this.trackWidth / 2) - 0.9;
            this.targetPlayerX = Math.max(-halfWidth, Math.min(halfWidth, this.targetPlayerX));
        });

        window.addEventListener('pointerup', () => {
            this.isPointerDown = false;
        });

        // Keyboard controls
        window.addEventListener('keydown', (e) => {
            if (this.keys.hasOwnProperty(e.code)) {
                this.keys[e.code] = true;
            }
        });

        window.addEventListener('keyup', (e) => {
            if (this.keys.hasOwnProperty(e.code)) {
                this.keys[e.code] = false;
            }
        });
    }

    setupUI() {
        const startBtn = document.getElementById('start-btn');
        startBtn.addEventListener('click', () => {
            window.soundFX.init();
            this.startGame();
        });

        const nextLevelBtn = document.getElementById('next-level-btn');
        nextLevelBtn.addEventListener('click', () => {
            this.nextLevel();
        });

        const restartWinBtn = document.getElementById('restart-win-btn');
        restartWinBtn.addEventListener('click', () => {
            this.restartGame();
        });

        const restartLoseBtn = document.getElementById('restart-lose-btn');
        restartLoseBtn.addEventListener('click', () => {
            this.restartGame();
        });

        const soundBtn = document.getElementById('sound-btn');
        soundBtn.addEventListener('click', () => {
            const enabled = window.soundFX.toggle();
            soundBtn.textContent = enabled ? '🔊' : '🔇';
        });
    }

    startGame() {
        document.getElementById('start-screen').classList.add('hidden');
        document.getElementById('victory-screen').classList.add('hidden');
        document.getElementById('gameover-screen').classList.add('hidden');
        document.getElementById('hud').classList.remove('hidden');

        this.score = 60;
        this.currentTierIndex = 0;
        this.playerX = 0;
        this.targetPlayerX = 0;
        this.playerZ = 0;
        this.playerY = 0;
        this.currentSpeed = this.forwardSpeed;
        this.isPlaying = true;
        this.isGameOver = false;
        this.isVictory = false;
        this.isReachingFinish = false;

        this.updatePlayerModel();
        this.updateScoreDisplay();
        window.soundFX.playHuh();
    }

    restartGame() {
        this.buildLevel();
        this.startGame();
    }

    nextLevel() {
        this.level++;
        this.forwardSpeed = Math.min(this.maxSpeed, this.forwardSpeed + 2.0);
        this.buildLevel();
        this.startGame();
    }

    updateScore(delta, multiplier = false) {
        const oldScore = this.score;
        if (multiplier) {
            this.score = Math.floor(this.score * delta);
        } else {
            this.score = Math.max(0, this.score + delta);
        }

        // Float notification
        let text = delta >= 0 ? `+${delta}` : `${delta}`;
        if (multiplier) text = `×${delta}`;
        this.showFloatingText(text, delta >= 0 ? 'floating-positive' : 'floating-negative');

        this.updateScoreDisplay();
        this.checkEvolution();

        if (this.score <= 0 && !this.isVictory) {
            this.triggerGameOver();
        }
    }

    updateScoreDisplay() {
        document.getElementById('hud-score').textContent = this.score;
        this.updateEvolutionProgressBar();
    }

    checkEvolution() {
        // Determine appropriate tier for current score
        let newTierIndex = 0;
        for (let i = MEME_TIERS.length - 1; i >= 0; i--) {
            if (this.score >= MEME_TIERS[i].threshold) {
                newTierIndex = i;
                break;
            }
        }

        if (newTierIndex !== this.currentTierIndex) {
            const isUpgrade = newTierIndex > this.currentTierIndex;
            this.currentTierIndex = newTierIndex;
            this.updatePlayerModel();

            if (isUpgrade) {
                window.soundFX.playEvolve();
                this.showFloatingText(`🎉 EVOLUIU: ${MEME_TIERS[newTierIndex].name}!`, 'floating-evolve');
                this.spawnConfettiParticles(this.playerGroup.position, 0x00cec9, 30);
            }
        }
    }

    showFloatingText(text, className) {
        const container = document.getElementById('floating-notifications');
        const el = document.createElement('div');
        el.className = `floating-text ${className}`;
        el.textContent = text;
        container.appendChild(el);

        setTimeout(() => {
            if (container.contains(el)) {
                container.removeChild(el);
            }
        }, 1200);
    }

    spawnConfettiParticles(pos, color = 0xf1c40f, count = 20) {
        const geo = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const velocities = [];

        for (let i = 0; i < count; i++) {
            positions[i * 3] = pos.x;
            positions[i * 3 + 1] = pos.y + 1.0;
            positions[i * 3 + 2] = pos.z;

            velocities.push(new THREE.Vector3(
                (Math.random() - 0.5) * 6,
                Math.random() * 5 + 3,
                (Math.random() - 0.5) * 6
            ));
        }

        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const mat = new THREE.PointsMaterial({
            color: color,
            size: 0.35,
            transparent: true,
            opacity: 1
        });
        const pSystem = new THREE.Points(geo, mat);
        this.scene.add(pSystem);

        this.particles.push({
            mesh: pSystem,
            velocities: velocities,
            life: 1.0
        });
    }

    triggerGameOver() {
        this.isPlaying = false;
        this.isGameOver = true;
        this.currentSpeed = 0;

        const distancePct = Math.min(99, Math.floor((Math.abs(this.playerZ) / this.trackLength) * 100));
        document.getElementById('lose-distance').textContent = `${distancePct}%`;

        setTimeout(() => {
            document.getElementById('hud').classList.add('hidden');
            document.getElementById('gameover-screen').classList.remove('hidden');
            window.soundFX.playGateNegative();
        }, 600);
    }

    triggerVictory() {
        this.isPlaying = false;
        this.isVictory = true;
        this.currentSpeed = 0;

        const baseScore = this.score;
        const finalMultipliedScore = Math.floor(baseScore * this.finalMultiplier);
        const tier = MEME_TIERS[this.currentTierIndex];

        document.getElementById('win-avatar').textContent = tier.avatar;
        document.getElementById('win-meme-name').textContent = tier.name;
        document.getElementById('win-base-score').textContent = baseScore;
        document.getElementById('win-multiplier').textContent = `x${this.finalMultiplier.toFixed(1)}`;
        document.getElementById('win-final-score').textContent = finalMultipliedScore;

        document.getElementById('hud').classList.add('hidden');
        document.getElementById('victory-screen').classList.remove('hidden');

        window.soundFX.playVictory();

        // Confetti explosion
        if (window.confetti) {
            window.confetti({
                particleCount: 150,
                spread: 80,
                origin: { y: 0.6 }
            });
        }
    }

    animate() {
        requestAnimationFrame(this.animate);
        const dt = Math.min(this.clock.getDelta(), 0.1);

        if (this.isPlaying) {
            this.handlePlayerMovement(dt);
            this.handleGateCollisions();
            this.handleCollectibleCollisions();
            this.handleObstacleCollisions(dt);
            this.checkFinishLine(dt);
            this.animateCatMeme(dt);
        }

        // Particle updates
        this.updateParticles(dt);

        // Camera follow
        this.updateCamera(dt);

        this.renderer.render(this.scene, this.camera);
    }

    handlePlayerMovement(dt) {
        // Keyboard inputs
        const keySpeed = 16.0;
        if (this.keys.ArrowLeft || this.keys.KeyA) {
            this.targetPlayerX -= keySpeed * dt;
        }
        if (this.keys.ArrowRight || this.keys.KeyD) {
            this.targetPlayerX += keySpeed * dt;
        }

        const halfWidth = (this.trackWidth / 2) - 0.9;
        this.targetPlayerX = Math.max(-halfWidth, Math.min(halfWidth, this.targetPlayerX));

        // Smooth horizontal Lerp
        this.playerX += (this.targetPlayerX - this.playerX) * 14.0 * dt;

        // Move forward
        this.playerZ -= this.currentSpeed * dt;

        // Jump physics
        if (this.isJumping) {
            this.jumpVelocity -= 22 * dt;
            this.playerY += this.jumpVelocity * dt;
            if (this.playerY <= 0) {
                this.playerY = 0;
                this.isJumping = false;
                this.jumpVelocity = 0;
            }
        }

        // Update 3D player position & tilt
        this.playerGroup.position.set(this.playerX, this.playerY, this.playerZ);
        const tiltX = (this.targetPlayerX - this.playerX) * 0.12;
        this.playerGroup.rotation.z = -tiltX;
    }

    handleGateCollisions() {
        const pZ = this.playerZ;
        const pX = this.playerX;

        this.gates.forEach(gate => {
            if (!gate.active) return;

            // Trigger when player passes through the gate's Z plane
            if (pZ <= gate.z + 0.5 && pZ >= gate.z - 1.2) {
                // Check if player is on this gate's side
                const distToGate = Math.abs(pX - gate.x);
                if (distToGate < gate.radius) {
                    gate.active = false;

                    // Deactivate partner gate in the same pair!
                    this.gates.forEach(partner => {
                        if (partner.pairId === gate.pairId) {
                            partner.active = false;
                            partner.group.visible = false;
                        }
                    });

                    // Apply gate effect
                    if (gate.config.op === '+') {
                        this.updateScore(gate.config.val, false);
                        window.soundFX.playGatePositive();
                    } else if (gate.config.op === 'x') {
                        this.updateScore(gate.config.val, true);
                        window.soundFX.playGatePositive();
                    } else if (gate.config.op === '-') {
                        this.updateScore(-gate.config.val, false);
                        window.soundFX.playGateNegative();
                    } else if (gate.config.op === '÷') {
                        const newScore = Math.max(1, Math.floor(this.score / gate.config.val));
                        const loss = this.score - newScore;
                        this.updateScore(-loss, false);
                        window.soundFX.playGateNegative();
                    }

                    // Burst particles at gate
                    this.spawnConfettiParticles(gate.group.position, gate.isPositive ? 0x2ecc71 : 0xe74c3c, 25);
                }
            }
        });
    }

    handleCollectibleCollisions() {
        const pZ = this.playerZ;
        const pX = this.playerX;

        this.collectibles.forEach(item => {
            if (!item.active) return;

            // Rotate collectible
            item.group.rotation.y += item.rotSpeed * 0.02;

            // Collision check
            const dist = Math.hypot(pX - item.x, pZ - item.z);
            if (dist < 1.1) {
                item.active = false;
                item.group.visible = false;
                this.updateScore(item.value, false);
                window.soundFX.playCollect();
                this.spawnConfettiParticles(item.group.position, item.isTuna ? 0x3498db : 0xf1c40f, 15);
            }
        });
    }

    handleObstacleCollisions(dt) {
        const pZ = this.playerZ;
        const pX = this.playerX;

        this.obstacles.forEach(obs => {
            if (!obs.active) return;

            if (obs.type === 'roomba') {
                // Patrol Roomba left-right
                obs.group.position.x += obs.patrolSpeed * obs.direction * dt;
                const limit = (this.trackWidth / 2) - 1.2;
                if (obs.group.position.x > limit) {
                    obs.direction = -1;
                } else if (obs.group.position.x < -limit) {
                    obs.direction = 1;
                }
                obs.x = obs.group.position.x;
            }

            // Check collision with player
            const dist = Math.hypot(pX - obs.x, pZ - obs.z);
            if (dist < obs.radius && this.playerY < 0.8) {
                obs.active = false;
                obs.group.visible = false;

                // Player jumps in surprise!
                this.isJumping = true;
                this.jumpVelocity = 7.0;

                const penalty = obs.type === 'cucumber' ? 40 : 60;
                this.updateScore(-penalty, false);
                window.soundFX.playScareHiss();
                this.showFloatingText(obs.type === 'cucumber' ? '🥒 SUSTO!' : '🤖 BATEU!', 'floating-negative');
            }
        });
    }

    checkFinishLine(dt) {
        if (!this.isReachingFinish && this.playerZ <= this.finishLineZ) {
            // Crossed finish line! Enter fever multiplier stretch!
            this.isReachingFinish = true;
            this.showFloatingText("🏁 RETA FINAL! MULTIPLIQUE!", "floating-evolve");

            // Calculate how far the cat can travel based on score
            // Base score 100 gets to 1.5x, 500 gets to 3x, 1000+ reaches 10x!
            const totalRunwayDist = Math.abs(this.runwayEndZ - this.finishLineZ);
            const scoreRatio = Math.min(1.0, this.score / 1200);
            this.feverStopZ = this.finishLineZ - (totalRunwayDist * scoreRatio);
        }

        if (this.isReachingFinish) {
            // Decelerate as approaching feverStopZ
            const remainingDist = Math.max(0, this.playerZ - this.feverStopZ);
            if (remainingDist < 1.0) {
                // Find current multiplier zone
                let matchedMultiplier = 1.0;
                for (const zone of this.multiplierZones) {
                    if (this.playerZ <= zone.startZ && this.playerZ >= zone.endZ) {
                        matchedMultiplier = zone.multiplier;
                        break;
                    }
                }
                this.finalMultiplier = matchedMultiplier;
                this.triggerVictory();
            }
        }
    }

    animateCatMeme(dt) {
        this.memeAnimTimer += dt;

        // Specific meme animations & sound triggers
        switch (this.currentTierIndex) {
            case 0: // Huh Cat
                const sprite = this.playerGroup.getObjectByName("huh_question_sprite");
                if (sprite) {
                    sprite.position.y = 2.3 + Math.sin(this.memeAnimTimer * 5) * 0.15;
                }
                break;

            case 1: // Pop Cat
                const popHead = this.playerGroup.getObjectByName("popcat_head");
                if (popHead && popHead.userData) {
                    popHead.userData.timer += dt;
                    if (popHead.userData.timer > 0.22) {
                        popHead.userData.timer = 0;
                        popHead.userData.isOpen = !popHead.userData.isOpen;
                        popHead.material.map = popHead.userData.isOpen ? popHead.userData.faceOpenTex : popHead.userData.faceClosedTex;
                        popHead.material.needsUpdate = true;
                        if (popHead.userData.isOpen) {
                            window.soundFX.playPop();
                        }
                    }
                }
                break;

            case 2: // Oiia Oiia Cat (Spins fast 360 degrees!)
                const spinGroup = this.playerGroup.getObjectByName("oiia_spin_group");
                if (spinGroup) {
                    spinGroup.rotation.y += 18.0 * dt; // Rapid spin!
                }
                // Periodic synth step
                this.oiiaSoundTimer += dt;
                if (this.oiiaSoundTimer > 0.18) {
                    this.oiiaSoundTimer = 0;
                    const step = Math.floor(this.memeAnimTimer * 6) % 6;
                    window.soundFX.playOiiaStep(step);
                }
                break;

            case 3: // Muhehehe Cat
                const evilAura = this.playerGroup.getObjectByName("evil_aura");
                if (evilAura) {
                    evilAura.rotation.y += 4.0 * dt;
                    evilAura.rotation.z += 2.0 * dt;
                    const scale = 1.0 + Math.sin(this.memeAnimTimer * 8) * 0.15;
                    evilAura.scale.set(scale, scale, scale);
                }
                // Periodic evil laugh
                this.muheheheTimer += dt;
                if (this.muheheheTimer > 3.0) {
                    this.muheheheTimer = 0;
                    window.soundFX.playMuhehehe();
                }
                break;

            case 4: // Banana Cat
                // Gentle wobbling crying bounce
                this.playerGroup.position.y = this.playerY + Math.abs(Math.sin(this.memeAnimTimer * 6)) * 0.12;
                break;

            case 5: // GigaChad Cat
                const floorAura = this.playerGroup.getObjectByName("gold_floor_aura");
                if (floorAura) {
                    floorAura.rotation.z += 3.0 * dt;
                }
                break;
        }
    }

    updateParticles(dt) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.life -= dt * 1.5;

            const posAttr = p.mesh.geometry.attributes.position;
            for (let j = 0; j < p.velocities.length; j++) {
                const vel = p.velocities[j];
                vel.y -= 9.8 * dt; // gravity

                posAttr.setXYZ(
                    j,
                    posAttr.getX(j) + vel.x * dt,
                    posAttr.getY(j) + vel.y * dt,
                    posAttr.getZ(j) + vel.z * dt
                );
            }
            posAttr.needsUpdate = true;
            p.mesh.material.opacity = p.life;

            if (p.life <= 0) {
                this.scene.remove(p.mesh);
                this.particles.splice(i, 1);
            }
        }
    }

    updateCamera(dt) {
        // Camera smooth third person follow
        const targetCamX = this.playerX * 0.5;
        const targetCamY = this.playerY + 4.8;
        const targetCamZ = this.playerZ + 8.2;

        this.camera.position.x += (targetCamX - this.camera.position.x) * 8.0 * dt;
        this.camera.position.y += (targetCamY - this.camera.position.y) * 8.0 * dt;
        this.camera.position.z = targetCamZ;

        // Look slightly ahead of player
        this.camera.lookAt(this.playerX * 0.7, this.playerY + 1.2, this.playerZ - 12);
    }
}

// Instantiate game on window load
window.addEventListener('load', () => {
    window.game = new Game();
});
