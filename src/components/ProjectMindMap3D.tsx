import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { MindMapNode, MindMapLink } from '../types';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  Info,
  User,
  ShieldAlert,
  BookOpen,
  Cpu,
  Milestone,
  CheckCircle2,
  X,
  Target,
  FileText,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Eye,
  Activity
} from 'lucide-react';

interface ProjectMindMap3DProps {
  nodes: MindMapNode[];
  links: MindMapLink[];
  projectName?: string;
  onSelectPerson?: (personId: string) => void;
}

// Visual category configuration with custom 3D shader parameters
const CATEGORY_CONFIG: Record<
  string,
  {
    color: number;
    hex: string;
    label: string;
    shape: 'icosahedron' | 'sphere' | 'octahedron' | 'dodecahedron' | 'cylinder' | 'box';
    icon: React.ElementType;
    bgClass: string;
    borderClass: string;
    textClass: string;
  }
> = {
  project: {
    color: 0xe8ded2,
    hex: '#E8DED2',
    label: 'Project Hub',
    shape: 'icosahedron',
    icon: Sparkles,
    bgClass: 'bg-[#342F2A]',
    borderClass: 'border-[#B8A48D]',
    textClass: 'text-[#F3F0E9]',
  },
  person: {
    color: 0x10b981,
    hex: '#10B981',
    label: 'Contributor',
    shape: 'sphere',
    icon: User,
    bgClass: 'bg-emerald-950/90',
    borderClass: 'border-emerald-500/80',
    textClass: 'text-emerald-200',
  },
  problem: {
    color: 0xf43f5e,
    hex: '#F43F5E',
    label: 'Challenge',
    shape: 'octahedron',
    icon: AlertCircle,
    bgClass: 'bg-rose-950/90',
    borderClass: 'border-rose-500/80',
    textClass: 'text-rose-200',
  },
  decision: {
    color: 0xf59e0b,
    hex: '#F59E0B',
    label: 'Decision',
    shape: 'dodecahedron',
    icon: Target,
    bgClass: 'bg-amber-950/90',
    borderClass: 'border-amber-500/80',
    textClass: 'text-amber-200',
  },
  solution: {
    color: 0x3b82f6,
    hex: '#3B82F6',
    label: 'Solution',
    shape: 'box',
    icon: CheckCircle2,
    bgClass: 'bg-blue-950/90',
    borderClass: 'border-blue-500/80',
    textClass: 'text-blue-200',
  },
  outcome: {
    color: 0x06b6d4,
    hex: '#06B6D4',
    label: 'Outcome',
    shape: 'sphere',
    icon: Activity,
    bgClass: 'bg-cyan-950/90',
    borderClass: 'border-cyan-500/80',
    textClass: 'text-cyan-200',
  },
  lesson: {
    color: 0x8b5cf6,
    hex: '#8B5CF6',
    label: 'Lesson',
    shape: 'dodecahedron',
    icon: BookOpen,
    bgClass: 'bg-purple-950/90',
    borderClass: 'border-purple-500/80',
    textClass: 'text-purple-200',
  },
  technology: {
    color: 0x6366f1,
    hex: '#6366F1',
    label: 'Technology',
    shape: 'cylinder',
    icon: Cpu,
    bgClass: 'bg-indigo-950/90',
    borderClass: 'border-indigo-500/80',
    textClass: 'text-indigo-200',
  },
  milestone: {
    color: 0xfb923c,
    hex: '#FB923C',
    label: 'Milestone',
    shape: 'box',
    icon: Milestone,
    bgClass: 'bg-orange-950/90',
    borderClass: 'border-orange-500/80',
    textClass: 'text-orange-200',
  },
  capability: {
    color: 0x2563eb,
    hex: '#2563EB',
    label: 'Capability',
    shape: 'octahedron',
    icon: Cpu,
    bgClass: 'bg-blue-950/90',
    borderClass: 'border-blue-500/80',
    textClass: 'text-blue-200',
  },
  role: {
    color: 0xd97706,
    hex: '#D97706',
    label: 'Role',
    shape: 'cylinder',
    icon: User,
    bgClass: 'bg-amber-950/90',
    borderClass: 'border-amber-600/80',
    textClass: 'text-amber-200',
  },
  risk: {
    color: 0xe11d48,
    hex: '#E11D48',
    label: 'Risk',
    shape: 'octahedron',
    icon: ShieldAlert,
    bgClass: 'bg-red-950/90',
    borderClass: 'border-red-500/80',
    textClass: 'text-red-200',
  },
};

export const ProjectMindMap3D: React.FC<ProjectMindMap3DProps> = ({
  nodes,
  links,
  projectName = 'Organizational Memory Graph',
  onSelectPerson,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [selectedNode, setSelectedNode] = useState<MindMapNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<MindMapNode | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [isOrbiting, setIsOrbiting] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // References for Three.js lifecycle
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const nodeMeshesRef = useRef<Map<string, THREE.Group>>(new Map());
  const linkCurvesRef = useRef<Array<{ curve: THREE.CatmullRomCurve3; line: THREE.Line; particles: THREE.Points; src: string; tgt: string }>>([]);
  const animationFrameRef = useRef<number | null>(null);
  const targetCamPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 40, 520));
  const targetLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const currentLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));

  // Pointer & Drag state
  const isPointerDownRef = useRef(false);
  const pointerStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const sphericalRef = useRef<THREE.Spherical>(new THREE.Spherical(520, Math.PI / 2.3, 0));
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseVecRef = useRef<THREE.Vector2>(new THREE.Vector2(-999, -999));

  // Filter nodes based on active selection
  const filteredNodes = useMemo(() => {
    if (filterCategory === 'all') return nodes;
    return nodes.filter(
      (n) => n.category === 'project' || n.category === filterCategory
    );
  }, [nodes, filterCategory]);

  const filteredNodeIds = useMemo(() => new Set(filteredNodes.map((n) => n.id)), [filteredNodes]);

  // Handle scroll-based 3D depth modulation
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      if (rect.top < windowHeight && rect.bottom > 0) {
        const totalTravel = windowHeight + rect.height;
        const currentProgress = (windowHeight - rect.top) / totalTravel;
        const clamped = Math.max(0, Math.min(1, currentProgress));
        setScrollProgress(clamped);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Initialize Three.js WebGL Scene
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 800;
    const height = mount.clientHeight || 600;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(0x161311, 0.0008);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(50, width / height, 1, 3000);
    camera.position.set(0, 50, 520);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xfff8f0, 1.2);
    scene.add(ambientLight);

    const mainDirLight = new THREE.DirectionalLight(0xffeedd, 2.0);
    mainDirLight.position.set(120, 200, 150);
    scene.add(mainDirLight);

    const blueBackLight = new THREE.DirectionalLight(0x60a5fa, 1.4);
    blueBackLight.position.set(-180, -100, -150);
    scene.add(blueBackLight);

    const centerPointLight = new THREE.PointLight(0xfef3c7, 3.5, 450, 1.2);
    centerPointLight.position.set(0, 0, 0);
    scene.add(centerPointLight);

    // 5. Starfield / Ambient Floating Memory Particles
    const starCount = 350;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const radius = 250 + Math.random() * 500;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = radius * Math.cos(phi);

      const tone = Math.random() > 0.5 ? 0.9 : 0.6;
      starColors[i * 3] = 0.9 * tone;
      starColors[i * 3 + 1] = 0.8 * tone;
      starColors[i * 3 + 2] = 0.7 * tone;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 3.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // 6. Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Slow ambient starfield rotation
      starField.rotation.y = elapsedTime * 0.015;
      starField.rotation.x = Math.sin(elapsedTime * 0.01) * 0.05;

      // Smooth camera interpolation towards target
      if (cameraRef.current) {
        // Orbit dynamics when user drags
        if (!selectedNode) {
          // Add gentle float with scroll influence
          const scrollPitchOffset = (scrollProgress - 0.5) * 60;
          const targetY = sphericalRef.current.radius * Math.cos(sphericalRef.current.phi) + scrollPitchOffset;
          const targetX = sphericalRef.current.radius * Math.sin(sphericalRef.current.phi) * Math.sin(sphericalRef.current.theta);
          const targetZ = sphericalRef.current.radius * Math.sin(sphericalRef.current.phi) * Math.cos(sphericalRef.current.theta);

          targetCamPosRef.current.set(targetX, targetY, targetZ);
        }

        cameraRef.current.position.lerp(targetCamPosRef.current, 0.06);
        currentLookAtRef.current.lerp(targetLookAtRef.current, 0.06);
        cameraRef.current.lookAt(currentLookAtRef.current);
      }

      // Animate node meshes (subtle float & ring orbits)
      nodeMeshesRef.current.forEach((group, nodeId) => {
        const isProject = nodeId === 'node_root';
        const innerMesh = group.getObjectByName('innerMesh') as THREE.Mesh;
        const ringMesh = group.getObjectByName('ringMesh') as THREE.Mesh;
        const outerRing = group.getObjectByName('outerRing') as THREE.Mesh;

        if (innerMesh) {
          if (isProject) {
            innerMesh.rotation.y = elapsedTime * 0.35;
            innerMesh.rotation.x = Math.sin(elapsedTime * 0.25) * 0.2;
          } else {
            innerMesh.rotation.y = elapsedTime * 0.5;
          }
        }

        if (ringMesh) {
          ringMesh.rotation.z = -elapsedTime * 0.6;
          ringMesh.rotation.x = Math.sin(elapsedTime * 0.4) * 0.3;
        }

        if (outerRing) {
          outerRing.rotation.y = elapsedTime * 0.4;
        }

        // Float up/down gently
        const floatOffset = Math.sin(elapsedTime * 1.5 + Number(group.userData.seed || 0)) * 2.5;
        group.position.y = (group.userData.baseY || 0) + floatOffset;
      });

      // Animate flow particles along 3D connection curves
      linkCurvesRef.current.forEach((linkItem) => {
        const { curve, particles } = linkItem;
        if (!particles) return;

        const positions = particles.geometry.attributes.position.array as Float32Array;
        const count = positions.length / 3;

        for (let i = 0; i < count; i++) {
          const tBase = (elapsedTime * 0.25 + i / count) % 1;
          const pt = curve.getPoint(tBase);
          positions[i * 3] = pt.x;
          positions[i * 3 + 1] = pt.y;
          positions[i * 3 + 2] = pt.z;
        }
        particles.geometry.attributes.position.needsUpdate = true;
      });

      renderer.render(scene, camera);
    };

    animate();

    // 7. Resize Observer
    const handleResize = () => {
      if (!mount || !rendererRef.current || !cameraRef.current) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Build & Update 3D Nodes and Curved Connections
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Clean up previous node groups & lines
    nodeMeshesRef.current.forEach((grp) => scene.remove(grp));
    nodeMeshesRef.current.clear();

    linkCurvesRef.current.forEach((l) => {
      scene.remove(l.line);
      scene.remove(l.particles);
    });
    linkCurvesRef.current = [];

    // Helper: Map Node geometry
    const createNodeGeometry = (shape: string, size: number) => {
      switch (shape) {
        case 'icosahedron':
          return new THREE.IcosahedronGeometry(size, 2);
        case 'sphere':
          return new THREE.SphereGeometry(size, 24, 24);
        case 'octahedron':
          return new THREE.OctahedronGeometry(size, 0);
        case 'dodecahedron':
          return new THREE.DodecahedronGeometry(size, 0);
        case 'cylinder':
          return new THREE.CylinderGeometry(size * 0.8, size * 0.8, size * 1.5, 16);
        case 'box':
          return new THREE.BoxGeometry(size * 1.4, size * 1.4, size * 1.4);
        default:
          return new THREE.SphereGeometry(size, 16, 16);
      }
    };

    // Node Positions map for link calculations
    const nodePositionMap = new Map<string, THREE.Vector3>();

    // Create 3D Nodes
    filteredNodes.forEach((node, idx) => {
      const isProject = node.category === 'project';
      const config = CATEGORY_CONFIG[node.category] || CATEGORY_CONFIG.project;
      const nodeSize = isProject ? 22 : 12;

      const group = new THREE.Group();
      group.name = `node_${node.id}`;
      group.userData = {
        nodeId: node.id,
        nodeData: node,
        baseY: node.y || 0,
        seed: idx * 1.37,
      };

      const x = node.x ?? 0;
      const y = node.y ?? 0;
      const z = node.z ?? (isProject ? 0 : (idx % 2 === 0 ? 40 : -40));
      group.position.set(x, y, z);
      nodePositionMap.set(node.id, new THREE.Vector3(x, y, z));

      // 1. Core 3D Mesh
      const geom = createNodeGeometry(config.shape, nodeSize);
      const mat = new THREE.MeshPhysicalMaterial({
        color: config.color,
        emissive: config.color,
        emissiveIntensity: isProject ? 0.35 : 0.2,
        metalness: isProject ? 0.85 : 0.65,
        roughness: 0.2,
        clearcoat: 1.0,
        clearcoatRoughness: 0.15,
        transparent: true,
        opacity: 0.95,
      });

      const coreMesh = new THREE.Mesh(geom, mat);
      coreMesh.name = 'innerMesh';
      group.add(coreMesh);

      // 2. Orbital Glowing Rings for Visual Depth
      if (isProject) {
        // Dual majestic rings for Central Project
        const ringGeo1 = new THREE.TorusGeometry(32, 1.2, 16, 64);
        const ringMat1 = new THREE.MeshBasicMaterial({
          color: 0xb8a48d,
          transparent: true,
          opacity: 0.8,
          wireframe: true,
        });
        const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
        ring1.name = 'ringMesh';
        ring1.rotation.x = Math.PI / 3;
        group.add(ring1);

        const ringGeo2 = new THREE.TorusGeometry(38, 0.8, 16, 64);
        const ringMat2 = new THREE.MeshBasicMaterial({
          color: 0x5b5045,
          transparent: true,
          opacity: 0.6,
        });
        const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
        ring2.name = 'outerRing';
        ring2.rotation.y = Math.PI / 4;
        group.add(ring2);
      } else {
        // Subtle accent ring for child memories
        const accentRingGeo = new THREE.TorusGeometry(nodeSize * 1.4, 0.6, 12, 32);
        const accentRingMat = new THREE.MeshBasicMaterial({
          color: config.color,
          transparent: true,
          opacity: 0.65,
        });
        const accentRing = new THREE.Mesh(accentRingGeo, accentRingMat);
        accentRing.name = 'ringMesh';
        accentRing.rotation.x = Math.PI / 2.5;
        group.add(accentRing);
      }

      // 3. Glowing Point Light at Node Center
      const pLight = new THREE.PointLight(config.color, isProject ? 1.8 : 0.9, 120, 1.5);
      group.add(pLight);

      scene.add(group);
      nodeMeshesRef.current.set(node.id, group);
    });

    // Create 3D Curved Connections & Particle Energy Flows
    links.forEach((link) => {
      if (!filteredNodeIds.has(link.source) || !filteredNodeIds.has(link.target)) return;

      const srcPos = nodePositionMap.get(link.source);
      const tgtPos = nodePositionMap.get(link.target);
      if (!srcPos || !tgtPos) return;

      // Spatial 3D Catmull-Rom Curve with natural arc
      const midPoint = new THREE.Vector3()
        .addVectors(srcPos, tgtPos)
        .multiplyScalar(0.5);

      // Add spatial elevation arch based on distance
      const distance = srcPos.distanceTo(tgtPos);
      midPoint.y += Math.min(60, distance * 0.18);
      midPoint.z += (Math.sin(distance * 0.05) * 35);

      const curve = new THREE.CatmullRomCurve3([
        srcPos.clone(),
        midPoint,
        tgtPos.clone(),
      ]);

      // Curve Line Geometry
      const points = curve.getPoints(36);
      const lineGeom = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineBasicMaterial({
        color: 0xb8a48d,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
      });
      const line = new THREE.Line(lineGeom, lineMat);
      scene.add(line);

      // Energy Pulse Particles along connection
      const particleCount = 4;
      const pGeom = new THREE.BufferGeometry();
      const pPosArray = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount; i++) {
        const pt = curve.getPoint(i / particleCount);
        pPosArray[i * 3] = pt.x;
        pPosArray[i * 3 + 1] = pt.y;
        pPosArray[i * 3 + 2] = pt.z;
      }
      pGeom.setAttribute('position', new THREE.BufferAttribute(pPosArray, 3));

      const pMat = new THREE.PointsMaterial({
        color: 0xfef3c7,
        size: 4.5,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
      });
      const particles = new THREE.Points(pGeom, pMat);
      scene.add(particles);

      linkCurvesRef.current.push({
        curve,
        line,
        particles,
        src: link.source,
        tgt: link.target,
      });
    });
  }, [filteredNodes, links, filteredNodeIds]);

  // Pointer Interaction & Raycasting (Hover / Click)
  const handlePointerMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const mount = mountRef.current;
    if (!mount || !cameraRef.current) return;

    const rect = mount.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    mouseVecRef.current.set(x, y);

    // Orbit camera if pointer dragging
    if (isPointerDownRef.current) {
      const dx = e.clientX - pointerStartRef.current.x;
      const dy = e.clientY - pointerStartRef.current.y;
      pointerStartRef.current = { x: e.clientX, y: e.clientY };

      sphericalRef.current.theta -= dx * 0.005;
      sphericalRef.current.phi = Math.max(
        0.2,
        Math.min(Math.PI - 0.2, sphericalRef.current.phi - dy * 0.005)
      );
      setIsOrbiting(true);
      return;
    }

    // Raycast for hover
    raycasterRef.current.setFromCamera(mouseVecRef.current, cameraRef.current);
    const intersectables: THREE.Object3D[] = [];
    nodeMeshesRef.current.forEach((grp) => {
      const inner = grp.getObjectByName('innerMesh');
      if (inner) intersectables.push(inner);
    });

    const intersects = raycasterRef.current.intersectObjects(intersectables, false);

    if (intersects.length > 0) {
      const hit = intersects[0].object.parent;
      if (hit && hit.userData.nodeData) {
        const nData = hit.userData.nodeData as MindMapNode;
        setHoveredNode(nData);
        setTooltipPos({ x: e.clientX - rect.left + 15, y: e.clientY - rect.top + 15 });

        // Highlight hit mesh scale
        hit.scale.set(1.25, 1.25, 1.25);
      }
    } else {
      if (hoveredNode) {
        nodeMeshesRef.current.forEach((grp) => grp.scale.set(1, 1, 1));
      }
      setHoveredNode(null);
      setTooltipPos(null);
    }
  };

  const handlePointerDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('.mindmap-overlay-control')) return;
    isPointerDownRef.current = true;
    pointerStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.MouseEvent<HTMLDivElement>) => {
    isPointerDownRef.current = false;
    setIsOrbiting(false);

    // Check if it was a quick click vs long drag
    const mount = mountRef.current;
    if (!mount || !cameraRef.current) return;

    raycasterRef.current.setFromCamera(mouseVecRef.current, cameraRef.current);
    const intersectables: THREE.Object3D[] = [];
    nodeMeshesRef.current.forEach((grp) => {
      const inner = grp.getObjectByName('innerMesh');
      if (inner) intersectables.push(inner);
    });

    const intersects = raycasterRef.current.intersectObjects(intersectables, false);
    if (intersects.length > 0) {
      const hit = intersects[0].object.parent;
      if (hit && hit.userData.nodeData) {
        const clicked = hit.userData.nodeData as MindMapNode;
        focusOnNode(clicked);
      }
    }
  };

  const focusOnNode = (node: MindMapNode) => {
    setSelectedNode(node);
    const grp = nodeMeshesRef.current.get(node.id);
    if (grp) {
      const targetPos = grp.position.clone();
      targetLookAtRef.current.copy(targetPos);

      // Position camera offset relative to the node
      const offset = new THREE.Vector3(0, 25, 140);
      targetCamPosRef.current.copy(targetPos).add(offset);
    }
  };

  const resetCamera = () => {
    setSelectedNode(null);
    targetLookAtRef.current.set(0, 0, 0);
    sphericalRef.current.set(520, Math.PI / 2.3, 0);
    targetCamPosRef.current.set(0, 40, 520);
  };

  const zoomIn = () => {
    sphericalRef.current.radius = Math.max(180, sphericalRef.current.radius - 80);
  };

  const zoomOut = () => {
    sphericalRef.current.radius = Math.min(900, sphericalRef.current.radius + 80);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[660px] rounded-3xl bg-[#141210] border border-[#5B5045]/60 overflow-hidden shadow-2xl select-none"
    >
      {/* Three.js Canvas Container */}
      <div
        ref={mountRef}
        onMouseMove={handlePointerMove}
        onMouseDown={handlePointerDown}
        onMouseUp={handlePointerUp}
        className={`w-full h-full ${
          isOrbiting ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      />

      {/* Top Header & Interactive Category Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Title Tag */}
        <div className="flex items-center gap-2 pointer-events-auto bg-[#342F2A]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#B8A48D]/40 text-xs text-[#F3F0E9] shadow-md mindmap-overlay-control">
          <Sparkles className="h-3.5 w-3.5 text-amber-300" />
          <span className="font-semibold tracking-wide">3D Organizational Mind Map</span>
          <span className="text-[10px] text-[#B8A48D] font-mono">({filteredNodes.length} Spatial Nodes)</span>
        </div>

        {/* Filter Categories */}
        <div className="flex items-center gap-1.5 pointer-events-auto bg-[#23201C]/90 backdrop-blur-md p-1 rounded-full border border-[#5B5045]/50 text-[11px] text-[#F3F0E9] overflow-x-auto max-w-full mindmap-overlay-control">
          {[
            { id: 'all', label: 'All Spatial Relations' },
            { id: 'person', label: 'Contributors' },
            { id: 'problem', label: 'Challenges' },
            { id: 'decision', label: 'Decisions' },
            { id: 'solution', label: 'Solutions' },
            { id: 'outcome', label: 'Outcomes' },
            { id: 'lesson', label: 'Lessons' },
            { id: 'technology', label: 'Tech Stack' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setFilterCategory(cat.id);
                setSelectedNode(null);
              }}
              className={`px-3 py-1 rounded-full transition-all font-medium cursor-pointer whitespace-nowrap ${
                filterCategory === cat.id
                  ? 'bg-[#E8DED2] text-[#342F2A] font-bold shadow-xs'
                  : 'text-[#B8A48D] hover:text-white hover:bg-[#342F2A]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Zoom & Orbit Controls */}
        <div className="flex items-center gap-1 pointer-events-auto bg-[#23201C]/90 backdrop-blur-md p-1 rounded-full border border-[#5B5045]/50 text-[#F3F0E9] shadow-md mindmap-overlay-control">
          <button
            onClick={zoomIn}
            className="p-1.5 rounded-full hover:bg-[#342F2A] text-[#E8DED2] transition-colors cursor-pointer"
            title="Zoom In 3D Space"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={zoomOut}
            className="p-1.5 rounded-full hover:bg-[#342F2A] text-[#E8DED2] transition-colors cursor-pointer"
            title="Zoom Out 3D Space"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={resetCamera}
            className="p-1.5 rounded-full hover:bg-[#342F2A] text-[#E8DED2] transition-colors cursor-pointer"
            title="Reset Perspective"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Floating Spatial Hover Tooltip */}
      {hoveredNode && tooltipPos && !selectedNode && (
        <div
          className="absolute z-30 pointer-events-none p-3 rounded-2xl bg-[#1E1B18]/95 backdrop-blur-md border border-[#B8A48D]/40 text-[#F3F0E9] shadow-xl max-w-xs space-y-1 transform -translate-x-1/2 -translate-y-full mb-2 animate-fade-in"
          style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}
        >
          <div className="flex items-center justify-between gap-2 border-b border-[#5B5045]/40 pb-1.5">
            <span
              className="text-[10px] font-mono uppercase tracking-wider font-bold"
              style={{ color: CATEGORY_CONFIG[hoveredNode.category]?.hex || '#E8DED2' }}
            >
              {CATEGORY_CONFIG[hoveredNode.category]?.label || hoveredNode.category}
            </span>
            {hoveredNode.evidence_count !== undefined && (
              <span className="text-[10px] text-[#B8A48D] font-mono">
                {hoveredNode.evidence_count} evidence records
              </span>
            )}
          </div>
          <div className="text-xs font-bold text-[#F3F0E9]">{hoveredNode.label}</div>
          {hoveredNode.subtitle && (
            <div className="text-[11px] text-[#B8A48D]">{hoveredNode.subtitle}</div>
          )}
          <div className="text-[10px] text-[#A89A8C] pt-1 font-mono">
            Click node to focus in 3D &amp; inspect evidence
          </div>
        </div>
      )}

      {/* Bottom Spatial Guidance Bar */}
      <div className="absolute bottom-3 left-4 right-4 z-20 flex items-center justify-between pointer-events-none text-[11px] text-[#A89A8C] font-mono">
        <div className="bg-[#1E1B18]/80 backdrop-blur-xs px-3 py-1 rounded-full border border-[#5B5045]/40 pointer-events-auto">
          Drag to Orbit 3D · Scroll to Modulate Depth · Click Node to Fly In
        </div>
        {selectedNode && (
          <button
            onClick={resetCamera}
            className="bg-[#342F2A] hover:bg-[#5B5045] text-[#F3F0E9] px-3 py-1 rounded-full border border-[#B8A48D]/40 pointer-events-auto transition-all cursor-pointer font-sans text-xs flex items-center gap-1.5"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Return to Project Hub</span>
          </button>
        )}
      </div>

      {/* Node Inspector Modal / Drawer when a node is clicked and focused */}
      {selectedNode && (
        <div className="absolute bottom-12 right-4 top-16 w-80 sm:w-96 z-30 bg-[#1E1B18]/95 backdrop-blur-xl border border-[#B8A48D]/60 rounded-3xl p-5 text-[#F3F0E9] shadow-2xl flex flex-col justify-between overflow-y-auto animate-fade-in mindmap-overlay-control">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-[#5B5045]/50 pb-3">
              <div className="space-y-1">
                <div
                  className="text-[10px] font-mono font-bold uppercase tracking-wider inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#342F2A] border"
                  style={{
                    color: CATEGORY_CONFIG[selectedNode.category]?.hex || '#E8DED2',
                    borderColor: CATEGORY_CONFIG[selectedNode.category]?.hex || '#5B5045',
                  }}
                >
                  <Sparkles className="h-3 w-3" />
                  <span>{CATEGORY_CONFIG[selectedNode.category]?.label || selectedNode.category}</span>
                </div>
                <h4 className="font-heading text-lg font-bold text-[#F3F0E9]">
                  {selectedNode.label}
                </h4>
                {selectedNode.subtitle && (
                  <p className="text-xs text-[#B8A48D]">{selectedNode.subtitle}</p>
                )}
              </div>

              <button
                onClick={() => setSelectedNode(null)}
                className="p-1.5 rounded-full hover:bg-[#342F2A] text-[#B8A48D] hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Details Content */}
            <div className="space-y-3 text-xs leading-relaxed text-[#E8DED2]/90">
              <div className="p-3.5 rounded-2xl bg-[#2A2521] border border-[#5B5045]/40 space-y-1.5">
                <span className="font-mono text-[10px] font-bold text-[#B8A48D] uppercase">
                  Spatial Context &amp; Purpose
                </span>
                <p className="whitespace-pre-wrap">{selectedNode.details || 'Documented entity in organizational memory graph.'}</p>
              </div>

              {/* Contributor / Avatar Linkage */}
              {selectedNode.avatar && (
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#2A2521] border border-[#5B5045]/40">
                  <img
                    src={selectedNode.avatar}
                    alt={selectedNode.label}
                    className="w-10 h-10 rounded-full border border-emerald-500 object-cover"
                  />
                  <div>
                    <div className="font-bold text-sm text-[#F3F0E9]">{selectedNode.label}</div>
                    <div className="text-[11px] text-emerald-400 font-mono">Matched Contributor</div>
                  </div>
                </div>
              )}

              {/* Evidence Badge */}
              <div className="p-3 rounded-2xl bg-[#2A2521] border border-[#5B5045]/40 flex items-center justify-between">
                <span className="font-mono text-[10px] text-[#B8A48D] uppercase">
                  Verified Evidence
                </span>
                <span className="text-xs font-mono font-bold text-amber-300">
                  {selectedNode.evidence_count !== undefined ? `${selectedNode.evidence_count} Documented Records` : 'Hindsight Verified'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-[#5B5045]/50 flex items-center gap-2">
            {selectedNode.category === 'person' && onSelectPerson && (
              <button
                onClick={() => onSelectPerson(selectedNode.id.replace('node_person_', 'person_'))}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-[#F3F0E9] text-xs font-semibold shadow-md transition-all cursor-pointer"
              >
                <User className="h-3.5 w-3.5" />
                <span>View Full Contributor Profile</span>
              </button>
            )}
            <button
              onClick={resetCamera}
              className="px-3 py-2 rounded-xl bg-[#342F2A] hover:bg-[#5B5045] text-[#E8DED2] text-xs font-semibold transition-all cursor-pointer whitespace-nowrap"
            >
              Reset 3D
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
