import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Pagination from '../../../components/Pagination';
import { getStrategies, startStrategy, stopStrategy, deleteStrategy } from '../../../services/StrategiesService';
import MyStrategyRow from './MyStrategyRow';
import StrategyModal from '../StrategyModal/StrategyModal';

/**
 * props:
 * - symbol
 * - onNotification
 */
function MyStrategies(props) {

    const defaultLocation = useLocation();

    function getPage(location) {
        if (!location) location = defaultLocation;
        return new URLSearchParams(location.search).get('page');
    }

    useEffect(() => {
        setPage(getPage(defaultLocation));
    }, [defaultLocation])

    const [strategies, setStrategies] = useState([]);

    const [count, setCount] = useState(0);

    const [editStrategy, setEditStrategy] = useState({});

    const [page, setPage] = useState(getPage());

    useEffect(() => {
        getStrategies(props.symbol, page || 1)
            .then(result => {
                setStrategies(result.rows);
                setCount(result.count);
            })
            .catch(err => {
                console.error(err.response ? err.response.data : err.message);
                props.onNotification({ type: 'error', text: err.response ? err.response.data : err.message });
            });

    }, [page, props.symbol])

    function onEditClick(event) {
        const id = event.target.id.replace('edit', '');
        const strategy = strategies.find(s => s.id == id);
        setEditStrategy({ ...strategy });
    }

    function onStopClick(event) {
        const id = event.target.id.replace('stop', '');
        stopStrategy(id)
            .then(strategy => { window.location.reload() })
            .catch(err => {
                console.error(err.response ? err.response.data : err.message);
                props.onNotification({ type: 'error', text: err.response ? err.response.data : err.message });
            });
    }

    function onStartClick(event) {
        const id = event.target.id.replace('start', '');
        startStrategy(id)
            .then(strategy => { window.location.reload() })
            .catch(err => {
                console.error(err.response ? err.response.data : err.message)
                props.onNotification({ type: 'error', text: err.response ? err.response.data : err.message });
            });
    }

    function onDeleteClick(event) {
        const id = event.target.id.replace('delete', '');
        deleteStrategy(id)
            .then(strategy => { window.location.reload() })
            .catch(err => {
                console.error(err.response ? err.response.data : err.message);
                props.onNotification({ type: 'error', text: err.response ? err.response.data : err.message });
            });
    }

    function onStrategySubmit(strategy) {
        window.location.reload();
    }

    return (
        <>
            <div className="card card-body border-0 shadow table-wrapper table-responsive">
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th className="border-gray-200">Symbol</th>
                            <th className="border-gray-200">Name</th>
                            <th className="border-gray-200">Status</th>
                            <th className="border-gray-200">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            strategies && strategies.length
                                ? strategies.map(strategy => (<MyStrategyRow key={strategy.id} data={strategy} onEditClick={onEditClick} onStartClick={onStartClick} onStopClick={onStopClick} onDeleteClick={onDeleteClick} />))
                                : <></>
                        }
                    </tbody>
                </table>
                <Pagination count={count} />
            </div>
            <StrategyModal data={editStrategy} onSubmit={onStrategySubmit} />
        </>
    )
}

export default MyStrategies;