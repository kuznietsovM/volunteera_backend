module.exports = class PointDto {
    id;
    lat;
    lng;
    administrative_area_id;
    formatted_address;
    tz;
    organization_name;
    organization_icon;
    description;
    website;
    number;
    labels;
    is_open;
    next_state;
    business_hours;

    constructor(model) {
        this.id = model.id;
        this.lat = model.lat;
        this.lng = model.lng;
        if(model.street && model.house_number && model.locality && model.region){
            this.formatted_address = (model.street != '' ? model.street + ', ' : model.street) + (model.house_number != '' ? model.house_number + ', ' : model.house_number)+ model.locality + ', ' + model.region;
        }
        this.administrative_area_id = model.administrative_area_id;
        this.tz = model.tz;
        this.organization_name = model.organization_name;
        this.organization_icon = model.organization_icon;
        this.description = model.description;
        this.website = model.website;
        this.number = model.number;
        if(model.labels){
            this.labels = model.labels.map((obj) => obj['id'] || obj['label_id']);
        }
        this.is_open = model.is_open;
        this.next_state = model.next_state;
        this.business_hours = model.business_hours;
    }
}