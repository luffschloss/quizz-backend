module.exports = {
    convertDataToModel: (model, dto) => {
        model.name = dto.name;
        model.credit = dto.credit;
        model.theoretical_lesson = dto.theoretical_lesson;
        model.pratical_lesson = dto.pratical_lesson;
        return model;
    }
}