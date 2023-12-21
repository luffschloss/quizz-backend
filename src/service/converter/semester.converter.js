module.exports = {
    convertDataToModel: (model, dto) => {
        model.semester = dto.semester;
        model.year = dto.year;
        return model;
    }
}