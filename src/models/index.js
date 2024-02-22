const Organization = require("./organization.model");
const Point  = require("./point.model");
const Label  = require("./label.model");
const LabelToPoint = require("./label_to_point.model");
const AdministrativeArea = require("./administrative_area.model");
const Volunteer = require("./volunteer.model");
const Token = require("./token.model");
const BusinessHours = require("./business_hours.model");
const Recipient = require('./recipient.model');
const OneTimeToken = require('./oneTimeToken.model');
const RecipientToken = require('./recipient_token.model');

//Associations

//One-to-Many
AdministrativeArea.hasMany(Point, {
  foreignKey: "administrative_area_id",
  onDelete: "CASCADE",
});
Point.belongsTo(AdministrativeArea, {
  foreignKey: "administrative_area_id"
});

Organization.hasMany(Point, {
  foreignKey: "organization_id",
  onDelete: "CASCADE",
});
Point.belongsTo(Organization, {
  foreignKey: "organization_id",
});

Organization.hasMany(Volunteer, {
  foreignKey: "organization_id",
  onDelete: "CASCADE",
});
Volunteer.belongsTo(Organization, {
  foreignKey: "organization_id",
});

Point.hasMany(BusinessHours, {
  foreignKey: "point_id",
  onDelete: "CASCADE"
});
BusinessHours.belongsTo(Point, {
  foreignKey: "point_id"
});

//Many-to-Many
Point.belongsToMany(Label, { 
  as:"labels",
  through: LabelToPoint,
  foreignKey: 'point_id',
  otherKey: 'label_id'
});
Label.belongsToMany(Point, { 
  through: LabelToPoint,
  foreignKey: 'label_id',
  otherKey: 'point_id'
});

Recipient.hasMany(OneTimeToken, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
  foreignKey: 'recipient_id'
});
OneTimeToken.belongsTo(Recipient, {
  foreignKey: 'recipient_id'
});

//One-to-One
Volunteer.hasOne(Token, {
  onDelete: 'RESTRICT',
  onUpdate: 'RESTRICT',
  foreignKey: 'volunteer_id'
});
Token.belongsTo(Volunteer, {
  foreignKey: "volunteer_id",
});

Volunteer.hasOne(Organization, {
  onDelete: 'RESTRICT',
  onUpdate: 'RESTRICT',
  foreignKey: 'creator_id'
});
Organization.belongsTo(Volunteer, {
  foreignKey: "creator_id",
});

Recipient.hasOne(RecipientToken, {
  onDelete: 'RESTRICT',
  onUpdate: 'RESTRICT',
  foreignKey: 'recipient_id'
});
RecipientToken.belongsTo(Recipient, {
  foreignKey: 'recipient_id'
});

// //sync functions
const sync = async() => {
  await AdministrativeArea.sync({ alter: true });
  await Volunteer.sync({ alter: true });
  await Token.sync({ alter: true });
  await Organization.sync({ alter: true });
  await Point.sync({ alter: true });
  await BusinessHours.sync({ alert: true });
  await Label.sync({ alter: true });
  await LabelToPoint.sync({ alter: true });
  await Recipient.sync({ alter: true });
  await OneTimeToken.sync({ alter : true });
  await RecipientToken.sync({ alter: true });
}

module.exports = {
  sync,
  Organization,
  Point,
  Label,
  LabelToPoint,
  AdministrativeArea,
  Volunteer,
  Token,
  BusinessHours,
  Recipient,
  OneTimeToken,
  RecipientToken
};
