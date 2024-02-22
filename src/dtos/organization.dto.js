module.exports = class OrganizationDto {
    id; // has to be removed
    name;
    number;
    website;
    description;
    icon

    constructor(model) {
        this.id = model.id; // has to be removed
        this.name = model.name;
        this.number = model.number;
        this.website = model.website;
        this.description = model.description;
        this.icon = model.icon;
    }
}