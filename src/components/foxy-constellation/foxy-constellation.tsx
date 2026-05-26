import { Component, Element, Host, h } from '@stencil/core';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

@Component({
  tag: 'foxy-constellation',
  styleUrl: 'foxy-constellation.css',
  shadow: false,
})
export class FoxyConstellation {
  @Element() el: HTMLElement;
  
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D | null;
  private animationId: number = 0;
  private nodes: Node[] = [];
  private maxNodes = 40;
  private connectionDistance = 120;
  private mouse = { x: -1000, y: -1000, radius: 150 };

  componentDidLoad() {
    this.canvas = this.el.querySelector('canvas') as HTMLCanvasElement;
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.resizeCanvas();
    this.initNodes();

    // Event listeners
    window.addEventListener('resize', this.handleResize);
    const parent = this.el.parentElement;
    if (parent) {
      parent.addEventListener('mousemove', this.handleMouseMove);
      parent.addEventListener('mouseleave', this.handleMouseLeave);
    }

    this.animate();
  }

  disconnectedCallback() {
    cancelAnimationFrame(this.animationId);
    window.removeEventListener('resize', this.handleResize);
    const parent = this.el.parentElement;
    if (parent) {
      parent.removeEventListener('mousemove', this.handleMouseMove);
      parent.removeEventListener('mouseleave', this.handleMouseLeave);
    }
  }

  private resizeCanvas = () => {
    if (!this.canvas) return;
    const rect = this.canvas.parentElement?.getBoundingClientRect() || { width: 400, height: 400 };
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
    this.initNodes(); // Re-init nodes to distribute over new bounds
  };

  private handleResize = () => {
    this.resizeCanvas();
  };

  private handleMouseMove = (e: MouseEvent) => {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = e.clientX - rect.left;
    this.mouse.y = e.clientY - rect.top;
  };

  private handleMouseLeave = () => {
    this.mouse.x = -1000;
    this.mouse.y = -1000;
  };

  private initNodes() {
    if (!this.canvas) return;
    const w = this.canvas.width;
    const h = this.canvas.height;
    this.nodes = [];

    for (let i = 0; i < this.maxNodes; i++) {
      this.nodes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4, // ultra-slow cinematic drift
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
      });
    }
  }

  private animate = () => {
    if (!this.canvas || !this.ctx) return;
    const w = this.canvas.width;
    const h = this.canvas.height;

    this.ctx.clearRect(0, 0, w, h);

    // Update & Draw nodes
    this.nodes.forEach((node) => {
      // Drift movement
      node.x += node.vx;
      node.y += node.vy;

      // Bounce bounds
      if (node.x < 0 || node.x > w) node.vx *= -1;
      if (node.y < 0 || node.y > h) node.vy *= -1;

      // Mouse attraction / interaction (living lines effect)
      if (this.mouse.x !== -1000) {
        const dx = this.mouse.x - node.x;
        const dy = this.mouse.y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.mouse.radius) {
          // Soft pull toward cursor
          const force = (this.mouse.radius - dist) / this.mouse.radius;
          node.x += (dx / dist) * force * 0.3;
          node.y += (dy / dist) * force * 0.3;
        }
      }

      // Draw particle dot
      this.ctx!.beginPath();
      this.ctx!.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      this.ctx!.fillStyle = 'rgba(255, 46, 68, 0.4)'; // Crimson-glow color
      this.ctx!.fill();
    });

    // Draw lines between nodes close to each other
    for (let i = 0; i < this.nodes.length; i++) {
      const n1 = this.nodes[i];
      for (let j = i + 1; j < this.nodes.length; j++) {
        const n2 = this.nodes[j];

        const dx = n1.x - n2.x;
        const dy = n1.y - n2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.connectionDistance) {
          const alpha = (1 - dist / this.connectionDistance) * 0.25;
          this.ctx!.beginPath();
          this.ctx!.moveTo(n1.x, n1.y);
          this.ctx!.lineTo(n2.x, n2.y);
          this.ctx!.strokeStyle = `rgba(200, 16, 46, ${alpha})`; // core crimson color with fading opacity
          this.ctx!.lineWidth = 0.8;
          this.ctx!.stroke();
        }
      }

      // Connect lines to mouse
      if (this.mouse.x !== -1000) {
        const dx = n1.x - this.mouse.x;
        const dy = n1.y - this.mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.mouse.radius) {
          const alpha = (1 - dist / this.mouse.radius) * 0.4;
          this.ctx!.beginPath();
          this.ctx!.moveTo(n1.x, n1.y);
          this.ctx!.lineTo(this.mouse.x, this.mouse.y);
          this.ctx!.strokeStyle = `rgba(255, 46, 68, ${alpha})`; // active glowing crimson to mouse
          this.ctx!.lineWidth = 1.0;
          this.ctx!.stroke();
        }
      }
    }

    this.animationId = requestAnimationFrame(this.animate);
  };

  render() {
    return (
      <Host class="foxy-constellation">
        <canvas class="foxy-constellation-canvas"></canvas>
      </Host>
    );
  }
}
