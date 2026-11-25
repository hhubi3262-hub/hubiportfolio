import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
  const stage = document.getElementById('three-stage');
  if (stage && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(40, Math.max(stage.clientWidth,1)/Math.max(stage.clientHeight,1), .1, 100);
      camera.position.set(0, 0, 7.1);
      const renderer = new THREE.WebGLRenderer({antialias:true, alpha:true, powerPreference:'high-performance'});
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.65));
      renderer.setSize(stage.clientWidth, stage.clientHeight);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.12;
      renderer.domElement.setAttribute('aria-hidden','true');
      stage.appendChild(renderer.domElement);

      const model = new THREE.Group(); scene.add(model);
      const gold = 0xD6AC65, champagne = 0xE9C98E, bronze = 0x8F6330;

      // Neural network core: a subtle metallic center surrounded by connected nodes.
      const core = new THREE.Mesh(
        new THREE.IcosahedronGeometry(.92, 2),
        new THREE.MeshPhysicalMaterial({color:0x282117, metalness:.82, roughness:.28,
          clearcoat:.9, clearcoatRoughness:.2, emissive:0x4A3214, emissiveIntensity:.28,
          transparent:true, opacity:.92})
      );
      model.add(core);
      const coreWire = new THREE.Mesh(new THREE.IcosahedronGeometry(1.02, 2),
        new THREE.MeshBasicMaterial({color:gold, wireframe:true, transparent:true, opacity:.22}));
      model.add(coreWire);

      const nodePositions=[];
      const nodeCount=170, radius=1.72, goldenAngle=Math.PI*(3-Math.sqrt(5));
      for(let i=0;i<nodeCount;i++){
        const y=1-(i/(nodeCount-1))*2;
        const ring=Math.sqrt(1-y*y), theta=goldenAngle*i;
        nodePositions.push(new THREE.Vector3(Math.cos(theta)*ring*radius, y*radius, Math.sin(theta)*ring*radius));
      }
      const nodeGeo=new THREE.BufferGeometry();
      const nodeArray=new Float32Array(nodeCount*3);
      nodePositions.forEach((v,i)=>{nodeArray[i*3]=v.x;nodeArray[i*3+1]=v.y;nodeArray[i*3+2]=v.z;});
      nodeGeo.setAttribute('position',new THREE.BufferAttribute(nodeArray,3));
      const nodes=new THREE.Points(nodeGeo,new THREE.PointsMaterial({color:champagne,size:.052,
        transparent:true,opacity:.96,sizeAttenuation:true}));
      model.add(nodes);

      // Link each node to its closest neighbors to form a spherical neural mesh.
      const linkPositions=[];
      for(let i=0;i<nodeCount;i++){
        const nearest=nodePositions.map((v,j)=>({j,d:nodePositions[i].distanceToSquared(v)}))
          .filter(x=>x.j!==i).sort((a,b)=>a.d-b.d).slice(0,4);
        for(const n of nearest){if(n.j>i){const a=nodePositions[i],b=nodePositions[n.j];linkPositions.push(a.x,a.y,a.z,b.x,b.y,b.z);}}
      }
      const linkGeo=new THREE.BufferGeometry();
      linkGeo.setAttribute('position',new THREE.Float32BufferAttribute(linkPositions,3));
      const links=new THREE.LineSegments(linkGeo,new THREE.LineBasicMaterial({color:gold,transparent:true,opacity:.38}));
      model.add(links);

      // A few orbital signal paths add depth without overpowering the network.
      const orbitA=new THREE.Mesh(new THREE.TorusGeometry(2.08,.007,6,180),
        new THREE.MeshBasicMaterial({color:champagne,transparent:true,opacity:.35}));
      orbitA.rotation.set(1.05,.2,.25); model.add(orbitA);
      const orbitB=new THREE.Mesh(new THREE.TorusGeometry(2.18,.006,6,180),
        new THREE.MeshBasicMaterial({color:bronze,transparent:true,opacity:.48}));
      orbitB.rotation.set(.35,1.18,.65); model.add(orbitB);

      scene.add(new THREE.AmbientLight(0xD9C6A4,1.05));
      const keyLight = new THREE.PointLight(0xFFE0A6,34,24); keyLight.position.set(3.5,3.5,4.5); scene.add(keyLight);
      const fillLight = new THREE.PointLight(0xA8793B,22,22); fillLight.position.set(-4,-2,2); scene.add(fillLight);
      const rimLight = new THREE.PointLight(0xFFF0D1,18,18); rimLight.position.set(0,4,-3); scene.add(rimLight);

      const particleGeometry = new THREE.BufferGeometry();
      const particlePositions = new Float32Array(300*3);
      for(let i=0;i<300;i++){
        particlePositions[i*3]=(Math.random()-.5)*8.5;
        particlePositions[i*3+1]=(Math.random()-.5)*7.5;
        particlePositions[i*3+2]=(Math.random()-.5)*5;
      }
      particleGeometry.setAttribute('position',new THREE.BufferAttribute(particlePositions,3));
      const particles = new THREE.Points(particleGeometry,new THREE.PointsMaterial({color:champagne,size:.018,transparent:true,opacity:.72,sizeAttenuation:true}));
      scene.add(particles);

      let mx=0,my=0,tx=0,ty=0,frame=0,active=true;
      const pointerMove=e=>{const r=stage.getBoundingClientRect();tx=((e.clientX-r.left)/r.width-.5)*.55;ty=((e.clientY-r.top)/r.height-.5)*.42;};
      stage.addEventListener('pointermove',pointerMove,{passive:true});
      stage.addEventListener('pointerleave',()=>{tx=0;ty=0;},{passive:true});
      stage.addEventListener('click',()=>{core.scale.setScalar(1.08);setTimeout(()=>core.scale.setScalar(1),180);});
      const clock=new THREE.Clock();
      function animate(){
        if(!active)return;
        frame=requestAnimationFrame(animate);
        const t=clock.getElapsedTime(); mx+=(tx-mx)*.035; my+=(ty-my)*.035;
        const scrollFactor=Math.min(window.scrollY/1800,.7);
        model.rotation.y=t*(.075+scrollFactor*.055)+mx; model.rotation.x=Math.sin(t*.22)*.07+my;
        core.rotation.y=-t*.11; core.rotation.x=Math.sin(t*.3)*.06;
        coreWire.rotation.y=t*.055; coreWire.rotation.x=-t*.035;
        nodes.rotation.y=t*.018; links.rotation.y=t*.018;
        orbitA.rotation.z=t*.055; orbitB.rotation.x=1.18+Math.sin(t*.17)*.1;
        particles.rotation.y=-t*.009;
        renderer.render(scene,camera);
      }
      const resizeObserver=new ResizeObserver(()=>{
        const w=Math.max(stage.clientWidth,1),h=Math.max(stage.clientHeight,1);
        camera.aspect=w/h; camera.updateProjectionMatrix(); renderer.setSize(w,h);
      });
      resizeObserver.observe(stage);
      const onVisibility=()=>{active=!document.hidden;if(active){clock.start();animate();}else{cancelAnimationFrame(frame);}};
      document.addEventListener('visibilitychange',onVisibility);
      animate();
    } catch(error) {
      console.warn('3D model could not be initialized:',error);
      stage.classList.add('three-fallback');
    }
  } else if(stage) {
    stage.classList.add('three-static');
  }
