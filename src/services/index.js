const volunteerService = require('./volunteer.service');
const pointService = require('./point.service');
const organizationService = require('./organization.service');
const mailService = require('./mail.service');
const tokenService = require('./token.service');
const administrativeAreaService = require('./administrative_area.service');
const businessHoursService = require('./business_hours.service');
const labelToPointService = require('./label_to_point.service');
const smsService = require('./sms.service');
const recipientService = require('./recipient.service');

module.exports = {
    volunteerService,
    pointService,
    organizationService,
    mailService,
    tokenService,
    administrativeAreaService,
    businessHoursService,
    labelToPointService,
    smsService,
    recipientService
}