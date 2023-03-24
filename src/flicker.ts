export function applyFlicker(element: HTMLElement): void {
  type DelayKind = 'short' | 'long';

  let nextDelay: DelayKind | undefined;

  const delay = (): number => {
    let thisDelay: DelayKind | undefined;

    if (nextDelay === 'short') {
      thisDelay = 'short';
      nextDelay = 'long';
    } else if (nextDelay === 'long') {
      thisDelay = 'long';
      nextDelay = undefined;
    } else {
      thisDelay = Math.random() < 0.25 ? 'short' : 'long';
    }

    return thisDelay === 'short'
      ? Math.random() * 400 + 50
      : Math.random() * 2400 + 400
    ;
  };

  const addFlicker = (): void => {
    element.classList.add('flicker');
  };

  const removeFlicker = (): void => {
    element.classList.remove('flicker');
  };

  element.addEventListener('animationend', () => {
    removeFlicker();
    setTimeout(() => {
      addFlicker();
    }, delay());
  });

  nextDelay = 'short';
  addFlicker();
};
