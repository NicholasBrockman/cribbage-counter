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
import { Card, FullDeckCards } from '../../../types/card';

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
    const inputString = (document.getElementById("cardInput") as HTMLInputElement).value.trim();

    if (!inputString.includes(":"))
    {
      alert("Please enter cards in valid format. Must include a colon to separate hand and cut cards")
      return;
    }
    const deckOfCards = FullDeckCards;
    alert(deckOfCards);

    setHandScore(19);
  };

  return (
    <div>
      <div className="margin-bottom-md">
         First select where you are adding your cards too (hand or cut cards), and then click on a card to add it that location.
      </div>
      <Row>
        <Col xs={2} sm={4} md={6}>
          <Row className="margin-bottom-md">
            <Col span={8}>
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
            <Col>
              <Button onClick={handleClearSelection}>Clear selection</Button>
            </Col>
          </Row>
          <div className="margin-bottom-md">
            Click on a card to add to {isAddingToHand ? "your hand." : "the cut."}
          </div>
        </Col>
        <Col span={8}>
        <div className="margin-bottom-md">
            <Button type="primary" onClick={handleCalculateScore}>Click to count hand</Button>
          </div>
          <Row className="margin-bottom-md">
            <Col xs={8}>
              Hand Cards
            </Col>
            <Col xs={8}>
              Cut Cards
            </Col>
          </Row>
          <Row className="margin-bottom-md">
            <Col xs={8}>
              {handCards.map((handCard) => (
                <div>{handCard.value}</div>
              ))}
            </Col>
            <Col xs={8}>
            {cutCards.map((cutCard) => (
                <div>{cutCard.value}</div>
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