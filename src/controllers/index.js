const pointController = require('./point.controller');
const organizationController = require('./organization.controller');
const administrativeAreaController = require('./administrative_area.controller');
const volunteerController = require('./volunteer.controller');
const recipientController = require('./recipient.controller');

module.exports = {
    volunteerController,
    pointController,
    organizationController,
    administrativeAreaController,
    recipientController
}