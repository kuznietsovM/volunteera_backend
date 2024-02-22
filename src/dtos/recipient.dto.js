module.exports = class RecipientDto {
    id;
    phone_number;
    first_name;
    last_name;
    patronymic;

    constructor(model) {
        this.id = model.id;
        this.phone_number = model.phone_number;
        this.first_name = model.first_name;
        this.last_name = model.last_name;
        this.patronymic = model.patronymic;
    }
}