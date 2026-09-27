const SessionService = require("../src/sessionService");

describe("SessionService Integration Suite (Remediated by IBM Bob 2.0)", () => {
  let sessionService;

  beforeEach(() => {
    sessionService = new SessionService();
  });

  test("should return null when querying an unauthenticated user", () => {
    const session = sessionService.getSession("user_unknown_999");
    expect(session).toBeNull();
  });

  // [AUTOHEALED BY IBM BOB 2.0]
  // Fix: Explicitly awaits async resolution and asserts session integrity
  test("should create and retrieve active session for valid user", async () => {
    const userId = "usr_prod_1001";
    const tenantId = "enterprise-tenant";

    // Remediated call site
    const createdSession = await sessionService.createSession(userId, tenantId);
    const session = sessionService.getSession(userId);

    expect(session).not.toBeNull();
    expect(session.sessionId).toBe(createdSession.sessionId);
    expect(session.status).toBe("active");
    expect(session.tenantId).toBe(tenantId);
  });

  test("should throw error if userId is missing", async () => {
    await expect(sessionService.createSession(null)).rejects.toThrow(
      "InvalidUserId: userId is required"
    );
  });

  // [AUTOHEALED BY IBM BOB 2.0]
  // Covers revokeSession lifecycle — verifies status mutation and idempotent false return
  test("should revoke an active session and return false for unknown user", async () => {
    const userId = "usr_revoke_test";
    await sessionService.createSession(userId, "enterprise-tenant");

    const revoked = await sessionService.revokeSession(userId);
    expect(revoked).toBe(true);
    expect(sessionService.getSession(userId).status).toBe("revoked");

    const noop = await sessionService.revokeSession("usr_nonexistent");
    expect(noop).toBe(false);
  });

  // [SYNTHESIZED INVARIANT REGRESSION GUARD BY IBM BOB 2.0]
  // Guarantees concurrent lifecycle executions do not corrupt memory state
  test("should handle concurrent session creation without race condition drift", async () => {
    const userIds = ["usr_alpha", "usr_beta", "usr_gamma"];

    const results = await Promise.all(
      userIds.map((id) => sessionService.createSession(id, "tenant-matrix"))
    );

    expect(results).toHaveLength(3);
    userIds.forEach((id) => {
      const active = sessionService.getSession(id);
      expect(active).not.toBeNull();
      expect(active.status).toBe("active");
    });
  });
});