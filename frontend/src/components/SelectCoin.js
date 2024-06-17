import React, { useState, useEffect } from 'react';
import { getSymbols } from '../services/SymbolsService';

/**
 * props:
 * - coin
 * - onChange
 */
function SelectCoin(props) {

    const [coins, setCoins] = useState([]);

    useEffect(() => {
        getSymbols()
            .then(symbols => {
                if (!symbols.rows.map) return setCoins([]);
                const coinNames = [...new Set(symbols.rows.map(s => s.base))].sort();
                setCoins(coinNames);
            })
            .catch(err => setCoins([err.response ? err.response.data : err.message]));
    }, [])

    function onCoinChange(event) {
        if (props.onChange)
            props.onChange(event);
    }

    return (
        <select className="form-select" id="coin" value={props.coin} onChange={onCoinChange}>
            <option value="">Select...</option>
            {
                coins
                    ? coins.map(c => (<option key={c}>{c}</option>))
                    : <></>
            }
        </select>
    )
}

export default SelectCoin;