module.exports = {
    convertDataToModel: (model, dto) => {
        model.name = dto.name;
        model.date = dto.date;
        model.semester_id = dto.semester_id;
        return model;
    }
}