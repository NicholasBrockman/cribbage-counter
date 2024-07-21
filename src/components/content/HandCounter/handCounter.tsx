import { useContext, useEffect, useState } from 'react';
import {
  Button,
  Input
} from 'antd';
import classNames from 'classnames';
import { BaseContext } from '../../base/Base';
import './handCounter.css';
import { FullDeckCards } from '../../../types/card';

export const StartPage = () => {
  const baseContext = useContext(BaseContext);
  useEffect(() => baseContext.setTitle('Calculate Hand Score'));
  const [handScore, setHandScore] = useState<number | null>(null);

  const handleCalculateScore = () => {
    const inputString = (document.getElementById("cardInput") as HTMLInputElement).value.trim();

    if (!inputString.includes(":"))
    {
      alert("Please enter cards in valid format. Must include a colon to separate hand and cut cards")
      return;
    }
    const handAndCutCards = inputString.split(":");
    const handCards = handAndCutCards[0];
    const cutCards = handAndCutCards[1];

    const deckOfCards = FullDeckCards;
    alert(deckOfCards);

    setHandScore(19);
  };

  return (
    <div>
      <div className="margin-bottom-md">
        Type the cards in your hand and the cut card(s) into the box below. <br/>
        Cards must be input in format of <strong>&#123;rank&#125;&#123;suit&#125;</strong>, with a colon separating the cards in your hand and the cut cards. <br/><br/>
        For example, if your hand is:
        <div>
          <li>Ace of Spades</li>
          <li>Four of Diamonds</li>
          <li>Five of Clubs</li>
          <li>Jack of Hearts</li>
        </div>
        and there are two cards that were cut:
        <div>
          <li>Eight of Spades</li>
          <li>Two of Hearts</li>
        </div>
        the input would look like: "<strong>AS 4D 5C JH : 8S 2H</strong>"<br/>
      </div>
      <div className="margin-bottom-md">
        <Input id="cardInput" placeholder='Input cards (i.e. 3C 4D 5S JH : 10H)' />
      </div>
      <div className="margin-bottom-md">
        <Button type="primary" onClick={handleCalculateScore}>Click to count hand</Button>
      </div>
     <br/>
     {handScore && (
       <div className="margin-bottom-md">
        Your total hand score is: <strong>{handScore}</strong>
      </div>
      )}
    </div>
  );
}

export default StartPage;