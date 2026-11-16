/**
 * A real receipt signed by the live GoVTraceAI engine, captured once and stored.
 * It verifies by signature (POST /api/govtrace/verify-receipt), not by run id.
 * Used for the /verify "Load sample" button and as the stored example when the
 * live engine does not answer. If the engine's signing key rotates, recapture it.
 */
export const SAMPLE_META = {
  capturedOn: '2026-11-13',
  verdict: 'SAFE' as const,
  prompt: "Summarise this quarter’s invoice exceptions for the AP team.",
  reason: "SAFE: no policy-relevant content detected.",
}

export const SAMPLE_RECEIPT = {
  "receipt_id": "rcpt_GT-20261113-6633",
  "signed_at": "2026-11-13T11:06:09Z",
  "signature_algo": "Ed25519",
  "signature": "2BKolRmNGYMZsRYdlaegk2lzpArD2g_0AMWaE_h_1lnqPFwCd1NIFoC-oUvAmCNC47TUIHNIMpTd8moBzcJuBQ",
  "public_key_id": "govtrace-signing-v1",
  "signed_fields": [
    "run_id",
    "verdict",
    "record_hash",
    "policy_digest",
    "input_hash",
    "timestamp"
  ],
  "signed_fields_data": {
    "run_id": "GT-20261113-6633",
    "verdict": "COMPLIANT",
    "record_hash": "afafeda41a5c98ff4efce2fdf20a5496ea4392b24df07ec3a355b5361ed9db50",
    "policy_digest": "624bce1aee1eb0b83e436861464812b788f8632e5f054db741f3c7a1124f4801",
    "input_hash": "c9ffd41e546d2d03d61c9fbd83e2c3a62c9e8b0238cdfcc2bd1e9d9e769a4ef2",
    "timestamp": "2026-11-13T11:06:09Z"
  },
  "canonical_digest": "3e7a40f55273c00ec218a9844e784d72059a4bfb80d9864e0e046c2e24f158c0"
}
