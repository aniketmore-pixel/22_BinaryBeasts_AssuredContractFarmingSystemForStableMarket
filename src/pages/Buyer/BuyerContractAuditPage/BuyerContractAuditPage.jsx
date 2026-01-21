import { useEffect, useState, useMemo } from "react";
import "./BuyerContractAuditPage.css";

const BuyerContractAuditPage = () => {
  const [data, setData] = useState({});
  const [participants, setParticipants] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:5000/api/contract-audit").then((r) => r.json()),
      fetch("http://localhost:5000/api/contracts/participants").then((r) =>
        r.json()
      )
    ])
      .then(([auditData, participantsData]) => {
        setData(auditData);
        setParticipants(participantsData);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredData = useMemo(() => {
    if (!search) return data;
    return Object.fromEntries(
      Object.entries(data).filter(([contractId]) =>
        contractId.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [data, search]);

  if (loading) return <p>Loading blockchain audit...</p>;

  return (
    <div className="audit-page">
      <h1>📜 Contract Blockchain Ledger</h1>

      <input
        className="search-input"
        type="text"
        placeholder="Search by Contract ID..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {Object.entries(filteredData).map(([contractId, blocks]) => {
        const party = participants[contractId];

        return (
          <div key={contractId} className="contract-section">
            <h2>Contract ID: {contractId}</h2>

            {/* 👥 Parties */}
            {party && (
              <div className="contract-parties">
                🏢 <strong>{party.organization_name}</strong>
                <span className="arrow">↔</span>
                🌾 <strong>{party.farmer_name}</strong>
              </div>
            )}

            {/* 🔗 Horizontal Timeline */}
            <div className="timeline-horizontal">
              {blocks.map((b, i) => (
                <div key={i} className="block">
                  <div className="block-header">
                    <span className="op">{b.operation.toUpperCase()}</span>
                    <span className="time">
                      {new Date(b.timestamp).toLocaleString()}
                    </span>
                  </div>

                  <div className="hashes">
                    <div>🔗 Prev: {b.prev_hash || "GENESIS"}</div>
                    <div>🔒 Hash: {b.new_hash}</div>
                  </div>

                  {Object.keys(b.changed_fields || {}).length > 0 && (
                    <pre className="changes">
                      {JSON.stringify(b.changed_fields, null, 2)}
                    </pre>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BuyerContractAuditPage;
