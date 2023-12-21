module.exports = {
  convertDataToModel: (model, dto) => {
    model.level = dto.level;
    model.image = dto.image;
    model.question = dto.question;
    model.answer_a = dto.answer_a;
    model.answer_b = dto.answer_b;
    model.answer_c = dto.answer_c;
    model.answer_d = dto.answer_d;
    model.chapter_id = dto.chapter_id;
    model.correct_answer = dto.correct_answer;
    return model;
  },
};
