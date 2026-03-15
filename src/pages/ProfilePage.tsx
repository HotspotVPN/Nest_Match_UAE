import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link, useParams } from "react-router-dom";
import { 
    formatCurrency, 
    getInitials 
} from "@/data/mockData";
import type { User, Listing } from "@/types";
import {
  ShieldCheck,
  Award,
  CreditCard,
  MapPin,
  Building2,
  CheckCircle2,
  Phone,
  Mail,
  Instagram,
  Linkedin,
  Plus,
  ChevronLeft
} from "lucide-react";
import { api } from "@/services/api";

export default function ProfilePage() {
  const { currentUser, verificationTier } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  const [users, setUsers] = useState<User[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    // Parallel fetch for users and listings
    Promise.all([
        api.getUsers(),
        api.getProperties()
    ]).then(([fetchedUsers, fetchedListings]) => {
        setUsers(fetchedUsers);
        setListings(fetchedListings);
        setLoading(false);
    }).catch(err => {
        console.error("Profile page fetch failure:", err);
        setLoading(false);
    });
  }, [currentUser, navigate]);

  const displayUser = id ? users.find((u) => u.id === id) : currentUser;

  useEffect(() => {
    if (!loading && !displayUser && !currentUser) {
      navigate("/login");
    }
  }, [loading, displayUser, currentUser, navigate]);

  const currentListing = displayUser?.current_house_id
    ? listings.find((l) => l.id === displayUser.current_house_id)
    : null;

  const managedListings = listings.filter(
    (l) => l.landlord_id === displayUser?.id || l.letting_agent_id === displayUser?.id
  );

  const isOwnProfile = displayUser?.id === currentUser?.id;
  
  // GCC logic based strictly on displayUser
  const gccScore = (displayUser as any)?.gccScore ?? 0;
  const gccQualified = gccScore >= 80;

  if (loading) {
    return (
        <div className="section container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <div style={{ textAlign: 'center' }}>
                <Building2 className="animate-pulse" size={48} style={{ color: 'var(--brand-purple-light)', marginBottom: '1rem', opacity: 0.5 }} />
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Loading verified profile...</p>
            </div>
        </div>
    );
  }

  if (!displayUser) {
    return (
      <div className="section container" style={{ paddingTop: '2rem' }}>
        <Link to="/profile" className="btn btn-ghost btn-sm" style={{ marginBottom: '1.5rem' }}>
          <ChevronLeft size={16} /> Back to My Profile
        </Link>
        <h2>User not found</h2>
      </div>
    );
  }

  return (
    <div className="section" style={{ paddingTop: "2rem" }}>
      <div className="container" style={{ maxWidth: "900px" }}>
        
        {!isOwnProfile && (
           <Link to="/chat" className="btn btn-ghost btn-sm" style={{ marginBottom: '1.5rem' }}>
             <ChevronLeft size={16} /> Back to Chat
           </Link>
        )}

        {/* Profile Header */}
        <div className="glass-card" style={{ padding: "2rem", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start" }}>
            <div className="avatar avatar-xl">{getInitials(displayUser.name)}</div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginBottom: "0.5rem",
                  flexWrap: "wrap",
                }}
              >
                <h2 style={{ margin: 0 }}>{displayUser.name}</h2>

                {displayUser.isUaePassVerified ? (
                  <span className="badge badge-uaepass">
                    <ShieldCheck size={12} /> UAE PASS Verified (Tier 2)
                  </span>
                ) : displayUser.isIdVerified ? (
                  <span className="badge badge-green">
                    <ShieldCheck size={12} /> ID Verified (Tier 2)
                  </span>
                ) : (
                  <span className="badge badge-orange">
                    <ShieldCheck size={12} /> Tier 1 Basic
                  </span>
                )}

                {displayUser.isPremium && <span className="badge badge-gold">⭐ Premium</span>}

                {gccQualified && (
                  <span className="gcc-badge">
                    <Award size={12} /> Verified GCC
                  </span>
                )}
              </div>

              <p style={{ fontSize: "0.875rem", marginBottom: "0.75rem" }}>
                {displayUser.type === "letting_agent"
                  ? `RERA Agent ${displayUser.agency_name ? `— ${displayUser.agency_name}` : ""}`
                  : displayUser.type === "landlord"
                  ? "Property Owner"
                  : displayUser.resident_role === "residing"
                  ? "Residing Roommate"
                  : "Searching Roommate"}
              </p>

              <p
                style={{
                  fontSize: "0.875rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.6,
                }}
              >
                {displayUser.bio}
              </p>
            </div>
          </div>

          {/* Contact */}
          <div
            style={{
              display: "flex",
              gap: "1rem",
              marginTop: "1rem",
              flexWrap: "wrap",
            }}
          >
            {displayUser.phone && (
              <span className="tag">
                <Phone size={12} /> {displayUser.phone}
              </span>
            )}
            {displayUser.email && (
              <span className="tag">
                <Mail size={12} /> {displayUser.email}
              </span>
            )}
            {displayUser.instagram_handle && (
              <span className="tag">
                <Instagram size={12} /> {displayUser.instagram_handle}
              </span>
            )}
            {displayUser.linkedin_url && (
              <span className="tag">
                <Linkedin size={12} /> LinkedIn
              </span>
            )}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          {/* GCC Score */}
          <div className="glass-card" style={{ padding: "1.5rem" }}>
            <h3
              style={{
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <Award size={20} style={{ color: "#f59e0b" }} /> Good Conduct Certificate
            </h3>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "0.75rem",
              }}
            >
              <div
                style={{
                  fontSize: "2.5rem",
                  fontWeight: 800,
                  fontFamily: "var(--font-display)",
                  color: gccQualified ? "#f59e0b" : "var(--text-primary)",
                }}
              >
                {gccScore}
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                / 100
                <br />
                GCC Score
              </div>
            </div>
            <div className="occupancy-bar" style={{ height: "8px", marginBottom: "0.75rem" }}>
              <div
                className={`occupancy-bar-fill ${
                  gccScore >= 80
                    ? "safe"
                    : gccScore >= 40
                    ? "warning"
                    : "critical"
                }`}
                style={{ width: `${gccScore}%` }}
              />
            </div>

            {gccQualified ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.625rem 0.75rem",
                  borderRadius: "var(--radius-md)",
                  background: "rgba(245,158,11,0.1)",
                  border: "1px solid rgba(245,158,11,0.3)",
                }}
              >
                <Award size={16} style={{ color: "#f59e0b" }} />
                <span
                  style={{
                    fontSize: "0.8125rem",
                    color: "#f59e0b",
                    fontWeight: 600,
                  }}
                >
                  Gold Verified — Priority access to listings
                </span>
              </div>
            ) : (
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                {gccScore > 0
                  ? `${80 - gccScore} more points to Gold status. Complete your tenancy for +20 pts.`
                  : "Start building your GCC score — complete a 12-month tenancy with zero complaints."}
              </p>
            )}

            {displayUser.good_conduct_certificate && (
              <div
                style={{
                  marginTop: "1rem",
                  padding: "0.75rem",
                  borderRadius: "var(--radius-md)",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.75rem",
                    color: "var(--text-muted)",
                    marginBottom: "0.5rem",
                  }}
                >
                  <span>Payment Reliability</span>
                  <span
                    style={{
                      fontWeight: 600,
                      color: "var(--success)",
                      textTransform: "capitalize",
                    }}
                  >
                    {displayUser.good_conduct_certificate.payment_reliability}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.75rem",
                    color: "var(--text-muted)",
                  }}
                >
                  <span>Property Care</span>
                  <span
                    style={{
                      fontWeight: 600,
                      color: "var(--success)",
                      textTransform: "capitalize",
                    }}
                  >
                    {displayUser.good_conduct_certificate.property_care}
                  </span>
                </div>
              </div>
            )}

            {isOwnProfile && (
              <Link
                to="/gcc"
                className="btn btn-outline btn-sm"
                style={{
                  width: "100%",
                  marginTop: "1rem",
                  display: "flex",
                  justifyContent: "center",
                  gap: "0.5rem",
                }}
              >
                <Award size={14} /> View Full Dashboard
              </Link>
            )}
          </div>

          {/* Verification Status */}
          <div className="glass-card" style={{ padding: "1.5rem" }}>
            <h3
              style={{
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <ShieldCheck size={20} style={{ color: "var(--uaepass-green-light)" }} /> Verification
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {[
                { label: "UAE PASS Identity", done: !!displayUser.isUaePassVerified },
                {
                  label: "Emirates ID Confirmed",
                  done: !!displayUser.emiratesId || !!displayUser.isIdVerified,
                },
                {
                  label: "AML / PEP Screening",
                  done: displayUser.compliance?.aml_status === "completed",
                },
                { label: "Bank Account Linked", done: !!displayUser.bank_linked },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.5rem 0.625rem",
                    borderRadius: "var(--radius-sm)",
                    background: item.done
                      ? "rgba(34,197,94,0.05)"
                      : "rgba(255,255,255,0.02)",
                  }}
                >
                  {item.done ? (
                    <CheckCircle2 size={16} style={{ color: "var(--success)" }} />
                  ) : (
                    <div
                      style={{
                        width: "16px",
                        height: "16px",
                        borderRadius: "var(--radius-full)",
                        border: "2px solid var(--text-muted)",
                      }}
                    />
                  )}
                  <span style={{ fontSize: "0.875rem" }}>{item.label}</span>
                </div>
              ))}
            </div>

            {displayUser.uaePassId && (
              <div
                style={{
                  marginTop: "0.75rem",
                  fontSize: "0.6875rem",
                  color: "var(--text-muted)",
                }}
              >
                UAE PASS ID: {displayUser.uaePassId}
              </div>
            )}

            {verificationTier === "tier1" && isOwnProfile && (
              <div
                style={{
                  marginTop: "1rem",
                  padding: "1rem",
                  borderRadius: "var(--radius-md)",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid var(--border-medium)",
                }}
              >
                <p
                  style={{
                    fontSize: "0.8125rem",
                    marginBottom: "0.75rem",
                  }}
                >
                  Upgrade to Tier 2 to unlock chat and bookings.
                </p>
                <button
                  className="btn btn-primary btn-sm"
                  style={{ width: "100%" }}
                >
                  Verify Visual ID (Onfido)
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Lifestyle Tags (Roommates) */}
        {displayUser.type === "roommate" &&
          (displayUser.lifestyle_tags?.length ||
            displayUser.personality_traits?.length ||
            displayUser.hobbies?.length) && (
            <div
              className="glass-card"
              style={{ padding: "1.5rem", marginTop: "1.5rem" }}
            >
              <h3 style={{ marginBottom: "1rem" }}>Lifestyle & Personality</h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                {displayUser.lifestyle_tags && displayUser.lifestyle_tags.length > 0 && (
                  <div>
                    <span
                      style={{
                        fontSize: "0.6875rem",
                        color: "var(--text-muted)",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Activities
                    </span>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.375rem",
                        marginTop: "0.375rem",
                      }}
                    >
                      {displayUser.lifestyle_tags.map((t: string) => (
                        <span key={t} className="tag">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {displayUser.personality_traits &&
                  displayUser.personality_traits.length > 0 && (
                    <div>
                      <span
                        style={{
                          fontSize: "0.6875rem",
                          color: "var(--text-muted)",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}
                      >
                        Personality
                      </span>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "0.375rem",
                          marginTop: "0.375rem",
                        }}
                      >
                        {displayUser.personality_traits.map((t: string) => (
                          <span key={t} className="badge badge-purple">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                {displayUser.hobbies && displayUser.hobbies.length > 0 && (
                  <div>
                    <span
                      style={{
                        fontSize: "0.6875rem",
                        color: "var(--text-muted)",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Hobbies
                    </span>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.375rem",
                        marginTop: "0.375rem",
                      }}
                    >
                      {displayUser.hobbies.map((t: string) => (
                        <span key={t} className="tag">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        {/* Current Accommodation */}
        {currentListing && (
          <div
            className="glass-card"
            style={{ padding: "1.5rem", marginTop: "1.5rem" }}
          >
            <h3
              style={{
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <Building2 size={20} /> Current Accommodation
            </h3>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ flex: 1 }}>
                <h4>{currentListing.title}</h4>
                <p
                  style={{
                    fontSize: "0.8125rem",
                    color: "var(--text-muted)",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem",
                  }}
                >
                  <MapPin size={12} /> {currentListing.address}
                </p>
                <div
                  style={{
                    display: "flex",
                    gap: "0.375rem",
                    marginTop: "0.5rem",
                  }}
                >
                  <span className="tag">
                    {formatCurrency(displayUser.rent_monthly ?? 0)}/mo
                  </span>
                  {displayUser.direct_debit?.status === "active" && (
                    <span className="badge badge-green">Auto-Pay Active</span>
                  )}
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <Link
                  to={`/listing/${currentListing.id}`}
                  className="btn btn-outline btn-sm"
                  style={{
                    width: "100%",
                    textAlign: "center",
                    justifyContent: "center",
                  }}
                >
                  View Property
                </Link>
                {isOwnProfile && (
                  <Link
                    to="/ledger"
                    className="btn btn-primary btn-sm"
                    style={{
                      width: "100%",
                      textAlign: "center",
                      justifyContent: "center",
                    }}
                  >
                    Payment Schedule
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Managed Properties */}
        {managedListings.length > 0 && (
          <div
            className="glass-card"
            style={{ padding: "1.5rem", marginTop: "1.5rem" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <h3>
                <Building2
                  size={20}
                  style={{ marginRight: "0.5rem", verticalAlign: "middle" }}
                />{" "}
                {isOwnProfile ? "My Properties" : "Managed Properties"}
              </h3>
              {isOwnProfile && (
                <Link to="/add-property" className="btn btn-primary btn-sm">
                  <Plus size={14} /> Add Property
                </Link>
              )}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              {managedListings.map((l) => (
                <Link
                  to={`/listing/${l.id}`}
                  key={l.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "1.25rem",
                    borderRadius: "var(--radius-md)",
                    background: "var(--bg-surface-2)",
                    border: "1px solid var(--border-subtle)",
                    textDecoration: "none",
                    transition: "all 0.2s",
                  }}
                >
                  <div
                    style={{
                      padding: "0.75rem",
                      background: "rgba(99,102,241,0.1)",
                      borderRadius: "var(--radius-sm)",
                      color: "var(--brand-purple-light)",
                    }}
                  >
                    <Building2 size={24} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: "1rem",
                        color: "var(--text-primary)",
                        marginBottom: "0.25rem",
                      }}
                    >
                      {l.title}
                    </div>
                    <div
                      style={{
                        fontSize: "0.8125rem",
                        color: "var(--text-muted)",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.25rem",
                        marginBottom: "0.75rem",
                      }}
                    >
                      <MapPin size={12} /> {l.district} · {l.current_roommates.length}/
                      {l.maxLegalOccupancy} occupants
                    </div>

                    {/* Linked Tenants */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.375rem",
                      }}
                    >
                      {l.current_roommates.slice(0, 5).map((rmId: string) => {
                        const rm = users.find((u) => u.id === rmId);
                        if (!rm) return null;
                        return (
                          <div
                            key={rmId}
                            className="avatar avatar-sm"
                            title={rm.name}
                            style={{
                              width: "28px",
                              height: "28px",
                              fontSize: "0.625rem",
                              border: "2px solid var(--bg-surface-2)",
                            }}
                          >
                            {getInitials(rm.name)}
                          </div>
                        );
                      })}
                      {l.current_roommates.length > 5 && (
                        <div
                          className="avatar avatar-sm"
                          style={{
                            width: "28px",
                            height: "28px",
                            fontSize: "0.625rem",
                            background: "var(--bg-surface-3)",
                            color: "var(--text-muted)",
                            border: "2px solid var(--bg-surface-2)",
                          }}
                        >
                          +{l.current_roommates.length - 5}
                        </div>
                      )}
                      {l.current_roommates.length === 0 && (
                        <span
                          style={{
                            fontSize: "0.75rem",
                            color: "var(--text-muted)",
                            fontStyle: "italic",
                          }}
                        >
                          Completely Vacant
                        </span>
                      )}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      gap: "0.5rem",
                    }}
                  >
                    <span
                      className={`badge ${
                        l.isActive ? "badge-green" : "badge-red"
                      }`}
                    >
                      {l.isActive ? "Active" : "At Capacity"}
                    </span>
                    <span
                      style={{
                        fontWeight: 700,
                        color: "var(--text-primary)",
                        fontSize: "1.125rem",
                      }}
                    >
                      {formatCurrency(l.rent_per_room)}
                    </span>
                    <span
                      style={{
                        fontSize: "0.6875rem",
                        color: "var(--text-muted)",
                      }}
                    >
                      / room
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Bank Details */}
        {isOwnProfile && displayUser.bank_details && (
          <div
            className="glass-card"
            style={{ padding: "1.5rem", marginTop: "1.5rem" }}
          >
            <h3
              style={{
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <CreditCard size={20} /> Bank Details
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.75rem",
              }}
            >
              {[
                { label: "Bank", value: displayUser.bank_details.bank_name },
                {
                  label: "Account Name",
                  value: displayUser.bank_details.account_name,
                },
                { label: "IBAN", value: displayUser.bank_details.iban },
                { label: "SWIFT", value: displayUser.bank_details.swift_code },
              ].map((d) => (
                <div key={d.label}>
                  <div
                    style={{
                      fontSize: "0.6875rem",
                      color: "var(--text-muted)",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {d.label}
                  </div>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: "0.875rem",
                    }}
                  >
                    {d.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RERA License (Agents) */}
        {displayUser.rera_license && (
          <div
            className="glass-card"
            style={{ padding: "1.5rem", marginTop: "1.5rem" }}
          >
            <h3 style={{ marginBottom: "0.75rem" }}>RERA Broker License</h3>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
              }}
            >
              <ShieldCheck size={20} style={{ color: "var(--uaepass-green-light)" }} />
              <div>
                <div style={{ fontWeight: 600 }}>{displayUser.rera_license}</div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--text-muted)",
                  }}
                >
                  {displayUser.agency_name}
                </div>
              </div>
              <span
                className="badge badge-green"
                style={{ marginLeft: "auto" }}
              >
                Verified
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
