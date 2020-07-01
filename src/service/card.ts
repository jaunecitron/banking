import { CardRequest, Card, CardStatus } from '../models/card';
import { CardRepository } from '../repository/card';

export interface CardService {
  createCard: (card: CardRequest) => Promise<Card>;
  listCard: (userId: string, options?: { offset?: number; limit?: number }) => Promise<Card[]>;
  unblockCard: (userId: string, cardId: number) => Promise<Card>;
}

const randomlyChooseNInElements = (n: number, elements: any[]): string =>
  Array.from({ length: n }, () => elements[Math.floor(elements.length * Math.random())]).join('');

export const CardService = (cardRepository: CardRepository): CardService => ({
  async createCard(card: CardRequest): Promise<Card> {
    const elementsCount = 10;
    const elements = Array.from({ length: elementsCount }, (_: any, i: number) => i);
    const digits = randomlyChooseNInElements(16, elements);
    const ccv = randomlyChooseNInElements(3, elements);
    const createdCard = await cardRepository.createCard({ ...card, digits, ccv });
    return createdCard;
  },

  listCard: (userId: string, options?: { offset?: number; limit?: number }): Promise<Card[]> =>
    cardRepository.listCard(userId, options),

  async unblockCard(userId: string, cardId: number): Promise<Card> {
    const okStatus: CardStatus = 'OK';
    const card = cardRepository.updateCardStatus(userId, cardId, okStatus);
    return card;
  },
});
