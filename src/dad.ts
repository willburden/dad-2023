import dadUrl from './assets/dad.png';

const dadWidth = 100;
const pathTime = 8_000;
const wobble = 0.3;
const wobbleSpeed = 8;
const particleInterval = 100;

interface Dad {
  curve: CubicBezierCurve;
  startTime: number;
};

interface CubicBezierCurve {
  p0: Point;
  p1: Point;
  p2: Point;
};

interface Point {
  x: number;
  y: number;
};

export async function prepareDadCanvas(
  spawnParticle: (x: number, y: number, direction: number) => void,
): Promise<() => void> {
  const canvas = document.querySelector<HTMLCanvasElement>('#dad-canvas');
  if (canvas === null) {
    throw new Error('Missing #dad-canvas canvas element!');
  }

  const observer = new ResizeObserver(() => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  });
  observer.observe(canvas);

  const onImageLoad = (): () => void => {
    console.log('Image loaded');

    const aspect = image.naturalHeight / image.naturalWidth;
    const dadHeight = dadWidth * aspect;
    let particleTimerId: number | undefined;

    const queueSpawn = (): void => {
      setTimeout(() => {
        spawn();
      }, Math.random() * 10_000 + 5_000);
    };

    const spawn = (): void => {
      console.log('Spawning father');

      particleTimerId = setInterval(() => {
        if (pos !== undefined) {
          spawnParticle(
            (pos.x + dadWidth / 2) / canvas.width,
            (pos.y + dadHeight / 2) / canvas.height,
            computeDirection(dad.curve, t),
          );
        }
      }, particleInterval);

      const offscreenPoint = (): Point => {
        let x, y;
        if (Math.random() > 0.5) {
          x = Math.random() > 0.5 ? -dadWidth : canvas.width;
          y = Math.random() * (canvas.height + dadHeight) - dadHeight;
        } else {
          x = Math.random() * (canvas.width + dadWidth) - dadWidth;
          y = Math.random() > 0.5 ? -dadHeight : canvas.height;
        }
        return { x, y };
      };

      const p0 = offscreenPoint();
      const p2 = offscreenPoint();
      const p1 = {
        x: Math.random() * (canvas.width - dadWidth),
        y: Math.random() * (canvas.height - dadHeight),
      };

      const dad: Dad = {
        curve: {
          p0, p1, p2,
        },
        startTime: Date.now(),
      };

      requestAnimationFrame(() => {
        update(dad);
      });
    };

    const render = ({ x, y }: Point, rot: number): void => {
      const ctx = canvas.getContext('2d')!;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(x + dadWidth / 2, y + dadHeight / 2);
      ctx.rotate(rot);
      ctx.drawImage(image, -dadWidth / 2, -dadHeight / 2, dadWidth, dadHeight);
      ctx.restore();
    };

    let t = 0;
    let pos: Point | undefined;

    const update = (dad: Dad): void => {
      t = (Date.now() - dad.startTime) / pathTime;

      if (t >= 1) {
        queueSpawn();
        clearInterval(particleTimerId);
        return;
      }

      pos = computePosition(dad.curve, t);
      const rot = computeRotation(t);
      render(pos, rot);
      requestAnimationFrame(() => {
        update(dad);
      });
    };

    return () => {
      spawn();
    };
  };

  const image = new Image();
  return await new Promise(resolve => {
    image.onload = () => {
      resolve(onImageLoad());
    };
    image.src = dadUrl;
  });
};

const computePosition = (curve: CubicBezierCurve, t: number): Point => {
  const u = 1 - t;
  const c0 = u ** 2;
  const c1 = 2 * u * t;
  const c2 = t ** 2;
  const x = c0 * curve.p0.x + c1 * curve.p1.x + c2 * curve.p2.x;
  const y = c0 * curve.p0.y + c1 * curve.p1.y + c2 * curve.p2.y;
  return { x, y };
};

const computeRotation = (t: number): number => {
  const min = -wobble / 2;
  return min + Math.sin(t * wobbleSpeed) * wobble;
};

const computeDirection = (curve: CubicBezierCurve, t: number): number => {
  const c0 = 2 * (1 - t);
  const c1 = 2 * t;
  const x = c0 * (curve.p1.x - curve.p0.x) + c1 * (curve.p2.x - curve.p1.x);
  const y = c0 * (curve.p1.y - curve.p0.y) + c1 * (curve.p2.y - curve.p1.y);
  return Math.atan2(y, x);
};
