import React, { useRef, useState, useEffect } from 'react';
import SelectSymbol from '../../../components/SelectSymbol';
import MonitorType from './MonitorType';
import MonitorIndex from './MonitorIndex';
import SwitchInput from '../../../components/SwitchInput';
import { saveMonitor } from '../../../services/MonitorsService';
import SelectInterval from './SelectInterval';
import LogButton from '../../../components/Logs/LogButton';
import LogView from '../../../components/Logs/LogView';

/**
 * props:
 * - data
 * - onSubmit
 */
function MonitorModal(props) {

    const DEFAULT_MONITOR = {
        id: 0,
        isSystemMon: false,
        symbol: '',
        type: "CANDLES",
        interval: "1m",
        indexes: '',
        broadcastLabel: '',
        isActive: false,
        logs: false,
        userId: 0
    }

    const [error, setError] = useState('');
    const [showLogs, setShowLogs] = useState(false);
    const [monitor, setMonitor] = useState(DEFAULT_MONITOR);

    const btnClose = useRef('');
    const btnSave = useRef('');

    function onSubmit(event) {
        saveMonitor(monitor.id, monitor)
            .then(result => {
                btnClose.current.click();
                if (props.onSubmit) props.onSubmit(result);
            })
            .catch(err => {
                console.error(err.response ? err.response.data : err.message);
                setError(err.response ? err.response.data : err.message);
            })
    }

    function onInputChange(event) {
        setMonitor(prevState => ({ ...prevState, [event.target.id]: event.target.value }));
    }

    useEffect(() => {
        if (!props.data || !props.data.id)
            setMonitor({ ...DEFAULT_MONITOR })
        else
            setMonitor(props.data);
    }, [props.data])

    function onLogClick(event) {
        setShowLogs(!showLogs);
    }

    useEffect(() => {
        const modal = document.getElementById('modalMonitor');
        modal.addEventListener('hidden.bs.modal', (event) => {
            setMonitor({ ...DEFAULT_MONITOR });
            setShowLogs(false);
        })
    }, [])

    return (
        <div className="modal fade" id="modalMonitor" tabIndex="-1" role="dialog" aria-labelledby="modalTitleNotify" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <p className="modal-title" id="modalTitleNotify">{props.data.id ? 'Edit ' : 'New '}Monitor</p>
                        <button ref={btnClose} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="form-group">
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <div className="form-group mb-4">
                                        <MonitorType onChange={onInputChange} type={monitor.type} disabled={true} />
                                    </div>
                                </div>
                                {
                                    monitor.type === 'CANDLES'
                                        ? <div className="col-md-6 mb-3">
                                            <div className="form-group mb-4">
                                                <label htmlFor="symbol">Symbol:</label>
                                                <SelectSymbol onChange={onInputChange} symbol={monitor.symbol} disabled={monitor.id > 0} />
                                            </div>
                                        </div>
                                        : <></>
                                }
                            </div>
                            {
                                showLogs
                                    ? <LogView file={"M:" + monitor.id} />
                                    : (
                                        <>
                                            <div className="row">
                                                {
                                                    monitor.type === 'CANDLES'
                                                        ? (
                                                            <>
                                                                <div className="col-md-6 mb-3">
                                                                    <div className="form-group mb-4">
                                                                        <SelectInterval onChange={onInputChange} interval={monitor.interval} />
                                                                    </div>
                                                                </div>
                                                                <MonitorIndex onChange={onInputChange} indexes={monitor.indexes} />
                                                            </>
                                                        )
                                                        : <></>
                                                }
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6 mb-3">
                                                    <div className="form-group">
                                                        <SwitchInput id="isActive" text="Is Active?" onChange={onInputChange} isChecked={monitor.isActive} />
                                                    </div>
                                                </div>
                                                <div className="col-md-6 mb-3">
                                                    <div className="form-group">
                                                        <SwitchInput id="logs" text="Enable Logs?" onChange={onInputChange} isChecked={monitor.logs} />
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )
                            }
                        </div>
                    </div>
                    <div className="modal-footer">
                        {
                            error
                                ? <div className="alert alert-danger mt-1 col-9 py-1">{error}</div>
                                : <></>
                        }
                        <LogButton id={monitor.id} onClick={onLogClick} />
                        <button ref={btnSave} type="button" className="btn btn-sm btn-primary" onClick={onSubmit}>Save</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MonitorModal;
