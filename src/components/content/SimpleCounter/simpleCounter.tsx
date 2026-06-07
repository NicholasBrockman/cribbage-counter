import { useContext, useEffect, useState } from 'react';
import {
  Button,
  Col,
  Row
} from 'antd';
import classNames from 'classnames';
import { BaseContext } from '../../base/Base';
import { Card, CardSuit, FullDeckCards } from '../../../types/card';
import { sum } from 'lodash';
import '../HandCounter/handCounter.css';

export const SimpleCounter = () => {
  const baseContext = useContext(BaseContext);
  useEffect(() => baseContext.setTitle('Simple Hand Score'));
  const [selectedCards, setSelectedCards] = useState<Card[] | null>([]);
  const [handScore, setHandScore] = useState<{ fifteens: number, runs: number, pairs: number, flushes: number, nobs: number, totalScore: number } | null>(null);

  const handleCardClick = (selectedCard: Card, isAddingCard: boolean, selectedIndex?: number) => {
    if (isAddingCard)
    {
      setSelectedCards([...selectedCards, selectedCard]);
    } 
    else
    {
      setSelectedCards([...selectedCards.slice(0, selectedIndex), ...selectedCards.slice(selectedIndex + 1)]);
    }
  }

  const handleClearSelection = () => {
      setSelectedCards([]);
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
    const groupedCards: Record<number, Card[]> = remainingCards.reduce(function(group, card) {
      (group[card.rank] = group[card.rank] || []).push(card);
      return group;
    }, {} as Record<number, Card[]>);

    const sortedRanks = Object.keys(groupedCards).map(Number).sort((a, b) => a - b);

    let i = 0;
    while (i < sortedRanks.length) {
      // Walk forward as long as ranks are consecutive
      let j = i;
      let runMultiplier = 1;
      while (j + 1 < sortedRanks.length && sortedRanks[j + 1] === sortedRanks[j] + 1) {
        runMultiplier *= groupedCards[sortedRanks[j]].length;
        j++;
      }

      const runLength = j - i + 1;
      if (runLength >= 3) {
        runMultiplier *= groupedCards[sortedRanks[j]].length;
        runningTotal.runs += runMultiplier * runLength;
      }

      i = j + 1;
    }
  }

  const sumMiscPoints = (sortedCards: Card[], runningTotal: { pairs: number }) => {
    // calculate the pairs
    const groupedCards = sortedCards.reduce(function(group, card) {
      (group[card.rank] = group[card.rank] || []).push(card);
      return group;
    }, {} as Record<number, Card[]>);

    Object.keys(groupedCards).forEach((rank) => {
      if (groupedCards[rank].length > 1){
        runningTotal.pairs += (groupedCards[rank].length * (groupedCards[rank].length - 1));
      }
    })
  }

  const handleCalculateScore = () => {
    if (selectedCards.length === 0)
    {
      alert("Please select at least one card.")
      return;
    }

    // sort cards from lowest to highest
    const sortedCards = [...selectedCards].sort((a, b) => a.value - b.value);

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
    if (card.suit !== CardSuit.Spades)
    {
      // only show a single suit for the simple counter since suit doesn't matter for scoring
      return;
    }
    if (!cardsBySuit.has(card.suit))
    {
      cardsBySuit.set(card.suit, []);
    }
    cardsBySuit.set(card.suit, [...cardsBySuit.get(card.suit), card]);
  });

  return (
    <div>
      <div className="margin-bottom-md">
         Select all the cards you want to count. This simple counter does not count flushes or nobs.
      </div>
      <Row gutter={24}>
        <Col xs={12} lg={10} xl={8}>
          <Row className="margin-bottom-md">
            <Col className='margin-left-md'>
              <Button onClick={handleClearSelection}>Clear all</Button>
            </Col>
          </Row>
          <Row className="margin-bottom-md">
            {[...cardsBySuit.entries()].map(([suit, cards]) => (
              <>
                {cards.map((card) => (  
                  <span onClick={() => handleCardClick(card, true)} className={classNames("cardDisplay", "fullDeck", {"cardRed": [CardSuit.Diamonds, CardSuit.Hearts].includes(suit)})}>
                    {card.displayName}
                  </span>
                ))}
              </>
            ))}
          </Row>
          <Row>
            <Button type="primary" onClick={handleCalculateScore}>Calculate score</Button>
          </Row>
        </Col>
        <Col xs={12} lg={14} xl={16} style={{ paddingTop: '15px'}}>
          <Row className="margin-bottom-md">
            <Col xs={12}>
              Selected Cards
            </Col>
          </Row>
          <Row className="margin-bottom-md">
            {[...selectedCards]
              .map((handCard, idx) => ({ handCard, idx }))
              .sort((a, b) => a.handCard.rank - b.handCard.rank)
              .map(({ handCard, idx }) => (
                <span onClick={() => handleCardClick(handCard, false, idx)} className={classNames("cardDisplay", {"cardRed": [CardSuit.Diamonds, CardSuit.Hearts].includes(handCard.suit)})}>{handCard.displayName}</span>
              ))
            }
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
                  Total hand score:&ensp;<strong>{handScore.totalScore}</strong>
              </Row>
            </>
          )}
        </Col>
      <br/>
      </Row>
    </div>
  );
}

export default SimpleCounter;
