import dummyData from '../dummy-data';

export default class DummyKnuPetitionService {
  getPetitions = async (milliSecs) => {
    return new Promise((resolve) => {
      setTimeout(() => {resolve(dummyData)}, milliSecs);
    });
  }
}
