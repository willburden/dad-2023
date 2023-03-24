import './style.css';

import { prepareParticles } from './particles';
import { applyFlicker } from './flicker';
import { prepareDadCanvas as prepareDad } from './dad';

(async () => {
  const heading = document.querySelector<HTMLHeadingElement>('#message');
  const trigger = document.querySelector<HTMLButtonElement>('#start-trigger');

  if (heading === null || trigger === null) {
    console.error('Missing required HTML element!');
    return;
  }

  const { startParticles, spawnParticle } = await prepareParticles();
  const startDad = await prepareDad(spawnParticle);

  trigger.addEventListener('click', () => {
    trigger.remove();
    startParticles()
      .then(() => {
        setTimeout(() => {
          applyFlicker(heading);
          heading.classList.remove('offscreen');
          setTimeout(startDad, 1000);
        }, 2000);
      })
      .catch(error => {
        console.error('Failed to start spawning particles', error);
      });
  });
  trigger.classList.remove('offscreen');
})()
  .catch(error => {
    console.error(error);
  });
