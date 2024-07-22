import { useContext, useEffect, useState } from 'react';
import {
  Button,
  Col,
  Input,
  Radio,
  RadioChangeEvent,
  Row
} from 'antd';
import classNames from 'classnames';
import { BaseContext } from '../../base/Base';
import './handCounter.css';
import { Card, CardSuit, FullDeckCards } from '../../../types/card';

export const StartPage = () => {
  const baseContext = useContext(BaseContext);
  useEffect(() => baseContext.setTitle('Calculate Hand Score'));
  const [isAddingToHand, setIsAddingToHand] = useState(true);
  const [handCards, setHandCards] = useState<Card[] | null>([]);
  const [cutCards, setCutCards] = useState<Card[] |  null>([]);
  const [handScore, setHandScore] = useState<number | null>(null);

  const handleCardLocationChange = (e: RadioChangeEvent) => {
    setIsAddingToHand(e.target.value);
  }

  const handleCardClick = (selectedCard: Card) => {
    if (isAddingToHand){
      setHandCards([...handCards, selectedCard]);
    }
    else 
    {
      setCutCards([...cutCards, selectedCard])
    }
  }

  const handleClearSelection = () => {
    if (isAddingToHand){
      setHandCards([]);
    }
    else 
    {
      setCutCards([])
    }
  }

  const handleCalculateScore = () => {
    if (handCards.length === 0 || cutCards.length === 0)
    {
      alert("Please select at least one card for both hand and cut.")
      return;
    }
    const deckOfCards = FullDeckCards;
    alert(deckOfCards);

    setHandScore(19);
  };

  const cardsBySuit = new Map<CardSuit, Card[]>();
  FullDeckCards.forEach((card) => {
    if (!cardsBySuit.has(card.suit)) {
      cardsBySuit.set(card.suit, []);
    }
    cardsBySuit.set(card.suit, [...cardsBySuit.get(card.suit), card]);
  });

  return (
    <div>
      <div className="margin-bottom-md">
         First select where you are adding your cards too (hand or cut cards), and then click on a card to add it that location.
      </div>
      <Row gutter={24}>
        <Col xs={2} sm={4} md={6}>
          <Row className="margin-bottom-md">
            <Col>
              <Radio.Group 
                onChange={handleCardLocationChange} 
                value={isAddingToHand} 
                optionType="button"
                buttonStyle="solid"
              >
                <Radio value={true}>Hand</Radio>
                <Radio value={false}>Cut</Radio>
              </Radio.Group>
            </Col>
            <Col className='margin-left-md'>
              <Button onClick={handleClearSelection}>Clear selection</Button>
            </Col>
          </Row>
          <Row className="margin-bottom-md">
            Click on a card to add to {isAddingToHand ? "your hand." : "the cut."}
          </Row>
          <Row>
            {[...cardsBySuit.entries()].map(([suit, cards]) => (
              <Col>
                {cards.map((card) => (
                  <Row className={classNames("cardDisplay", {"cardRed": [CardSuit.Diamonds, CardSuit.Hearts].includes(suit)})}>
                    <span onClick={() => handleCardClick(card)}>{card.displayName}</span>
                  </Row>
                ))}
              </Col>
            ))}
          </Row>
        </Col>
        <Col span={8}>
          <div className="margin-bottom-md">
            <Button type="primary" onClick={handleCalculateScore}>Calculate score</Button>
          </div>
          <Row className="margin-bottom-md">
            <Col xs={8}>
              Hand Cards
            </Col>
          </Row>
          <Row className="margin-bottom-md">
            <Col xs={8}>
              {handCards.map((handCard) => (
                <span className={classNames("cardDisplay", {"cardRed": [CardSuit.Diamonds, CardSuit.Hearts].includes(handCard.suit)})}>{handCard.displayName}</span>
              ))}
            </Col>
          </Row>
          <Row className="margin-bottom-md margin-top-md">
            <Col xs={8}>
              Cut Cards
            </Col>
          </Row>
          <Row>
            <Col xs={8}>
              {cutCards.map((cutCard) => (
                <span className={classNames("cardDisplay", {"cardRed": [CardSuit.Diamonds, CardSuit.Hearts].includes(cutCard.suit)})}>{cutCard.displayName}</span>
              ))}
            </Col>
          </Row>
          
        </Col>
      <br/>
      {handScore && (
        <div className="margin-bottom-md">
          Your total hand score is: <strong>{handScore}</strong>
        </div>
        )}
      </Row>
    </div>
  );
}

export default StartPage;