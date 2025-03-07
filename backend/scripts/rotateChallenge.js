const { rotateChallenge } = require('../controllers/challengeController');

// Function to schedule challenge rotation
function scheduleRotation() {
  // Rotate immediately if no challenge exists
  if (!global.activeChallenge || !global.activeChallenge.current) {
    rotateChallenge();
  }

  // Schedule next rotation
  const now = new Date();
  const nextSunday = new Date();
  nextSunday.setDate(now.getDate() + (7 - now.getDay()));
  nextSunday.setHours(0, 0, 0, 0);

  const timeUntilNextRotation = nextSunday.getTime() - now.getTime();
  setTimeout(() => {
    rotateChallenge();
    scheduleRotation(); // Schedule next rotation
  }, timeUntilNextRotation);
}

// Start the rotation schedule
scheduleRotation(); 