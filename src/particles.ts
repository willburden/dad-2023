import { loadFull } from 'tsparticles';
import { type IOptions, type RecursivePartial, type SingleOrMultiple, tsParticles, type Container } from 'tsparticles-engine';

type PartialOptions = SingleOrMultiple<RecursivePartial<IOptions>>;

const options: PartialOptions = {
  fpsLimit: 40,
  particles: {
    color: {
      value: ['#FFED4B', '#E3BF29', '#FAC339', '#E39D29', '#FB962D'],
    },
    opacity: {
      value: { min: 0, max: 0.6 },
      animation: {
        enable: true,
        destroy: 'min',
        speed: 1,
        startValue: 'max',
      },
    },
    size: {
      value: { min: 1, max: 3 },
    },
    move: {
      enable: true,
      speed: 0.5,
      direction: 'outside',
    },
  },
};

async function loadParticles(tagId: string): Promise<Container | undefined> {
  await loadFull(tsParticles);

  return await tsParticles.load(tagId, options);
};

export async function prepareParticles(): Promise<{
  startParticles: () => Promise<void>;
  spawnParticle: (x: number, y: number, direction: number) => void;
}> {
  const container = await loadParticles('particles');

  if (container === undefined) {
    throw new Error('Particle container is undefined');
  };

  container.play();

  const startParticles = async (): Promise<void> => {
    await new Promise<void>(resolve => {
      let interval = 300;
      const spawn = (): void => {
        container.particles.addParticle();

        if (interval > 20) {
          setTimeout(() => { spawn(); }, interval);
          interval -= 25;
        } else {
          setInterval(() => { container.particles.addParticle(); }, 20);
          resolve();
        }
      };
      spawn();
    });
  };

  const spawnParticle = (x: number, y: number, direction: number): void => {
    container.particles.addParticle({
      x: x * container.canvas.size.width,
      y: y * container.canvas.size.height,
    }, {
      move: {
        direction: radsToDegrees(direction + Math.PI),
        speed: 0.75,
      },
      size: {
        value: { min: 5, max: 8 },
      },
      color: {
        value: ['#13F270', '#14FC33', '#43E61D', '#90FC14', '#D8F213'],
      },
    });
  };

  return { startParticles, spawnParticle };
}

const radsToDegrees = (radians: number): number => {
  return radians * 180 / Math.PI;
};
