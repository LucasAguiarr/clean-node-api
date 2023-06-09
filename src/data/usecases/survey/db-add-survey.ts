import { AddSurveyRepository } from '@/data/protocols/database/survey/add.survey-repository';
import { AddSurveyUsecase } from '@/domain/usecases/survey/add-survey-usecase';

export class DbAddSurvey implements AddSurveyUsecase {
  constructor(private readonly addSurveyRepository: AddSurveyRepository) {}

  async add(
    surveyData: AddSurveyUsecase.Params,
  ): Promise<AddSurveyUsecase.Result> {
    await this.addSurveyRepository.add(surveyData);
  }
}
