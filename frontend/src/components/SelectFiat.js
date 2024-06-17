import React, { useEffect, useState } from 'react';

const DEFAULT_FIAT_PROPERTY = "defaultFiat";

/**
 * props:
 * - fiat
 * - onChange
 */
function SelectFiat(props) {

    const [fiat, setFiat] = useState(getDefaultFiat());

    useEffect(() => {
        if (!props.fiat) return;
        setFiat(props.fiat);
    }, [props.fiat])

    return (
        <>
            <select id="selectFiat" className="form-select pe-6" value={fiat} onChange={props.onChange}>
                <option value="AUD">AUD</option>
                <option value="BRL">BRL</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="NGN">NGN</option>
                <option value="TRY">TRY</option>
                <option value="UAH">UAH</option>
                <option value="USD">USD</option>
            </select>
        </>
    )
}

export function getDefaultFiat() {
    return localStorage.getItem(DEFAULT_FIAT_PROPERTY) ? localStorage.getItem(DEFAULT_FIAT_PROPERTY) : "USD";
}

export function setDefaultFiat(quote) {
    localStorage.setItem(DEFAULT_FIAT_PROPERTY, quote);
}

export default SelectFiat;
