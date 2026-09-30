// 3D Procedural Models and Textures for Cat Memes in Three.js

const CatModels = {
    loadedModels: {},

    // Preload ready-made GLB 3D models
    initLoader() {
        if (typeof THREE !== 'undefined' && typeof THREE.GLTFLoader !== 'undefined') {
            const loader = new THREE.GLTFLoader();
            loader.load('assets/maxwell.glb', (gltf) => {
                this.loadedModels['maxwell'] = gltf.scene;
                console.log("✅ 3D GLB Model for Maxwell loaded successfully!");
                // If game is active and player is currently Maxwell / Oiia, update view
                if (window.game && window.game.currentTierIndex === 2) {
                    window.game.updatePlayerModel();
                }
            }, undefined, (err) => {
                console.warn("⚠️ Maxwell GLB could not be loaded, using high-detail procedural model.", err);
            });
        }
    },

    // Face Texture Generators using HTML5 2D Canvas
    createFaceCanvas(memeType, state = 0) {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');

        // Background / Fur
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 256, 256);

        if (memeType === 'huh') {
            // Huh Cat - confused look with big round eyes
            ctx.fillStyle = '#f5f6fa';
            ctx.fillRect(0, 0, 256, 256);

            // Grey patches
            ctx.fillStyle = '#718093';
            ctx.beginPath();
            ctx.arc(60, 60, 40, 0, Math.PI * 2);
            ctx.arc(200, 50, 45, 0, Math.PI * 2);
            ctx.fill();

            // Big Wide Confused Eyes
            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.arc(85, 120, 28, 0, Math.PI * 2);
            ctx.arc(171, 115, 34, 0, Math.PI * 2); // One eye slightly bigger (confused)
            ctx.fill();

            // Eye highlights
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(78, 112, 9, 0, Math.PI * 2);
            ctx.arc(164, 107, 12, 0, Math.PI * 2);
            ctx.fill();

            // Little pink nose
            ctx.fillStyle = '#ff9ff3';
            ctx.beginPath();
            ctx.moveTo(128, 155);
            ctx.lineTo(120, 145);
            ctx.lineTo(136, 145);
            ctx.fill();

            // Wavy mouth
            ctx.strokeStyle = '#2f3542';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(120, 162, 10, 0, Math.PI);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(136, 162, 10, 0, Math.PI);
            ctx.stroke();

        } else if (memeType === 'popcat') {
            // Pop Cat - Cream fur
            ctx.fillStyle = '#fcebd5';
            ctx.fillRect(0, 0, 256, 256);

            // Small eyes
            ctx.fillStyle = '#1e272e';
            ctx.beginPath();
            ctx.arc(80, 110, 12, 0, Math.PI * 2);
            ctx.arc(176, 110, 12, 0, Math.PI * 2);
            ctx.fill();

            if (state === 1) {
                // Mouth WIDE OPEN (Pop!)
                ctx.fillStyle = '#6b0000';
                ctx.beginPath();
                ctx.ellipse(128, 175, 45, 55, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = '#2d3436';
                ctx.lineWidth = 6;
                ctx.stroke();

                // Pink tongue
                ctx.fillStyle = '#ff7675';
                ctx.beginPath();
                ctx.ellipse(128, 195, 25, 20, 0, 0, Math.PI * 2);
                ctx.fill();
            } else {
                // Mouth Closed cute smile
                ctx.fillStyle = '#ff7675';
                ctx.beginPath();
                ctx.moveTo(128, 145);
                ctx.lineTo(122, 138);
                ctx.lineTo(134, 138);
                ctx.fill();

                ctx.strokeStyle = '#2d3436';
                ctx.lineWidth = 5;
                ctx.beginPath();
                ctx.arc(118, 150, 12, 0, Math.PI);
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(138, 150, 12, 0, Math.PI);
                ctx.stroke();
            }

        } else if (memeType === 'oiia') {
            // Oiiai Spinning Cat (Black and white tuxedo cat face)
            ctx.fillStyle = '#1e272e';
            ctx.fillRect(0, 0, 256, 256);

            // White muzzle patch
            ctx.fillStyle = '#f5f6fa';
            ctx.beginPath();
            ctx.ellipse(128, 160, 65, 55, 0, 0, Math.PI * 2);
            ctx.fill();

            // Big bright green-yellow eyes
            ctx.fillStyle = '#eccc68';
            ctx.beginPath();
            ctx.arc(80, 105, 24, 0, Math.PI * 2);
            ctx.arc(176, 105, 24, 0, Math.PI * 2);
            ctx.fill();

            // Slit pupils
            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.ellipse(80, 105, 8, 22, 0, 0, Math.PI * 2);
            ctx.ellipse(176, 105, 8, 22, 0, 0, Math.PI * 2);
            ctx.fill();

            // Pink nose
            ctx.fillStyle = '#ff7675';
            ctx.beginPath();
            ctx.arc(128, 145, 8, 0, Math.PI * 2);
            ctx.fill();

            // Whiskers
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 3;
            [-15, 0, 15].forEach(offset => {
                ctx.beginPath();
                ctx.moveTo(70, 150 + offset);
                ctx.lineTo(20, 145 + offset * 1.5);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(186, 150 + offset);
                ctx.lineTo(236, 145 + offset * 1.5);
                ctx.stroke();
            });

        } else if (memeType === 'muhehehe') {
            // Muhehehe - Evil Laughing Cat
            ctx.fillStyle = '#2d3436';
            ctx.fillRect(0, 0, 256, 256);

            // Glowing red/yellow evil eyes
            ctx.fillStyle = '#ff3838';
            ctx.beginPath();
            ctx.moveTo(55, 95);
            ctx.quadraticCurveTo(85, 80, 110, 110);
            ctx.quadraticCurveTo(80, 120, 55, 95);
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(201, 95);
            ctx.quadraticCurveTo(171, 80, 146, 110);
            ctx.quadraticCurveTo(176, 120, 201, 95);
            ctx.fill();

            // Evil sharp wide grin
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(128, 160, 60, 0.1 * Math.PI, 0.9 * Math.PI);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = '#ff3838';
            ctx.lineWidth = 4;
            ctx.stroke();

            // Sharp teeth
            ctx.fillStyle = '#2d3436';
            for (let i = 85; i <= 170; i += 18) {
                ctx.beginPath();
                ctx.moveTo(i, 160);
                ctx.lineTo(i + 9, 175);
                ctx.lineTo(i + 18, 160);
                ctx.fill();
            }

        } else if (memeType === 'banana') {
            // Banana Cat Face (sad crying kitten)
            ctx.fillStyle = '#f8efba';
            ctx.fillRect(0, 0, 256, 256);

            // Big teary glossy eyes
            ctx.fillStyle = '#2f3542';
            ctx.beginPath();
            ctx.arc(80, 115, 24, 0, Math.PI * 2);
            ctx.arc(176, 115, 24, 0, Math.PI * 2);
            ctx.fill();

            // Huge tears
            ctx.fillStyle = '#70a1ff';
            ctx.beginPath();
            ctx.arc(80, 148, 12, 0, Math.PI * 2);
            ctx.arc(176, 148, 12, 0, Math.PI * 2);
            ctx.fill();

            // Sad wobbling mouth
            ctx.strokeStyle = '#2f3542';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(128, 175, 18, Math.PI, 0); // upside down arc = sad
            ctx.stroke();

        } else if (memeType === 'gigachad') {
            // GigaChad Cat
            ctx.fillStyle = '#ffeaa7';
            ctx.fillRect(0, 0, 256, 256);

            // Thug life black sunglasses
            ctx.fillStyle = '#1e272e';
            ctx.fillRect(45, 95, 75, 40);
            ctx.fillRect(136, 95, 75, 40);
            ctx.fillRect(115, 105, 26, 8); // bridge

            // White pixel glare on glasses
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(55, 100, 10, 10);
            ctx.fillRect(146, 100, 10, 10);

            // Chiseled jawline lines & smirk
            ctx.strokeStyle = '#d35400';
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(100, 175);
            ctx.lineTo(155, 165);
            ctx.stroke();

            // Gold tooth sparkle
            ctx.fillStyle = '#f1c40f';
            ctx.fillRect(145, 165, 8, 8);
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        return texture;
    },

    // Builder for each Meme Tier 3D Object Group
    buildCatGroup(tierIndex) {
        const group = new THREE.Group();
        group.name = "cat_tier_" + tierIndex;

        switch(tierIndex) {
            case 0:
                this.buildHuhCat(group);
                break;
            case 1:
                this.buildPopCat(group);
                break;
            case 2:
                this.buildOiiaCat(group);
                break;
            case 3:
                this.buildMuheheheCat(group);
                break;
            case 4:
                this.buildBananaCat(group);
                break;
            case 5:
            default:
                this.buildGigaChadCat(group);
                break;
        }

        return group;
    },

    // TIER 0: HUH CAT
    buildHuhCat(parent) {
        const bodyMat = new THREE.MeshStandardMaterial({ color: 0xecf0f1, roughness: 0.6 });
        const patchMat = new THREE.MeshStandardMaterial({ color: 0x7f8c8d, roughness: 0.6 });
        const faceTex = this.createFaceCanvas('huh');
        const faceMat = new THREE.MeshStandardMaterial({ map: faceTex, roughness: 0.5 });

        // Body
        const bodyGeo = new THREE.SphereGeometry(0.7, 16, 16);
        bodyGeo.scale(1, 0.9, 1.2);
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.position.y = 0.7;
        body.castShadow = true;
        parent.add(body);

        // Head
        const headGeo = new THREE.SphereGeometry(0.65, 20, 20);
        const headMats = [
            bodyMat, bodyMat, bodyMat, bodyMat,
            faceMat, // front
            bodyMat
        ];
        const head = new THREE.Mesh(headGeo, faceMat);
        head.position.set(0, 1.25, 0.4);
        head.rotation.z = -0.15; // Inquisitive tilt!
        head.castShadow = true;
        parent.add(head);

        // Ears
        const earGeo = new THREE.ConeGeometry(0.25, 0.45, 4);
        const earL = new THREE.Mesh(earGeo, patchMat);
        earL.position.set(-0.35, 1.8, 0.35);
        earL.rotation.z = 0.3;
        parent.add(earL);

        const earR = new THREE.Mesh(earGeo, bodyMat);
        earR.position.set(0.35, 1.8, 0.35);
        earR.rotation.z = -0.3;
        parent.add(earR);

        // Paws
        const pawGeo = new THREE.SphereGeometry(0.2, 8, 8);
        const pawMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
        [-0.4, 0.4].forEach(x => {
            const pawF = new THREE.Mesh(pawGeo, pawMat);
            pawF.position.set(x, 0.2, 0.5);
            parent.add(pawF);
            const pawB = new THREE.Mesh(pawGeo, pawMat);
            pawB.position.set(x, 0.2, -0.5);
            parent.add(pawB);
        });

        // Floating "?" symbol above head
        const questionCanvas = document.createElement('canvas');
        questionCanvas.width = 128;
        questionCanvas.height = 128;
        const qCtx = questionCanvas.getContext('2d');
        qCtx.font = 'bold 90px "Fredoka One", sans-serif';
        qCtx.fillStyle = '#ff7675';
        qCtx.textAlign = 'center';
        qCtx.textBaseline = 'middle';
        qCtx.fillText('?', 64, 64);

        const qTex = new THREE.CanvasTexture(questionCanvas);
        const qMat = new THREE.SpriteMaterial({ map: qTex, transparent: true });
        const qSprite = new THREE.Sprite(qMat);
        qSprite.position.set(0.4, 2.3, 0.4);
        qSprite.scale.set(0.8, 0.8, 0.8);
        qSprite.name = "huh_question_sprite";
        parent.add(qSprite);
    },

    // TIER 1: POP CAT
    buildPopCat(parent) {
        const furMat = new THREE.MeshStandardMaterial({ color: 0xfde3a7, roughness: 0.6 });
        
        // Body
        const bodyGeo = new THREE.CylinderGeometry(0.55, 0.65, 1.1, 16);
        const body = new THREE.Mesh(bodyGeo, furMat);
        body.position.y = 0.75;
        body.castShadow = true;
        parent.add(body);

        // Head
        const headGeo = new THREE.SphereGeometry(0.7, 24, 24);
        headGeo.scale(1.05, 0.95, 1);
        
        const faceClosedTex = this.createFaceCanvas('popcat', 0);
        const faceOpenTex = this.createFaceCanvas('popcat', 1);

        const headMat = new THREE.MeshStandardMaterial({ map: faceClosedTex, roughness: 0.5 });
        const head = new THREE.Mesh(headGeo, headMat);
        head.position.set(0, 1.4, 0.2);
        head.castShadow = true;
        head.name = "popcat_head";
        // Store textures on mesh for toggling during pop animation
        head.userData = { faceClosedTex, faceOpenTex, isOpen: false, timer: 0 };
        parent.add(head);

        // Cute triangular ears
        const earGeo = new THREE.ConeGeometry(0.24, 0.45, 4);
        const earMat = new THREE.MeshStandardMaterial({ color: 0xf5cd79 });
        const earL = new THREE.Mesh(earGeo, earMat);
        earL.position.set(-0.42, 1.95, 0.2);
        earL.rotation.z = 0.4;
        parent.add(earL);

        const earR = new THREE.Mesh(earGeo, earMat);
        earR.position.set(0.42, 1.95, 0.2);
        earR.rotation.z = -0.4;
        parent.add(earR);

        // Tail
        const tailGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.8, 8);
        const tail = new THREE.Mesh(tailGeo, earMat);
        tail.position.set(0, 0.7, -0.7);
        tail.rotation.x = -0.8;
        parent.add(tail);
    },

    // TIER 2: OIIA OIIA CAT (Fast Spinning Maxwell Cat)
    buildOiiaCat(parent) {
        // Inner spinning group so entire body spins dynamically!
        const spinGroup = new THREE.Group();
        spinGroup.name = "oiia_spin_group";
        parent.add(spinGroup);

        if (this.loadedModels && this.loadedModels['maxwell']) {
            // Authentic 3D GLB Maxwell model!
            const maxwellInstance = this.loadedModels['maxwell'].clone();
            maxwellInstance.scale.set(0.09, 0.09, 0.09);
            maxwellInstance.position.set(0, 0.05, 0);
            maxwellInstance.rotation.y = Math.PI; // Face forward along track
            maxwellInstance.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            spinGroup.add(maxwellInstance);
        } else {
            // Procedural fallback
            const blackMat = new THREE.MeshStandardMaterial({ color: 0x1e272e, roughness: 0.5 });
            const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
            const faceTex = this.createFaceCanvas('oiia');
            const faceMat = new THREE.MeshStandardMaterial({ map: faceTex, roughness: 0.5 });

            // Body
            const bodyGeo = new THREE.SphereGeometry(0.7, 16, 16);
            bodyGeo.scale(0.85, 1.1, 0.85);
            const body = new THREE.Mesh(bodyGeo, blackMat);
            body.position.y = 0.85;
            body.castShadow = true;
            spinGroup.add(body);

            // White belly
            const bellyGeo = new THREE.SphereGeometry(0.5, 12, 12);
            bellyGeo.scale(0.7, 0.9, 0.4);
            const belly = new THREE.Mesh(bellyGeo, whiteMat);
            belly.position.set(0, 0.85, 0.45);
            spinGroup.add(belly);

            // Head
            const headGeo = new THREE.SphereGeometry(0.68, 20, 20);
            const head = new THREE.Mesh(headGeo, faceMat);
            head.position.set(0, 1.55, 0.1);
            head.castShadow = true;
            spinGroup.add(head);

            // Ears
            const earGeo = new THREE.ConeGeometry(0.24, 0.45, 4);
            const earL = new THREE.Mesh(earGeo, blackMat);
            earL.position.set(-0.38, 2.1, 0.1);
            earL.rotation.z = 0.35;
            spinGroup.add(earL);

            const earR = new THREE.Mesh(earGeo, blackMat);
            earR.position.set(0.38, 2.1, 0.1);
            earR.rotation.z = -0.35;
            spinGroup.add(earR);
        }

        // Speed spin trail ring
        const ringGeo = new THREE.TorusGeometry(1.2, 0.05, 8, 30);
        const ringMat = new THREE.MeshBasicMaterial({ color: 0x00cec9, transparent: true, opacity: 0.7 });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = 0.8;
        parent.add(ring);
    },

    // TIER 3: MUHEHEHE CAT (Evil Laughing Demon Cat)
    buildMuheheheCat(parent) {
        const darkMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.4 });
        const evilPurpleMat = new THREE.MeshStandardMaterial({ color: 0x6c5ce7, emissive: 0x4834d4, emissiveIntensity: 0.6 });
        const faceTex = this.createFaceCanvas('muhehehe');
        const faceMat = new THREE.MeshStandardMaterial({ map: faceTex, roughness: 0.4 });

        // Body
        const bodyGeo = new THREE.SphereGeometry(0.75, 16, 16);
        bodyGeo.scale(1, 1, 1.2);
        const body = new THREE.Mesh(bodyGeo, darkMat);
        body.position.y = 0.8;
        body.castShadow = true;
        parent.add(body);

        // Head
        const headGeo = new THREE.SphereGeometry(0.72, 20, 20);
        const head = new THREE.Mesh(headGeo, faceMat);
        head.position.set(0, 1.45, 0.3);
        head.castShadow = true;
        parent.add(head);

        // Little red/purple devil horns
        const hornGeo = new THREE.ConeGeometry(0.16, 0.5, 6);
        const hornMat = new THREE.MeshStandardMaterial({ color: 0xff3838, emissive: 0xd63031, emissiveIntensity: 0.8 });
        const hornL = new THREE.Mesh(hornGeo, hornMat);
        hornL.position.set(-0.35, 2.1, 0.25);
        hornL.rotation.z = 0.3;
        hornL.rotation.x = -0.2;
        parent.add(hornL);

        const hornR = new THREE.Mesh(hornGeo, hornMat);
        hornR.position.set(0.35, 2.1, 0.25);
        hornR.rotation.z = -0.3;
        hornR.rotation.x = -0.2;
        parent.add(hornR);

        // Evil Aura Flame Sprite
        const auraGeo = new THREE.SphereGeometry(1.2, 16, 16);
        const auraMat = new THREE.MeshBasicMaterial({ 
            color: 0x8854d0, 
            transparent: true, 
            opacity: 0.25, 
            wireframe: true 
        });
        const aura = new THREE.Mesh(auraGeo, auraMat);
        aura.position.y = 1.1;
        aura.name = "evil_aura";
        parent.add(aura);
    },

    // TIER 4: BANANA CAT
    buildBananaCat(parent) {
        const bananaYellowMat = new THREE.MeshStandardMaterial({ color: 0xffdd59, roughness: 0.4 });
        const bananaGreenMat = new THREE.MeshStandardMaterial({ color: 0x2ed573, roughness: 0.5 });
        const faceTex = this.createFaceCanvas('banana');
        const faceMat = new THREE.MeshStandardMaterial({ map: faceTex, roughness: 0.5 });

        // Banana Curved Body
        const bananaCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0.3, -0.9),
            new THREE.Vector3(0, 0.5, -0.3),
            new THREE.Vector3(0, 0.7, 0.3),
            new THREE.Vector3(0, 1.1, 0.8)
        ]);
        const bananaGeo = new THREE.TubeGeometry(bananaCurve, 20, 0.55, 12, false);
        const bananaMesh = new THREE.Mesh(bananaGeo, bananaYellowMat);
        bananaMesh.castShadow = true;
        parent.add(bananaMesh);

        // Green Stem at tip
        const stemGeo = new THREE.CylinderGeometry(0.12, 0.18, 0.4, 8);
        const stem = new THREE.Mesh(stemGeo, bananaGreenMat);
        stem.position.set(0, 0.2, -1.05);
        stem.rotation.x = 0.5;
        parent.add(stem);

        // Kitten Head popping out of peel
        const headGeo = new THREE.SphereGeometry(0.55, 16, 16);
        const head = new THREE.Mesh(headGeo, faceMat);
        head.position.set(0, 1.35, 0.5);
        head.castShadow = true;
        parent.add(head);

        // Kitten Ears
        const earMat = new THREE.MeshStandardMaterial({ color: 0xf5f6fa });
        const earGeo = new THREE.ConeGeometry(0.18, 0.35, 4);
        const earL = new THREE.Mesh(earGeo, earMat);
        earL.position.set(-0.3, 1.8, 0.45);
        earL.rotation.z = 0.35;
        parent.add(earL);

        const earR = new THREE.Mesh(earGeo, earMat);
        earR.position.set(0.3, 1.8, 0.45);
        earR.rotation.z = -0.35;
        parent.add(earR);
    },

    // TIER 5: GIGACHAD CAT (God Tier)
    buildGigaChadCat(parent) {
        const goldFurMat = new THREE.MeshStandardMaterial({ 
            color: 0xf1c40f, 
            metalness: 0.3, 
            roughness: 0.3,
            emissive: 0xf39c12,
            emissiveIntensity: 0.2
        });
        const faceTex = this.createFaceCanvas('gigachad');
        const faceMat = new THREE.MeshStandardMaterial({ map: faceTex, roughness: 0.3 });

        // Muscular Buff Body
        const torsoGeo = new THREE.BoxGeometry(1.2, 1.0, 0.9);
        const torso = new THREE.Mesh(torsoGeo, goldFurMat);
        torso.position.y = 0.9;
        torso.castShadow = true;
        parent.add(torso);

        // Huge Shoulders (Biceps)
        const bicepGeo = new THREE.SphereGeometry(0.4, 12, 12);
        [-0.7, 0.7].forEach(x => {
            const shoulder = new THREE.Mesh(bicepGeo, goldFurMat);
            shoulder.position.set(x, 1.1, 0.1);
            parent.add(shoulder);
        });

        // Chiseled Head
        const headGeo = new THREE.BoxGeometry(0.9, 0.9, 0.8);
        const head = new THREE.Mesh(headGeo, faceMat);
        head.position.set(0, 1.65, 0.2);
        head.castShadow = true;
        parent.add(head);

        // Shiny Golden King Crown
        const crownGeo = new THREE.CylinderGeometry(0.45, 0.35, 0.35, 5);
        const crownMat = new THREE.MeshStandardMaterial({ 
            color: 0xffd700, 
            metalness: 0.9, 
            roughness: 0.1, 
            emissive: 0xf39c12, 
            emissiveIntensity: 0.4 
        });
        const crown = new THREE.Mesh(crownGeo, crownMat);
        crown.position.set(0, 2.25, 0.2);
        parent.add(crown);

        // Ruby Gems on Crown
        const gemGeo = new THREE.SphereGeometry(0.08, 8, 8);
        const gemMat = new THREE.MeshStandardMaterial({ color: 0xe74c3c, emissive: 0xff0000, emissiveIntensity: 0.8 });
        for (let i = 0; i < 5; i++) {
            const angle = (i / 5) * Math.PI * 2;
            const gem = new THREE.Mesh(gemGeo, gemMat);
            gem.position.set(Math.cos(angle) * 0.42, 2.38, 0.2 + Math.sin(angle) * 0.42);
            parent.add(gem);
        }

        // Golden sparkles aura
        const auraGeo = new THREE.RingGeometry(1.2, 1.5, 24);
        const auraMat = new THREE.MeshBasicMaterial({ color: 0xffd700, side: THREE.DoubleSide, transparent: true, opacity: 0.5 });
        const aura = new THREE.Mesh(auraGeo, auraMat);
        aura.rotation.x = Math.PI / 2;
        aura.position.y = 0.1;
        aura.name = "gold_floor_aura";
        parent.add(aura);
    }
};

// Information and stats for each meme tier
const MEME_TIERS = [
    {
        name: "HUH? CAT",
        avatar: "❓",
        threshold: 0,
        desc: "O gatinho mais confuso da internet.",
        color: "#74b9ff"
    },
    {
        name: "POP CAT",
        avatar: "😺",
        threshold: 100,
        desc: "Pop! Pop! Pop! Boca aberta e fechada sem parar!",
        color: "#ffeaa7"
    },
    {
        name: "OIIA OIIA CAT",
        avatar: "🌪️",
        threshold: 280,
        desc: "Girando na velocidade da luz com sua canção épica!",
        color: "#00cec9"
    },
    {
        name: "MUHEHEHE CAT",
        avatar: "😈",
        threshold: 550,
        desc: "A risada malévola do gato que dominou o mundo!",
        color: "#a29bfe"
    },
    {
        name: "BANANA CAT",
        avatar: "🍌",
        threshold: 900,
        desc: "Chorando lágrimas de pura dopamina dentro da banana!",
        color: "#fdcb6e"
    },
    {
        name: "GIGACHAD CAT",
        avatar: "👑",
        threshold: 1400,
        desc: "O ápice da evolução felina. Dourado e invencível!",
        color: "#f1c40f"
    }
];

window.CatModels = CatModels;
window.MEME_TIERS = MEME_TIERS;

// Initialize model loader as soon as scripts load
CatModels.initLoader();
