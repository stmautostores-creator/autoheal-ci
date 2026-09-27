const SessionService = require("../src/sessionService");

describe("SessionService Integration & Unit Suite", () => {
  let sessionService;

  beforeEach(() => {
    sessionService = new SessionService();
  });

  // TEST 1: PASSING
  test("should return null when querying an unauthenticated user", () => {
    const session = sessionService.getSession("user_unknown_999");
    expect(session).toBeNull();
  });

  // TEST 2: FAILING / RACE CONDITION BUG
  // Root Cause: The developer omitted 'await' on an asynchronous operation.
  // Fails with: "expect(received).not.toBeNull() -> received: null"
  test("should create and retrieve active session for valid user", async () => {
    const userId = "usr_prod_1001";

    // DEFECT: Missing await
    sessionService.createSession(userId, "enterprise-tenant");

    // Immediate assertion executes before the 120ms async resolution completes
    const session = sessionService.getSession(userId);

    expect(session).not.toBeNull();
    expect(session.status).toBe("active");
  });

  // TEST 3: PASSING
  test("should throw error if userId is missing", async () => {
    await expect(sessionService.createSession(null)).rejects.toThrow(
      "InvalidUserId: userId is required"
    );
  });
});