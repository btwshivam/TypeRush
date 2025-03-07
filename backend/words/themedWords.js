// Themed word collections for TypeRush challenges
const themedWords = {
  // Sci-Fi Theme
  scifi: {
    easy: ['alien', 'robot', 'space', 'laser', 'ship', 'star', 'moon', 'mars'],
    medium: ['starship', 'android', 'quantum', 'galaxy', 'nebula', 'cosmic'],
    hard: ['terraform', 'wormhole', 'antimatter', 'cybernetic'],
    special: ['interstellar', 'hyperspace', 'teleportation']
  },
  
  // Fantasy Theme
  fantasy: {
    easy: ['magic', 'sword', 'spell', 'dragon', 'witch', 'wizard'],
    medium: ['potion', 'enchant', 'mystic', 'ancient', 'scroll'],
    hard: ['sorcerer', 'warlock', 'conjure', 'mythical'],
    special: ['enchantment', 'spellbinding', 'supernatural']
  },
  
  // Programming Theme
  programming: {
    easy: ['function', 'var', 'let', 'const', 'if', 'else', 'for', 'while', 'return', 'class'],
    medium: ['async', 'await', 'promise', 'export', 'import', 'default', 'extends', 'interface'],
    hard: ['middleware', 'prototype', 'constructor', 'inheritance', 'polymorphism'],
    special: ['asynchronous', 'authentication', 'authorization', 'dependency']
  },
  
  // Medical Theme
  medical: {
    easy: ['heart', 'brain', 'lung', 'bone', 'cell', 'blood'],
    medium: ['cardiac', 'neural', 'tissue', 'muscle', 'system'],
    hard: ['diagnosis', 'pathology', 'anatomy', 'syndrome'],
    special: ['cardiovascular', 'neurological', 'respiratory']
  },
  
  // Legal Theme
  legal: {
    easy: ['law', 'court', 'judge', 'case', 'rule', 'jury'],
    medium: ['verdict', 'justice', 'appeal', 'motion', 'client'],
    hard: ['plaintiff', 'defendant', 'evidence', 'testimony'],
    special: ['jurisdiction', 'prosecution', 'litigation']
  },
  
  // Holiday Theme (Christmas)
  christmas: {
    easy: ['gift', 'snow', 'tree', 'star', 'bell', 'song'],
    medium: ['present', 'holiday', 'festive', 'winter', 'sleigh'],
    hard: ['reindeer', 'mistletoe', 'stocking', 'garland'],
    special: ['celebration', 'decorations', 'gingerbread']
  }
};

module.exports = themedWords; 