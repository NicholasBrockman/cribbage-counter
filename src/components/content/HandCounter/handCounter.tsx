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
  const [handScore, setHandScore] = useState<{ fifteens: number, runs: number, pairs: number, flushes: number, nobs: number, totalScore: number } | null>(null);

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

  const sumFifteen = (cardValues: number[], subSetValues: number[], runningTotal: { fifteens: number }) => {
    const currentTotal = sum(subSetValues);
    if (currentTotal === 15) 
    {
      runningTotal.fifteens += 2;
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

  const sumRuns = (remainingCards: Card[], runningTotal: { runs: number }) => {

    const groupedCards: Map<CardRank, Card[]> = remainingCards.reduce(function(group, card) {
      (group[card.rank] = group[card.rank] || []).push(card);
      return group;
    }, {} as Map<CardRank, Card[]>);

    const numberOfRanks = Object.keys(groupedCards).length;
    // this is ugliest code I've ever written, but i gave up on recursion
    for (let i = 0; i < numberOfRanks; i++)
    {
      let runMultiplier = groupedCards[Object.keys(groupedCards)[i]].length;
      let currentRank = parseInt(Object.keys(groupedCards)[i]) as CardRank;
      if (groupedCards[currentRank + 1])
      {
        i++;
        let cardsInRank = groupedCards[Object.keys(groupedCards)[i]].length;
        runMultiplier = runMultiplier * cardsInRank;
        currentRank = parseInt(Object.keys(groupedCards)[i]) as CardRank;
        if (groupedCards[currentRank + 1])
        {
          // at this point, we are three ranks deep so the run will score points
          i++;
          cardsInRank = groupedCards[Object.keys(groupedCards)[i]].length;
          runMultiplier = runMultiplier * cardsInRank;
          currentRank = parseInt(Object.keys(groupedCards)[i]) as CardRank;
          if (groupedCards[currentRank + 1])
          {
            i++;
            cardsInRank = groupedCards[Object.keys(groupedCards)[i]].length;
            runMultiplier = runMultiplier * cardsInRank;
            currentRank = parseInt(Object.keys(groupedCards)[i]) as CardRank;
            if (groupedCards[currentRank + 1])
            {
              i++;
              cardsInRank = groupedCards[Object.keys(groupedCards)[i]].length;
              runMultiplier = runMultiplier * cardsInRank;
              currentRank = parseInt(Object.keys(groupedCards)[i]) as CardRank;
              if (groupedCards[currentRank + 1])
              {
                i++;
                cardsInRank = groupedCards[Object.keys(groupedCards)[i]].length;
                runMultiplier = runMultiplier * cardsInRank;
                currentRank = parseInt(Object.keys(groupedCards)[i]) as CardRank;
                if (groupedCards[currentRank + 1])
                {
                  i++;
                  cardsInRank = groupedCards[Object.keys(groupedCards)[i]].length;
                  runMultiplier = runMultiplier * cardsInRank;
                  currentRank = parseInt(Object.keys(groupedCards)[i]) as CardRank;
                  if (groupedCards[currentRank + 1])
                  {
                    i++;
                    cardsInRank = groupedCards[Object.keys(groupedCards)[i]].length;
                    runMultiplier = runMultiplier * cardsInRank;
                    runningTotal.runs += runMultiplier * 8;
                    // i got tired of copying and pasting, only going up to runs of 8
                  } 
                  else {
                    runningTotal.runs += runMultiplier * 7;
                  }
                } 
                else {
                  runningTotal.runs += runMultiplier * 6;
                }
              } 
              else {
                runningTotal.runs += runMultiplier * 5;
              }
            } 
            else {
              runningTotal.runs += runMultiplier * 4;
            }
          }
          else {
            runningTotal.runs += runMultiplier * 3;
          }
        }
      }
    }
  }

  const sumMiscPoints = (sortedCards: Card[], runningTotal: { pairs: number, flushes: number, nobs: number }) => {
    // calculate the pairs
    const groupedCards = sortedCards.reduce(function(group, card) {
      (group[card.rank] = group[card.rank] || []).push(card);
      return group;
    }, {} as Map<CardRank, Card[]>);

    Object.keys(groupedCards).forEach((rank) => {
      if (groupedCards[rank].length > 1){
        runningTotal.pairs += (groupedCards[rank].length * (groupedCards[rank].length - 1));
      }
    })

    // calculate the flushes
    if (handCards.every((card) => card.suit === handCards[0].suit))
    {
      // add value of flush from hand
      runningTotal.flushes += handCards.length;

      // check if cut cards are also part of flush
      cutCards.forEach((cutCard) => {
        if (cutCard.suit === handCards[0].suit)
        {
          runningTotal.flushes += 1;
        }
      })
    }

    // calculated nobs
    const jacksInHand = handCards.filter((card) => card.rank === CardRank.Jack);
    cutCards.forEach((cutCard) => {
      jacksInHand.forEach((handJack) => {
        if (handJack.suit === cutCard.suit){
          runningTotal.nobs += 1;
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
    let runningTotal = { fifteens: 0, runs: 0, pairs: 0, flushes: 0, nobs: 0, totalScore: 0 };
    sumFifteen(sortedCards.map(card => card.value), [], runningTotal);
    sumRuns(sortedCards, runningTotal);
    sumMiscPoints(sortedCards, runningTotal);
    runningTotal.totalScore = runningTotal.fifteens + runningTotal.runs + runningTotal.pairs + runningTotal.flushes + runningTotal.nobs;
    setHandScore(runningTotal);
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
            <>
              <Row>
                  Fifteens:&ensp;<strong>{handScore.fifteens}</strong>
              </Row>
              <Row>
                  Runs:&ensp;<strong>{handScore.runs}</strong>
              </Row>
              <Row>
                  Pairs:&ensp;<strong>{handScore.pairs}</strong>
              </Row>
              <Row>
                  Flushes:&ensp;<strong>{handScore.flushes}</strong>
              </Row>
              <Row>
                  Nobs:&ensp;<strong>{handScore.nobs}</strong>
              </Row>
              <Row>
                  Your total hand score is:&ensp;<strong>{handScore.totalScore}</strong>
              </Row>
            </>
          )}
        </Col>
      <br/>
      </Row>
    </div>
  );
}

export default StartPage;