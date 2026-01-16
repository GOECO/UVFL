
# UVFL Global Release v4.4.0 - Operation "Recursive Trust"

## 1. Release Components
- **API**: v4.4.0 (RuleEngine v4.4, Ledger v4.4)
- **Web**: v4.4.0 (Cycle Stepper, Governance Hub)
- **Admin**: v4.4.0 (Country Profile v4.3, AI Command v1.8)
- **Mobile**: v1.5.0 (P2P Mesh v2)

## 2. DB Migration Steps
1. Create table `country_profile_history`.
2. Update `value_records` to include `ruleset_version` (varchar).
3. Initialize `role_history` with starting values for Cycle 12.

## 3. Verification Checklist (UAT)
- [ ] Create Record -> Verify Ledger Hash contains `rulesetVersion: "4.4.0"`.
- [ ] Distribution -> Verify Payout matches 7/8/13 matrix for F1/F2/F3.
- [ ] Royalty Calculation -> Verify 1% bonus to F1 and Old F2 upon F3 promotion.
- [ ] Governance -> Verify AI-07 blocks Reward Token for VN profiles.

## 4. Rollback Plan
- **Backend**: Revert to tag `v4.3.2`.
- **DB**: Execute `down` migrations to revert schema changes.
- **Ledger**: No rollback possible for hash chain. Discrepancies must be marked as `VOID` in future blocks.
