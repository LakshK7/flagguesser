import { Platform, StyleSheet, Text, View } from "react-native";
import { WebView } from "react-native-webview";

export default function Globe() {
  if (Platform.OS === "web") {
    return (
      <View style={styles.container}>
        <Text style={styles.emoji}>🌍</Text>
      </View>
    );
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * { margin: 0; padding: 0; }
        body { 
          background: transparent; 
          overflow: hidden;
          width: 280px;
          height: 280px;
        }
        canvas { display: block; }
      </style>
    </head>
    <body>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
      <script>
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        camera.position.z = 2;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(280, 280);
        renderer.setClearColor(0x000000, 0);
        document.body.appendChild(renderer.domElement);

        // Earth
        const geometry = new THREE.SphereGeometry(1, 64, 64);
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load(
          'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg'
        );
        const material = new THREE.MeshPhongMaterial({ map: texture });
        const sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);

        // Atmosphere
        const atmosGeometry = new THREE.SphereGeometry(1.05, 64, 64);
        const atmosMaterial = new THREE.MeshPhongMaterial({
          color: 0x4488ff,
          transparent: true,
          opacity: 0.08,
        });
        scene.add(new THREE.Mesh(atmosGeometry, atmosMaterial));

        // Lights
        scene.add(new THREE.AmbientLight(0xffffff, 0.6));
        const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
        dirLight.position.set(5, 3, 5);
        scene.add(dirLight);

        // Drag rotation
        let isDragging = false;
        let lastX = 0, lastY = 0;
        let rotX = 0, rotY = 0;

        renderer.domElement.addEventListener('mousedown', e => {
          isDragging = true;
          lastX = e.clientX;
          lastY = e.clientY;
        });
        renderer.domElement.addEventListener('mousemove', e => {
          if (!isDragging) return;
          rotY += (e.clientX - lastX) * 0.005;
          rotX += (e.clientY - lastY) * 0.005;
          lastX = e.clientX;
          lastY = e.clientY;
        });
        renderer.domElement.addEventListener('mouseup', () => isDragging = false);

        renderer.domElement.addEventListener('touchstart', e => {
          isDragging = true;
          lastX = e.touches[0].clientX;
          lastY = e.touches[0].clientY;
        });
        renderer.domElement.addEventListener('touchmove', e => {
          if (!isDragging) return;
          rotY += (e.touches[0].clientX - lastX) * 0.005;
          rotX += (e.touches[0].clientY - lastY) * 0.005;
          lastX = e.touches[0].clientX;
          lastY = e.touches[0].clientY;
        });
        renderer.domElement.addEventListener('touchend', () => isDragging = false);

        function animate() {
          requestAnimationFrame(animate);
          if (!isDragging) rotY += 0.003;
          sphere.rotation.y = rotY;
          sphere.rotation.x = rotX;
          renderer.render(scene, camera);
        }
        animate();
      </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        source={{ html }}
        style={styles.webview}
        scrollEnabled={false}
        backgroundColor="transparent"
        originWhitelist={["*"]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 280,
    height: 280,
    alignItems: "center",
    justifyContent: "center",
  },
  webview: {
    flex: 1,
    backgroundColor: "transparent",
  },
  emoji: {
    fontSize: 120,
  },
});
