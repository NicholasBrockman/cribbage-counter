import { useContext, useEffect, useState } from 'react';
import {
  Button,
  Col,
  Radio,
  RadioChangeEvent,
  Row
} from 'antd';
import classNames from 'classnames';
import { BaseContext } from '../../base/Base';
import './handCounter.css';
import { Card, CardRank, CardSuit, FullDeckCards } from '../../../types/card';
import { sum } from 'lodash';

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
    if (isAddingToHand)
    {
      setHandCards([...handCards, selectedCard]);
    }
    else 
    {
      setCutCards([...cutCards, selectedCard])
    }
  }

  const handleClearSelection = () => {
    if (isAddingToHand)
    {
      setHandCards([]);
    }
    else 
    {
      setCutCards([])
    }
  }

  const sumFifteen = (cardValues: number[], subSetValues: number[], runningTotal: { total: number }) => {
    const currentTotal = sum(subSetValues);
    if (currentTotal === 15) 
    {
      runningTotal.total += 2;
    }

    if (currentTotal >= 15 || cardValues.length === 0)
    {
      return;
    }

    for (let i = 0; i < cardValues.length; i++){
      const currentValue = cardValues[i];
      const remaining = cardValues.slice(i+1);
      sumFifteen(remaining, subSetValues.concat([currentValue]), runningTotal);
    }
  }

  const sumRuns = (remainingCards: Card[], currentRun: Card[], runningTotal: { total: number }) => {
    
    // else
    // {
    //   currentRun = currentRun.concat([currentCard]);
    // }

    // if (currentRun.length === 0 || (currentCard.rank === currentRun[currentRun.length - 1].rank + 1)) {
    //   currentRun = currentRun.concat([currentCard]);
    // }
    //  no remaining cards, or next card not part of run. move on to next card
    if (remainingCards.length === 0 || (currentRun.length !== 0 && remainingCards[0].rank !== (currentRun[currentRun.length - 1].rank + 1)))
    {
      if (currentRun.length >= 3)
      {
        runningTotal.total += currentRun.length;
      }
      return;
    }


    for (let i = 0; i < remainingCards.length; i++){
      const currentCard = remainingCards[i];
      const remaining = remainingCards.slice(i+1);
      // if (currentRun.length === 0 || (currentCard.rank === currentRun[currentRun.length - 1].rank + 1)) {
      //   currentRun = currentRun.concat([currentCard]);
      // }
      // // next card not part of run. move on to next card
      // if (currentRun.length !== 0 && currentRun[currentRun.length - 1].rank !== (currentCard.rank - 1)){
      //   return;
      // }
      currentRun = currentRun.concat([currentCard]);
      // if (remaining.length === 0 || remaining[0].rank !== (currentCard.rank + 1)) 
      //   {
      //     if (currentRun.length >= 3)
      //       {
      //         runningTotal.total += currentRun.length;
      //       }
            
      //       return;
      //     }
      sumRuns(remaining, currentRun, runningTotal);
    }
  }

  const sumMiscPoints = (sortedCards: Card[], runningTotal: { total: number }) => {
    // calculate the pairs
    const groupedCards = sortedCards.reduce(function(group, card) {
      (group[card.rank] = group[card.rank] || []).push(card);
      return group;
    }, {} as Map<CardRank, Card[]>);

    Object.keys(groupedCards).forEach((rank) => {
      if (groupedCards[rank].length > 1){
        runningTotal.total += (groupedCards[rank].length * (groupedCards[rank].length - 1));
      }
    })

    // calculate the flushes
    if (handCards.every((card) => card.suit === handCards[0].suit))
    {
      // add value of flush from hand
      runningTotal.total += handCards.length;

      // check if cut cards are also part of flush
      cutCards.forEach((cutCard) => {
        if (cutCard.suit === handCards[0].suit)
        {
          runningTotal.total += 1;
        }
      })
    }

    // calculated nobs
    const jacksInHand = handCards.filter((card) => card.rank === CardRank.Jack);
    cutCards.forEach((cutCard) => {
      jacksInHand.forEach((handJack) => {
        if (handJack.suit === cutCard.suit){
          runningTotal.total += 1;
        }
      })
    })
  }

  const handleCalculateScore = () => {
    if (handCards.length === 0 || cutCards.length === 0)
    {
      alert("Please select at least one card for both hand and cut.")
      return;
    }

    // sort cards from lowest to highest
    const sortedCards = [...handCards, ...cutCards].sort((a, b) => a.value - b.value);

    // passing in object instead of number to update by reference
    let runningTotal = { total: 0 };
    sumFifteen(sortedCards.map(card => card.value), [], runningTotal);

    sumRuns(sortedCards, [], runningTotal);

    sumMiscPoints(sortedCards, runningTotal);

    setHandScore(runningTotal.total);
  };

  const cardsBySuit = new Map<CardSuit, Card[]>();
  FullDeckCards.forEach((card) => {
    if (!cardsBySuit.has(card.suit))
    {
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
        <Col xs={16} sm={14} md={12} lg={10} xl={8}>
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
                  <Row onClick={() => handleCardClick(card)} className={classNames("cardDisplay", "fullDeck", {"cardRed": [CardSuit.Diamonds, CardSuit.Hearts].includes(suit)})}>
                    {card.displayName}
                  </Row>
                ))}
              </Col>
            ))}
          </Row>
        </Col>
        <Col xs={8} sm={10} md={12} lg={14} xl={16}>
          <div className="margin-bottom-md">
            <Button type="primary" onClick={handleCalculateScore}>Calculate score</Button>
          </div>
          <Row className="margin-bottom-md">
            <Col xs={8}>
              Hand Cards
            </Col>
          </Row>
          <Row className="margin-bottom-md">
            {handCards.map((handCard) => (
              <span className={classNames("cardDisplay", {"cardRed": [CardSuit.Diamonds, CardSuit.Hearts].includes(handCard.suit)})}>{handCard.displayName}</span>
            ))}
          </Row>
          <Row className="margin-bottom-md margin-top-md">
            <Col xs={8}>
              Cut Cards
            </Col>
          </Row>
          <Row>
            {cutCards.map((cutCard) => (
              <span className={classNames("cardDisplay", {"cardRed": [CardSuit.Diamonds, CardSuit.Hearts].includes(cutCard.suit)})}>{cutCard.displayName}</span>
            ))}
          </Row>
          {handScore !== null && (
            <Row>
                Your total hand score is:&ensp;<strong>{handScore}</strong>
            </Row>
          )}
        </Col>
      <br/>
      </Row>
    </div>
  );
}

export default StartPage;