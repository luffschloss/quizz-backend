module.exports = {
    convertDataToModel: (model, dto) => {
        model.semester_id = dto.semester_id;
        model.quantity = dto.quantity;
        model.subject_id = dto.subject_id;
        return model;
    }
}