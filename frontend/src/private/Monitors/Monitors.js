import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Menu from '../../components/Menu/Menu';
import Footer from '../../components/Footer';
import MonitorRow from './MonitorRow';
import { getMonitors, startMonitor, stopMonitor, deleteMonitor } from '../../services/MonitorsService';
import Pagination from '../../components/Pagination';
import MonitorModal from './MonitorModal/MonitorModal';
import Toast from '../../components/Toast';
import LogModal from '../../components/Logs/LogModal';
import NewMonitorButton from './NewMonitorButton';

function Monitors() {

    const defaultLocation = useLocation();

    function getPage(location) {
        if (!location) location = defaultLocation;
        return new URLSearchParams(location.search).get('page');
    }

    useEffect(() => {
        setPage(getPage(defaultLocation));
    }, [defaultLocation])

    const [monitors, setMonitors] = useState([]);

    const [count, setCount] = useState(0);

    const [notification, setNotification] = useState({ type: '', text: '' });

    const [editMonitor, setEditMonitor] = useState({});

    const [page, setPage] = useState(getPage());

    useEffect(() => {
        getMonitors(page || 1)
            .then(result => {
                setMonitors(result.rows);
                setCount(result.count);
            })
            .catch(err => {
                console.error(err.response ? err.response.data : err.message);
                setNotification({ type: 'error', text: err.response ? err.response.data : err.message });
            });

    }, [page])

    function onEditClick(event) {
        const id = event.target.id.replace('edit', '');
        const monitor = monitors.find(m => m.id == id);
        setEditMonitor({...monitor});
    }

    function onLogsClick(event) {
        const id = event.target.id.replace('logs', '');
        setEditMonitor(monitors.find(m => m.id == id));
    }

    function onStopClick(event) {
        const id = event.target.id.replace('stop', '');
        stopMonitor(id)
            .then(monitor => { window.location.reload() })
            .catch(err => {
                console.error(err.response ? err.response.data : err.message);
                setNotification({ type: 'error', text: err.response ? err.response.data : err.message });
            });
    }

    function onStartClick(event) {
        const id = event.target.id.replace('start', '');
        startMonitor(id)
            .then(monitor => { window.location.reload() })
            .catch(err => {
                console.error(err.response ? err.response.data : err.message)
                setNotification({ type: 'error', text: err.response ? err.response.data : err.message });
            });
    }

    function onDeleteClick(event) {
        const id = event.target.id.replace('delete', '');
        deleteMonitor(id)
            .then(monitor => { window.location.reload() })
            .catch(err => {
                console.error(err.response ? err.response.data : err.message);
                setNotification({ type: 'error', text: err.response ? err.response.data : err.message });
            });
    }

    function onMonitorSubmit(order) {
        window.location.reload();
    }

    return (
        <>
            <Menu />
            <main className="content">
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
                    <div className="d-block mb-4 mb-md-0">
                        <h2 className="h4">Monitors</h2>
                    </div>
                    <div className="btn-toolbar mb-2 mb-md-0">
                        <div className="d-inline-flex align-items-center">
                            <NewMonitorButton />
                        </div>
                    </div>
                </div>
                <div className="card card-body border-0 shadow table-wrapper table-responsive">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th className="border-gray-200">Type</th>
                                <th className="border-gray-200">Symbol</th>
                                <th className="border-gray-200">Active</th>
                                <th className="border-gray-200">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                monitors && monitors.length
                                    ? monitors.map(monitor => (<MonitorRow key={monitor.id} data={monitor} onEditClick={onEditClick} onStartClick={onStartClick} onStopClick={onStopClick} onDeleteClick={onDeleteClick} onLogsClick={onLogsClick} />))
                                    : <></>
                            }
                        </tbody>
                    </table>
                    <Pagination count={count} />
                </div>
                <Footer />
            </main>
            <MonitorModal data={editMonitor} onSubmit={onMonitorSubmit} />
            <LogModal file={editMonitor.id > 0 ? "M:" + editMonitor.id : ""} />
            <Toast type={notification.type} text={notification.text} />
        </>
    );
}

export default Monitors;
