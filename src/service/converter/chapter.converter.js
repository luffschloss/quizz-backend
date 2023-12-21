module.exports = {
    convertDataToModel: (model, dto) => {
        model.name = dto.name;
        model.index = dto.index;
        model.subject_id = dto.subject_id;
        return model;
    }
}