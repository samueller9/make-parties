'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.addColumn('Rsvps', 'EventId', Sequelize.INTEGER)
    
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Rsvps', 'EventId');
  }
};
