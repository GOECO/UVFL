
# UVFL Global - System Architecture Specification

## 1. Overview
UVFL (Universal Value Flow Ledger) Global is a platform designed to formalize, validate, and distribute value across borders using a strictly enforced state machine.

## 2. High-Level Diagram
```text
[ Mobile App (Flutter) ] <--- REST/WS ---> [ Backend API (NestJS) ] <--- Web Platform (Next.js)
          |                                       |                           |
          |                                [ Rule Engine ]             [ Admin Console ]
          |                                       |                           |
          +-------------------------------- [ Database (PostgreSQL) ] <-------+
                                                  |
                                          [ Immutable Audit Log ]
                                          (Hash-chained records)
```

## 3. Core Flow: The UVFL Cycle
1. **CREATE**: User records a Value Contribution (Online/Offline). Evidence is hashed and uploaded.
2. **VALIDATE**: Multi-sig/Peer verification. Validators earn trust scores. No distribution allowed until 100% validated.
3. **DISTRIBUTE**: Algorithmic payout to Creator, Operator, Guide, and System Fund. Respects 'Ceiling' rules.
4. **RENEW**: End-of-cycle evaluation. Roles (Creator/Operator/Guide) are recalculated based on KPI performance.

## 4. Multi-Asset Engine
Supports 4 assets:
- **USDT**: Global settlement.
- **GOLD**: Commodity peg (grams).
- **NATIONAL_CURRENCY**: Local fiat for tax estimation.
- **REWARD_TOKEN**: Systemic incentive (burn/mint only by rules).

## 5. Security & Compliance
- **Hash Chain**: Every audit log entry contains `sha256(data + previous_hash)`.
- **Tax Engine**: Estimated based on Country Profile HS Codes and VAT/GST configs.
- **KYC**: Tiered levels (1-3) enforced by Country Profile.
