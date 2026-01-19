import React, { useState } from 'react';
import ContractTimeline from '../../components/ui/ContractTimeline';
import { Card, Button } from '../../components/ui/Base';
import './TimelineDemo.css';

const STATUS_OPTIONS = [
    'created',
    'negotiation',
    'accepted',
    'active',
    'scheduled',
    'delivered',
    'paid',
    'closed'
];

const TimelineDemo = () => {
    const [currentStatus, setCurrentStatus] = useState('active');

    const mockHistory = [
        { status: 'created', timestamp: '12 Oct, 10:30 AM' },
        { status: 'negotiation', timestamp: '14 Oct, 02:45 PM' },
        { status: 'accepted', timestamp: '15 Oct, 09:00 AM' },
        { status: 'active', timestamp: '16 Oct, 11:15 AM' }
    ];

    return (
        <div className="demo-container">
            <header className="demo-header">
                <h1>Contract Lifecycle Tracker</h1>
                <p>Interactive UI demo for the KrishiSetu contract timeline component.</p>
            </header>

            <div className="demo-controls">
                <Card className="control-card">
                    <h3>Update Contract Status</h3>
                    <div className="status-selector">
                        {STATUS_OPTIONS.map(status => (
                            <button
                                key={status}
                                className={`status-btn ${currentStatus === status ? 'active' : ''}`}
                                onClick={() => setCurrentStatus(status)}
                            >
                                {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                            </button>
                        ))}
                    </div>
                </Card>
            </div>

            <div className="demo-view">
                <Card className="timeline-preview-card">
                    <div className="card-header">
                        <div className="contract-id">
                            <span>Contract ID</span>
                            <strong>#KS-2026-WHEAT-442</strong>
                        </div>
                        <div className="current-badge">
                            Status: <span className="status-text">{currentStatus.replace('_', ' ')}</span>
                        </div>
                    </div>

                    <ContractTimeline
                        currentStatus={currentStatus}
                        history={mockHistory}
                    />

                    <div className="card-footer">
                        <p>ℹ️ Hover over the info icon on each step to see a detailed description of the contract stage.</p>
                    </div>
                </Card>
            </div>

            <div className="usage-guide">
                <h3>Component Usage</h3>
                <pre>
                    <code>{`
import ContractTimeline from './components/ui/ContractTimeline';

const MyPage = () => (
    <ContractTimeline 
        currentStatus="active" 
        history={[
            { status: 'created', timestamp: '12 Oct' },
            { status: 'negotiation', timestamp: '14 Oct' }
        ]}
    />
);
                    `}</code>
                </pre>
            </div>
        </div>
    );
};

export default TimelineDemo;
