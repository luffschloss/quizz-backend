module.exports = {
    convertDataToModel: (model, dto) => {
        model.name = dto.name;
        model.quantity = dto.quantity;
        model.credit_class_id = dto.credit_class_id;
        return model;
    }
}