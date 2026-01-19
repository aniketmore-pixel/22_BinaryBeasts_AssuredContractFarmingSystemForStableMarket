import React, { useState, useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import {
    Calendar as CalendarIcon,
    Truck,
    CreditCard,
    FileText,
    AlertCircle,
    ChevronRight,
    X
} from 'lucide-react';
import { dummyContracts } from '../../data/dummyContracts';
import styles from './ContractCalendar.module.css';

const EVENT_COLORS = {
    Contract: '#3498db',
    Delivery: '#f1c40f',
    Payment: '#2ecc71',
    Dispute: '#e74c3c'
};

const ContractCalendar = ({ role }) => {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [filters, setFilters] = useState({
        Contract: true,
        Delivery: true,
        Payment: true,
        Dispute: true
    });

    // Transform contracts data into FullCalendar events
    const events = useMemo(() => {
        let allEvents = [];
        dummyContracts.forEach(contract => {
            // Contract range events
            if (filters.Contract) {
                allEvents.push({
                    id: `${contract.id}-range`,
                    title: `${contract.crop} Contract`,
                    start: contract.startDate,
                    end: contract.endDate,
                    backgroundColor: '#ebf5fb',
                    textColor: '#3498db',
                    borderColor: '#3498db',
                    extendedProps: {
                        type: 'Contract',
                        contractId: contract.id,
                        details: `Active contract for ${contract.crop} with ${contract.buyer}`
                    }
                });
            }

            // Milestone events
            contract.milestones.forEach(m => {
                if (filters[m.type]) {
                    allEvents.push({
                        id: m.id,
                        title: m.title,
                        start: m.date,
                        allDay: true,
                        backgroundColor: EVENT_COLORS[m.type],
                        extendedProps: {
                            type: m.type,
                            contractId: contract.id,
                            status: m.status,
                            details: m.amount ? `Amount: ${m.amount}` : m.title
                        }
                    });
                }
            });
        });
        return allEvents;
    }, [filters]);

    const stats = useMemo(() => {
        const upcomingDeliveries = dummyContracts.flatMap(c => c.milestones)
            .filter(m => m.type === 'Delivery' && m.status === 'Upcoming').length;
        const paymentsDue = dummyContracts.flatMap(c => c.milestones)
            .filter(m => m.type === 'Payment' && m.status === 'Upcoming').length;
        const activeContracts = dummyContracts.filter(c => c.status === 'Active').length;

        return { upcomingDeliveries, paymentsDue, activeContracts };
    }, []);

    const handleEventClick = (info) => {
        setSelectedEvent(info.event);
    };

    const toggleFilter = (type) => {
        setFilters(prev => ({ ...prev, [type]: !prev[type] }));
    };

    return (
        <div className={styles.calendarContainer}>
            {/* Stats Widgets */}
            <div className={styles.statsRow}>
                <div className={styles.statCard}>
                    <div className={`${styles.statIcon}`} style={{ background: '#e8f5e9', color: '#2e7d32' }}>
                        <CalendarIcon size={24} />
                    </div>
                    <div className={styles.statInfo}>
                        <h4>Active Contracts</h4>
                        <p>{stats.activeContracts}</p>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={`${styles.statIcon}`} style={{ background: '#fff9c4', color: '#fbc02d' }}>
                        <Truck size={24} />
                    </div>
                    <div className={styles.statInfo}>
                        <h4>Upcoming Deliveries</h4>
                        <p>{stats.upcomingDeliveries}</p>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={`${styles.statIcon}`} style={{ background: '#e3f2fd', color: '#1976d2' }}>
                        <CreditCard size={24} />
                    </div>
                    <div className={styles.statInfo}>
                        <h4>Payments Due</h4>
                        <p>{stats.paymentsDue}</p>
                    </div>
                </div>
            </div>

            <div className={styles.mainGrid}>
                {/* Sidebar Filters */}
                <aside className={styles.sidebar}>
                    <div className={styles.sidebarSection}>
                        <h3>Event Types</h3>
                        <div className={styles.filterList}>
                            {Object.keys(EVENT_COLORS).map(type => (
                                <label key={type} className={styles.filterItem}>
                                    <input
                                        type="checkbox"
                                        checked={filters[type]}
                                        onChange={() => toggleFilter(type)}
                                    />
                                    <div
                                        className={styles.colorDot}
                                        style={{ backgroundColor: EVENT_COLORS[type] }}
                                    ></div>
                                    <span>{type}s</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className={styles.sidebarSection}>
                        <h3>Calendar Legend</h3>
                        <div className={styles.filterList}>
                            <div className={styles.filterItem}>
                                <AlertCircle size={16} color="#e74c3c" />
                                <span>Priority Hearing</span>
                            </div>
                            <div className={styles.filterItem}>
                                <FileText size={16} color="#3498db" />
                                <span>Contract Term</span>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Calendar Main */}
                <div className={styles.calendarWrapper}>
                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,timeGridWeek,timeGridDay'
                        }}
                        events={events}
                        eventClick={handleEventClick}
                        height="auto"
                        aspectRatio={1.5}
                    />
                </div>
            </div>

            {/* Event Detail Modal */}
            {selectedEvent && (
                <div className={styles.modalOverlay} onClick={() => setSelectedEvent(null)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3>Event Details</h3>
                            <button className={styles.closeBtn} onClick={() => setSelectedEvent(null)}>
                                <X size={24} />
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.detailRow}>
                                <div className={styles.detailLabel}>Event</div>
                                <div className={styles.detailValue}>{selectedEvent.title}</div>
                            </div>
                            <div className={styles.detailRow}>
                                <div className={styles.detailLabel}>Type</div>
                                <div className={styles.detailValue}>{selectedEvent.extendedProps.type}</div>
                            </div>
                            <div className={styles.detailRow}>
                                <div className={styles.detailLabel}>Contract ID</div>
                                <div className={styles.detailValue}>{selectedEvent.extendedProps.contractId}</div>
                            </div>
                            <div className={styles.detailRow}>
                                <div className={styles.detailLabel}>Date</div>
                                <div className={styles.detailValue}>
                                    {selectedEvent.start.toLocaleDateString('en-IN', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </div>
                            </div>
                            <div className={styles.detailRow}>
                                <div className={styles.detailLabel}>Details</div>
                                <div className={styles.detailValue}>{selectedEvent.extendedProps.details}</div>
                            </div>
                            {selectedEvent.extendedProps.status && (
                                <div className={styles.detailRow}>
                                    <div className={styles.detailLabel}>Status</div>
                                    <div className={styles.detailValue}>{selectedEvent.extendedProps.status}</div>
                                </div>
                            )}
                        </div>
                        <div className={styles.modalFooter}>
                            <a href={`/${role}/contracts/${selectedEvent.extendedProps.contractId}`} className={styles.btnLink}>
                                Go to Contract <ChevronRight size={16} style={{ verticalAlign: 'middle' }} />
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContractCalendar;
