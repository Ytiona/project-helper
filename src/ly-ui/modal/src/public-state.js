const publicState = {
  currentModalStates: null
}

function handleEsc(event) {
  if(event.keyCode === 27) {
    const { currentModalStates } = publicState;
    if(currentModalStates) {
      const { show, instance, closable } = currentModalStates;
      if(!instance && closable) {
        show.value = false;
      }
    }
  }
}

document.addEventListener('keydown', handleEsc);

export default publicState;