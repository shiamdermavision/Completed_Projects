document.addEventListener('DOMContentLoaded', () => {
  const scoreDisplays = Array.from(document.querySelectorAll('.schoor1 p'));
  let homeScore = 0;
  let guestScore = 0;

  const buttonGroups = Array.from(document.querySelectorAll('.btnn3'));
  buttonGroups.forEach((group, idx) => {
    const buttons = group.querySelectorAll('.btn');
    buttons.forEach(button => {
      button.addEventListener('click', () => {
        const increment = parseInt(button.textContent.replace('+', ''), 10) || 0;
        if (idx === 0) {
          homeScore += increment;
          scoreDisplays[0].textContent = homeScore;
        } else {
          guestScore += increment;
          scoreDisplays[1].textContent = guestScore;
        }
      });
    });
  });
});