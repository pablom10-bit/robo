import React, { useState, useEffect } from 'react';

const DEFAULT_QUOTE_PROPERTY = "defaultQuote";

/**
 * props:
 * - onChange
 * - disabled
 * - noFavorites
 * - value
 */
function SelectQuote(props) {

    const [quote, setQuote] = useState('');
    const [isDisabled, setIsDisabled] = useState(false);

    useEffect(() => {
        if (!props.value) return setQuote(getDefaultQuote());
        setQuote(props.value);
    }, [props.value])

    useEffect(() => {
        setIsDisabled(props.disabled);
    }, [props.disabled])

    function onChange(event) {
        setDefaultQuote(event.target.value);
        props.onChange(event);
    }

    return (
        <select id="selectQuote" className="form-select me-4" disabled={isDisabled} value={quote} onChange={onChange}>
            {
                props.noFavorites
                    ? <></>
                    : <option value="FAVORITES">Favorites</option>
            }
            <option value="BNB">BNB</option>
            <option value="BRL">BRL</option>
            <option value="BTC">BTC</option>
            <option value="GBP">GBP</option>
            <option value="ETH">ETH</option>
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
            <option value="USDT">USDT</option>
        </select>
    )
}

export function filterSymbolObjects(symbols, quote) {
    return symbols.filter(s => {
        if (quote === 'FAVORITES')
            return s.isFavorite;
        else
            return s.symbol.endsWith(quote);
    })
}

export function filterSymbolNames(symbols, quote) {
    return filterSymbolObjects(symbols, quote).map(s => s.symbol);
}

export function getDefaultQuote() {
    return localStorage.getItem(DEFAULT_QUOTE_PROPERTY) ? localStorage.getItem(DEFAULT_QUOTE_PROPERTY) : "USDT";
}

export function setDefaultQuote(quote) {
    localStorage.setItem(DEFAULT_QUOTE_PROPERTY, quote);
}

export default SelectQuote;
