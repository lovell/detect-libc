'use strict';

// Safe require
const safeRequire = (moduleName, ...fallbacks) => {
  try {
    // Try to require the primary module
    return require(moduleName);
  } catch (error) {
    // If module not found, try fallbacks
    for (const fallback of fallbacks) {
      try {
        return require(fallback);
      } catch (fallbackError) {
        // Skip to the next fallback if it fails
      }
    }

    return null;
  }
};

module.exports = { safeRequire };
