import { useContext, useEffect } from 'react';
import {BaseContext} from '../../base/Base';

export const BestJokerPage = () => {
  const baseContext = useContext(BaseContext);
  useEffect(() => baseContext.setTitle('Find Best Joker'));

  return (
    <div>
      Not implemented yet, jokers are ILLEGAL.
    </div>
  );
}

export default BestJokerPage;